import env from '#start/env'

export default {
  adAccountId: env.get('META_ADS_AD_ACCOUNT_ID', ''),
  accessToken: env.get('META_ADS_ACCESS_TOKEN', ''),
  pageId: env.get('META_PAGE_ID', ''),
  appId: env.get('META_ADS_APP_ID', ''),
  apiVersion: env.get('META_API_VERSION', 'v22.0'),
  defaultCta: env.get('META_ADS_DEFAULT_CTA', 'LEARN_MORE'),
  defaultBudgetType: env.get('META_ADS_DEFAULT_BUDGET_TYPE', 'daily'),
  defaultCurrency: env.get('META_ADS_DEFAULT_CURRENCY', 'USD'),
  edgePlacements: [
    'facebook_feed',
    'instagram_feed',
    'instagram_story',
    'messenger_home',
    'facebook_marketplace',
  ],
}
