import app from '@adonisjs/core/services/app'
import { WhatsAppService } from '#services/whatsapp_service'
import logger from '@adonisjs/core/services/logger'

async function initializeWhatsApp() {
  try {
    logger.info('Initializing WhatsApp service...')
    await WhatsAppService.initialize()
    logger.info('WhatsApp service initialized successfully')
  } catch (error) {
    logger.error('Failed to initialize WhatsApp service:', error)
  }
}

if (app.getEnvironment() !== 'console' && app.getEnvironment() !== 'test') {
  app.ready(() => {
    initializeWhatsApp()
  })
}
