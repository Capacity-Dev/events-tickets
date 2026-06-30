import { test } from '@japa/runner'
import { MetaAdsService } from '#services/meta_ads_service'

test.group('MetaAdsService', () => {
  test('isConfigured returns false when no credentials set', ({ assert }) => {
    const service = new MetaAdsService()
    assert.isFalse(service.isConfigured())
  })

  test('adAccountId getter returns configured value', ({ assert }) => {
    const service = new MetaAdsService()
    assert.isString(service.adAccountId)
  })

  test('accessToken getter returns configured value', ({ assert }) => {
    const service = new MetaAdsService()
    assert.isString(service.accessToken)
  })

  test('apiVersion getter returns configured version', ({ assert }) => {
    const service = new MetaAdsService()
    assert.isString(service.apiVersion)
    assert.isTrue(service.apiVersion.startsWith('v'))
  })

  test('pageId getter returns configured value', ({ assert }) => {
    const service = new MetaAdsService()
    assert.isString(service.pageId)
  })
})
