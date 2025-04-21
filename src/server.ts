import app from './app';
import config from './app/config';
import mongoose from 'mongoose';

main().catch((err) => console.log(err));

async function main() {
  try {
    await mongoose.connect(config.database_url as string);
    const port = process.env.PORT || config.port;
    app.listen(port, () => {
      console.log(`🔥🔥 Meal Box app listening on port ${port} 🔥🔥`);
    });
  } catch (error) {
    console.log(error);
  }
}
