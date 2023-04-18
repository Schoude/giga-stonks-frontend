<script setup lang='ts'>
import type { EPSSurprises } from '../types/earnings-calendar';
import { watch, ref } from 'vue';

const props = defineProps<{
  symbol?: string;
}>();
const loading = ref(false);
const data = ref<null | EPSSurprises>(null);

watch(() => props.symbol, async (newValue) => {
  if (newValue == null) {
    return;
  }

  loading.value = true;
  data.value = await ((await fetch(`https://finnhub.io/api/v1/stock/earnings?symbol=${newValue}&token=cfje729r01que34nv410cfje729r01que34nv41g`)).json()) as EPSSurprises;
  loading.value = false;
});
</script>

<template>
<div class="eps-surprises">
  <h3 class="title"><dfn title="Earnings Per Share">EPS</dfn> Surprises</h3>
  <template v-if="loading">
    <p>Lade Daten...</p>
  </template>
  <template v-else-if="data">
    <p>{{ data[0] }}</p>
  </template>
</div>
</template>

<style lang='scss' scoped>
</style>
