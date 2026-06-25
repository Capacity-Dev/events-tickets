import { WhatsappTemplateSchema } from '#database/schema'

export default class WhatsAppTemplate extends WhatsappTemplateSchema {
  static $selfAssignPrimaryKey = true
  static table = 'whatsapp_templates'
}
