module.exports = {
    name: 'addemoji',
    category: 'moderation',
    description: 'Adds an emoji to the guild!',
    permissions: ["MANAGE_EMOJIS"],
    cooldown: 0,
    aliases: ['aemoji'],
    usage: 'addemoji <image/gif url>'
}

module.exports.run = async(client, message, args) => {
    if (!args[0]) return message.channel.send({ embeds: [client.embedBuilder(client, message, "Error", "You need to enter emoji name.", "RED")] });
    if (args[0].length > 32 || args[0].length < 2) return message.channel.send({ embeds: [client.embedBuilder(client, message, "Error", "Name must be between 2 and 32 characters.", "RED")] });
    if (!args[1]) return message.channel.send({ embeds: [client.embedBuilder(client, message, "Error", "Please enter Emoji URL.", "RED")] });

    message.guild.emojis.create(args[1], args[0]).then(e =>
        message.channel.send({ embeds: [client.embedBuilder(client, message, "Emoji Added",`Emoji ${e} have been added`)] })
    ).catch(() => message.channel.send({ embeds: [client.embedBuilder(client, message, "Error", "You need to enter valid image/gif URL.", "RED")] }))
}
