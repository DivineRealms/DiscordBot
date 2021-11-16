module.exports = {
    description: 'Check to see who someone is married to.',
    aliases: [],
    usage: 'marriage'
}

module.exports.run = (client, message, args) => {
    const user = message.mentions.users.first() || message.author
    const member = client.members.ensure(message.guild.id, client.memberSettings, user.id)

    if (!member.married) return message.channel.send(`${user.id === message.author.id ? 'You\'re not' : 'That user'} isnt married to anyone!`).then(r => r.delete({ timeout: 5000 }))

    const arr = member.married.split('-|-')

    message.channel.send(new client.embed()
            .setDescription(`\`${user.username}\` is currently married to \`${arr[1]}\` (\`${arr[0]}\`).\nThey've been engaged since ${arr[2]}!`))
        .setFooter(message.author.username, message.author.displayAvatarURL({ dynamic: true, size: 1024 }))
}