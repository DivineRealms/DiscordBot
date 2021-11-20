module.exports = {
    name: 'turnoff',
    description: 'Lets you turnoff the bot via discord.',
    permissions: [],
    cooldown: 0,
    aliases: ['selfdestruct', 'shutdown'],
    usage: 'turnoff'
}

module.exports.run = async(client, message, args) => {
    if (message.author.id !== client.conf.settings.BotOwnerDiscordID) return message.channel.send({ embeds: [client.embedBuilder(client, message, "Error", `You're not Owner`, "RED")] });

    message.channel.send({ content: 'Bot have been turned off.' }).then(() => {
        client.destroy()
    })
}