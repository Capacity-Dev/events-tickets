import { BaseCommand } from '@adonisjs/core/ace'
import type { CommandOptions } from '@adonisjs/core/types/ace'
import { boostLaunch } from '#services/boost_launch_service'

export default class BoostSyncInsights extends BaseCommand {
  static commandName = 'boost:sync-insights'
  static description = 'Sync Meta Ads insights for all active boosts'

  static options: CommandOptions = {
    startApp: true,
  }

  async run() {
    this.logger.info('Syncing insights for all active event boosts...')
    const { synced, failed } = await boostLaunch.syncAllActiveInsights()
    this.logger.success(`Done — ${synced} synced, ${failed} failed`)
  }
}
