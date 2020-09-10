# :crescent_moon: Corvo Astral

![Repo status](https://www.repostatus.org/badges/latest/active.svg)
[![Build Status](https://travis-ci.com/Markkop/corvo-astral.svg?branch=master)](https://travis-ci.com/Markkop/corvo-astral)
[![codecov](https://codecov.io/gh/Markkop/corvo-astral/branch/master/graph/badge.svg)](https://codecov.io/gh/Markkop/corvo-astral)
![contributions welcome](https://img.shields.io/badge/contributions-welcome-brightgreen.svg?style=flat)

Corvo Astral is a [Discord Bot](https://discord.js.org/#/) that serves as a helper for the [Wakfu MMORPG](https://www.wakfu.com/) game.  
If you wish to add this bot to your server, access this [link](https://discord.com/api/oauth2/authorize?client_id=750529201161109507&permissions=2048&scope=bot).  
Note: currently the only language available is Brazilian Portuguese.

## Commands

* `.alma`: returns the Almanax Bonus for the current day
* `.calc`: calculates the damage for an attack given some values
* `.subli`: search for a given sublimation by name, slot combination or source
* `.equip`: search for a given equipment by name
* `.about`: get information about this bot
* `.help`: get help for available commands

## Almanax Bonus Notifier

As configured on `almaNotifier.js` and Heroku Scheduler, this bot tries to send the same message from `.alma` command to all channels named "almanax" every day on 00:01 AM.  
If you wish to disable this behavior, simply deny permission to this bot on that channel.


## How to develop

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
