module.exports = {
    description: 'Lets you see the ban count in the guild.',
    aliases: ['vbans', 'viewingbans'],
    usage: 'viewbans'
}

module.exports.run = async(client, message, args) => {
    if (!message.member.hasPermission("ADMINISTRATOR"))
        return message.channel.send(new client.embed().setDescription(`You are missing permission \`ADMINISTRATOR\``).setFooter(message.author.username, message.author.displayAvatarURL({ dynamic: true, size: 1024 })));
    message.guild.fetchBans().then(bans => {
        message.channel.send(new client.embed()
            .setTitle(`Ban Count For ${message.guild.name}`)
            .setDescription(`Count: \`${bans.size}\``)
            .setFooter(message.author.username, message.author.displayAvatarURL({ dynamic: true, size: 1024 })))
    })

}