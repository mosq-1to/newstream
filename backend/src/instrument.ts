import * as Sentry from '@sentry/nestjs';

Sentry.init({
  dsn: process.env.SENTRY_DSN_URL,
  tracesSampleRate: 1.0,
  enableLogs: true,
  sendDefaultPii: true,
});
