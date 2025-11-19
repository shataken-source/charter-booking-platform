// IndexedDB utilities for offline storage
export const openBookingsDB = (): Promise<IDBDatabase> => {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open('CaptainBookingsDB', 1);
    
    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve(request.result);
    
    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;
      
      if (!db.objectStoreNames.contains('bookings')) {
        db.createObjectStore('bookings', { keyPath: 'id' });
      }
      
      if (!db.objectStoreNames.contains('pending-actions')) {
        db.createObjectStore('pending-actions', { keyPath: 'id', autoIncrement: true });
      }
    };
  });
};

export const saveBookingsOffline = async (bookings: any[]) => {
  const db = await openBookingsDB();
  const transaction = db.transaction(['bookings'], 'readwrite');
  const store = transaction.objectStore('bookings');
  
  bookings.forEach(booking => {
    store.put(booking);
  });
  
  return new Promise((resolve, reject) => {
    transaction.oncomplete = () => resolve(true);
    transaction.onerror = () => reject(transaction.error);
  });
};

export const getOfflineBookings = async (): Promise<any[]> => {
  const db = await openBookingsDB();
  const transaction = db.transaction(['bookings'], 'readonly');
  const store = transaction.objectStore('bookings');
  const request = store.getAll();
  
  return new Promise((resolve, reject) => {
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
};

export const queueOfflineAction = async (action: any) => {
  const db = await openBookingsDB();
  const transaction = db.transaction(['pending-actions'], 'readwrite');
  const store = transaction.objectStore('pending-actions');
  store.add({ ...action, timestamp: Date.now() });
  
  return new Promise((resolve, reject) => {
    transaction.oncomplete = () => resolve(true);
    transaction.onerror = () => reject(transaction.error);
  });
};

export const getPendingActions = async (): Promise<any[]> => {
  const db = await openBookingsDB();
  const transaction = db.transaction(['pending-actions'], 'readonly');
  const store = transaction.objectStore('pending-actions');
  const request = store.getAll();
  
  return new Promise((resolve, reject) => {
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
};

export const clearPendingActions = async () => {
  const db = await openBookingsDB();
  const transaction = db.transaction(['pending-actions'], 'readwrite');
  const store = transaction.objectStore('pending-actions');
  store.clear();
  
  return new Promise((resolve, reject) => {
    transaction.oncomplete = () => resolve(true);
    transaction.onerror = () => reject(transaction.error);
  });
};
