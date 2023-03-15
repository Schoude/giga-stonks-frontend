<script setup lang='ts'>
import { reactive, ref } from 'vue';
import type { Candle, FHCandles, IntervalValues} from '../types/stock-chart';
import { getInterval, collectCandleData } from '../utils';

const props = defineProps<{
  symbol: string;
  interval: IntervalValues;
}>();

const chartSetup = reactive<{
  data: Candle[];
}>({
  data: [],
});

const {from, to} = getInterval(props.interval);

const CANDLES = ref<FHCandles | null>(null);
CANDLES.value = await (await fetch(`https://finnhub.io/api/v1/stock/candle?symbol=${props.symbol}&resolution=1&from=${from}&to=${to}&token=cfje729r01que34nv410cfje729r01que34nv41g`)).json() as FHCandles;

chartSetup.data = collectCandleData(CANDLES.value);
</script>

<template>

</template>

<style lang="scss"></style>
