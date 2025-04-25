import { Server } from 'http';
import app from './app';
import config from './app/config';
import mongoose from 'mongoose';

let server: Server;

async function main() {
  try {
    await mongoose.connect(config.database_url as string);
    const port = process.env.PORT || 8080;
    server = app.listen(port, () => {
      console.log(`🔥🔥 Meal Box app listening on port ${port} 🔥🔥`);
    });
  } catch (error) {
    console.log(error);
  }
}

main();

process.on('unhandledRejection', () => {
  console.log(`👿 unhandledRejection is detected. server is shutting down...`);
  if (server) {
    server.close(() => {
      process.exit(1);
    });
  }
  process.exit(1);
});

process.on('uncaughtException', () => {
  console.log(`👿 uncaughtException is detected. server is shutting down...`);
  process.exit(1);
});
