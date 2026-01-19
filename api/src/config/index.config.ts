import dotenv from "dotenv";
import { logger, LogLevel } from "../utils/logger.utils";
dotenv.config();

const NODE_ENV = process.env.NODE_ENV || "development";
let PORT = process.env.PORT || 8000;
let DATABASE_URL = process.env.DATABASE_URL || "postgresql://postgres.postgress:postgres@localhost:5432/semeru_authentication_db";
const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key-change-in-production";
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || "24h";
const logLevel = process.env.LOG_LEVEL || 'DEBUG';
const logDirectory = process.env.LOG_DIRECTORY || 'logs';
const originsString = process.env.ALLOWED_ORIGINS;
let allowedOrigins = originsString ? originsString.split(',') : ['http://localhost:3000'];

if (NODE_ENV !== "development" && NODE_ENV === "production") {
    if (!process.env.PORT) logger.warn("Warning: PORT is not defined. Using default 8000.");
    if (!process.env.DATABASE_URL) logger.warn("Warning: DATABASE_URL is not defined. Using default local URL.");
    if (!process.env.JWT_SECRET) logger.warn("Warning: JWT_SECRET is not defined. Using default secret.");
    
    PORT = process.env.PORT || PORT;
    DATABASE_URL = process.env.DATABASE_URL || DATABASE_URL;
    allowedOrigins = process.env.ALLOWED_ORIGINS ? process.env.ALLOWED_ORIGINS.split(',') : allowedOrigins;

    logger.info("Configuration loaded for production environment.");
    logger.setLogLevel(LogLevel.INFO);
}

if (logLevel === 'DEBUG') logger.setLogLevel(LogLevel.DEBUG);
else if (logLevel === 'WARN') logger.setLogLevel(LogLevel.WARN);
else if (logLevel === 'ERROR') logger.setLogLevel(LogLevel.ERROR);
else logger.setLogLevel(LogLevel.INFO);
    
logger.setLogDirectory(logDirectory);

export { NODE_ENV, PORT, DATABASE_URL, JWT_SECRET, JWT_EXPIRES_IN, logLevel, logDirectory, allowedOrigins };