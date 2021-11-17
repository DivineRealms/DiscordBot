const { GiveawaysManager: Giveaway } = require(`discord-giveaways`)
const { MessageEmbed } = require('discord.js')
const { readdirSync } = require('fs')
const Player = require('distube')
const Enmap = require('enmap')

module.exports = async client => {
    Object.defineProperty(client, 'conf', { get: () => { delete require.cache[require.resolve('../settings/config')]; return require('../settings/config').config } })
    client.resolveMember = (str, user, title) => str.replace(/\{(.+)\}/, (...e) => e[1] === 'mention' && title ? user.toString() : user[e[1]])
    client.categories = new Enmap()
    client.processes = new Enmap()
    client.commands = new Enmap()
    client.snipes = new Enmap()
    client.afk = new Enmap()
    client.embed = class Embed extends MessageEmbed { color = client.conf.settings.embedColor }
    const settings = { fetchAll: true, autoFetch: true, cloneLevel: 'deep' }
    client.defaultSettings = require('../settings/config').guildSettings
    client.memberSettings = require('../settings/config').memberSettings
    client.shop = require('../settings/config').shop;
    client.giveaways = new Giveaway(client, {})
    client.settings = new Enmap({
        name: 'settings',
        ...settings
    })

    client.members = new Enmap({
        name: 'members',
        ...settings
    })
    
    client.embeds = require("embedBuilder.js");

    process.on('unhandledRejection', console.log)
    process.on('uncaughtException', console.log)
    process.on('error', () => {})

    for (const d of readdirSync('./commands/')) {
        client.categories.set(d, readdirSync(`./commands/${d}`).map(s => s.split('.')[0]))
        for (const f of readdirSync(`./commands/${d}`))
            client.commands.set(f.split('.')[0], {...require(`../commands/${d}/${f}`), category: d })
    }

    for (const evt of readdirSync('./events'))
        client.on(evt.split('.')[0], require(`../events/${evt}`).bind(null, client))

    require('./music')(client, client.player)
    client.login(client.conf.settings.token).catch(() =>
        console.log('[Error] Invalid token provided in config')
    )
}