<script setup lang='ts'>
import { computed, reactive, ref, watch, watchEffect } from 'vue';
import { useSocket } from '../composables/use-socket';
import { Candle, FHCandles, intervalResolution, IntervalValues, RenderTypeValues, RENDER_TYPE} from '../types/stock-chart';
import { getInterval, collectCandleData, getHigher, getLower } from '../utils';
import StockChartRenderer from './StockChartRenderer.vue';

const props = defineProps<{
  symbol: string;
  width?: number;
  height?: number;
}>();

const interval = ref<IntervalValues>('days-1')
const isIntervalActive = computed(() => {
  return (givenInterval: IntervalValues) => {
    return interval.value === givenInterval;
  }
});
const fetchLiveData = ref(false);
const {subscribe, unsubscribe} = useSocket(onUpdate);
const renderType = ref<RenderTypeValues>(RENDER_TYPE.LINE);
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
const width = props.width ? props.width * factor : 1270 * factor;
const height = props.height ? props.height * factor : 425 * factor;
const margin = {
  top: 10,
  right: 50,
  bottom: 35,
  left: 70,
};

const CANDLES = ref<FHCandles | null>(null);
const currentPrice = computed(() => chartSetup.data.at(-1)!.c.toFixed(2));
const deltaPercent = computed(() => ((chartSetup.data.at(-1)!.c / chartSetup.data[0].c - 1) * 100).toFixed(2));
const deltaAbsolute = computed(() => (chartSetup.data.at(-1)!.c - chartSetup.data[0].c).toFixed(2));

watchEffect(async () => {
  const {from, to} = getInterval(interval.value);
  const resolution = intervalResolution.get(interval.value);
  CANDLES.value = await (await fetch(`https://finnhub.io/api/v1/stock/candle?symbol=${props.symbol}&resolution=${resolution}&from=${from}&to=${to}&token=cfje729r01que34nv410cfje729r01que34nv41g`)).json() as FHCandles;
  chartSetup.data = collectCandleData(CANDLES.value);
});

function onUpdate({v, c, time}: { v: number; c: number; time: Date }) {
  const lastTick = chartSetup.data.at(-1)!;
  const lastTickMinute = lastTick.time.getMinutes();
  const minuteToAdd = time.getMinutes();

  const dataToAdd = {
      c,
      time,
      v,
      o: c,
      h: c,
      l: c
    };

  if (lastTickMinute < minuteToAdd) {
    chartSetup.data.push(dataToAdd)
    chartSetup.data.shift();
  } else {
    dataToAdd.v += lastTick.v;
    dataToAdd.o = lastTick.o;
    dataToAdd.h = getHigher(lastTick.h, dataToAdd.c);
    dataToAdd.l = getLower(lastTick.l, dataToAdd.c);
    chartSetup.data[chartSetup.data.length - 1] = dataToAdd;
  }
}

function setRenderType() {
  if (renderType.value === RENDER_TYPE.CANDLES) {
    renderType.value = RENDER_TYPE.LINE;
  } else {
    renderType.value = RENDER_TYPE.CANDLES;
  }
}

watch(fetchLiveData, fetchData => {
  if (fetchData === false) {
    unsubscribe();
  } else {
    subscribe(props.symbol)
  }
});

watch(() => props.symbol, newSymbol => {
  if (fetchLiveData.value === false) {
    unsubscribe();
  } else  {
    unsubscribe();
    subscribe(newSymbol)
  }
});
</script>

<template>
  <header class="header">
    <section class="meta">
      <h2 class="current-price">${{ currentPrice }}</h2>
      &nbsp;
      <small class="deltas">
        (<span class="percent">{{ deltaPercent }}%</span> / <span class="absolute">${{ deltaAbsolute }}</span>)
      </small>
    </section>
    <section class="intervals">
      <button
        type="button"
        class="btn-interval"
        :disabled="isIntervalActive('week')"
        title="Week"
        @click="interval = 'week'"
      >
        W
      </button>
      <button
        type="button"
        class="btn-interval"
        :disabled="isIntervalActive('days-2')"
        title="Two days"
        @click="interval = 'days-2'"
      >
        D-2
      </button>
      <button
        type="button"
        class="btn-interval"
        :disabled="isIntervalActive('days-1')"
        title="One day"
        @click="interval = 'days-1'"
      >
        D-1
      </button>
      <button
        type="button"
        class="btn-interval"
        :disabled="isIntervalActive('hours-6')"
        title="Six hours"
        @click="interval = 'hours-6'"
      >
        H-6
      </button>
      <button
        type="button"
        class="btn-interval"
        :disabled="isIntervalActive('hours-3')"
        title="Three hours"
        @click="interval = 'hours-3'"
      >
        H-3
      </button>
      <button
        type="button"
        class="btn-interval"
        :disabled="isIntervalActive('hours-1')"
        title="One hour"
        @click="interval = 'hours-1'"
      >
        H-1
      </button>
      <button
        type="button"
        class="btn-interval"
        :disabled="isIntervalActive('minutes-30')"
        title="Thirty minutes"
        @click="interval = 'minutes-30'"
      >
        M-30
      </button>
    </section>
    <div class="interactions">
      <button
        type="button"
        class="btn-render-type"
        @click="setRenderType"
      >
        {{ renderType === RENDER_TYPE.LINE ? 'Draw Candle Chart' : 'Draw Line Chart' }}
      </button>
      <button
        type="button"
        class="btn-live-data"
        :class="[{active: fetchLiveData}]"
        @click="() => fetchLiveData = !fetchLiveData"
      >
        {{ fetchLiveData ? 'Stop Fetching Live Data' : 'Fetch Live Data' }}
      </button>
    </div>
  </header>
  <StockChartRenderer
    v-if="chartSetup.data[0].c > 0"
    :data="chartSetup.data"
    :height="height"
    :width="width"
    :margin="margin"
    :renderType="renderType"
  />
</template>

<style lang="scss" scoped>
header,
.meta {
  display: flex;
  align-items: center;
}

header {
  gap: 1rem;
}

.meta {
  min-inline-size: 150px;
}

.current-price {
  margin: 0;
  font-size: 1rem;
}

.intervals {
  display: flex;
  gap: .5rem;
}

header button {
  border: none;
  padding: .25rem .5rem;
  line-height: 1;
  border-radius: var(--border-radius);
  background-color: #0b121d;
}

.interactions {
  margin-inline-start: auto;
  display: flex;
  gap: .5rem;
}

.btn-live-data {
  &.active {
    background-color: #281717;
  }
}
</style>
