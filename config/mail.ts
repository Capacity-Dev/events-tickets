import env from '#start/env'

const mailConfig = {
  from: {
    address: env.get('MAIL_FROM', 'noreply@events-tickets.com'),
    name: env.get('MAIL_FROM_NAME', 'Events Tickets'),
  },
  smtp: {
    host: env.get('SMTP_HOST', 'smtp.zeptomail.com'),
    port: Number(env.get('SMTP_PORT', '587')),
    user: env.get('SMTP_USER', ''),
    pass: env.get('SMTP_PASS', ''),
  },
}

export default mailConfig
