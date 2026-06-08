// Yeh function API response ko hamesha array mein convert karta hai
export function safeArray<T>(data: unknown): T[] {
  if (Array.isArray(data)) return data as T[];
  if (data && typeof data === 'object') {
    // Try common wrapper shapes: {data: []}, {items: []}, {products: []}, etc.
    for (const key of ['data', 'items', 'products', 'categories', 'orders']) {
      const val = (data as any)[key];
      if (Array.isArray(val)) return val as T[];
    }
  }
  return [];
}