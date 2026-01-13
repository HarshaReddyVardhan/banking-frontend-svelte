import { writable } from 'svelte/store';
import type { NotificationsState } from '$lib/types';

export const notificationsStore = writable<NotificationsState>({
    items: [],
    unreadCount: 0
});
