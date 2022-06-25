import * as winston from 'winston';
import config from '$lib/config';

const { combine, timestamp: timing, printf } = winston.format;
const LOG_TAG = 'logger';
const LOG_ENABLE_TIMING = config.get('logging.enableTimingLog');
const LOG_LEVEL_CONSOLE = config.get('logging.logLevelConsole');

const customFormat = printf(({ level, message, label, timestamp, durationMs }) => {
  if (durationMs) {
    return `[${timestamp}] [${level}] ${label} ${message}, Done in ${durationMs}ms`;
  } else {
    return `[${timestamp}] [${level}] ${label} ${message}`;
  }
});

const logger = winston.createLogger({
  transports: [
    new winston.transports.Console({
      level: LOG_LEVEL_CONSOLE,
      // format: combine(colorize(), timestamp(), customFormat),
      format: combine(timing(), customFormat),
    }),
  ],
});

const error = (label = LOG_TAG, message = 'unknown') => {
  logger.log('error', message, { label });
};
const warn = (label = LOG_TAG, message = 'unknown') => {
  logger.log('warn', message, { label });
};
const info = (label = LOG_TAG, message = 'unknown') => {
  logger.log('info', message, { label });
};
const verbose = (label = LOG_TAG, message = 'unknown') => {
  logger.log('verbose', message, { label });
};
const debug = (label = LOG_TAG, message = 'unknown') => {
  logger.log('debug', message, { label });
};
const silly = (label = LOG_TAG, message = 'unknown') => {
  logger.log('silly', message, { label });
};

const time = (label = LOG_TAG, id = 'unknown') => {
  if (!LOG_ENABLE_TIMING) return;
  logger.log('info', `Starting timer ${id}`, { label });
  logger.profile(id);
};

const timeEnd = (label = LOG_TAG, id = 'unknown') => {
  if (!LOG_ENABLE_TIMING) return;
  logger.profile(id, {
    level: 'info',
    label,
    message: `Finished timer ${id}`,
  });
};

export { error, warn, info, verbose, debug, silly, time, timeEnd };
