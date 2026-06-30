/*
|--------------------------------------------------------------------------
| Environment variables service
|--------------------------------------------------------------------------
|
| The `Env.create` method creates an instance of the Env service. The
| service validates the environment variables and also cast values
| to JavaScript data types.
|
*/

import { Env } from '@adonisjs/core/env'

export default await Env.create(new URL('../', import.meta.url), {
  // Node
  NODE_ENV: Env.schema.enum(['development', 'production', 'test'] as const),
  PORT: Env.schema.number(),
  HOST: Env.schema.string({ format: 'host' }),
  LOG_LEVEL: Env.schema.string(),

  // App
  APP_KEY: Env.schema.secret(),
  APP_URL: Env.schema.string({ format: 'url', tld: false }),

  // Session
  SESSION_DRIVER: Env.schema.enum(['cookie', 'memory', 'database'] as const),

  // Database
  DB_CONNECTION: Env.schema.enum(['pg', 'sqlite'] as const),
  DB_HOST: Env.schema.string(),
  DB_PORT: Env.schema.number(),
  DB_USER: Env.schema.string(),
  DB_PASSWORD: Env.schema.string.optional(),
  DB_DATABASE: Env.schema.string(),

  /*
  |----------------------------------------------------------
  | Variables for configuring ally package
  |----------------------------------------------------------
  */
  GOOGLE_CLIENT_ID: Env.schema.string.optional(),
  GOOGLE_CLIENT_SECRET: Env.schema.string.optional(),

  MBIYOPAY_API_KEY: Env.schema.string(),
  MBIYOPAY_WEBHOOK_SECRET: Env.schema.string(),

  // Admin
  ADMIN_PREFIX: Env.schema.string.optional(),

  // WhatsApp
  WHATSAPP_PROVIDER: Env.schema.enum.optional(['baileys', 'meta', 'disabled'] as const),

  // Mail (ZeptoMail)
  ZEPTOMAIL_TOKEN: Env.schema.string.optional(),
  MAIL_FROM: Env.schema.string.optional(),
  MAIL_FROM_NAME: Env.schema.string.optional(),

  // Meta Ads
  META_ADS_AD_ACCOUNT_ID: Env.schema.string.optional(),
  META_ADS_ACCESS_TOKEN: Env.schema.secret.optional(),
  META_PAGE_ID: Env.schema.string.optional(),
  META_ADS_APP_ID: Env.schema.string.optional(),
  META_API_VERSION: Env.schema.string.optional(),
  META_ADS_DEFAULT_CURRENCY: Env.schema.string.optional(),
  META_ADS_DEFAULT_CTA: Env.schema.string.optional(),
  META_ADS_DEFAULT_BUDGET_TYPE: Env.schema.enum.optional(['daily', 'lifetime'] as const),
  META_WEBHOOK_VERIFY_TOKEN: Env.schema.string.optional(),
})
