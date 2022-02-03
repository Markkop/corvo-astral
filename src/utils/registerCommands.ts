import { REST } from "@discordjs/rest";
import { GuildConfig } from "@types";
import { Routes } from "discord-api-types/v9";
import { Client } from "discord.js";
import commandsData from "../commands";

export async function registerCommands (client: Client, guildId: string, guildConfig: GuildConfig) {
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
    console.log(error)
  } 
};
