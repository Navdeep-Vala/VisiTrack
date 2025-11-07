import app from "./app";
import { connectDatabase } from "./config/database.config";
import { env } from "./config/env.config";

const startServer = async () => {
  try {
    // connect to database
    await connectDatabase();

    app.listen(env.port, () => {
      console.log(`🚀 Server running on http://localhost:${env.port}`);
      console.log(`📝 Environment: ${env.nodeEnv}`);
    });
  } catch (error) {
    console.error("Failed to start server: ", error);
    process.exit(1);
  }
};

startServer();
