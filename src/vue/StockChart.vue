<script setup lang='ts'>
import { reactive, ref } from 'vue';
import type { Candle, FHCandles, IntervalValues} from '../types/stock-chart';
import { getInterval, collectCandleData } from '../utils';
import StockChartRenderer from './StockChartRenderer.vue';

const props = defineProps<{
  symbol: string;
  interval: IntervalValues;
}>();

const chartSetup = reactive<{
  data: Candle[];
}>({
  data: [],
});

const factor = 1;
const width = 1270 * factor;
const height = 450 * factor;
const margin = {
  top: 0,
  right: 65,
  bottom: 25,
  left: 50,
};

const {from, to} = getInterval(props.interval);

const CANDLES = ref<FHCandles | null>(null);
CANDLES.value = await (await fetch(`https://finnhub.io/api/v1/stock/candle?symbol=${props.symbol}&resolution=1&from=${from}&to=${to}&token=cfje729r01que34nv410cfje729r01que34nv41g`)).json() as FHCandles;

chartSetup.data = collectCandleData(CANDLES.value);
</script>

<template>
  <StockChartRenderer
    :data="chartSetup.data"
    :height="height"
    :width="width"
    :margin="margin"
  />
</template>

<style lang="scss" scoped></style>
