module.exports = {
    description: 'Divorce your fiance and become single.',
    aliases: ['breakup'],
    usage: 'divorce'
}

module.exports.run = (client, message) => {
    const author = client.members.get(message.guild.id, message.author.id)

    if (!author.married) return message.channel.send('Try again when you\'re married').then(r => r.delete({ timeout: 5000 }))

    const arr = author.married.split('-|-')
    const embed = new client.embed().setDescription(`Are you sure you want to divorce from ${arr[1]} (\`${arr[0]}\`)?`).setFooter(message.author.username, message.author.displayAvatarURL({ dynamic: true, size: 1024 }))

    message.channel.send(embed).then(async r2 => {
        await r2.react('✅')
        await r2.react('❌')

        r2.awaitReactions((r, u) => ['✅', '❌'].includes(r.emoji.name) && u.id === message.author.id, { max: 1, time: 30000 }).then(async r => {
            if (r.first().emoji.name === '✅') {
                r2.edit(embed.setDescription(`${embed.description}\n:broken_heart: You decided to end things!`).setFooter(message.author.username, message.author.displayAvatarURL({ dynamic: true, size: 1024 })))

                client.members.set(message.guild.id, null, `${arr[0]}.married`)
                client.members.set(message.guild.id, null, `${message.author.id}.married`)
            } else if (r.first().emoji.name === '❌')
                r2.edit(embed.setDescription(`${embed.description}\n:gift_heart: You decided to stay together!`).setFooter(message.author.username, message.author.displayAvatarURL({ dynamic: true, size: 1024 })))
        }).catch(() => {})
    })
}