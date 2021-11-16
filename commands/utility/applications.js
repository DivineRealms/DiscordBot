const { chunk } = require('lodash')

module.exports = {
    description: 'View the available applications in the channel.',
    aliases: [],
    usage: 'applications'
}

module.exports.run = async(client, message, args) => {
    const applications = client.conf.applicationSystem.applications.filter(s => !s.Application_Channel || s.Application_Channel === message.channel.id)
    const apps = chunk(applications.map((app, i) => `**Application ${i + 1}:** ${app.Application_Name}`), 5)
    const embed = new client.embed()
        .setTitle('Application Menu')
        .setDescription(`Please select what application you would like to apply for.\n\nUse the reactions to flip through the applications on the server.\n\n${apps[0].join('\n')}\n\u200b`)
        .setFooter(`Pages 1/${apps.length} - This only contains applications allowed in this channel.`)

    if (!applications.length) return message.channel.send(new client.embed().setDescription('I couldnt find any applications available in this channel!'))

    message.channel.send(embed).then(async emb => {
        if (!apps[1]) return;
        ['⏮️', '◀️', '▶️', '⏭️', '⏹️'].forEach(async m => await emb.react(m))

        const filter = (_, u) => u.id === message.author.id
        const collector = emb.createReactionCollector(filter, { time: 300000 })
        let page = 1
        collector.on('collect', async(r, user) => {
            let current = page;
            emb.reactions.cache.get(r.emoji.name).users.remove(user.id)
            if (r.emoji.name === '◀️' && page !== 1) page--;
            else if (r.emoji.name === '▶️' && page !== apps.length) page++;
            else if (r.emoji.name === '⏮️') page = 1
            else if (r.emoji.name === '⏭️') page = apps.length
            else if (r.emoji.name === '⏹️') return collector.stop()

            embed.setDescription(`Please select which application you would like to apply to.\nUse the reactions to flip pages\n\n${apps[page - 1].join('\n')}\n\u200b`)
            if (current !== page) emb.edit(embed.setFooter(`Pages ${page}/${apps.length} - This only contains applications allowed in this channel.`))
        })
    })
}