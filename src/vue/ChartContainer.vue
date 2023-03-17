<script setup lang='ts'>
import { onMounted, ref } from 'vue';
import StockChart from './StockChart.vue';
import SymbolSearch from './SymbolSearch.vue';

const selectedSymbol = ref<null | {name: string; symbol: string;}>(null);
const chartWidth = ref(0);
const chartHeight = ref(0);
onMounted(() => {
  chartWidth.value = innerWidth;
  chartHeight.value = innerHeight - 165;
})
</script>

<template>
<main class="about">
  <section class="infos">
    <SymbolSearch  @symbol-selected="payload => selectedSymbol = payload"/>
    <h1 class="stock-name">{{ selectedSymbol?.name }}</h1>
  </section>

  <section class="chart">
    <StockChart
      v-if="selectedSymbol"
      :symbol="selectedSymbol.symbol"
      :width="chartWidth"
      :height="chartHeight"
    />
  </section>
</main>
</template>

<style lang='scss' scoped>
.chart-container {
  block-size: 100%;
  display: flex;
  flex-direction: column;
}

.infos {
  display: flex;
  gap: 3rem;
}

.stock-name {
  font-size: 26px;
  align-self: end;
  margin-inline: auto;
}

.chart {
  margin-block-start: 2rem;
}
</style>
