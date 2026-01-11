import fs from 'fs';
import path from 'path';

export enum LogLevel {
  ERROR = 'ERROR',
  WARN = 'WARN',
  INFO = 'INFO',
  DEBUG = 'DEBUG'
}

const levelPriority: Record<LogLevel, number> = {
  [LogLevel.ERROR]: 0,
  [LogLevel.WARN]: 1,
  [LogLevel.INFO]: 2,
  [LogLevel.DEBUG]: 3
};

class Logger {
  private currentLevel: LogLevel = LogLevel.INFO;
  private directory = 'logs';
  private fileName = 'app.log';

  setLogLevel(level: LogLevel): void {
    this.currentLevel = level;
  }

  setLogDirectory(directory: string): void {
    this.directory = directory;
    try {
      if (!fs.existsSync(directory)) {
        fs.mkdirSync(directory, { recursive: true });
      }
    } catch (error) {
      // fallback silently if directory cannot be created
      console.error('[LOGGER] Unable to create log directory', error);
    }
  }

  private shouldLog(level: LogLevel): boolean {
    return levelPriority[level] <= levelPriority[this.currentLevel];
  }

  private format(level: LogLevel, message: string): string {
    const timestamp = new Date().toISOString();
    return `[${timestamp}] [${level}] ${message}`;
  }

  private writeToFile(message: string): void {
    try {
      const filePath = path.join(this.directory, this.fileName);
      fs.appendFile(filePath, `${message}\n`, (error) => {
        if (error) console.error('[LOGGER] Failed to write log file', error);
      });
    } catch (error) {
      console.error('[LOGGER] Error while writing log', error);
    }
  }

  private log(level: LogLevel, message: string, meta?: unknown): void {
    if (!this.shouldLog(level)) return;

    const metaString = meta === undefined ? '' : ` ${JSON.stringify(meta)}`;
    const output = `${this.format(level, message)}${metaString}`;

    switch (level) {
      case LogLevel.ERROR:
        console.error(output);
        break;
      case LogLevel.WARN:
        console.warn(output);
        break;
      default:
        console.log(output);
        break;
    }

    this.writeToFile(output);
  }

  debug(message: string, meta?: unknown): void {
    this.log(LogLevel.DEBUG, message, meta);
  }

  info(message: string, meta?: unknown): void {
    this.log(LogLevel.INFO, message, meta);
  }

  warn(message: string, meta?: unknown): void {
    this.log(LogLevel.WARN, message, meta);
  }

  error(message: string, meta?: unknown): void {
    this.log(LogLevel.ERROR, message, meta);
  }
}

export const logger = new Logger();