declare global {
  namespace NodeJS {
    interface ProcessEnv {
      PORT: number;
      NODE_ENV: "development" | "production";
      MONGO_URI: string;
      JWT_SECRET: string;
      JWT_EXPIRE: string;
      JWT_COOKIE_EXPIRE: string;
      SMTP_HOST: string;
      SMTP_PORT: number;
      SMTP_EMAIL: string;
      SMTP_PASSWORD: string;
      FROM_EMAIL: string;
      FROM_NAME: string;
    }
  }
}
