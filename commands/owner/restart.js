module.exports = {
    description: 'Lets you restart the bot via discord.',
    permissions: [],
    aliases: ['bootup'],
    usage: 'restart'
}

module.exports.run = async(client, message, args) => {
    if (message.author.id !== client.conf.settings.BotOwnerDiscordID) return message.channel.send({ embeds: [client.embedBuilder(client, message, "Error", `You're not Owner`, "RED")] });

    message.channel.send({ content: 'Bot have been restarted' }).then(() => {
        client.destroy()
        client.login(client.conf.settings.token)
    })
}