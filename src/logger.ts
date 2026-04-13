/**
 * Structured logger for consistent, production-safe logging across the codebase.
 * Replaces ad-hoc console statements with a unified interface.
 */

export type LogLevel = 'debug' | 'info' | 'warn' | 'error';

export interface LogEntry {
    level: LogLevel;
    timestamp: string;
    message: string;
    context?: string;
    data?: unknown;
}

class Logger {
    private isDev = process.env.NODE_ENV !== 'production';

    private formatEntry(entry: LogEntry): string {
        const { level, timestamp, message, context, data } = entry;
        let formatted = `[${timestamp}] ${level.toUpperCase()}`;
        if (context) formatted += ` [${context}]`;
        formatted += `: ${message}`;
        if (data !== undefined) {
            formatted += ` ${JSON.stringify(data)}`;
        }
        return formatted;
    }

    debug(message: string, context?: string, data?: unknown): void {
        if (!this.isDev) return;
        const entry: LogEntry = {
            level: 'debug',
            timestamp: new Date().toISOString(),
            message,
            context,
            data,
        };
        console.debug(this.formatEntry(entry));
    }

    info(message: string, context?: string, data?: unknown): void {
        const entry: LogEntry = {
            level: 'info',
            timestamp: new Date().toISOString(),
            message,
            context,
            data,
        };
        console.info(this.formatEntry(entry));
    }

    warn(message: string, context?: string, data?: unknown): void {
        const entry: LogEntry = {
            level: 'warn',
            timestamp: new Date().toISOString(),
            message,
            context,
            data,
        };
        console.warn(this.formatEntry(entry));
    }

    error(message: string, context?: string, error?: Error | unknown): void {
        const entry: LogEntry = {
            level: 'error',
            timestamp: new Date().toISOString(),
            message,
            context,
            data: error instanceof Error ? { message: error.message, stack: error.stack } : error,
        };
        console.error(this.formatEntry(entry));
    }
}

export const logger = new Logger();
