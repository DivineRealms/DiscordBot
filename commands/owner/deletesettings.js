module.exports = {
    name: 'deletesettings',
    category: 'owner',
    description: 'Deletes all the settings for the bot (PERMANENT)',
    permissions: [],
    cooldown: 0,
    aliases: ['deleteset'],
    usage: 'deletesettings'
}

module.exports.run = (client, message, args) => {
    if (!client.conf.settings.BotOwnerDiscordID.includes(message.author.id)) return message.channel.send({ embeds: [client.embedBuilder(client, message, "Error", `You're not Owner`, "RED")] });
    client.settings.deleteAll()
}