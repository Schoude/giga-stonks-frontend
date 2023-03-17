<script setup lang='ts'>import { ref } from 'vue';
import type { SymbolSearchResponse, SymbolSearchResponseEntry } from '../types/symbol-search';


defineEmits<{
  (event: 'symbol-selected', selectedSymbol: string): void
}>();

const loading = ref(false);
const foundSymbols = ref<SymbolSearchResponseEntry[]>([]);
const input$ = ref<null | HTMLInputElement>(null);

async function fetchMatchingSymbols(query: string) {
  return await (
    await fetch(`https://www.alphavantage.co/query?function=SYMBOL_SEARCH&keywords=${query}&apikey=cfje729r01que34nv410cfje729r01que34nv41g`)
    ).json() as SymbolSearchResponse;
}

async function onChange(event: Event) {
  if (loading.value) return;
  const target = event.target as HTMLInputElement;
  const value = target.value.trim();
  if (value == null) return;

  loading.value = true;
  const {bestMatches} = await fetchMatchingSymbols(target.value);
  foundSymbols.value = bestMatches.filter(match => match['4. region'] === 'United States');
  loading.value = false;
}

function onClear() {
  input$.value!.value = '';
  foundSymbols.value = [];
}
</script>

<template>
<div class="symbol-search">
  <div class="input-wrapper">
    <input ref="input$" type="text" @change="onChange">
    <button class="clear" :disabled="input$?.value === ''"
      @click="onClear"
    >X</button>
  </div>

  <ul class="found-symbols" :class="{populated: foundSymbols.length > 0}">
    <template v-if="foundSymbols.length > 0">
      <li class="found-symbol"
        v-for="symbol in foundSymbols"
        :key="symbol['1. symbol']"
      >
        <div class="col">
          <div class="symbol">{{ symbol['1. symbol'] }}</div>
          <div class="type">{{ symbol['3. type'] }}</div>
        </div>
        <div class="col col-name">
          <span class="name">{{ symbol['2. name'] }}</span>
        </div>
      </li>
    </template>
  </ul>
</div>
</template>

<style lang='scss' scoped>
.input-wrapper {
  display: flex;
  gap: .5rem;
}

input {
  border: none;
  padding: .25rem .5rem;
  border-radius: var(--border-radius);
  background-color: transparent;
  outline: 1px solid var(--color-accent);
}

button {
  border: none;
  line-height: 1;
  padding: .25rem .5rem;
  border-radius: var(--border-radius);
  background-color: #0b121d;
  outline: 1px solid var(--color-accent);
}

.found-symbols {
  margin-top: .5rem;
  list-style: none;
  padding: 0;
  border-radius: var(--border-radius);
  opacity: 0;
  transition: opacity 200ms ease;

  &.populated {
    opacity: 1;
    outline: 1px solid var(--color-accent);
  }
}

.found-symbol {
  background-color: hsl(210, 38%, 16%);
  display: grid;
  grid-template-columns: auto 1fr;
  padding: .5rem .5rem;
  cursor: pointer;

  &:hover {
    background-color: hsl(210, 38%, 20%);
  }

  & + & {
    border-block-start: 1px solid var(--color-accent);;
  }
}
</style>
