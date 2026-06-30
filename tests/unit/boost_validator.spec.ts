import { test } from '@japa/runner'
import { storeBoostValidator, payBoostValidator } from '#validators/boost'

test.group('Boost Validators', () => {
  test('storeBoostValidator passes with valid data', async ({ assert }) => {
    const data = {
      eventId: crypto.randomUUID(),
      budget: 100,
      currency: 'USD',
      budgetType: 'daily',
      startDate: new Date().toISOString(),
      channels: ['facebook'],
      headline: 'Test Headline',
      primaryText: 'Test primary text',
      callToAction: 'LEARN_MORE',
    }

    const result = await storeBoostValidator.validate(data)
    assert.isUndefined(result)
  })

  test('storeBoostValidator fails when budget is negative', async ({ assert }) => {
    const data = {
      eventId: crypto.randomUUID(),
      budget: -10,
      startDate: new Date().toISOString(),
      channels: ['facebook'],
    }

    await assert.rejects(() => storeBoostValidator.validate(data))
  })

  test('storeBoostValidator fails when budget exceeds max', async ({ assert }) => {
    const data = {
      eventId: crypto.randomUUID(),
      budget: 100000,
      startDate: new Date().toISOString(),
      channels: ['facebook'],
    }

    await assert.rejects(() => storeBoostValidator.validate(data))
  })

  test('storeBoostValidator fails with invalid eventId', async ({ assert }) => {
    const data = {
      eventId: 'not-a-uuid',
      budget: 100,
      startDate: new Date().toISOString(),
      channels: ['facebook'],
    }

    await assert.rejects(() => storeBoostValidator.validate(data))
  })

  test('storeBoostValidator accepts channels as JSON string', async ({ assert }) => {
    const data = {
      eventId: crypto.randomUUID(),
      budget: 100,
      startDate: new Date().toISOString(),
      channels: JSON.stringify(['facebook', 'instagram']),
    }

    const result = await storeBoostValidator.validate(data)
    assert.isUndefined(result)
  })

  test('storeBoostValidator fails with invalid channel name', async ({ assert }) => {
    const data = {
      eventId: crypto.randomUUID(),
      budget: 100,
      startDate: new Date().toISOString(),
      channels: ['snapchat'],
    }

    await assert.rejects(() => storeBoostValidator.validate(data))
  })

  test('storeBoostValidator passes with valid targeting', async ({ assert }) => {
    const data = {
      eventId: crypto.randomUUID(),
      budget: 100,
      startDate: new Date().toISOString(),
      channels: ['facebook'],
      targeting: {
        countries: ['US', 'FR'],
        ageMin: 25,
        ageMax: 45,
        languages: ['en', 'fr'],
      },
    }

    const result = await storeBoostValidator.validate(data)
    assert.isUndefined(result)
  })

  test('payBoostValidator passes with valid boostId', async ({ assert }) => {
    const data = { boostId: crypto.randomUUID() }
    const result = await payBoostValidator.validate(data)
    assert.isUndefined(result)
  })

  test('payBoostValidator fails with invalid boostId', async ({ assert }) => {
    const data = { boostId: 'not-a-uuid' }
    await assert.rejects(() => payBoostValidator.validate(data))
  })
})
