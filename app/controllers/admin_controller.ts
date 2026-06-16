import type { HttpContext } from '@adonisjs/core/http'
import { DateTime } from 'luxon'
import Event from '#models/event'
import User from '#models/user'
import Category from '#models/category'
import FeeRule from '#models/fee_rule'
import Payout from '#models/payout'
import Order from '#models/order'
import WhatsAppTemplate from '#models/whatsapp_template'

export default class AdminController {
  async pendingEvents({ inertia }: HttpContext) {
    const events = await Event.query()
      .where('status', 'pending_approval')
      .preload('organizer')
      .preload('category')
      .orderBy('createdAt', 'asc')

    return (inertia.render as any)('admin/events_pending', { events })
  }

  async approveEvent({ params, response }: HttpContext) {
    const event = await Event.find(params.id)
    if (!event) return response.status(404).send('Not found')
    event.status = 'published'
    event.publishedAt = DateTime.now()
    await event.save()
    response.redirect().toRoute('admin.events.pending')
  }

  async rejectEvent({ params, response }: HttpContext) {
    const event = await Event.find(params.id)
    if (!event) return response.status(404).send('Not found')
    event.status = 'rejected'
    await event.save()
    response.redirect().toRoute('admin.events.pending')
  }

  async users({ inertia }: HttpContext) {
    const users = await User.query().preload('role').orderBy('createdAt', 'desc')
    return (inertia.render as any)('admin/users', { users })
  }

  async updateUserRole({ request, params, response }: HttpContext) {
    const user = await User.find(params.id)
    if (!user) return response.status(404).send('Not found')
    const roleId = request.input('roleId')
    if (roleId) user.roleId = roleId
    await user.save()
    response.redirect().toRoute('admin.users')
  }

  async feeRules({ inertia }: HttpContext) {
    const rules = await FeeRule.query().orderBy('priority', 'asc')
    return (inertia.render as any)('admin/fee_rules', { rules })
  }

  async storeFeeRule({ request, response }: HttpContext) {
    const data = request.all()
    await FeeRule.create({
      id: crypto.randomUUID(),
      name: data.name,
      type: data.type,
      value: data.value,
      secondaryValue: data.secondaryValue ?? null,
      appliesTo: data.appliesTo ?? 'buyer',
      isDefault: data.isDefault ?? false,
      status: 'active',
      priority: data.priority ?? 0,
    })
    response.redirect().toRoute('admin.fee.rules')
  }

  async finances({ inertia }: HttpContext) {
    const orders = await Order.query()
      .preload('buyer')
      .orderBy('createdAt', 'desc')
      .limit(100)

    return (inertia.render as any)('admin/finances', { orders })
  }

  async processPayout({ params, response }: HttpContext) {
    const payout = await Payout.find(params.id)
    if (!payout) return response.status(404).send('Not found')
    payout.status = 'completed'
    payout.processedAt = DateTime.now()
    payout.completedAt = DateTime.now()
    await payout.save()
    response.redirect().toRoute('admin.finances')
  }

  async categories({ inertia }: HttpContext) {
    const categories = await Category.query().orderBy('displayOrder', 'asc')
    return (inertia.render as any)('admin/categories', { categories })
  }

  async storeCategory({ request, response }: HttpContext) {
    const data = request.all()
    await Category.create({
      id: crypto.randomUUID(),
      name: data.name,
      slug: data.slug ?? data.name.toLowerCase().replace(/\s+/g, '-'),
      displayOrder: data.displayOrder ?? 0,
    })
    response.redirect().toRoute('admin.categories')
  }

  async deleteCategory({ params, response }: HttpContext) {
    const cat = await Category.find(params.id)
    if (cat) await cat.delete()
    response.redirect().toRoute('admin.categories')
  }

  async homepage({ inertia }: HttpContext) {
    const events = await Event.query()
      .where('status', 'published')
      .orderBy('isFeatured', 'desc')
      .orderBy('startDate', 'asc')

    return (inertia.render as any)('admin/homepage', { events })
  }

  async toggleFeatured({ params, response }: HttpContext) {
    const event = await Event.find(params.id)
    if (!event) return response.status(404).send('Not found')
    event.isFeatured = !event.isFeatured
    await event.save()
    response.redirect().toRoute('admin.homepage')
  }

  async whatsappTemplates({ inertia }: HttpContext) {
    const templates = await WhatsAppTemplate.query().orderBy('createdAt', 'desc')
    return (inertia.render as any)('admin/whatsapp', { templates })
  }

  async storeWhatsappTemplate({ request, response }: HttpContext) {
    const data = request.all()
    await WhatsAppTemplate.create({
      id: crypto.randomUUID(),
      name: data.name,
      category: data.category,
      languageCode: data.languageCode ?? 'en_US',
      status: 'pending_approval',
      variables: data.variables ? JSON.parse(data.variables) : null,
    })
    response.redirect().toRoute('admin.whatsapp')
  }
}
