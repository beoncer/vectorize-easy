import { createLogger, format, transports } from 'winston';
import { performance } from 'perf_hooks';

// Custom format for structured logging
const structuredFormat = format.combine(
  format.timestamp(),
  format.errors({ stack: true }),
  format.metadata({ fillExcept: ['message', 'level', 'timestamp'] }),
  format.json()
);

// Create logger instance
const logger = createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: structuredFormat,
  defaultMeta: { service: 'vectorize-api' },
  transports: [
    // Console transport for development
    new transports.Console({
      format: format.combine(
        format.colorize(),
        format.simple()
      )
    }),
    // Error log file
    new transports.File({ 
      filename: 'logs/error.log', 
      level: 'error',
      maxsize: 5242880, // 5MB
      maxFiles: 5,
      tailable: true
    }),
    // Combined log file
    new transports.File({ 
      filename: 'logs/combined.log',
      maxsize: 5242880, // 5MB
      maxFiles: 5,
      tailable: true
    }),
    // Performance metrics log file
    new transports.File({ 
      filename: 'logs/performance.log',
      level: 'info',
      maxsize: 5242880, // 5MB
      maxFiles: 5,
      tailable: true
    })
  ]
});

// Performance monitoring
const performanceMetrics = {
  startTime: Date.now(),
  requestCount: 0,
  errorCount: 0,
  totalResponseTime: 0
};

// Log levels
export const logLevels = {
  error: 0,
  warn: 1,
  info: 2,
  http: 3,
  debug: 4
};

// Structured logging functions
export const logError = (error: Error, context?: Record<string, any>) => {
  performanceMetrics.errorCount++;
  logger.error({
    message: error.message,
    stack: error.stack,
    ...context
  });
};

export const logInfo = (message: string, context?: Record<string, any>) => {
  logger.info({
    message,
    ...context
  });
};

export const logWarning = (message: string, context?: Record<string, any>) => {
  logger.warn({
    message,
    ...context
  });
};

export const logHttp = (message: string, context?: Record<string, any>) => {
  logger.http({
    message,
    ...context
  });
};

// Performance monitoring functions
export const startPerformanceMonitoring = () => {
  const startTime = performance.now();
  return () => {
    const endTime = performance.now();
    const duration = endTime - startTime;
    performanceMetrics.totalResponseTime += duration;
    performanceMetrics.requestCount++;

    // Log performance metrics
    logger.info({
      message: 'Performance metrics',
      duration,
      averageResponseTime: performanceMetrics.totalResponseTime / performanceMetrics.requestCount,
      uptime: Date.now() - performanceMetrics.startTime,
      requestCount: performanceMetrics.requestCount,
      errorCount: performanceMetrics.errorCount
    });
  };
};

// Health check function
export const getHealthStatus = () => {
  return {
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime: Date.now() - performanceMetrics.startTime,
    metrics: {
      requestCount: performanceMetrics.requestCount,
      errorCount: performanceMetrics.errorCount,
      averageResponseTime: performanceMetrics.totalResponseTime / performanceMetrics.requestCount
    }
  };
};

// Error tracking
export const trackError = (error: Error, context?: Record<string, any>) => {
  // Log error
  logError(error, context);

  // Here you would integrate with an error tracking service like Sentry
  // if (process.env.SENTRY_DSN) {
  //   Sentry.captureException(error, {
  //     extra: context
  //   });
  // }
};

export default logger; 