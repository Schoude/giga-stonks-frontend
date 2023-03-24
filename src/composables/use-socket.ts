import { onBeforeUnmount, ref, watch } from 'vue';

interface SocketTick {
  c: string[];
  p: number;
  s: string;
  v: number;
  t: number;
}

export function useSocket(onUpdate: (updateValue: { v: number; c: number; time: Date }) => void) {
  const socket = ref<WebSocket | null>(null);
  const symbol = ref();
  const socketResolution = ref(1);
  const accumulatedVolume = ref(0);

  function subscribe(newSymbol: string) {
    symbol.value = newSymbol;
    socket.value = new WebSocket('wss://ws.finnhub.io?token=cfje729r01que34nv410cfje729r01que34nv41g');
  }

  function unsubscribe() {
    if (socket.value == null) {
      return;
    }

    socket.value.send(JSON.stringify({ 'type': 'unsubscribe', 'symbol': symbol.value }))
    accumulatedVolume.value = 0;
  }

  watch(socket, (theSocket) => {
    if (theSocket == null) {
      return;
    }

    theSocket.addEventListener('open', (event) => {
      theSocket.send(JSON.stringify({ 'type': 'subscribe', 'symbol': symbol.value }))
    });

    let lastMin: null | number = null;
    theSocket.addEventListener('message', function (event) {
      const ticker = JSON.parse(event.data);
      if (ticker.type === 'ping') return;

      const tickerData = ticker.data as SocketTick[];

      let currentMin = 0;
      const date = new Date(tickerData.at(-1)!.t);
      currentMin = date.getMinutes();

      if (lastMin === null) {
        lastMin = currentMin;
      }

      tickerData.forEach((tick: SocketTick) => {
        accumulatedVolume.value += tick.v;
      })

      const lastTimestamp = tickerData.at(-1)!.t;
      const lastPrice = tickerData.at(-1)!.p;

      onUpdate({
        c: lastPrice,
        v: accumulatedVolume.value,
        time: new Date(lastTimestamp),
      });

      if (currentMin > lastMin) {
        lastMin = currentMin;
        accumulatedVolume.value = 0;
      }
    });
  });

  onBeforeUnmount(() => {
    if (socket.value == null) {
      return;
    }

    unsubscribe();
  })

  return {
    subscribe,
    unsubscribe,
    socketResolution,
  }
}
