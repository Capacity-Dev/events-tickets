import env from '#start/env'

const mailConfig = {
  from: {
    address: env.get('MAIL_FROM', 'noreply@events-tickets.com'),
    name: env.get('MAIL_FROM_NAME', 'Events Tickets'),
  },
  zeptomail: {
    token: env.get('ZEPTOMAIL_TOKEN', ''),
  },
}

export default mailConfig
