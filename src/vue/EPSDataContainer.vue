<script setup lang='ts'>
import { ref } from 'vue';
import SymbolSearch from './SymbolSearch.vue';

const selectedSymbol = ref<null | {name: string; symbol: string;}>(null);
</script>

<template>
<section class="eps-data-container container outlined">
  <h1>Earnings Data</h1>
  <div class="search-container">
    <SymbolSearch  @symbol-selected="payload => selectedSymbol = payload"/>
      <h2 class="symbol-name">{{ selectedSymbol?.name}}</h2>
  </div>
</section>
</template>

<style lang='scss' scoped>
.search-container {
  display: flex;
  align-items: flex-end;
  gap: 2rem;
}

.symbol-name {
  margin: 0;
}
</style>
