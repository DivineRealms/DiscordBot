module.exports = {
    description: 'Adds an emoji to the guild!',
    aliases: ['aemoji'],
    usage: 'addemoji <image/gif url>'
}

module.exports.run = async(client, message, args) => {
    if (!message.member.hasPermission('MANAGE_EMOJIS')) return message.channel.send(new client.embed().setDescription(`You are missing permissions \`MANAGE_EMOJIS\``).setFooter(message.author.username, message.author.displayAvatarURL({ dynamic: true, size: 1024 })))
    if (!args[0]) return message.channel.send(new client.embed().setDescription(`Please write the name for the emoji!`).setFooter(message.author.username, message.author.displayAvatarURL({ dynamic: true, size: 1024 })))
    if (args[0].length > 32 || args[0].length < 2) return message.channel.send(new client.embed().setDescription('The name must be between 2 and 32 characters').setFooter(message.author.username, message.author.displayAvatarURL({ dynamic: true, size: 1024 })))
    if (!args[1]) return message.channel.send(new client.embed().setDescription(`Please insert the emoji url!`).setFooter(message.author.username, message.author.displayAvatarURL({ dynamic: true, size: 1024 })))

    message.guild.emojis.create(args[1], args[0]).then(e =>
        message.channel.send(new client.embed().setDescription(`I have created the emoji ${e}`).setFooter(message.author.username, message.author.displayAvatarURL({ dynamic: true, size: 1024 })))
    ).catch(() => message.channel.send(new client.embed().setDescription('Please enter a valid image/gif link!').setFooter(message.author.username, message.author.displayAvatarURL({ dynamic: true, size: 1024 }))))
}