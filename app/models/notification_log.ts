import { NotificationLogSchema } from '#database/schema'

export default class NotificationLog extends NotificationLogSchema {
  static $selfAssignPrimaryKey = true
}
