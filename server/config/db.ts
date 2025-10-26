import mongoose from "mongoose";

/**
 * connectMongo: attempts to connect to MongoDB with optional retry/backoff.
 * Returns true when connected, false otherwise. If MONGODB_URI is not set
 * the function returns false and the app can fallback to in-memory stores.
 */
export async function connectMongo(
  maxRetries = 3,
  initialDelayMs = 500
): Promise<boolean> {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    console.warn("MONGODB_URI not set. Using in-memory store.");
    return false;
  }

  const opts: mongoose.ConnectOptions = {
    dbName: process.env.MONGODB_DB || undefined,
    // modern mongoose uses these by default
    // useNewUrlParser: true,
    // useUnifiedTopology: true,
  };

  let attempt = 0;
  let delay = initialDelayMs;

  while (attempt <= maxRetries) {
    try {
      attempt++;
      await mongoose.connect(uri, opts);
      console.log(`MongoDB connected successfully (attempt ${attempt})`);
      return true;
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      console.error(`MongoDB connection attempt ${attempt} failed: ${msg}`);

      if (attempt > maxRetries) break;

      console.log(`Retrying in ${delay}ms...`);
      await new Promise((resolve) => setTimeout(resolve, delay));
      delay *= 2; // exponential backoff
    }
  }

  console.error(
    "MongoDB connection failed after maximum retries. Falling back to in-memory store."
  );
  return false;
}
