import { writable } from 'svelte/store';
import type { WebSocketState } from '$lib/types';

export const websocketStore = writable<WebSocketState>({
    connected: false,
    lastPing: null
});
