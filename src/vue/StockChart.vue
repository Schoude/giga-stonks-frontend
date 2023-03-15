<script setup lang='ts'>
import { computed, reactive, ref, watchEffect } from 'vue';
import type { Candle, FHCandles, IntervalValues} from '../types/stock-chart';
import { getInterval, collectCandleData } from '../utils';
import StockChartRenderer from './StockChartRenderer.vue';

const props = defineProps<{
  symbol: string;
}>();

const interval = ref<IntervalValues>('days-1')
const isIntervalActive = computed(() => {
  return (givenInterval: IntervalValues) => {
    return interval.value === givenInterval;
  }
});
const chartSetup = reactive<{
  data: Candle[];
}>({
  data: [{
    c: 0,
    o: 0,
    h: 0,
    l: 0,
    v: 0,
    time: new Date(),
  }],
});

const factor = 1;
const width = 1270 * factor;
const height = 425 * factor;
const margin = {
  top: 0,
  right: 65,
  bottom: 25,
  left: 60,
};

const CANDLES = ref<FHCandles | null>(null);

watchEffect(async () => {
  const {from, to} = getInterval(interval.value);
  CANDLES.value = await (await fetch(`https://finnhub.io/api/v1/stock/candle?symbol=${props.symbol}&resolution=1&from=${from}&to=${to}&token=cfje729r01que34nv410cfje729r01que34nv41g`)).json() as FHCandles;
  chartSetup.data = collectCandleData(CANDLES.value);
});
</script>

<template>
  <div class="interactions">
    <div class="intervals">
      <button
        class="btn-interval"
        :disabled="isIntervalActive('week')"
        title="Week"
        @click="interval = 'week'"
      >
        W
      </button>
      <button
        class="btn-interval"
        :disabled="isIntervalActive('days-2')"
        title="Two days"
        @click="interval = 'days-2'"
      >
        D-2
      </button>
      <button
        class="btn-interval"
        :disabled="isIntervalActive('days-1')"
        title="One day"
        @click="interval = 'days-1'"
      >
        D-1
      </button>
      <button
        class="btn-interval"
        :disabled="isIntervalActive('hours-3')"
        title="Three hours"
        @click="interval = 'hours-3'"
      >
        H-3
      </button>
      <button
        class="btn-interval"
        :disabled="isIntervalActive('hours-1')"
        title="One hour"
        @click="interval = 'hours-1'"
      >
        H-1
      </button>
      <button
        class="btn-interval"
        :disabled="isIntervalActive('minutes-30')"
        title="Thirty minutes"
        @click="interval = 'minutes-30'"
      >
        M-30
      </button>
    </div>
  </div>
  <StockChartRenderer
    v-if="chartSetup.data[0].c > 0"
    :data="chartSetup.data"
    :height="height"
    :width="width"
    :margin="margin"
  />
</template>

<style lang="scss" scoped>
.intervals {
  display: flex;
  gap: .5rem;
}

.btn-interval {
  border: none;
  padding: .25rem .5rem;
  line-height: 1;
  border-radius: var(--border-radius);
  background-color: #0b121d;
}
</style>
