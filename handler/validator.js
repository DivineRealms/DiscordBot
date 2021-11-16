module.exports = client => {
    if (!client.conf.settings.token) throw new Error('Please enter a bot token in the config')
    if (!client.conf.settings.embedColor) throw new Error('Please enter a embed color in the config')
    if (!client.conf.settings.GuildID) throw new Error('Please enter the server id that this bot will be in, in the config.')
    if (!client.conf.settings.prefix) throw new Error('Please enter the bot prefix in the config')
    if (!client.conf.settings.BotOwnerDiscordID) throw new Error('Please enter you discord id in the BotOwnerDiscordID section in the config')
    if (!client.conf.settings.token) throw new Error('Please enter a bot token in the config')
    if (!client.conf.settings.token) throw new Error('Please enter a bot token in the config')
    if (!client.conf.settings.token) throw new Error('Please enter a bot token in the config')
}