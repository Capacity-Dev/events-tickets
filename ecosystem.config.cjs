module.exports = {
  apps: [
    {
      name: 'events-tickets',
      script: 'bin/server.js',
      cwd: './build',
      instances: 1,
      exec_mode: 'fork',
      env: {
        NODE_ENV: 'production',
        PORT: 3777,
        HOST: '0.0.0.0',
        LOG_LEVEL: 'info',
      },
      max_memory_restart: '512M',
      log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
      error_file: './storage/logs/pm2-error.log',
      out_file: './storage/logs/pm2-out.log',
      merge_logs: true,
      autorestart: true,
      max_restarts: 10,
      min_uptime: '10s',
    },
  ],
}
