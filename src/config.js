import { config } from "dotenv";
config();

export const PORT = process.env.PORT || 3000;
export const DB_HOST = process.env.DB_HOST || "34.45.46.36";
export const DB_USER = process.env.DB_USER || "root";
export const DB_PASSWORD = process.env.DB_PASSWORD || ";=W_9N+wbxm4K5(MFAo]";
export const DB_DATABASE = process.env.DB_DATABASE || "farmacia";
export const SECRET = process.env.SECRET || "musicapp-api";

export const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID || "443406548073-mb6e76fdeq18d09e3r2pdq9ioq23euuo.apps.googleusercontent.com";
export const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET || "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";
export const GOOGLE_CALLBACK_URL = process.env.GOOGLE_CALLBACK_URL || "http://localhost:3000/api/google/callback";

export const AWS_BUCKET_NAME = process.env.AWS_BUCKET_NAME;
export const AWS_BUCKET_REGION = process.env.AWS_BUCKET_REGION;
export const AWS_PUBLIC_KEY = process.env.AWS_PUBLIC_KEY;
export const AWS_SECRET_KEY = process.env.AWS_SECRET_KEY;