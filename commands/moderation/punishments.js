module.exports = {
    description: 'View the punishments on the requested user.',
    aliases: [`staffinfo`],
    usage: 'punishments <@USER | ID'
}

module.exports.run = async(client, message, args) => {
    if (!message.member.hasPermission('ADMINISTRATOR')) return message.channel.send(new client.embed().setDescription(`Sorry you are missing the permission \`ADMINISTRATOR\`!`).setFooter(message.author.username, message.author.displayAvatarURL({ dynamic: true, size: 1024 })))
    const member = message.mentions.users.first() || await client.users.fetch(args[0]).catch(() => {});

    if (!member) return message.channel.send(new client.embed().setDescription(`Please specify a user to view punishments on.`).setFooter(message.author.username, message.author.displayAvatarURL({ dynamic: true, size: 1024 })))

    const punishments = client.members.ensure(message.guild.id, client.memberSettings, member.id).punishments
    if (!punishments.length) return message.channel.send(new client.embed().setDescription('That member doesnt have any punishments!'))

    message.channel.send({ embed: punishments[0] }).then(async emb => {
        if (!punishments[1]) return;
        ['⏮️', '◀️', '▶️', '⏭️', '⏹️'].forEach(async m => await emb.react(m))

        const filter = (_, u) => u.id === message.author.id
        const collector = emb.createReactionCollector(filter, { time: 300000 })
        let page = 1
        collector.on('collect', async(r, user) => {
            let current = page;
            emb.reactions.cache.get(r.emoji.name).users.remove(user.id)
            if (r.emoji.name === '◀️' && page !== 1) page--;
            else if (r.emoji.name === '▶️' && page !== punishments.length) page++;
            else if (r.emoji.name === '⏮️') page = 1
            else if (r.emoji.name === '⏭️') page = punishments.length
            else if (r.emoji.name === '⏹️') return collector.stop()
            punishments[page - 1].footer.text = `Pages ${page}/${punishments.length}`
            if (current !== page) emb.edit({ embed: punishments[page - 1] })
        })
    })

}