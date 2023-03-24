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
import { Candle, RenderTypeValues, RENDER_TYPE } from '../types/stock-chart';

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
  renderType: RenderTypeValues;
}>();

const innerWidth = ref(props.width - props.margin.left - props.margin.right);
const innerHeight = ref(props.height - props.margin.top - props.margin.bottom);
const innerHeightVolume = ref(innerHeight.value);

const formatTime = timeFormat('%d %b, %H:%M');

const yScaleDomainMargin = computed(() => Number(Math.abs((props.data[0].o - Math.abs(props.data.at(-1)!.o)) / 4).toFixed(4)));

const svgDOMString = computed(() => {
  const yScale = scaleLinear()
  .domain([
      // @ts-expect-error
      min(props.data.map(d => d.l)) - yScaleDomainMargin.value,
      // @ts-expect-error
      max(props.data.map(d => d.h)) + yScaleDomainMargin.value
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
  const axisYLeft = axisLeft(scaleVolume)
    .tickSize(0)
    .tickPadding(6);
  svg
    .select('.margin')
    .append('g')
    .attr('class', 'axis-y-left')
    .call(axisYLeft);

  // y axis right
  const axisYRight = axisRight(yScale)
    .tickFormat(d => `$${d}`)
    .tickSize(-innerWidth.value)
    .tickPadding(8);


  svg
    .select('.margin')
    .append('g')
    .attr('class', 'axis-y-right')
    .attr('transform', `translate(${innerWidth.value}, 0)`)
    .call(axisYRight);

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

  if (props.renderType === RENDER_TYPE.LINE) {
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
  } else {
    // Candle Stick
    const candles = svg
      .select('.margin')
      .append('g')
      .attr('class', 'candle-sticks')
      .selectAll('g')
      .data(props.data)
      .join('g')
      .attr('class', 'candle')
      .attr('transform', d => {
        return `translate(${xScale(d.time)}, 0)`;
      })

    candles
      .append('line')
      .attr('class', 'whisker')
      .attr('y1', d => yScale(d.l))
      .attr('y2', d => yScale(d.h))
      .attr('stroke-width', '0.5')
      .attr('stroke', 'white');

    candles
      .append('line')
      .attr('class', 'body')
      .attr('y1', d => yScale(d.c))
      .attr('y2', d => yScale(d.o))
      .attr('stroke-linecap', 'round')
      .attr('stroke-width', '4')
      .attr('stroke', d => d.c > d.o ? '#0e814b' : '#9e3d4f'); // > red : green;

    candles
      .append('title')
      .text(d => `Time: ${formatTime(d.time)}\nOpen: ${d.o}\nClose: ${d.c}\nHigh: ${d.h}\nLow: ${d.l}\nVol.: ${d.v}`);
  }

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

    .axis-y-right {
      .tick {
        line {
          stroke: rgba(255, 255, 255, 0.1);
        }
      }
    }
  }
}
</style>
