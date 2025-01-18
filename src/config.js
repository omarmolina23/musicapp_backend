import {config} from 'dotenv';

config();

console.log(process.env.PORT)

export const PORT = process.env.PORT || 3000;
export const DB_USER = process.env.DB_USER || 'root';
export const DB_PASSWORD = process.env.DB_PASSWORD || 'my-secret-pw';
export const DB_HOST = process.env.DB_HOST || '35.222.224.163';
export const DB_DATABASE = process.env.DB_DATABASE || 'musicapp';
export const DB_PORT = process.env.DB_PORT || 3306;
export const SECRET = process.env.SECRET || 'musicapp-api';

