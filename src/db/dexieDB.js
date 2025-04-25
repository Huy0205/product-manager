import Dexie from 'dexie';

const db = new Dexie('productManager');

db.version(1).stores({
  products: '++id, name, price, quantity',
});

export default db;