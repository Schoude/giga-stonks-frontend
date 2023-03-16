<script setup lang='ts'>
import {
  axisBottom,
  axisLeft,
  axisRight,
  create,
  curveLinear,
  line,
  scaleLinear,
  scaleTime,
  timeFormat,
  min,
  max,
} from 'd3';
import { computed, ref } from 'vue';
import type { Candle } from '../types/stock-chart';

const props = defineProps<{
  data: Candle[];
  width: number;
  height: number;
  margin: {
    top: number;
    right: number;
    bottom: number;
    left: number;
  };
}>();

const innerWidth = ref(props.width - props.margin.left - props.margin.right);
const innerHeight = ref(props.height - props.margin.top - props.margin.bottom);
const innerHeightVolume = ref(innerHeight.value);

const formatTime = timeFormat('%d %b, %H:%M');

const svgDOMString = computed(() => {
  const yScale = scaleLinear()
  .domain([
      // @ts-expect-error
      min(props.data.map(d => d.c)) - .5,
      // @ts-expect-error
      max(props.data.map(d => d.c)) + .5
    ])
    .range([innerHeight.value, 0]);

  const xScale = scaleTime([0, innerWidth.value])
    .domain([props.data[0].time, props.data.at(-1)!.time])
    .nice();

  // Setup for volume bar chart
  const scaleVolume = scaleLinear()
    // @ts-expect-error
    .domain([min(props.data.map(d => d.v)), max(props.data.map(d => d.v))])
    .range([innerHeightVolume.value, 0]);

  const svg = create("svg")
    .attr("width", props.width)
    .attr("height", props.height)
    .attr("viewBox", [0, 0, props.width, props.height]);

  // Margin
  svg
    .append('g')
    .attr('class', 'margin')
    .attr('transform', `translate(${props.margin.left}, ${props.margin.top})`);

  // x axis
  const axisX = axisBottom(xScale)
    .tickFormat(d => formatTime(d as Date))
    .tickPadding(8);
  svg
    .select('.margin')
    .append('g')
    .attr('class', 'axis-x')
    .attr('transform', `translate(0, ${innerHeight.value})`)
    .call(axisX);

  // y axis left
  const axisYLeft = axisLeft(yScale)
    .tickFormat(d => `$${d}`)
    .tickSize(-innerWidth.value)
    .tickPadding(12);
  svg
    .select('.margin')
    .append('g')
    .attr('class', 'axis-y-left')
    .call(axisYLeft);

  // y axis right
  const axisYRight = axisRight(scaleVolume)
    .tickSize(0)
    .tickPadding(12);

  svg
    .select('.margin')
    .append('g')
    .attr('class', 'axis-y-right')
    .attr('transform', `translate(${innerWidth.value}, 0)`)
    .call(axisYRight);

  // Line
  svg
    .select('.margin')
    .append('g')
    .attr('class', 'line')
    .append('path')
    .attr('d',
      line<{time: Date; c: number}>()
        .x(d => xScale(d.time))
        .y(d => yScale(d.c))
        .curve(curveLinear)(props.data)
    )
    .attr('stroke-width', '1.5')
    .attr('stroke', props.data[0].c > props.data.at(-1)!.c ? '#9e3d4f' : '#0e814b')
    .attr('stroke-linejoin', 'round')
    .attr('fill', 'none');

  // Volume
  svg
    .select('.margin')
    .append('g')
    .attr('class', 'volumes')
    .selectAll('g')
    .data(props.data)
    .enter()
    .append('g')
    .attr('class', 'volume')
    .attr('transform', d => {
      return `translate(${xScale(d.time) - (innerWidth.value / props.data.length / 4)}, 0)`;
    })
    .append('rect')
    .attr('y', d => scaleVolume(d.v))
    .attr('width', innerWidth.value / props.data.length / 2)
    .attr('height', d => innerHeightVolume.value - scaleVolume(d.v))
    .attr('fill', 'rgba(224, 159, 62, 0.07)');

  return svg.node()?.outerHTML;
});
</script>

<template>
  <div
    class="stock-chart-renderer"
    v-html="svgDOMString">
  </div>
</template>

<style lang='scss' scoped>
.stock-chart-renderer {
  font: inherit;

  &:deep() {
    .axis-x,
    .axis-y-left,
    .axis-y-right {
      .domain {
        display: none;
      }
    }

    .axis-y-left,
    .axis-y-right {
      .tick {
        font-size: .85rem;
      }
    }

    .axis-x {
      .tick {
        font-size: .7rem;
      }
    }

    .axis-y-left {
      .tick {
        line {
          stroke: rgba(255, 255, 255, 0.1);
        }
      }
    }
  }
}
</style>
