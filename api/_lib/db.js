import { MongoClient } from 'mongodb'

const DB_NAME = process.env.MONGODB_DB || 'udaan_diaries'

// one connection is reused across warm serverless invocations
let clientPromise
let indexed = false

export async function getDb() {
  if (!process.env.MONGODB_URI) throw new Error('MONGODB_URI is not set')
  clientPromise ||= new MongoClient(process.env.MONGODB_URI, { serverSelectionTimeoutMS: 8000 }).connect()
  let db
  try {
    db = (await clientPromise).db(DB_NAME)
  } catch (err) {
    clientPromise = undefined // reconnect next time
    throw err
  }
  if (!indexed) {
    indexed = true
    await Promise.all([
      db.collection('locks').createIndex({ expiresAt: 1 }, { expireAfterSeconds: 0 }),
      db.collection('sign_hits').createIndex({ expireAt: 1 }, { expireAfterSeconds: 0 }),
      db.collection('stories').createIndex({ status: 1, createdAt: -1 }),
    ]).catch(() => {})
  }
  return db
}
