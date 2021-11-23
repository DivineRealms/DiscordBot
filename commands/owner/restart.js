module.exports = {
    name: 'restart',
    category: 'owner',
    description: 'Lets you restart the bot via discord.',
    permissions: [],
    cooldown: 0,
    aliases: ['bootup'],
    usage: 'restart'
}

module.exports.run = async(client, message, args) => {
    if (!client.conf.settings.BotOwnerDiscordID.includes(message.author.id)) return message.channel.send({ embeds: [client.embedBuilder(client, message, "Error", `You're not Owner`, "RED")] });
    
    let embed = new client.embed().setDescription("Bot have been restarted");

    message.channel.send({ embeds: [embed] }).then(() => {
        client.destroy()
        client.login(client.conf.settings.token)
    })
}
