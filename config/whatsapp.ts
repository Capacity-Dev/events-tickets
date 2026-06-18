import env from '#start/env'

const whatsappConfig = {
  provider: env.get('WHATSAPP_PROVIDER', 'baileys') as 'baileys' | 'meta' | 'disabled',
  baileys: {
    authPath: 'storage/whatsapp-auth',
    reconnectDelayMs: 10000,
  },
  meta: {
    phoneNumberId: env.get('META_WHATSAPP_PHONE_ID', ''),
    token: env.get('META_WHATSAPP_TOKEN', ''),
  },
}

export default whatsappConfig
