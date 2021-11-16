module.exports = {
    description: 'Lets you restart the bot via discord.',
    aliases: ['bootup'],
    usage: 'restart'
}

module.exports.run = async(client, message, args) => {
    if (message.author.id !== client.conf.settings.BotOwnerDiscordID) return message.channel.send(new client.embed().setDescription(`You my friend are not the bot owner!`).setFooter(message.author.username, message.author.displayAvatarURL({ dynamic: true, size: 1024 })))

    message.channel.send(':robot: Initializing Self Destruct...').then(() => {
        client.destroy()
        client.login(client.conf.settings.token)
    })
}