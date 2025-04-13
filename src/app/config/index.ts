import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.join(process.cwd(), '.env') });

export default {
  NODE_ENV: process.env.NODE_ENV,
  port: process.env.PORT,
  database_url: process.env.DATABASE_URL,
  bcrypt_salt_rounds: process.env.BCRYPT_SALT_ROUNDS,
  //
  jwt_access_secret: process.env.JWT_ACCESS_SECRET,
  jwt_access_expires_in: process.env.JWT_ACCESS_EXPIRES_IN,

  jwt_refresh_secret: process.env.JWT_REFRESH_SECRET,
  jwt_refresh_expires_in: process.env.JWT_REFRESH_EXPIRES_IN,
  //   reset ui link
  RESET_UI_LINK: process.env.RESET_UI_LINK,

  //   SSl Commeriz
  STORE_ID: process.env.STORE_ID,
  STORE_PASSWORD: process.env.STORE_PASSWORD,
  SUCCESS_URL: process.env.SUCCESS_URL,
  FAIL_URL: process.env.FAIL_URL,
  CANCEL_URL: process.env.CANCEL_URL,
  VALIDATION_URL: process.env.VALIDATION_URL,
};
