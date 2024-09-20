# :crescent_moon: Corvo Astral

[![https://img.shields.io/badge/host-koyeb-blue](https://img.shields.io/badge/host-koyeb-blue)](https://www.koyeb.com/)
![https://img.shields.io/badge/repo%20status-maintenance-yellow](https://img.shields.io/badge/repo%20status-maintenance-yellow)
![contributions welcome](https://img.shields.io/badge/contributions-welcome-brightgreen.svg?style=flat)

Corvo Astral is a [Discord Bot](https://discord.js.org/#/) that provides information about the [Wakfu MMORPG](https://www.wakfu.com/) game.

If you wish to **add this bot** to your server, access this [link](https://discord.com/api/oauth2/authorize?client_id=750529201161109507&permissions=139586825280&scope=bot%20applications.commands).  

Most features support Wakfu community languages: en, es, pt and fr.  

If you need help or want to report bugs, feel free to **join the bot's discord**: https://discord.gg/aX6j3gM8HC  

This bot is now featured in **top.gg**: https://top.gg/bot/750529201161109507  

To keep the bot running, please consider [donating](https://www.buymeacoffee.com/markkop) `<3`

## Commands

* `/alma`: returns the Almanax Bonus for the current day
* `/calc`: calculates the damage for an attack given some values
* `/subli`: search for sublimations by name, slot combination or source
* `/recipe`: search for recipes by name and rarity
* `/equip`: search for equipment by name and rarity
* `/party`: create, update, join or leave a party listing
* `/about`: get information about this bot
* `/config`: configure custom settings for each discord channel
* `/help`: get help for available commands

## Features 

### ⛅️ Almanax

Find out the current Almanax bonus and optimize your farming with `/alma` command.

![image](https://user-images.githubusercontent.com/16388408/154340449-c9dda590-95b7-4fb9-9153-c9fa9864d15b.png)

### 🕰 Daily Almanax Notification

At 00:01 Europe/France Timezone (GMT+2) (server time), the bot will send the `/alma` command to a channel named `almanax` or any other named defined by the `/config` command.  
If you wish to disable this behavior, simply deny permission to this bot on that channel.

![image](https://user-images.githubusercontent.com/16388408/134070563-2cdc69dd-b25b-4514-b008-b109e2f9df71.png)


### 👥 Party Listing

When using `/party-create` command, the bot will create a new party list and it'll post it on the channel defined by the `/config` command (`listagem-de-grupos` by default).  
It'll also listen to reactions so members can join or leave groups.  
To make use of this feature, make sure that the bot has enough permissions to the configured channel.  

**Examples**:
```bash
/party-create name: Boss Smasher
/party-create name: Ogrest description: If it's your first time, it's okay date: Tomorrow 8PM level: 200 slots: 3
```

![image](https://user-images.githubusercontent.com/16388408/154342000-cf540dfe-6070-41ac-ba86-686261840a3f.png)


### 🌎 Internationalization

Most commands accept `lang: <lang>` and `translate: <lang>` options.  
A server administrator can also set the default language with `/config` command.  
Available languages are `en`, `es`, `pt` and `fr`.  

![image](https://user-images.githubusercontent.com/16388408/154341187-6024bf47-dc89-4bc4-bb7e-339fa9178470.png)

![image](https://user-images.githubusercontent.com/16388408/154341341-aba99e7e-655e-4297-977d-0e69c289de44.png)

### 🛡 Equipment search

An equipment search is available with `/equip name: <name>` command.  
It's also possible to filter them by a rarity option.
If a recipe is associated, it can be displayed by reacting with 🛠️  

**Examples**:
```bash
/equip name: martelo de osamodas lang: pt
/equip name: the eternal rarity: mythical
```

![image](https://user-images.githubusercontent.com/16388408/154341493-cc1c14ab-08d9-4e11-8c24-822ffdc03796.png)


### 💎 Sublimation search

The command `/subli` can search by sublimation name, type, rarity and slots combination.  
When searching by slots combination, it's possible to match with white slots and/or by random ordering.  

**Examples**:
```bash
/subli by-name name: bruta
/subli by-name name: bruta translate: fr
/subli by-name name: talho lang: pt
/subli by-slots slots: rwb
/subli by-slots slots: rgbg random: true
/subli by-slots slots: epic
```

![image](https://user-images.githubusercontent.com/16388408/154341613-61243e6b-881f-43a9-8c01-2e286cab88cd.png)

![image](https://user-images.githubusercontent.com/16388408/154341679-f6e10cec-86e1-44ff-aa02-d185248b53b3.png)

### 📜 Recipe search

Similar to the commands above, you can search for recipes by name and rarity.  
Recipes with same results are shown together.  

**Examples**:
```bash
/recipe name: brakmar sword
/recipe name: espada de brakmar lang: pt
/recipe name: peace pipe rarity: mythical
/recipe name: o eterno rarity: mítico lang: pt
```

![image](https://user-images.githubusercontent.com/16388408/154341785-576b84f0-2c0e-4914-937b-fd3d407492f8.png)

### 🥊 Damage Calculator

It's possible to simulate an attack by providing some numbers to the `.calc` commands.  
Maybe in the future we can add new options to it.  

Examples:
```bash
/calc dmg:3000 base:55 res:60%
/calc dmg:5000 base:40 res:420 crit:30%
```

![image](https://user-images.githubusercontent.com/16388408/154341868-1fa0be2d-a945-4e76-a8d6-8afc09a8d63d.png)


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
* almanaxChannel: channel to receive the `.alma` command daily (default: almanax)
* partyChannel: channel to receive the `.party` command (default: listagem-de-grupos)
* buildPreview: `enabled` (default) or `disabled` to show a build printscreen and other info

**Examples**:
```bash
/config get
/config set lang: en
/config set almanax-channel: #temple-bonus
/config set party-channel: #party-listing
```

## Disabled Features

The following features are currently disabled due to external limitations, such as scrapping protection in Ankama's websites.

### 🌌 Krosmoz Almanax

Inspired by [wakmanax](https://github.com/elio-centrique/wakmanax), the `/alma` command used to scrap [Krosmoz Almanax](http://www.krosmoz.com/en/almanax) page and returned tons of cool stuff such as Protector of the Day, Zodiac, Trivia, Event and Forecast.  
  
![](https://i.imgur.com/BVOqE2p.gif)

### 🐲 Monster search

When Wakfu's web scrapping was working, we could search for monsters by typing `/mob name: ogrest`, for example  
It would show their characteristics, damage, resistances, drops and spells.  

![papatudoMob](https://user-images.githubusercontent.com/16388408/101432541-ce9e1700-38e7-11eb-8214-3a048596d944.gif)

## 🚧 Roadmap

- Slash commands ✅
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

# Deploy is made automatically to Railway
https://railway.app/project/64e147d3-7c3e-4ed2-a89e-1cbea68e225a/service/9d2b5ab2-d5c2-4e32-9f26-bf5ad922ab2f
```
