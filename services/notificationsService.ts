import { Notification, Page } from '../types.ts';

// The data required to create a new notification
export type NotificationData = Omit<Notification, 'id' | 'read' | 'timestamp'>;

// The function signature for a listener
type Listener = (notification: Notification) => void;

let listeners: Listener[] = [];

// A simple pub/sub service for notifications
export const notifications = {
  /**
   * Subscribes a listener function to be called when a new notification is added.
   * @param listener The function to call with the new notification.
   * @returns A function to unsubscribe the listener.
   */
  subscribe(listener: Listener): () => void {
    listeners.push(listener);
    return () => {
      listeners = listeners.filter(l => l !== listener);
    };
  },

  /**
   * Adds a new notification and informs all subscribers.
   * @param notificationData The data for the new notification.
   */
  add(notificationData: NotificationData) {
    const newNotification: Notification = {
      ...notificationData,
      id: new Date().getTime().toString() + Math.random().toString(),
      read: false,
      timestamp: new Date().getTime(),
    };
    
    // Inform all listeners about the new notification
    for (const listener of listeners) {
      try {
        listener(newNotification);
      } catch (e) {
        console.error("Error in notification listener:", e);
      }
    }
  }
};