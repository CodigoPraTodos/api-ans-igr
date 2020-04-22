// import fs from "fs";
// import DailyRotateFile from "winston-daily-rotate-file";
// import { createLogger, format, transports } from "winston";

// import config from "./config";

// const {
//     logging,
//     app: { environment },
// } = config;
// const { combine, colorize, splat, printf, timestamp } = format;

// const keysToFilter = ["password", "token"];

// const formatter = printf((info: any) => {
//     const { level, message, timestamp: ts, ...restMeta } = info;

//     const meta =
//         restMeta && Object.keys(restMeta).length
//             ? JSON.stringify(restMeta, (key: any, value: any) => (keysToFilter.includes(key) ? "******" : value), 2)
//             : restMeta instanceof Object
//             ? ""
//             : restMeta;

//     return `[ ${ts} ] - [ ${level} ] ${message} ${meta}`;
// });

// if (!fs.existsSync(logging.dir)) {
//     fs.mkdirSync(logging.dir);
// }

// let trans: any = [];

// if (environment === "development") {
//     trans = [new transports.Console()];
// }

// const logger = createLogger({
//     level: logging.level,
//     format: combine(splat(), colorize(), timestamp(), formatter),
//     transports: [
//         ...trans,
//         new DailyRotateFile({
//             maxSize: logging.maxSize,
//             maxFiles: logging.maxFiles,
//             datePattern: logging.datePattern,
//             zippedArchive: true,
//             filename: `${logging.dir}/${logging.level}-%DATE%.log`,
//         }),
//     ],
// });

// logger.stream = {
//     write: (message, encoding) => {
//         logger.info(message);
//     },
// };

// export default logger;