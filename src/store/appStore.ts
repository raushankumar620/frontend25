import { useState, useEffect } from 'react';

export interface Toast {
  id: string;
  type: 'success' | 'error' | 'info' | 'warning';
  title?: string;
  message: string;
}

let toasts: Toast[] = [];
let isDarkMode = true;

const listeners = new Set<() => void>();
function notify() {
  listeners.forEach((fn) => fn());
}

export const appStore = {
  getToasts() {
    return toasts;
  },
  addToast(toast: Omit<Toast, 'id'>) {
    const id = 'toast_' + Math.random().toString(36).substring(2);
    toasts = [...toasts, { ...toast, id }];
    notify();
    setTimeout(() => {
      this.removeToast(id);
    }, 4000);
  },
  removeToast(id: string) {
    toasts = toasts.filter((t) => t.id !== id);
    notify();
  },
  toggleDarkMode() {
    isDarkMode = !isDarkMode;
    notify();
  },
  isDarkMode() {
    return isDarkMode;
  },
  subscribe(fn: () => void) {
    listeners.add(fn);
    return () => {
      listeners.delete(fn);
    };
  },
};

export function useAppStore() {
  const [, setTick] = useState(0);

  useEffect(() => {
    return appStore.subscribe(() => setTick((t) => t + 1));
  }, []);

  return {
    toasts: appStore.getToasts(),
    addToast: appStore.addToast.bind(appStore),
    removeToast: appStore.removeToast.bind(appStore),
    isDarkMode: appStore.isDarkMode(),
    toggleDarkMode: appStore.toggleDarkMode.bind(appStore),
  };
}
