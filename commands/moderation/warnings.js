module.exports = {
    description: 'View the warnings on the requested user.',
    aliases: ['warns'],
    usage: 'warnings <@User | ID>'
}

module.exports.run = async(client, message, args) => {
    if (!message.member.hasPermission('MUTE_MEMBERS')) return message.channel.send(new client.embed().setDescription(`Sorry you are missing the permission \`MUTE_MEMBERS\`!`).setFooter(message.author.username, message.author.displayAvatarURL({ dynamic: true, size: 1024 })))
    const member = message.mentions.users.first() || await client.users.fetch(args[0]).catch(() => {});

    if (!member) return message.channel.send(new client.embed().setDescription(`Please specify a user to view warnings on.`).setFooter(message.author.username, message.author.displayAvatarURL({ dynamic: true, size: 1024 })))

    const warnings = client.members.ensure(message.guild.id, client.memberSettings, member.id).warnings
    if (!warnings.length) return message.channel.send(new client.embed().setDescription('That member doesnt have any warnings!'))

    message.channel.send({ embed: warnings[0] }).then(async emb => {
        if (!warnings[1]) return;
        ['⏮️', '◀️', '▶️', '⏭️', '⏹️'].forEach(async m => await emb.react(m))

        const filter = (_, u) => u.id === message.author.id
        const collector = emb.createReactionCollector(filter, { time: 300000 })
        let page = 1
        collector.on('collect', async(r, user) => {
            let current = page;
            emb.reactions.cache.get(r.emoji.name).users.remove(user.id)
            if (r.emoji.name === '◀️' && page !== 1) page--;
            else if (r.emoji.name === '▶️' && page !== warnings.length) page++;
            else if (r.emoji.name === '⏮️') page = 1
            else if (r.emoji.name === '⏭️') page = warnings.length
            else if (r.emoji.name === '⏹️') return collector.stop()
            warnings[page - 1].footer.text = `Pages ${page}/${warnings.length}`
            if (current !== page) emb.edit({ embed: warnings[page - 1] })
        })
    })

}