// const mongoose = require("mongoose");
// require("dotenv").config();
// const MONGODB_URI = process.env.MONGODB_URI;
// console.log(MONGODB_URI, "URI");
// if (!MONGODB_URI) {
//   throw new Error(
//     "Please define the MONGODB_URI environment variable inside .env.local"
//   );
// }
// let cached = global.mongoose;
// if (!cached) {
//   cached = global.mongoose = { conn: null, promise: null };
// }
// async function dbConnect() {
//   if (cached.conn) {
//     return cached.conn;
//   }
//   if (!cached.promise) {
//     const opts = {
//       bufferCommands: false,
//       useNewUrlParser: true,
//       useUnifiedTopology: true,
//     };
//     cached.promise = mongoose.connect(MONGODB_URI, opts).then((mongoose) => {
//       return mongoose;
//     });
//   }
//   cached.conn = await cached.promise;
//   if (cached.conn) console.log("connected to DB");
//   else {
//     console.log("didnt connect");
//   }
//   return cached.conn;
// }
// module.exports = dbConnect;


// import mongoose from 'mongoose';

// const MONGODB_URI = process.env.MONGODB_URI || '';

// if (!MONGODB_URI) {
//   throw new Error(
//     'Please define the MONGODB_URI environment variable inside .env.local'
//   );
// }

/**
 * Global is used here to maintain a cached connection across hot reloads in development.
 * This prevents connections growing exponentially during API Route usage.
 */
// let cached = global.mongoose;

// if (!cached) {
//   cached = global.mongoose = { conn: null, promise: null };
// }

// async function dbConnect() {
//   if (cached.conn) {
//     return cached.conn;
//   }

//   if (!cached.promise) {
//     const opts = {
//       bufferCommands: false,
//       useNewUrlParser: true,
//       useUnifiedTopology: true
//     };

//     console.log("Attempting to connect to MongoDB");

//     cached.promise = mongoose.connect(MONGODB_URI, opts).then((mongoose) => {
//       console.log("MongoDB connected successfully");
//       return mongoose;
//     }).catch((error) => {
//       console.error("Error connecting to MongoDB:", error);
//       throw error;
//     });
//   }

//   cached.conn = await cached.promise;
//   return cached.conn;
// }

// export default dbConnect;


/**** */


//@ts-nocheck
import mongoose, { Mongoose } from "mongoose";
const MONGODB_URI = process.env.MONGODB_URI;

console.log(MONGODB_URI, "URI");
if (!MONGODB_URI) {
  throw new Error(
    "Please define the MONGODB_URI environment variable inside .env.local"
  );
}

type CachedMongoose = {
  conn: Mongoose | null;
  promise: Promise<Mongoose> | null;
};

declare global {
  namespace NodeJS {
    interface Global {
      mongoose: CachedMongoose;
    }
  }
}

let cached = globalThis.mongoose;

if (!cached) {
  cached = globalThis.mongoose = { conn: null, promise: null };
}

async function dbConnect(): Promise<Mongoose> {
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
      useNewUrlParser: true,
      useUnifiedTopology: true,
    };

    cached.promise = mongoose.connect(MONGODB_URI, opts).then((mongoose) => {
      return mongoose;
    });
  }
  cached.conn = await cached.promise;
  if (cached.conn) console.log("connected to DB");
  else {
    console.log("didnt connect");
  }
  return cached.conn;
}

export default dbConnect;

export const dynamic = "force-dynamic";
