import { Message } from 'discord.js'
import fs from 'fs'
import { getAndScrapZenithBuild } from '../scrappers/zenithBuild'
import { getConfig } from '../utils/message'

/**
 * Get a zenith build based on its url and id and
 * scrap its data.
 *
 * @param {Message} message
 */
export async function getZenithBuildFromMessage (message) {
  const buildPreviewConfig = getConfig('buildPreview', message.guild.id)
  const hasBuildPreviewEnable = buildPreviewConfig === 'enabled'
  if (!hasBuildPreviewEnable) {
    return
  }

  const match = message.content.match(/zenithwakfu.com\/builder\/(.*)/)
  if (!match || !match[1]) {
    return
  }
  const awaitReaction = await message.react('⏳')
  const buildId = match[1]
  const buildData = await getAndScrapZenithBuild(buildId)
  const totalMastery = buildData.highestElement + buildData.summedSecondaryMasteries
  const messageContent = `Here's a preview. By the way, this build has **${totalMastery}** total mastery\n<${buildData.url}>`
  await message.channel.send(messageContent, { files: [`${buildId}.png`] })
  await awaitReaction.remove()
  fs.unlink(`./${buildId}.png`, () => {})
}
