import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI || '';

type Cache = { conn: any | null; promise: Promise<any> | null };

// Store the cached connection on the global object to prevent
// creating multiple connections in development where modules
// may be reloaded frequently.
const globalAny: any = global as any;
if (!globalAny.__mongoose) {
  globalAny.__mongoose = { conn: null, promise: null } as Cache;
}

const cached: Cache = globalAny.__mongoose;

export async function connectToDatabase() {
  if (!MONGODB_URI) {
    console.warn('MONGODB_URI not set; skipping DB connection');
    return null;
  }
  if (cached.conn) return cached.conn;
  if (!cached.promise) {
    console.log('Connecting to MongoDB:', MONGODB_URI);
    cached.promise = mongoose.connect(MONGODB_URI).then((m) => m).catch((e) => {
      console.error('Mongoose connection error:', e && e.message ? e.message : e);
      cached.promise = null;
      throw e;
    });
  }
  cached.conn = await cached.promise;
  console.log('MongoDB connected');
  return cached.conn;
}

export default connectToDatabase;
