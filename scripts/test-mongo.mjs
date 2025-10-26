import 'dotenv/config';
import mongoose from 'mongoose';

async function run() {
  const uri = process.env.MONGODB_URI;
  const dbName = process.env.MONGODB_DB || undefined;
  if (!uri) {
    console.error('MONGODB_URI is not set in .env');
    process.exit(1);
  }

  console.log('Testing MongoDB connection...');
  console.log('Using URI (redacted):', uri.replace(/:(.*?)@/, ':*****@'));
  try {
    // attempt connection with explicit options
    await mongoose.connect(uri, { dbName });
    console.log('MongoDB connection succeeded');
    await mongoose.disconnect();
    process.exit(0);
  } catch (err) {
    console.error('MongoDB connection failed. Full error:');
    console.error(err && err.stack ? err.stack : err);
    // Helpful extra info for common auth issues
    console.error('\nTroubleshooting hints:');
    console.error('- Confirm username + password are correct in Atlas UI (reset password to be sure)');
    console.error('- If password contains special characters, url-encode it (use encodeURIComponent)');
    console.error("- Ensure the DB user has the correct role (readWrite on the target DB or atlasAdmin for testing)");
    console.error("- Ensure network access / IP whitelist allows your IP (or 0.0.0.0/0 for testing)");
    console.error("- Use the exact connection string provided by Atlas (SRV string) and choose the correct 'Default' user database");
    process.exit(2);
  }
}

run();
