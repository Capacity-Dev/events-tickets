import env from '#start/env'
import logger from '@adonisjs/core/services/logger'

const BASE_URL = 'https://graph.facebook.com'

interface CreateCampaignParams {
  adAccountId: string
  accessToken: string
  campaignName: string
  objective: string
  status: string
}

interface CreateAdSetParams {
  adAccountId: string
  accessToken: string
  campaignId: string
  adSetName: string
  budget: number
  budgetType: string
  startDate: string
  endDate?: string
  targeting: Record<string, any>
  placementChannels: string[]
}

interface CreateCreativeParams {
  adAccountId: string
  accessToken: string
  pageId: string
  imageHash: string
  headline: string
  primaryText: string
  callToAction: string
  linkUrl: string
}

interface CreateAdParams {
  adAccountId: string
  accessToken: string
  adSetId: string
  creativeId: string
  adName: string
  status: string
}

interface BoostInsights {
  impressions: number
  clicks: number
  spend: number
  ctr: number
  cpc: number
}

export class MetaAdsService {
  #adAccountId: string
  #accessToken: string
  #pageId: string
  #apiVersion: string

  constructor() {
    this.#adAccountId = env.get('META_ADS_AD_ACCOUNT_ID', '')
    this.#accessToken = env.get('META_ADS_ACCESS_TOKEN', '')
    this.#pageId = env.get('META_PAGE_ID', '')
    this.#apiVersion = env.get('META_API_VERSION', 'v22.0')
  }

  get adAccountId() { return this.#adAccountId }
  get accessToken() { return this.#accessToken }
  get pageId() { return this.#pageId }
  get apiVersion() { return this.#apiVersion }

  isConfigured(): boolean {
    return !!(this.#adAccountId && this.#accessToken)
  }

  async #api(path: string, method: string = 'GET', body?: Record<string, any>): Promise<any> {
    const url = `${BASE_URL}/${this.#apiVersion}${path}`
    const fullUrl = `${url}?access_token=${this.#accessToken}`

    logger.info(`[MetaAds] ${method} ${url}`)

    const response = await fetch(fullUrl, method !== 'GET' && body
      ? {
          method,
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(body),
        }
      : { method, headers: { 'Content-Type': 'application/json' } })

    const json: any = await response.json()

    if (!response.ok) {
      const errMsg = json?.error?.message ?? JSON.stringify(json)
      logger.error({ err: json }, '[MetaAds] API error')
      throw new Error(`Meta API error: ${errMsg}`)
    }

    return json
  }

  async createCampaign(params: CreateCampaignParams): Promise<string> {
    const result = await this.#api(`/act_${params.adAccountId.replace('act_', '')}/campaigns`, 'POST', {
      name: params.campaignName,
      objective: params.objective,
      status: params.status,
      special_ad_categories: [],
      access_token: params.accessToken,
    })
    return result.id
  }

  async createAdSet(params: CreateAdSetParams): Promise<string> {
    const targeting = this.#buildTargeting(params.targeting, params.placementChannels)
    const cleanedAccountId = params.adAccountId.replace('act_', '')

    const body: Record<string, any> = {
      name: params.adSetName,
      campaign_id: params.campaignId,
      billing_event: 'IMPRESSIONS',
      optimization_goal: 'LINK_CLICKS',
      status: 'PAUSED',
      targeting,
      access_token: params.accessToken,
    }

    if (params.budgetType === 'daily') {
      body.daily_budget = Math.round(params.budget * 100)
    } else {
      body.lifetime_budget = Math.round(params.budget * 100)
    }

    if (params.startDate) {
      body.start_time = new Date(params.startDate).toISOString()
    }
    if (params.endDate) {
      body.end_time = new Date(params.endDate).toISOString()
    }

    const result = await this.#api(`/act_${cleanedAccountId}/adsets`, 'POST', body)
    return result.id
  }

  async createCreative(params: CreateCreativeParams): Promise<string> {
    const cleanedAccountId = params.adAccountId.replace('act_', '')

    const objectStorySpec: Record<string, any> = {
      page_id: params.pageId,
      link_data: {
        link: params.linkUrl,
        message: params.primaryText,
        name: params.headline,
        call_to_action: {
          type: params.callToAction,
        },
      },
    }

    if (params.imageHash) {
      objectStorySpec.link_data.image_hash = params.imageHash
    }

    const result = await this.#api(`/act_${cleanedAccountId}/adcreatives`, 'POST', {
      object_story_spec: objectStorySpec,
      access_token: params.accessToken,
    })
    return result.id
  }

  async createAd(params: CreateAdParams): Promise<string> {
    const cleanedAccountId = params.adAccountId.replace('act_', '')

    const result = await this.#api(`/act_${cleanedAccountId}/ads`, 'POST', {
      name: params.adName,
      adset_id: params.adSetId,
      creative: { creative_id: params.creativeId },
      status: params.status,
      access_token: params.accessToken,
    })
    return result.id
  }

  async uploadImage(imageUrl: string): Promise<string> {
    const imageData = await fetch(imageUrl)
    const imageBuffer = Buffer.from(await imageData.arrayBuffer())

    const cleanedAccountId = this.#adAccountId.replace('act_', '')
    const url = `${BASE_URL}/${this.#apiVersion}/act_${cleanedAccountId}/adimages`

    const response = await fetch(`${url}?access_token=${this.#accessToken}`, {
      method: 'POST',
      body: imageBuffer,
      headers: { 'Content-Type': 'application/octet-stream' },
    })

    const json: any = await response.json()
    if (!response.ok) {
      throw new Error(`Meta image upload failed: ${json?.error?.message ?? JSON.stringify(json)}`)
    }

    if (json.images) {
      const values: any[] = Object.values(json.images)
      return (values[0] as any).hash
    }
    return json.hash
  }

  async getInsights(campaignId: string): Promise<BoostInsights> {
    const result = await this.#api(`/${campaignId}/insights`, 'GET', {
      fields: 'impressions,clicks,spend,ctr,cpc',
      access_token: this.#accessToken,
    })

    const data = result?.data?.[0] ?? {}
    return {
      impressions: parseInt(data.impressions ?? '0', 10),
      clicks: parseInt(data.clicks ?? '0', 10),
      spend: parseFloat(data.spend ?? '0'),
      ctr: parseFloat(data.ctr ?? '0'),
      cpc: parseFloat(data.cpc ?? '0'),
    }
  }

  async pauseCampaign(campaignId: string): Promise<void> {
    await this.#api(`/${campaignId}`, 'POST', {
      status: 'PAUSED',
      access_token: this.#accessToken,
    })
  }

  async resumeCampaign(campaignId: string): Promise<void> {
    await this.#api(`/${campaignId}`, 'POST', {
      status: 'ACTIVE',
      access_token: this.#accessToken,
    })
  }

  #buildTargeting(targeting: Record<string, any>, channels: string[]): Record<string, any> {
    const geoLocations: Record<string, any> = {}
    if (targeting.countries) {
      geoLocations.countries = targeting.countries
    }
    if (targeting.cities) {
      geoLocations.cities = targeting.cities.map((c: any) => ({ key: c.key || c }))
    }

    const spec: Record<string, any> = {}

    if (Object.keys(geoLocations).length > 0) {
      spec.geo_locations = geoLocations
    }

    spec.age_min = targeting.ageMin ?? 18
    spec.age_max = targeting.ageMax ?? 65

    if (targeting.languages) {
      spec.locales = targeting.languages.map((l: string) => ({ key: l }))
    }

    spec.publisher_platforms = channels.map(this.#mapChannelToPlatform)

    return spec
  }

  #mapChannelToPlatform(channel: string): string {
    switch (channel) {
      case 'facebook':
        return 'facebook'
      case 'instagram':
        return 'instagram'
      case 'messenger':
        return 'messenger'
      default:
        return 'facebook'
    }
  }
}

export const metaAds = new MetaAdsService()
