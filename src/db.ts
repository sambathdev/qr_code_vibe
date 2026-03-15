import { openDB, IDBPDatabase } from 'idb';
import { Product } from './types';

const DB_NAME = 'scantrack_db';
const STORE_NAME = 'products';
const VERSION = 1;

export async function initDB(): Promise<IDBPDatabase> {
  return openDB(DB_NAME, VERSION, {
    upgrade(db) {
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        const store = db.createObjectStore(STORE_NAME, {
          keyPath: 'id',
          autoIncrement: true,
        });
        store.createIndex('barcode', 'barcode', { unique: false });
      }
    },
  });
}

export async function getAllProducts(): Promise<Product[]> {
  const db = await initDB();
  return db.getAll(STORE_NAME);
}

export async function addProduct(product: Product): Promise<number> {
  const db = await initDB();
  const id = await db.add(STORE_NAME, product);
  return id as number;
}

export async function updateProduct(product: Product): Promise<number> {
  const db = await initDB();
  const id = await db.put(STORE_NAME, product);
  return id as number;
}

export async function deleteProduct(id: number): Promise<void> {
  const db = await initDB();
  return db.delete(STORE_NAME, id);
}

export async function getProductByBarcode(barcode: string): Promise<Product | undefined> {
  const db = await initDB();
  return db.getFromIndex(STORE_NAME, 'barcode', barcode);
}
