const { chunk } = require('lodash')

module.exports = {
    description: 'Lets you create a reply message when the command you chose is ran!',
    aliases: ['ar'],
    usage: 'autoreply <delete | list | trigger> | [response] '
}

module.exports.run = async(client, message, args) => {
    if (!message.member.hasPermission("ADMINISTRATOR"))
        return message.channel.send(new client.embed().setDescription(`You are missing permission \`ADMINISTRATOR\``).setFooter(message.author.username, message.author.displayAvatarURL({ dynamic: true, size: 1024 })));
    const [trig, resp] = args.join(' ').split(/ *\| */)

    if (args[0] === 'delete') {
        const trigger = client.settings.get(message.guild.id, `replies.${args.slice(1).join(' ')}`)
        if (!trigger) return message.channel.send(new client.embed().setDescription('Sorry but i couldnt find a auto reply with those trigger words!'))
        client.settings.delete(message.guild.id, `replies.${args.slice(1).join(' ')}`)
        return message.channel.send(new client.embed().setDescription(`Successfully deleted the autoreply with trigger \`${args.slice(1).join(' ')}\``))
    }

    if (args[0] === 'list') {
        const autoreplies = chunk(Object.entries(client.settings.get(message.guild.id, 'replies')).map(s => `**Trigger:** ${s[0]}\n**Response:** ${s[1].response}\n`), 5)
        if (!autoreplies.length) return message.channel.send(new client.embed().setDescription('This server has no autoreplies to list!'))

        const embed = new client.embed()
            .setTitle('All autoreplies for the server')
            .setDescription(`Delete an autoreply with \`${message.px}ar delete <trigger>\`\n\n${autoreplies[0].join('\n')}`)
            .setFooter(`Pages 1/${autoreplies.length}`)

        return message.channel.send(embed).then(async emb => {
            if (!autoreplies[1]) return;
            ['⏮️', '◀️', '▶️', '⏭️', '⏹️'].forEach(async m => await emb.react(m))

            const filter = (_, u) => u.id === message.author.id
            const collector = emb.createReactionCollector(filter, { time: 300000 })
            let page = 1
            collector.on('collect', async(r, user) => {
                let current = page;
                emb.reactions.cache.get(r.emoji.name).users.remove(user.id)
                if (r.emoji.name === '◀️' && page !== 1) page--;
                else if (r.emoji.name === '▶️' && page !== autoreplies.length) page++;
                else if (r.emoji.name === '⏮️') page = 1
                else if (r.emoji.name === '⏭️') page = autoreplies.length
                else if (r.emoji.name === '⏹️') return collector.stop()

                embed.setDescription(`Delete an autoreply with \`${message.px}ar delete <trigger>\`\n\n${autoreplies[page - 1].join('\n')}`)
                if (current !== page) emb.edit(embed.setFooter(`Pages ${page}/${autoreplies.length}`))
            })
        })
    }

    if (!trig) return message.channel.send(new client.embed().setDescription(`You need to enter what the trigger for this response is!\nExample: \`${message.px}ar fuel | development!\``))
    if (!resp) return message.channel.send(new client.embed().setDescription(`You need to enter what i should respond to that trigger!\nExample: \`${message.px}ar fuel | development!\``))
    if (client.settings.get(message.guild.id, `replies.${trig}`)) return message.channel.send(new client.embed().setDescription(`An auto replier with that trigger already exists! choose another.`))

    message.channel.send(new client.embed().setDescription(`I will now answer \`${trig}\`\nWith \`${resp}\``))
    client.settings.set(message.guild.id, resp, `replies.${trig}.response`)
}