import app from "./app";
import { logger } from "./lib/logger";

const port = parseInt(process.env.PORT ?? "8080", 10);
const effectivePort = isNaN(port) || port <= 0 ? 8080 : port;

app.listen(effectivePort, "0.0.0.0", () => {
  logger.info({ port: effectivePort, env: process.env.NODE_ENV ?? "development" }, "🚀 API server started");
});

process.on("uncaughtException",  err    => { logger.error(err,    "Uncaught exception");         process.exit(1); });
process.on("unhandledRejection", reason => { logger.error(reason, "Unhandled promise rejection"); process.exit(1); });
