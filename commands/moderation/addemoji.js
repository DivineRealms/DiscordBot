module.exports = {
    description: 'Adds an emoji to the guild!',
    permissions: [],
    aliases: ['aemoji'],
    usage: 'addemoji <image/gif url>'
}

module.exports.run = async(client, message, args) => {
    if (!message.member.permissions.has('MANAGE_EMOJIS')) return message.channel.send({ embeds: [new client.embed().setDescription(`You are missing permissions \`MANAGE_EMOJIS\``).setFooter(message.author.username, message.author.displayAvatarURL({ dynamic: true, size: 1024 }))]})
    if (!args[0]) return message.channel.send({ embeds: [client.embedBuilder(client, message, "Error", "You need to enter emoji name.", "RED")] });
    if (args[0].length > 32 || args[0].length < 2) return message.channel.send({ embeds: [client.embedBuilder(client, message, "Error", "Name must be between 2 and 32 characters.", "RED")] });
    if (!args[1]) return message.channel.send({ embeds: [client.embedBuilder(client, message, "Error", "Please enter Emoji URL.", "RED")] });

    message.guild.emojis.create(args[1], args[0]).then(e =>
        message.channel.send({ embeds: [client.embedBuilder(client, message, "Emoji Added",`Emoji ${e} have been added`, "YELLOW")] })
    ).catch(() => message.channel.send({ embeds: [client.embedBuilder(client, message, "Error", "You need to enter valid image/gif URL.", "RED")] }))
}