const { chunk } = require('lodash')
const db = require('quick.db')

module.exports = {
    name: 'shop',
    description: 'View the shop on the server and buy items.',
    permissions: [],
    cooldown: 0,
    aliases: [`sh0p`],
    usage: 'shop'
}

module.exports.run = async(client, message, args) => {
    const settings = client.conf.economy
    const shop = [...settings.shopItems]
    const items = chunk(shop.map((s, i) => `**#${i + 1}** ${s.name} - ${s.price} ${message.coin}\n> ⁃ ${s.description.replace('{role}', '<@&' + s.roleID + '>')}\n`), 5);

    const embed = new client.embed()
        .setTitle(`${message.guild.name} Shop!`)
        .setDescription(`To purchase an item use \`${message.px}buy <item id>\`\n\n${items[0].join('\n')}`)
        .setFooter(`Pages 1/${items.length}`)

    message.channel.send({ embeds: [embed] }).then(async emb => {
        if (!items[1]) return;
        ['⏮️', '◀️', '▶️', '⏭️', '⏹️'].forEach(async m => await emb.react(m))

        const filter = (_, u) => u.id === message.author.id
        const collector = emb.createReactionCollector({ filter, time: 300000 })
        let page = 1
        collector.on('collect', async(r, user) => {
            let current = page;
            emb.reactions.cache.get(r.emoji.name).users.remove(user.id)
            if (r.emoji.name === '◀️' && page !== 1) page--;
            else if (r.emoji.name === '▶️' && page !== items.length) page++;
            else if (r.emoji.name === '⏮️') page = 1
            else if (r.emoji.name === '⏭️') page = items.length
            else if (r.emoji.name === '⏹️') return collector.stop()

            embed.setDescription(`To purchase an item use \`${message.px}buy <item id>\`\n\n${items[page-1].join('\n')}`)
            if (current !== page) emb.edit(embed.setFooter(`Pages ${page}/${items.length}`))
        })
    })
}