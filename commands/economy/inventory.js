const { chunk } = require('lodash')

module.exports = {
    description: 'Check your inventory on the server.',
    aliases: ['inv'],
    usage: 'inventory'
}

module.exports.run = async(client, message, args) => {
    const inv = client.members.get(message.guild.id, message.author.id).inventory
    const items = chunk(inv.items.map((s, i) => `**${i + 1}:** ${s.name} - Sell Value: ${~~(s.price * 0.9)} ${message.coin}\n`), 5)
    const embed = new client.embed()
        .setTitle('Your inventory')
        .setThumbnail(message.author.displayAvatarURL({ dynamic: true }))
        .addField('Total Fish', inv.fish, true)
        .addField('Total Cheques', inv.cheques, true)
        .addField('Total Meat', inv.meat, true)
        .addField('**Current items:**', items[0] || 'none')
        .setFooter(`Pages 1/${items.length || 1}`)

    message.channel.send(embed).then(async emb => {
        if (!items[1]) return;
        ['⏮️', '◀️', '▶️', '⏭️', '⏹️'].forEach(async m => await emb.react(m))

        const filter = (_, u) => u.id === message.author.id
        const collector = emb.createReactionCollector(filter, { time: 300000 })
        let page = 1
        collector.on('collect', async(r, user) => {
            let current = page;
            emb.reactions.cache.get(r.emoji.name).users.remove(user.id)
            if (r.emoji.name === '◀️' && page !== 1) page--;
            else if (r.emoji.name === '▶️' && page !== items.length) page++;
            else if (r.emoji.name === '⏮️') page = 1
            else if (r.emoji.name === '⏭️') page = items.length
            else if (r.emoji.name === '⏹️') return collector.stop()

            embed.fields[2].value = items[page - 1]
            if (current !== page) emb.edit(embed.setFooter(`Pages ${page}/${items.length}`))
        })
    })
}