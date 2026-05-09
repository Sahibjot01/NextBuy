type LogLevel = "info" | "warn" | "error" | "debug";

type LogMeta = Record<string, unknown>;

const currentLevel = process.env.LOG_LEVEL ?? (process.env.NODE_ENV === "production" ? "info" : "debug");

const levelRank: Record<LogLevel, number> = {
  debug: 10,
  info: 20,
  warn: 30,
  error: 40,
};

const shouldLog = (level: LogLevel) => {
  const configured = (currentLevel as LogLevel) in levelRank ? (currentLevel as LogLevel) : "info";
  return levelRank[level] >= levelRank[configured];
};

const redactMeta = (meta?: LogMeta): LogMeta | undefined => {
  if (!meta) return undefined;

  const blocked = new Set([
    "clientSecret",
    "clientSecretID",
    "stripeSecretKey",
    "authorization",
    "password",
    "token",
  ]);

  const redacted: LogMeta = {};
  for (const [key, value] of Object.entries(meta)) {
    redacted[key] = blocked.has(key) ? "[REDACTED]" : value;
  }
  return redacted;
};

const write = (level: LogLevel, source: string, message: string, meta?: LogMeta) => {
  if (!shouldLog(level)) return;

  const payload = {
    ts: new Date().toISOString(),
    level,
    source,
    message,
    ...(meta ? { meta: redactMeta(meta) } : {}),
  };

  if (level === "error") {
    console.error(JSON.stringify(payload));
    return;
  }
  if (level === "warn") {
    console.warn(JSON.stringify(payload));
    return;
  }
  if (level === "debug") {
    console.debug(JSON.stringify(payload));
    return;
  }
  console.info(JSON.stringify(payload));
};

export const logger = {
  info: (source: string, message: string, meta?: LogMeta) => write("info", source, message, meta),
  warn: (source: string, message: string, meta?: LogMeta) => write("warn", source, message, meta),
  error: (source: string, message: string, meta?: LogMeta) => write("error", source, message, meta),
  debug: (source: string, message: string, meta?: LogMeta) => write("debug", source, message, meta),
};
