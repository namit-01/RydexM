import mongoose from "mongoose";

const mongodbUrl = process.env.MONGODB_URL;
if (!mongodbUrl) {
  throw new Error("db url not found");
}

// ✅ FIX 1: initialize global safely
global.mongooseConn = global.mongooseConn || {
  conn: null,
  promise: null,
};

const cached = global.mongooseConn;

// ❌ REMOVE THIS BLOCK COMPLETELY
// if (cached.conn) {
//   cached = global.mongooseConn = { conn: null, promise: null };
// }

const connectDb = async () => {
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    cached.promise = mongoose.connect(mongodbUrl);
  }

  cached.conn = await cached.promise;
  global.mongooseConn = cached;

  return cached.conn;
};

export default connectDb;
