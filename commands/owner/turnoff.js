module.exports = {
    name: 'turnoff',
    category: 'owner',
    description: 'Lets you turnoff the bot via discord.',
    permissions: [],
    cooldown: 0,
    aliases: ['selfdestruct', 'shutdown'],
    usage: 'turnoff'
}

module.exports.run = async(client, message, args) => {
    if (!client.conf.settings.BotOwnerDiscordID.includes(message.author.id)) return message.channel.send({ embeds: [client.embedBuilder(client, message, "Error", `You're not Owner`, "RED")] });

    message.channel.send({ content: 'Bot have been turned off.' }).then(() => {
        client.destroy()
    })
}