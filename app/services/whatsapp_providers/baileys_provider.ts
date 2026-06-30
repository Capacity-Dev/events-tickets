import makeWASocket, {
  type ConnectionState,
  DisconnectReason,
  useMultiFileAuthState,
  type WAMessage,
  fetchLatestWaWebVersion,
} from '@whiskeysockets/baileys'
import { type Boom } from '@hapi/boom'
import QRCode from 'qrcode'
import app from '@adonisjs/core/services/app'
import logger from '@adonisjs/core/services/logger'

export class BaileysProvider {
  private static sock: any = null
  private static isConnected = false
  private static qrCode: string | null = null
  private static connectionStatus: 'disconnected' | 'connecting' | 'connected' = 'disconnected'
  private static initializationTimeout: NodeJS.Timeout | null = null

  static getStatus() {
    return {
      isConnected: this.isConnected,
      status: this.connectionStatus,
      qrCode: this.qrCode,
    }
  }

  static async initialize(): Promise<void> {
    const authPath = app.makePath('..', 'storage/whatsapp-auth')

    if (this.initializationTimeout) {
      clearTimeout(this.initializationTimeout)
      this.initializationTimeout = null
    }

    try {
      this.connectionStatus = 'connecting'
      const { state, saveCreds } = await useMultiFileAuthState(authPath)

      const { version } = await fetchLatestWaWebVersion().catch(() => ({
        version: [2, 3000, 1015901307] as [number, number, number],
      }))

      this.sock = makeWASocket({
        version,
        auth: state,
        printQRInTerminal: true,
        logger: logger.child({ module: 'whatsapp' }),
        browser: ['Ubuntu', 'Chrome', '20.0.04'],
        connectTimeoutMs: 60000,
        defaultQueryTimeoutMs: 0,
        keepAliveIntervalMs: 10000,
        generateHighQualityLinkPreview: true,
      })

      this.sock.ev.on('connection.update', async (update: Partial<ConnectionState>) => {
        const { connection, lastDisconnect, qr } = update

        if (qr) {
          this.qrCode = await QRCode.toDataURL(qr)
          logger.info('WhatsApp QR code generated')
        }

        if (connection === 'close') {
          this.connectionStatus = 'disconnected'
          this.isConnected = false
          this.qrCode = null

          const statusCode = (lastDisconnect?.error as Boom)?.output?.statusCode
          const shouldReconnect = statusCode !== DisconnectReason.loggedOut

          if (shouldReconnect) {
            logger.info(`WhatsApp disconnected (${statusCode}). Reconnecting in 10s...`)
            this.initializationTimeout = setTimeout(() => this.initialize(), 10000)
          } else {
            logger.info('WhatsApp logged out permanently')
          }
        } else if (connection === 'open') {
          logger.info('WhatsApp connected')
          this.connectionStatus = 'connected'
          this.isConnected = true
          this.qrCode = null
        }
      })

      this.sock.ev.on('creds.update', saveCreds)
    } catch (error) {
      this.connectionStatus = 'disconnected'
      logger.error('Failed to initialize WhatsApp:', error)
    }
  }

  static async disconnect(): Promise<void> {
    if (this.sock) {
      await this.sock.logout()
      this.sock = null
      this.isConnected = false
      this.connectionStatus = 'disconnected'
      this.qrCode = null
      if (this.initializationTimeout) clearTimeout(this.initializationTimeout)
    }
  }

  static async reset(): Promise<void> {
    try {
      if (this.initializationTimeout) clearTimeout(this.initializationTimeout)
      this.isConnected = false
      this.connectionStatus = 'disconnected'
      this.qrCode = null
      const authPath = app.makePath('..', 'storage/whatsapp-auth')
      const { rm } = await import('node:fs/promises')
      await rm(authPath, { recursive: true, force: true })
      logger.info('WhatsApp session reset')
    } catch (error) {
      logger.error('Failed to reset WhatsApp session:', error)
      throw error
    }
  }

  static async sendMessage(phone: string, message: string): Promise<WAMessage | null> {
    if (!this.isConnected || !this.sock) {
      throw new Error('WhatsApp is not connected')
    }
    const cleaned = phone.replace(/\D/g, '')
    const jid = cleaned + '@s.whatsapp.net'
    return this.sock.sendMessage(jid, { text: message })
  }

  static async sendImage(
    phone: string,
    imageBuffer: Buffer,
    caption?: string
  ): Promise<WAMessage | null> {
    if (!this.isConnected || !this.sock) {
      throw new Error('WhatsApp is not connected')
    }
    const cleaned = phone.replace(/\D/g, '')
    const jid = cleaned + '@s.whatsapp.net'
    return this.sock.sendMessage(jid, {
      image: imageBuffer,
      caption: caption ?? '',
    })
  }

  static async sendTicketNotification(
    phone: string,
    data: {
      buyerName: string
      eventTitle: string
      eventDate: string
      venueName: string
      ticketCount: number
      ticketNumbers: string[]
      orderNumber: string
      ticketLinks: string[]
    }
  ): Promise<void> {
    if (!this.isConnected || !this.sock) {
      throw new Error('WhatsApp is not connected')
    }

    const linksStr = data.ticketLinks
      .map((link, i) => `${data.ticketNumbers[i]}: ${link}`)
      .join('\n')

    const message = `🎫 *Vos billets sont prêts !*

Bonjour ${data.buyerName},

Votre commande #${data.orderNumber} a été confirmée.

📅 *Événement :* ${data.eventTitle}
📍 *Lieu :* ${data.venueName}
🗓 *Date :* ${data.eventDate}
🎟 *Billets :* ${data.ticketCount} ticket${data.ticketCount > 1 ? 's' : ''}

${linksStr}

Présentez ce billet à l'entrée. À bientôt !`

    const cleaned = phone.replace(/\D/g, '')
    await this.sock.sendMessage(cleaned + '@s.whatsapp.net', { text: message })
  }
}
