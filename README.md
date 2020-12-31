# :crescent_moon: Corvo Astral

![Repo status](https://www.repostatus.org/badges/latest/active.svg)
[![Build Status](https://travis-ci.com/Markkop/corvo-astral.svg?branch=master)](https://travis-ci.com/Markkop/corvo-astral)
[![codecov](https://codecov.io/gh/Markkop/corvo-astral/branch/master/graph/badge.svg)](https://codecov.io/gh/Markkop/corvo-astral)
![contributions welcome](https://img.shields.io/badge/contributions-welcome-brightgreen.svg?style=flat)

Corvo Astral is a [Discord Bot](https://discord.js.org/#/) that serves as a helper for the [Wakfu MMORPG](https://www.wakfu.com/) game.  
If you wish to add this bot to your server, access this [link](https://discord.com/api/oauth2/authorize?client_id=750529201161109507&permissions=1342565456&scope=bot).  
Most features support Wakfu community languages: en, es, pt and fr.  
If you need help or want to report bugs, feel free to join the bot's discord: https://discord.gg/aX6j3gM8HC  

## Commands

* `.alma`: returns the Almanax Bonus and [more info](http://www.krosmoz.com/en/almanax) for the current day
* `.calc`: calculates the damage for an attack given some values
* `.subli`: search for sublimations by name, slot combination or source
* `.recipe`: search for recipes by name and rarity
* `.equip`: search for equipment by name and rarity
* `.mob`: search for monsters by name
* `.party`: create, update, join or leave a party listing
* `.about`: get information about this bot
* `.config`: configure custom settings for each discord channel
* `.help`: get help for available commands

## Features

### :milky_way:  Krosmoz Almanax

Inspired by [wakmanax](https://github.com/elio-centrique/wakmanax), the `.alma` command scraps [Krosmoz Almanax](http://www.krosmoz.com/en/almanax) page and returns tons of cool stuff such as Protector of the Day, Zodiac, Trivia, Event and Forecast!  
  
![](https://i.imgur.com/BVOqE2p.gif)

### :sunny: Daily Almanax Notification

At 00:01 Europe/France Timezone (GMT+2) (server time), the bot will send the `.alma` command to a channel named `almanax` or any other named defined by the `.config` command.  
If you wish to disable this behavior, simply deny permission to this bot on that channel.

### :busts_in_silhouette: Party Listing

When using `.party create` command, the bot will guide you through creating a new party list and it'll post it on the cannel defined by the `.config` command (`listagem-de-grupos` by default).  
It'll also listen to reactions so members can join or leave groups.  
To make use of this feature, make sure that the bot has enough permissions to the configured channel.  

**Examples**:
```bash
.party create
.party update
```

![Party Listing gif example](https://i.imgur.com/bZkbz6E.gif)

### :earth_americas: Internationalization

Most commands accept `lang=<lang>` and `translate=<lang>` options.  
A server administrator can also set the default language with `.config` command.  
Available languages are `en`, `es`, `pt` and `fr`.  

![](http://i.imgur.com/HwrkX8M.png)

### :shield: Equipment search

Am equipment search is available with `.equip <name>` command.  
It's also possible to filter them by rarity with `rarity=<rarity>` option.  
If a recipe is associated, it can be displayed by reacting with 🛠️  
You can also react with 💰 to get its drop data directly from Wakfu's website  

**Examples**:
```bash
.equip martelo de osamodas lang=pt
.equip brakmar sword translate=fr
.equip the eternal rarity=mythical
.equip o eterno raridade=mítico
```

![](https://i.imgur.com/0oZzZ4W.png)

### :gem: Sublimation search

The command `.subli` can search by sublimation name, source, type and slots combination.  
When searching by slots combionation, it's possible to match with white slots and/or by random ordering.  

**Examples**:
```bash
.subli bruta
.subli bruta translate=fr
.subli talho lang=pt
.subli rwb
.subli rgbg random
.subli epic
.subli quest
.subli koko
.subli craft
```

![](http://i.imgur.com/ViQQqRE.png)

### :scroll: Recipe search

Similar to the commands above, you can search for recipes by name and rarity.  
Recipes with same results are shown together.  

**Examples**:
```bash
.recipe brakmar sword
.recipe espada de brakmar lang=pt
.recipe peace pipe rarity=mythical
```

![](http://i.imgur.com/1IBDf5j.png)

### :dragon_face: Monster search

You can search for monsters by typing `.mob ogrest`, for example  
It'll show their characteristics, damage, resistances, drops and spells.  
For monsters with huge droplist, you can click on the card title to
open the browser in the monster's page
When using translate, you first have to select a monster from the results 
 
**Examples**:
```bash
.mob ogrest
.mob gobbal lang=en
.mob papatudo lang=pt translate=fr
```

![papatudoMob](https://user-images.githubusercontent.com/16388408/101432541-ce9e1700-38e7-11eb-8214-3a048596d944.gif)

### :boxing_glove: Damage Calculator

It's possible to simulate an attack by providing some numbers to the `.calc` commands.  
Maybe in the future we can improve it.  

Examples:
```bash
.calc dmg=3000 base=55 res=60%
.calc dmg=5000 base=40 res=420 crit=30%
```

![](http://i.imgur.com/acjj1cJ.png)

### :bricks: Builder Integration

By sending a Method's build link, the bot will access the link, take a printscreen and send it as a preview to the chat.  
It'll also sum the highest elemental damage with all other non-negative secundary masteries and display it on the message.  
You can disable this behavior by using `.config set buildPreview=disabled`  

![buildPreviewEx](https://user-images.githubusercontent.com/16388408/102099728-5bc0fe80-3e07-11eb-86a4-e61081ee314c.gif)

### :gear: Configurable options

Some bot options can be configurable according to each server using `.config`.  
**Options**:
* lang: default bot language between fr, en, es and pt (default: en)
* prefix: character to call commands (default: .) _(not available yet)_
* almanaxChannel: channel receive the `.alma` command daily (default: almanax)
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

### :chart_with_upwards_trend: How to contribute

Most translations were translated from portuguese brazilian, so they can be a little bit off.  
If you notice any wrong translation, feel free to open a [Pull Request](https://github.com/Markkop/corvo-astral/pulls) fixing it.  
If you don't know how to use Github, join the bot's discord server: https://discord.gg/aX6j3gM8HC    

Wakfu data is gathered from Wakfu's [CDN](https://www.wakfu.com/en/forum/332-development/236779-json-data), [Wakfu's Website](https://www.wakfu.com/en/mmorpg/) and [Method](https://builder.methodwakfu.com/builder/main)'s API.  

This project contains tests to cover some of the code, so feel free to mess with it while running some test-watching command:  

```bash
npm run test -- --watch
jest ./tests/equip.test.js --watch // need jest installed globally
```

Also make sure to use Node v12 (`nvm use 12`) while developping or Discord.js will break on `.flat` method and some tests will break because of `.sort` unstable ordering on prior node versions.   

```
# Install system dependencies
sudo apt install nodejs npm git

# Clone this repository
git clone https://github.com/Markkop/corvo-astral.git

# Install project dependencies
cd corvo-astral
npm install

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
