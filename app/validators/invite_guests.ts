import vine from '@vinejs/vine'

export const inviteGuestsValidator = vine.compile(
  vine.object({
    ticketTypeId: vine.string().uuid(),
    guests: vine
      .array(
        vine.object({
          name: vine.string().trim().minLength(1).maxLength(200),
          email: vine.string().trim().email().optional(),
          phone: vine.string().trim().optional(),
          sendWhatsApp: vine.boolean().optional(),
          sendEmail: vine.boolean().optional(),
        })
      )
      .minLength(1)
      .maxLength(200),
  })
)
