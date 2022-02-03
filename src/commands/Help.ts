// import { BaseCommand } from '@baseCommands'
// import { MessageManager } from '@managers'
// import { GuildConfig } from '@types'
// import { Interaction, Message } from 'discord.js'

// export default class HelpCommand extends BaseCommand {
//   constructor (interaction: Interaction, guildConfig: GuildConfig) {
//     super(interaction, guildConfig)
//   }

//   public execute (): void {
//     const { args, options } = MessageManager.getArgumentsAndOptions(this.message)

//     if (options.lang) {
//       this.changeLang(options.lang)
//     }

//     this.sendHelp(args[0])
//   }
// }
