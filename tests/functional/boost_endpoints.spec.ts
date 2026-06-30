import { test } from '@japa/runner'
import User from '#models/user'
import Event from '#models/event'
import EventBoost from '#models/event_boost'
import db from '@adonisjs/lucid/services/db'
import { DateTime } from 'luxon'

test.group('Boost endpoints', (group) => {
  let organizer: User
  let event: Event

  group.setup(async () => {
    await db.beginGlobalTransaction()
    const userId = Date.now()
    organizer = await User.create({
      id: userId,
      fullName: 'Test Organizer',
      email: `organizer-${userId}@test.com`,
      password: 'password123',
    })

    event = await Event.create({
      id: crypto.randomUUID(),
      organizerId: organizer.id as number,
      title: 'Test Event',
      description: 'A test event description',
      startDate: DateTime.fromJSDate(new Date('2026-12-01')),
      status: 'published',
    })
  })

  group.teardown(async () => {
    await db.rollbackGlobalTransaction()
  })

  test('GET /dashboard/boosts returns empty list', async ({ client, assert }) => {
    const response = await client.get('/dashboard/boosts').withInertia().loginAs(organizer)

    response.assertStatus(200)
    const page = response.inertiaPage()
    assert.isArray(page.props.boosts)
    assert.lengthOf(page.props.boosts, 0)
  })

  test('GET /dashboard/events/:id/boost renders creation page', async ({ client, assert }) => {
    const response = await client
      .get(`/dashboard/events/${event.id}/boost`)
      .withInertia()
      .loginAs(organizer)

    response.assertStatus(200)
    const page = response.inertiaPage()
    assert.equal(page.component, 'dashboard/organizer/boost_create')
    assert.exists(page.props.event)
  })

  test('POST /dashboard/events/:id/boost creates a boost', async ({ client, assert }) => {
    const response = await client
      .post(`/dashboard/events/${event.id}/boost`)
      .withInertia()
      .loginAs(organizer)
      .json({
        eventId: event.id,
        budget: 50,
        currency: 'USD',
        budgetType: 'daily',
        startDate: new Date('2026-12-01').toISOString(),
        channels: ['facebook'],
        headline: 'Amazing Event',
        primaryText: 'Come join us for an amazing event!',
        callToAction: 'LEARN_MORE',
      })

    response.assertStatus(200)
    assert.exists(response.body().boostId)
    assert.exists(response.body().totalBudget)
  })

  test('POST /dashboard/events/:id/boost validates required fields', async ({ client }) => {
    const response = await client
      .post(`/dashboard/events/${event.id}/boost`)
      .withInertia()
      .loginAs(organizer)
      .json({ budget: 50 })

    response.assertStatus(422)
  })

  test('GET /dashboard/boosts/:id returns boost details', async ({ client, assert }) => {
    const boost = await EventBoost.create({
      id: crypto.randomUUID(),
      eventId: event.id,
      organizerId: organizer.id as number,
      budget: '50',
      budgetType: 'daily',
      startDate: DateTime.fromJSDate(new Date('2026-12-01')),
      status: 'pending_payment',
      channels: ['facebook'],
      headline: 'Test Boost',
      primaryText: 'Test primary text',
      callToAction: 'LEARN_MORE',
      metaBudget: '45',
      markupAmount: '5',
    })

    const response = await client
      .get(`/dashboard/boosts/${boost.id}`)
      .withInertia()
      .loginAs(organizer)

    response.assertStatus(200)
    const page = response.inertiaPage()
    assert.equal(page.component, 'dashboard/organizer/boost_show')
    assert.exists(page.props.boost)
    assert.equal(page.props.boost.id, boost.id)
  })

  test('GET /dashboard/boosts/:id/status returns status', async ({ client, assert }) => {
    const boost = await EventBoost.create({
      id: crypto.randomUUID(),
      eventId: event.id,
      organizerId: organizer.id as number,
      budget: '50',
      budgetType: 'daily',
      startDate: DateTime.fromJSDate(new Date('2026-12-01')),
      status: 'pending_payment',
      channels: ['facebook'],
      headline: 'Test Boost',
      primaryText: 'Test primary text',
      callToAction: 'LEARN_MORE',
      metaBudget: '45',
      markupAmount: '5',
    })

    const response = await client
      .get(`/dashboard/boosts/${boost.id}/status`)
      .withInertia()
      .loginAs(organizer)

    response.assertStatus(200)
    assert.equal(response.body().id, boost.id)
    assert.equal(response.body().status, 'pending_payment')
  })

  test('POST /dashboard/boosts/:id/pause pauses an active boost', async ({ client, assert }) => {
    const boost = await EventBoost.create({
      id: crypto.randomUUID(),
      eventId: event.id,
      organizerId: organizer.id as number,
      budget: '50',
      budgetType: 'daily',
      startDate: DateTime.fromJSDate(new Date('2026-12-01')),
      status: 'active',
      channels: ['facebook'],
      headline: 'Test Boost',
      primaryText: 'Test primary text',
      callToAction: 'LEARN_MORE',
      metaBudget: '45',
      markupAmount: '5',
    })

    const response = await client
      .post(`/dashboard/boosts/${boost.id}/pause`)
      .withInertia()
      .loginAs(organizer)

    response.assertStatus(302)

    await boost.refresh()
    assert.equal(boost.status, 'paused')
  })

  test('POST /dashboard/boosts/:id/resume resumes a paused boost', async ({ client, assert }) => {
    const boost = await EventBoost.create({
      id: crypto.randomUUID(),
      eventId: event.id,
      organizerId: organizer.id as number,
      budget: '50',
      budgetType: 'daily',
      startDate: DateTime.fromJSDate(new Date('2026-12-01')),
      status: 'paused',
      channels: ['facebook'],
      headline: 'Test Boost',
      primaryText: 'Test primary text',
      callToAction: 'LEARN_MORE',
      metaBudget: '45',
      markupAmount: '5',
    })

    const response = await client
      .post(`/dashboard/boosts/${boost.id}/resume`)
      .withInertia()
      .loginAs(organizer)

    response.assertStatus(302)

    await boost.refresh()
    assert.equal(boost.status, 'active')
  })
})
