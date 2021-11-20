module.exports = {
    name: 'reload',
    description: 'Lets you reload a command.',
    permissions: [],
    cooldown: 0,
    aliases: ['refresh'],
    usage: 'reload <Command>'
}

module.exports.run = async(client, message, args) => {
    if (message.author.id !== client.conf.settings.BotOwnerDiscordID) return message.channel.send({ embeds: [client.embedBuilder(client, message, "Error", `You're not Owner`, "RED")] });

    const command = client.commands.get((args[0] || '').toLowerCase())
    if (!command) return message.channel.send({ embeds: [client.embedBuilder(client, message, "Error", `You need to provide Command to Reload`, "RED")] });

    try {
        delete require.cache[require.resolve(`../${command.category}/${args[0].toLowerCase()}.js`)]
        client.commands.set(args[0].toLowerCase(), {...require(`../${command.category}/${args[0].toLowerCase()}.js`), category: command.category })
    } catch (e) {
        message.channel.send({ content: 'An error ocurred' })
        console.log(e)
    }
}