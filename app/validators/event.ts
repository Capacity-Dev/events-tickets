import vine from '@vinejs/vine'

const ticketTypeSchema = vine.object({
  name: vine.string().minLength(1),
  description: vine.string().optional(),
  basePrice: vine.number().min(0),
  quantityTotal: vine.number().min(1),
  maxPerOrder: vine.number().min(1).optional(),
  currency: vine.string().optional(),
})

export const createEventValidator = vine.compile(
  vine.object({
    title: vine.string().trim().minLength(3).maxLength(200),
    categoryId: vine.string().optional(),
    description: vine.string().optional(),
    coverImage: vine.string().optional(),
    venueName: vine.string().optional(),
    venueAddress: vine.string().optional(),
    startDate: vine.string(),
    endDate: vine.string().optional(),
    ticketTypes: vine.array(ticketTypeSchema).optional(),
    visibility: vine.enum(['public', 'unlisted']).optional(),
    accessPassword: vine.string().minLength(4).maxLength(100).optional(),
  })
)

export const updateEventValidator = vine.compile(
  vine.object({
    title: vine.string().trim().minLength(3).maxLength(200).optional(),
    categoryId: vine.string().optional(),
    description: vine.string().optional(),
    coverImage: vine.string().optional(),
    venueName: vine.string().optional(),
    venueAddress: vine.string().optional(),
    startDate: vine.string().optional(),
    endDate: vine.string().optional(),
    ticketTypes: vine.array(ticketTypeSchema).optional(),
    visibility: vine.enum(['public', 'unlisted']).optional(),
    accessPassword: vine.string().minLength(4).maxLength(100).optional(),
  })
)
