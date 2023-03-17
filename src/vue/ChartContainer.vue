<script setup lang='ts'>
import { ref } from 'vue';
import SymbolSearch from './SymbolSearch.vue';

const selectedSymbol = ref<null | {name: string; symbol: string;}>(null);

</script>

<template>
<main class="about">
  <section class="infos">
    <SymbolSearch  @symbol-selected="payload => selectedSymbol = payload"/>
    <h1 class="stock-name">{{ selectedSymbol?.name }}</h1>
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
}
</style>
