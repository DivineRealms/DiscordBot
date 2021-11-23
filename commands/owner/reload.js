module.exports = {
    name: 'reload',
    category: 'owner',
    description: 'Lets you reload a command.',
    permissions: [],
    cooldown: 0,
    aliases: ['refresh'],
    usage: 'reload <Command>'
}

module.exports.run = async(client, message, args) => {
    if (!client.conf.settings.BotOwnerDiscordID.includes(message.author.id)) return message.channel.send({ embeds: [client.embedBuilder(client, message, "Error", `You're not Owner`, "RED")] });

    const command = client.commands.get((args[0] || '').toLowerCase())
    if (!command) return message.channel.send({ embeds: [client.embedBuilder(client, message, "Error", `You need to provide Command to Reload`, "RED")] });

    try {
        delete require.cache[require.resolve(`../${command.category}/${args[0].toLowerCase()}.js`)]
        client.commands.set(args[0].toLowerCase(), {...require(`../${command.category}/${args[0].toLowerCase()}.js`), category: command.category })
        message.channel.send({ embeds: [new client.embed().setDescription("Command have been reloaded successfully.")] })
    } catch (e) {
        message.channel.send({ content: 'An error occurred' })
        console.log(e)
    }
}
