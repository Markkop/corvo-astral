# :crescent_moon: Corvo Astral

[![build](https://github.com/Markkop/corvo-astral/actions/workflows/production.yml/badge.svg)](https://github.com/Markkop/corvo-astral/actions/workflows/production.yml)
![Repo status](https://www.repostatus.org/badges/latest/active.svg)
[![servers](https://img.shields.io/endpoint?url=https://mark-nest.herokuapp.com/api/corvo-astral-servers)](https://discord.com/api/oauth2/authorize?client_id=750529201161109507&permissions=1342565456&scope=bot)
![contributions welcome](https://img.shields.io/badge/contributions-welcome-brightgreen.svg?style=flat)

Corvo Astral is a [Discord Bot](https://discord.js.org/#/) that provides information about the [Wakfu MMORPG](https://www.wakfu.com/) game.

If you wish to **add this bot** to your server, access this [link](https://discord.com/api/oauth2/authorize?client_id=750529201161109507&permissions=139586825280&scope=bot%20applications.commands).  


Most features support Wakfu community languages: en, es, pt and fr.  

If you need help or want to report bugs, feel free to **join the bot's discord**: https://discord.gg/aX6j3gM8HC  

This bot is now featured in **top.gg**: https://top.gg/bot/750529201161109507  

To keep the bot running, please consider [donating](https://www.buymeacoffee.com/markkop) `<3`

## Commands

* `.alma`: returns the Almanax Bonus for the current day
* `.calc`: calculates the damage for an attack given some values
* `.subli`: search for sublimations by name, slot combination or source
* `.recipe`: search for recipes by name and rarity
* `.equip`: search for equipment by name and rarity
* `.party`: create, update, join or leave a party listing
* `.about`: get information about this bot
* `.config`: configure custom settings for each discord channel
* `.help`: get help for available commands

## Features 

### ⛅️ Almanax

Find out the current Almanax bonus and optimize your farming with `.alma` command.

![image](https://user-images.githubusercontent.com/16388408/134070695-44e76cec-a0af-43e9-af6c-4d4baaf4c98b.png)

### 🕰 Daily Almanax Notification

At 00:01 Europe/France Timezone (GMT+2) (server time), the bot will send the `.alma` command to a channel named `almanax` or any other named defined by the `.config` command.  
If you wish to disable this behavior, simply deny permission to this bot on that channel.

![image](https://user-images.githubusercontent.com/16388408/134070563-2cdc69dd-b25b-4514-b008-b109e2f9df71.png)


### 👥 Party Listing

When using `.party create` command, the bot will guide you through creating a new party list and it'll post it on the cannel defined by the `.config` command (`listagem-de-grupos` by default).  
It'll also listen to reactions so members can join or leave groups.  
To make use of this feature, make sure that the bot has enough permissions to the configured channel.  

**Examples**:
```bash
.party create
.party update
```

![image](https://user-images.githubusercontent.com/16388408/134071603-3846c4c7-71b6-4c7b-9192-9aa520ef83fe.png)

![Untitled](https://user-images.githubusercontent.com/16388408/134070343-334c6944-b235-470d-8725-704bf393d27b.gif)

### 🌎 Internationalization

Most commands accept `lang=<lang>` and `translate=<lang>` options.  
A server administrator can also set the default language with `.config` command.  
Available languages are `en`, `es`, `pt` and `fr`.  

![image](https://user-images.githubusercontent.com/16388408/134066602-8c1fd58a-fa9d-46b0-b11b-c09e3ec71aa0.png)

### 🛡 Equipment search

Am equipment search is available with `.equip <name>` command.  
It's also possible to filter them by rarity with `rarity=<rarity>` option.  
If a recipe is associated, it can be displayed by reacting with 🛠️  

**Examples**:
```bash
.equip martelo de osamodas lang=pt
.equip brakmar sword translate=fr
.equip the eternal rarity=mythical
.equip o eterno raridade=mítico
```

![image](https://user-images.githubusercontent.com/16388408/134066526-bd20588d-11ab-477c-a538-ad83efdcf792.png)

### 💎 Sublimation search

The command `.subli` can search by sublimation name, type and slots combination.  
When searching by slots combionation, it's possible to match with white slots and/or by random ordering.  

**Examples**:
```bash
.subli bruta
.subli bruta translate=fr
.subli talho lang=pt
.subli rwb
.subli rgbg random
.subli epic
```

![image](https://user-images.githubusercontent.com/16388408/134066388-d3fdf726-001c-4b68-b759-1532693d2866.png)

### 📜 Recipe search

Similar to the commands above, you can search for recipes by name and rarity.  
Recipes with same results are shown together.  

**Examples**:
```bash
.recipe brakmar sword
.recipe espada de brakmar lang=pt
.recipe peace pipe rarity=mythical
```

![image](https://user-images.githubusercontent.com/16388408/134066195-1496574c-d92e-4ea3-929c-bbcbc7395e25.png)

### 🥊 Damage Calculator

It's possible to simulate an attack by providing some numbers to the `.calc` commands.  
Maybe in the future we can add new options to it.  

Examples:
```bash
.calc dmg=3000 base=55 res=60%
.calc dmg=5000 base=40 res=420 crit=30%
```

![](http://i.imgur.com/acjj1cJ.png)

### 👷 Builder Integration

By sending a Zenith's build link, the bot will access the link, take a printscreen and send it as a preview to the chat.  
It'll also sum the highest elemental damage with all other non-negative secundary masteries and display it on the message.  
You can disable this behavior by using `.config set buildPreview=disabled`  
**Note: this feature is currently disabled since Zenith has changed their interface. If you wish it back, please consider [supporting](https://www.buymeacoffee.com/markkop).**

![buildPreviewEx](https://user-images.githubusercontent.com/16388408/102099728-5bc0fe80-3e07-11eb-86a4-e61081ee314c.gif)

### ⚙️ Configurable options

Some bot options can be configurable according to each server using `.config`.  
**Options**:
* lang: default bot language between fr, en, es and pt (default: en)
* prefix: character to call commands (default: .) _(not available yet)_
* almanaxChannel: channel to receive the `.alma` command daily (default: almanax)
* partyChannel: channel to receive the `.party` command (default: listagem-de-grupos)
* buildPreview: `enabled` (default) or `disabled` to show a build printscreen and other info

**Examples**:
```bash
.config set lang=en
.config set almanaxChannel=temple-bonus
.config set partyChannel=party-listing
.config set buildPreview=disabled
.config get
```


## Disabled Features

The following features are currently disabled due to external limitations, such as scrapping protection in Ankama's websites.

### 🌌 Krosmoz Almanax

Inspired by [wakmanax](https://github.com/elio-centrique/wakmanax), the `.alma` command used to scrap [Krosmoz Almanax](http://www.krosmoz.com/en/almanax) page and returned tons of cool stuff such as Protector of the Day, Zodiac, Trivia, Event and Forecast.  
  
![](https://i.imgur.com/BVOqE2p.gif)

### 🐲 Monster search

When Wakfu's web scrapping was working, we could search for monsters by typing `.mob ogrest`, for example  
It would show their characteristics, damage, resistances, drops and spells.  

![papatudoMob](https://user-images.githubusercontent.com/16388408/101432541-ce9e1700-38e7-11eb-8214-3a048596d944.gif)

## 🚧 Roadmap

- Slash commands
- Almanax Bonus Forecast
- Zenith Build Preview
- Sublimation Custom Drop Information
- Extended internationalization
- Extended configuration

## 📈 How to contribute

If find a wrong translation or want to try fixing a bug by yourself, feel free to open a [Pull Request](https://github.com/Markkop/corvo-astral/pulls) to this project.  
In case you just want to report a bug or submit a suggestion, join us in the bot's [Discord server](https://discord.gg/aX6j3gM8HC).


```
# Install system dependencies
sudo apt install nodejs npm git

# Clone this repository
git clone https://github.com/Markkop/corvo-astral.git

# Install project dependencies
cd corvo-astral
npm install

# Setup environment variables
cp .env.example .env

# Create a Discord bot and set it's DISCORD_BOT_TOKEN for local testing

# After coding, run tests and lint
npm run test
npm run lint

# Create a new branch and push it to make a Pull Request
git checkout -b <branch name>
git add .
git commit -m "<commit name>"
git push origin <branch name>

# Deploy is made automatically on master via Travis-CI to Heroku
```
