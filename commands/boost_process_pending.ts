import { BaseCommand } from '@adonisjs/core/ace'
import type { CommandOptions } from '@adonisjs/core/types/ace'
import { boostLaunch } from '#services/boost_launch_service'

export default class BoostProcessPending extends BaseCommand {
  static commandName = 'boost:process-pending'
  static description = 'Process boosts stuck in pending_payment status (paid but not launched)'

  static options: CommandOptions = {
    startApp: true,
  }

  async run() {
    this.logger.info('Processing stuck event boosts...')
    const { processed, failed } = await boostLaunch.processStuckBoosts()
    this.logger.success(`Done — ${processed} processed, ${failed} failed`)
  }
}
