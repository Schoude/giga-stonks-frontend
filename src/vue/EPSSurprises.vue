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
    <div class="data-display">
      <dl class="entry" v-for="entry in data" :key="`${entry.year}-${entry.quarter}`">
        <dt>Peroid</dt>
        <dd>{{ entry.period }}</dd>
        <dt>Quarter</dt>
        <dd>{{ entry.quarter }}</dd>
        <dt>Estimate</dt>
        <dd>{{ entry.estimate }}</dd>
        <dt>Actual</dt>
        <dd>{{ entry.actual }}</dd>
        <dt>Surprise absolute</dt>
        <dd>{{ entry.surprise }}</dd>
        <dt>Surprise percent</dt>
        <dd>{{ entry.surprisePercent }}</dd>
      </dl>
    </div>
  </template>
</div>
</template>

<style lang='scss' scoped>
.title {
  margin-block-end: 1rem;
  font-size: 1.35rem;
}

.data-display {
  display: flex;
  gap: 2rem;
}

.entry {
  dt {
    font-weight: 700;
  }

  dd {
    margin-inline-start: 40px;
  }
}
</style>
