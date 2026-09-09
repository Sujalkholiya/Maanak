export const syncService = {
  triggerSync(): Promise<{ timestamp: string; status: 'success' | 'error' }> {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          timestamp: new Date().toLocaleTimeString('en-IN', { hour12: false }),
          status: 'success',
        });
      }, 1200);
    });
  },
};
