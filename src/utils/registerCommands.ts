import { REST } from "@discordjs/rest";
import { GuildConfig } from "@types";
import { Routes } from "discord-api-types/v9";
import { Client } from "discord.js";
import commandsData from "../commands";
import { SlashCommandBuilder, SlashCommandSubcommandBuilder } from '@discordjs/builders'
import stringsLang from "@stringsLang";
import mappings from '@utils/mappings'
const { rarityMap } = mappings

const languages = ['en', 'fr', 'pt', 'es']

export function addStringOptionWithRarityChoices(
  builder: SlashCommandBuilder | SlashCommandSubcommandBuilder,
  name: string, description: string,
  lang: string,
  rarityIds?: number[]
) {
  let rarities = []
  if (rarityIds) {
    rarities = rarityIds.map(rarityId => rarityMap[rarityId].name[lang])
  } else {
    rarities = Object.values(rarityMap).map(rarity => rarity.name[lang])
  }
  return builder.addStringOption(option => {
    option.setName(name).setDescription(description)
    rarities.forEach(rarity => option.addChoice(rarity, rarity))
    return option
  })
}

export function addStringOptionWithLanguageChoices(
  builder: SlashCommandBuilder | SlashCommandSubcommandBuilder,
  name: string,
  description: string) {
  return builder.addStringOption(option => {
    option.setName(name).setDescription(description)
    languages.forEach(language => option.addChoice(language, language))
    return option
  })
}

export function addLangAndTranslateStringOptions(builder: SlashCommandBuilder | SlashCommandSubcommandBuilder, lang: string) {
  addLangStringOption(builder, lang)
  addStringOptionWithLanguageChoices(builder, 'translate', stringsLang.translateCommandOptionDescription[lang])
  return builder
}

export function addLangStringOption(
  builder: SlashCommandBuilder | SlashCommandSubcommandBuilder,
  lang: string
) {
  return addStringOptionWithLanguageChoices(builder, 'lang', stringsLang.langCommandOptionDescription[lang])
}

export async function registerCommands(
  client: Client,
  guildId: string,
  guildConfig: GuildConfig,
  guildName: string) {
  try {
    const rest = new REST({ version: "9" }).setToken(process.env.DISCORD_BOT_TOKEN);

    const commandData = commandsData.map((getData) => {
      const data = getData(guildConfig.lang)
      return data.toJSON()
    });

    await rest.put(
      Routes.applicationGuildCommands(client.user?.id || "missing id", guildId),
      { body: commandData }
    );

    console.log("Slash commands registered!");
  } catch (error) {
    if (error.rawError?.code === 50001) {
      console.log(`Missing Access on server "${guildName}"`)
      return
    }
    console.log(`Register command error on ${guildId} using lang ${guildConfig.lang}`)
    console.log(error)
  }
};
