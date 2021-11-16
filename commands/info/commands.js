const { chunk } = require('lodash')

module.exports = {
    description: 'A list of all the commands.',
    aliases: [],
    usage: 'commands'
}

module.exports.run = async(client, message, args) => {

    if (!args[0]) {
        const categories = client.categories.keyArray().map(s => s.charAt(0).toUpperCase() + s.slice(1))
        let commands = client.categories.map((a, b) => [b, a]).map(s => [s[0], s[1].map(g => `\`${g}\` - ${client.commands.get(g).description}`)])
        commands = commands.reduce((a, b) => {
            temp = chunk(b[1], 15).map(s => [b[0], s])
            a.push(temp)
            return a
        }, []).flat(1).map(s => [s[0].charAt(0).toUpperCase() + s[0].slice(1), s[1]])

        const embed = new client.embed()
            .setTitle(commands[0][0])
            .setThumbnail(client.user.displayAvatarURL())
            .setDescription(commands[0][1].join('\n'))
            .setFooter(`Pages 1/${commands.length}`)

        return message.channel.send(embed).then(async emb => {
            if (!commands[1]) return;
            ['⏮️', '◀️', '▶️', '⏭️', '⏹️'].forEach(async m => await emb.react(m))

            const filter = (_, u) => u.id === message.author.id
            const collector = emb.createReactionCollector(filter, { time: 300000 })
            let page = 1
            collector.on('collect', async(r, user) => {
                let current = page;
                emb.reactions.cache.get(r.emoji.name).users.remove(user.id)
                if (r.emoji.name === '◀️' && page !== 1) page--;
                else if (r.emoji.name === '▶️' && page !== commands.length) page++;
                else if (r.emoji.name === '⏮️') page = 1
                else if (r.emoji.name === '⏭️') page = commands.length
                else if (r.emoji.name === '⏹️') return collector.stop()

                embed.setDescription(commands[page - 1][1].join('\n')).setTitle(commands[page - 1][0])
                if (current !== page) emb.edit(embed.setFooter(`Pages ${page}/${commands.length}`))
            })
        })
    }
    const category = client.categories.get(args[0])
    if (category) {
        args[0] = args[0].charAt(0).toUpperCase() + args[0].slice(1)
        const commands = chunk(category.map(s => `\`${s}\` - ${client.commands.get(s).description}`), 10)
        const embed = new client.embed()
            .setTitle(args[0])
            .setThumbnail(client.user.displayAvatarURL())
            .setDescription(commands[0].join('\n'))
            .setFooter(`Pages 1/${commands.length}`)

        return message.channel.send(embed).then(async emb => {
            if (!commands[1]) return;
            ['⏮️', '◀️', '▶️', '⏭️', '⏹️'].forEach(async m => await emb.react(m))

            const filter = (_, u) => u.id === message.author.id
            const collector = emb.createReactionCollector(filter, { time: 300000 })
            let page = 1
            collector.on('collect', async(r, user) => {
                let current = page;
                emb.reactions.cache.get(r.emoji.name).users.remove(user.id)
                if (r.emoji.name === '◀️' && page !== 1) page--;
                else if (r.emoji.name === '▶️' && page !== commands.length) page++;
                else if (r.emoji.name === '⏮️') page = 1
                else if (r.emoji.name === '⏭️') page = commands.length
                else if (r.emoji.name === '⏹️') return collector.stop()

                embed.setDescription(commands[page - 1].join('\n')).setTitle(args[0])
                if (current !== page) emb.edit(embed.setFooter(`Pages ${page}/${commands.length}`))
            })
        })
    }

    const command = client.commands.find((c, n) => n === args[0].toLowerCase() || (c.aliases && c.aliases.includes(args[0].toLowerCase())))
    if (!command) return message.channel.send(new client.embed().setDescription(`I couldnt find a command named \`${args[0]}\``))

    const embed = new client.embed()
        .setTitle(`${args[0].toLowerCase()} Help`)
        .addField('Command Name', args[0].toLowerCase())
        .addField('Aliases', command.aliases.map(s => `\`${s}\``).join(', ') || 'none')
        .addField('Usage', `\`${message.px}${command.usage}\``)

    message.channel.send(embed)
}