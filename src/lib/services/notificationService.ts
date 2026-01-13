import { api } from './api';
import { notificationsStore } from '$lib/stores/notificationsStore';
import type { NotificationItem } from '$lib/types';

interface NotificationsResponse {
    items: NotificationItem[];
    nextCursor?: string;
}

export const notificationService = {
    async fetchNotifications(cursor?: string, limit = 50) {
        const query = new URLSearchParams({ limit: limit.toString() });
        if (cursor) query.append('cursor', cursor);

        const response = await api.get<NotificationsResponse>(`/notifications?${query.toString()}`);

        notificationsStore.update(s => ({
            ...s,
            items: cursor
                ? [...s.items, ...response.items]
                : response.items,
            unreadCount: response.items.filter(i => !i.read).length // Simplistic unread count
            // In reality, unread count might involve checking total or backend provided count
        }));
        return response;
    },

    async markAsRead(id: string) {
        await api.post(`/notifications/${id}/read`, {});
        notificationsStore.update(s => ({
            ...s,
            items: s.items.map(i => i.id === id ? { ...i, read: true } : i),
            unreadCount: Math.max(0, s.unreadCount - 1)
        }));
    }
};
