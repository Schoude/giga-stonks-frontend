<script setup lang='ts'>import { ref } from 'vue';
import type { SymbolSearchResponse, SymbolSearchResponseEntry } from '../types/symbol-search';


const emit = defineEmits<{
  (event: 'symbol-selected', selectedSymbol: {name: string; symbol: string;}): void
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
  foundSymbols.value = bestMatches.filter(match => match['4. region'] === 'United States' && match['3. type'] === 'Equity');
  loading.value = false;
}

function onClear() {
  input$.value!.value = '';
  foundSymbols.value = [];
}

function onSymbolSelect(symbol: SymbolSearchResponseEntry) {
  emit('symbol-selected', {name: symbol['2. name'], symbol: symbol['1. symbol']});
  onClear();
}
</script>

<template>
<div class="symbol-search">
  <div class="input-wrapper">
    <div>
      <label for="symbol-input">Symbol Search</label>
      <input id="symbol-input" ref="input$" type="text" placeholder="AAPL" title="Search for a US stock symbol" @change="onChange">
    </div>
    <button class="btn-clear" :disabled="input$?.value === ''"
      @click="onClear"
    >X</button>
  </div>

  <ul class="found-symbols" :class="{populated: foundSymbols.length > 0}">
    <template v-if="foundSymbols.length > 0">
      <li
        v-for="symbol in foundSymbols"
        :key="symbol['1. symbol']"
      >
        <button class="found-symbol" type="button"
          @click="onSymbolSelect(symbol)"
        >
          <div class="col">
            <div class="symbol">{{ symbol['1. symbol'] }}</div>
            <div class="type">{{ symbol['3. type'] }}</div>
          </div>
          <div class="col col-name">
            <span class="name">{{ symbol['2. name'] }}</span>
          </div>
        </button>
      </li>
    </template>
  </ul>
</div>
</template>

<style lang='scss' scoped>
.symbol-search {
  margin-block-start: 1rem;
  position: relative;
}

.input-wrapper {
  display: flex;
  gap: .5rem;

  label {
    display: block;
    margin-block-end: .5rem;
  }
}

input {
  border: none;
  padding: .25rem .5rem;
  border-radius: var(--border-radius);
  background-color: transparent;
  outline: 1px solid var(--color-accent);
}

.btn-clear {
  align-self: end;
  block-size: 26px;
  border: none;
  line-height: 1;
  padding: .25rem .5rem;
  border-radius: var(--border-radius);
  background-color: #0b121d;
  outline: 1px solid var(--color-accent);
}

.found-symbols {
  position: absolute;
  inset-block-start: 100%;
  margin: 0;
  margin-block-start: .5rem;
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

li {
  display: flex;
  flex-direction: column;
}

.found-symbol {
  flex: 1;
  border: none;
  background-color: hsl(210, 38%, 16%);
  display: grid;
  gap: 1.5rem;
  grid-template-columns: auto 1fr;
  padding: .5rem .5rem;
  cursor: pointer;
  min-inline-size: 400px;

  &:hover {
    background-color: hsl(210, 38%, 20%);
  }

  & + & {
    border-block-start: 1px solid var(--color-accent);;
  }
}

.col-name {
  justify-self: center;
  align-self: center;
}
</style>
