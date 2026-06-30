import vine from '@vinejs/vine'

const CTAS = [
  'LEARN_MORE',
  'BOOK_NOW',
  'SIGN_UP',
  'SHOP_NOW',
  'CONTACT_US',
  'DOWNLOAD',
  'WATCH_MORE',
  'SEE_MENU',
  'APPLY_NOW',
  'SUBSCRIBE',
] as const

export const storeBoostValidator = vine.compile(
  vine.object({
    eventId: vine.string().uuid(),
    budget: vine.number().min(1).max(50000),
    currency: vine.string().fixedLength(3).optional(),
    budgetType: vine.enum(['daily', 'lifetime']).optional(),
    startDate: vine.date(),
    endDate: vine.date().optional(),
    channels: vine.any(),
    targeting: vine.any().optional(),
    headline: vine.string().maxLength(255).optional(),
    primaryText: vine.string().maxLength(500).optional(),
    callToAction: vine
      .string()
      .in([...CTAS])
      .optional(),
  })
)

export const payBoostValidator = vine.compile(
  vine.object({
    boostId: vine.string().uuid(),
  })
)
