const { Client, Discord } = require('discord.js')
require('./handler/load')(new Client({ partials: ['MESSAGE', 'REACTION', 'CHANNEL'] }))