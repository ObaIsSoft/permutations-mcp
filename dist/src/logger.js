/**
 * Structured logger for consistent, production-safe logging across the codebase.
 * Replaces ad-hoc console statements with a unified interface.
 */
class Logger {
    isDev = process.env.NODE_ENV !== 'production';
    formatEntry(entry) {
        const { level, timestamp, message, context, data } = entry;
        let formatted = `[${timestamp}] ${level.toUpperCase()}`;
        if (context)
            formatted += ` [${context}]`;
        formatted += `: ${message}`;
        if (data !== undefined) {
            formatted += ` ${JSON.stringify(data)}`;
        }
        return formatted;
    }
    debug(message, context, data) {
        if (!this.isDev)
            return;
        const entry = {
            level: 'debug',
            timestamp: new Date().toISOString(),
            message,
            context,
            data,
        };
        console.debug(this.formatEntry(entry));
    }
    info(message, context, data) {
        const entry = {
            level: 'info',
            timestamp: new Date().toISOString(),
            message,
            context,
            data,
        };
        console.info(this.formatEntry(entry));
    }
    warn(message, context, data) {
        const entry = {
            level: 'warn',
            timestamp: new Date().toISOString(),
            message,
            context,
            data,
        };
        console.warn(this.formatEntry(entry));
    }
    error(message, context, error) {
        const entry = {
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
