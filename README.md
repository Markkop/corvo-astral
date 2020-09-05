# :crescent_moon: Corvo Astral

![Repo status](https://www.repostatus.org/badges/latest/active.svg)
[![Build Status](https://travis-ci.com/Markkop/corvo-astral.svg?branch=master)](https://travis-ci.com/Markkop/corvo-astral)
![contributions welcome](https://img.shields.io/badge/contributions-welcome-brightgreen.svg?style=flat)

Corvo Astral is a [Discord Bot](https://discord.js.org/#/) that serves as a helper for the [Wakfu MMORPG](https://www.wakfu.com/) game.  
Link to add this bot to a Discord Server is not available until a further launch, but if you really want it, send me a message.

## Commands

* `.alma`: returns the Almanax Bonus for the current day
* `.calc`: calculates the damage for an attack given some values
* `.subli`: search for a given sublimation name or slot combination
* `.help`: get help for available commands


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
