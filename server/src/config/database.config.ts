import mongoose from "mongoose";
import { env } from "./env.config";
import { logger } from '../utils/logger.utils';

export const dbConfig = {
  uri: env.mangoUri,
  options: {
    maxPoolSize: 10,
    serverSelectionTimeoutMS: 5000
  },
};

export const connectDatabase = async (): Promise<void> => {
  try {
    mongoose.set('strictQuery', true);

    const conn = await mongoose.connect(env.mangoUri, dbConfig.options);
    console.log("✅ Database connected successfully");

    logger.info(`✅ MongoDB Connected: ${conn.connection.host}`);

    mongoose.connection.on('error', (err) => {
        console.error('❌ Database connection error:', err);
    });

    mongoose.connection.on('disconnected', () => {
        console.warn('⚠️  Database disconnected');
    })

    process.on('SIGINT', async () => {
      await mongoose.connection.close();
      logger.info('MongoDB connection closed due to app termination');
      process.exit(0);
    });
  } catch (error) {
    console.error('❌ Database connection failed:', error);
    process.exit(1);
  }
};
