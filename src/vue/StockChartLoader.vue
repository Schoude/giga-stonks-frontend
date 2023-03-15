<script setup lang='ts'>
import { ref } from 'vue';
import type { IntervalValues} from '../types/stock-chart';
import StockChart from './StockChart.vue';

defineProps<{
  symbol: string;
}>();

const interval = ref<IntervalValues>('days-1')
</script>

<template>
  <div class="stock-chart-loader container outlined">
    <Suspense>
      <StockChart :symbol="symbol" :interval="interval" />

      <template #fallback>
        <p>Loading Chart Data...</p>
      </template>
    </Suspense>
  </div>
</template>

<style lang='scss' scoped>
.stock-chart-loader {
  block-size: 100%;
}
</style>
