module.exports = {
    description: 'Clears the requested ammount of messages.',
    permissions: [],
    aliases: ['clear'],
    usage: 'purge <ammount>'
}

module.exports.run = async(client, message, args) => {
    const embed = new client.embed()
        .setFooter(message.author.username, message.author.displayAvatarURL({ dynamic: true, size: 1024 }))
    if (!message.member.permissions.has("MANAGE_MESSAGES"))
        return message.channel.send({ embeds: [new client.embed().setDescription(`You are missing permission \`MANAGE_MESSAGES\``).setFooter(message.author.username, message.author.displayAvatarURL({ dynamic: true, size: 1024 }))]});
    if (!args[0]) return message.channel.send({ embeds: [embed.setDescription('Please provide the ammount of messages that you would like to delete!').setFooter(message.author.username, message.author.displayAvatarURL({ dynamic: true, size: 1024 }))]})
    if (args[0] > 100) return message.channel.send({ embeds: [embed.setDescription('You cannot clear more than 100 messages at once!').setFooter(message.author.username, message.author.displayAvatarURL({ dynamic: true, size: 1024 }))]})
    if (args[0] < 1) return message.channel.send({ embeds: [embed.setDescription('You need to delete at least one message!').setFooter(message.author.username, message.author.displayAvatarURL({ dynamic: true, size: 1024 }))]})

    message.channel.bulkDelete(args[0], true).then(messages => {
        let embed = new client.embed()
            .setAuthor(`${message.author.tag} - (${message.author.id})`, message.author.displayAvatarURL({ dynamic: true }))
            .setDescription(`**Action:** Purge\n**Messages:** \`${args}\`\n**Channel:** ${message.channel}`)
            .setFooter(message.author.username, message.author.displayAvatarURL({ dynamic: true, size: 1024 }))
            .setThumbnail(message.author.displayAvatarURL())
            .setTimestamp()
        message.channel.send({ embeds: [embed] })
    }).catch(() =>
        message.channel.send({ embeds: [new client.embed().setDescription('Sorry, I cannot delete messages that are 14 days or older!').setFooter(message.author.username, message.author.displayAvatarURL({ dynamic: true, size: 1024 }))]})
    )
}