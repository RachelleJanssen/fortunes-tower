import { addColors, createLogger, format, Logger, transports } from 'winston';

import winstonDailyRotateFile from 'winston-daily-rotate-file';

import { isDev } from '../../env';

const { combine, timestamp, label, printf, colorize, align } = format;
// const LEVEL = Symbol.for('level');

// Log only the messages that match `level`.

// set custom levels and corresponding tagcolor
const customSet = {
  levels: {
    // set custom levels
    error: 0,
    warn: 1,
    info: 2,
    socket: 3,
    debug: 4,
    route: 5,
  },
  colors: {
    error: 'red',
    warn: 'yellow',
    info: 'green',
    socket: 'magentaBG',
    debug: 'blue',
    route: 'black greenBG',
  },
};
// add level-color link to winston
addColors(customSet.colors);

export function log(): Logger {
  let logger: Logger;
  if (isDev) {
    logger = createLogger({
      levels: customSet.levels,
      transports: [
        new transports.Console({
          level: 'route',
          format: combine(
            colorize(), // colorizes the logging level tag
            timestamp({
              format: 'YYYY-MM-DD HH:mm:ss.SSSS', // use 'hh:mm:ssa' to change to 12h am/pm  (or 'A' for AM/PM)
            }),
            label({
              label: 'log',
            }),
            printf(i => `${i.timestamp} [${i.label}] ${i.level}: ${i.message}`),
          ),
        }),
      ],
    });
  } else {
    logger = createLogger({
      levels: customSet.levels,
      transports: [
        new winstonDailyRotateFile({
          // all logs, except the routelogs
          level: 'debug',
          format: combine(
            align(), // creates automated tabs to align logs?
            timestamp({
              format: 'YYYY-MM-DD HH:mm:ss.SSSS', // use 'hh:mm:ssa' to change to 12h am/pm  (or 'A' for AM/PM)
            }),
            printf(i => `${i.timestamp} ${i.level}: ${i.message}`),
          ),
          filename: './logs/debuglogs/debug-%DATE%h.log',
          // concerning datePattern:
          // IF set to 'HH', rotation takes place every 24hours AND every hour a new file is created/overwritten, if you wait 24 hours
          // the old file at that hour gets overwritten.
          // IF set to YYYY-MM-DD_HH, rotation never takes place (there is no 2nd time/year that the year 2018 will exists).
          // we define the HH here, to set that every hour a new file is created.
          datePattern: 'YYYY-MM-DD_HH',
          zippedArchive: true, // create archive of old log
          maxSize: '20m', // 20 mb
          maxFiles: '1d', // change to 15d // if number has 'd'-suffix, it is set to ... days until log is archived
        }),
        new winstonDailyRotateFile({
          // all route logs
          level: 'route',
          format: combine(
            align(), // creates automated tabs to align logs?
            timestamp({
              format: 'YYYY-MM-DD HH:mm:ss.SSSS', // use 'hh:mm:ssa' to change to 12h am/pm  (or 'A' for AM/PM)
            }),
            label({
              label: 'label',
            }),
            printf(i => `${i.timestamp} [${i.label}] ${i.level}: ${i.message}`),
          ),
          filename: './logs/routelogs/route-%DATE%h.log',
          // concerning datePattern:
          // IF set to 'HH', rotation takes place every 24hours AND every hour a new file is created/overwritten, if you wait 24 hours
          // the old file at that hour gets overwritten.
          // IF set to YYYY-MM-DD_HH, rotation never takes place (there is no 2nd time/year that the year 2018 will exists).
          // we define the HH here, to set that every hour a new file is created.
          datePattern: 'YYYY-MM-DD_HH',
          zippedArchive: true, // create archive of old log
          maxSize: '20m', // 20 mb
          maxFiles: '1d', // change to 15d // if number has 'd'-suffix, it is set to ... days until log is archived
        }),
      ],
    });
  }
  return logger;
}
