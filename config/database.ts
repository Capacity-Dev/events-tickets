import app from '@adonisjs/core/services/app'
import env from '#start/env'
import { defineConfig } from '@adonisjs/lucid'

const dbConfig = defineConfig({
  connection: env.get('DB_CONNECTION', 'pg'),

  connections: {
    sqlite: {
      client: 'better-sqlite3',
      connection: { filename: app.tmpPath('db.sqlite3') },
      useNullAsDefault: true,
      migrations: { naturalSort: true, paths: ['database/migrations'] },
    },

    pg: {
      client: 'pg',
      connection: {
        host: env.get('DB_HOST', 'localhost'),
        port: Number(env.get('DB_PORT', '5432')),
        user: env.get('DB_USER', ''),
        password: env.get('DB_PASSWORD', ''),
        database: env.get('DB_DATABASE', 'ticket-manager'),
      },
      migrations: { naturalSort: true, paths: ['database/migrations'] },
      debug: app.inDev,
    },
  },
})

export default dbConfig
