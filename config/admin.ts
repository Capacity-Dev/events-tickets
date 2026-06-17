import env from '#start/env'

export default {
  prefix: env.get('ADMIN_PREFIX', 'admin'),
}
