<script setup lang='ts'>
import StockChart from './StockChart.vue';

defineProps<{
  symbol: string;
}>();
</script>

<template>
  <div class="stock-chart-loader container outlined">
    <Suspense>
      <StockChart
        :symbol="symbol"
        :display-type="'widget'"
      />
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
