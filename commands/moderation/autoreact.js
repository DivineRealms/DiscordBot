const { chunk } = require('lodash')

module.exports = {
    description: 'Make the bot react with specific emojis when a certain message is sent!',
    aliases: ['areact'],
    usage: 'autoreact <delete | list | trigger> | [emoji] '
}

module.exports.run = async(client, message, args) => {
    if (!message.member.hasPermission("ADMINISTRATOR"))
        return message.channel.send(new client.embed().setDescription(`You are missing permission \`ADMINISTRATOR\``).setFooter(message.author.username, message.author.displayAvatarURL({ dynamic: true, size: 1024 })));
    const [trig, resp] = args.join(' ').split(/ *\| */)
    const emojis = (resp || '').match(/\p{Emoji}/ug)
    if (args[0] === 'delete') {
        const trigger = client.settings.get(message.guild.id, `reacts.${args.slice(1).join(' ')}`)
        if (!trigger) return message.channel.send(new client.embed().setDescription('Sorry but i couldnt find a auto react with those trigger words!'))
        client.settings.delete(message.guild.id, `reacts.${args.slice(1).join(' ')}`)
        return message.channel.send(new client.embed().setDescription(`Successfully deleted the autoreact with trigger \`${args.slice(1).join(' ')}\``))
    }

    if (args[0] === 'list') {
        const autoreacts = chunk(Object.entries(client.settings.get(message.guild.id, 'reacts')).map(s => `**Trigger:** ${s[0]}\n**Response:** ${s[1].response}\n`), 5)
        if (!autoreacts.length) return message.channel.send(new client.embed().setDescription('This server has no autoreacts to list!'))

        const embed = new client.embed()
            .setTitle('All autoreacts for the server')
            .setDescription(`Delete an autoreact with \`${message.px}areact delete <trigger>\`\n\n${autoreacts[0].join('\n')}`)
            .setFooter(`Pages 1/${autoreacts.length}`)

        return message.channel.send(embed).then(async emb => {
            if (!autoreacts[1]) return;
            ['⏮️', '◀️', '▶️', '⏭️', '⏹️'].forEach(async m => await emb.react(m))

            const filter = (_, u) => u.id === message.author.id
            const collector = emb.createReactionCollector(filter, { time: 300000 })
            let page = 1
            collector.on('collect', async(r, user) => {
                let current = page;
                emb.reactions.cache.get(r.emoji.name).users.remove(user.id)
                if (r.emoji.name === '◀️' && page !== 1) page--;
                else if (r.emoji.name === '▶️' && page !== autoreacts.length) page++;
                else if (r.emoji.name === '⏮️') page = 1
                else if (r.emoji.name === '⏭️') page = autoreacts.length
                else if (r.emoji.name === '⏹️') return collector.stop()

                embed.setDescription(`Delete an autoreact with \`${message.px}areact delete <trigger>\`\n\n${autoreacts[page - 1].join('\n')}`)
                if (current !== page) emb.edit(embed.setFooter(`Pages ${page}/${autoreacts.length}`))
            })
        })
    }

    if (!trig) return message.channel.send(new client.embed().setDescription(`You need to enter what the trigger for the reaction(s) is!\nExample: \`${message.px}areact fuel | 👏 👍!\``))
    if (!resp || !emojis || !emojis[0]) return message.channel.send(new client.embed().setDescription(`You need to enter what i should react with to that trigger!\nExample: \`${message.px}areact fuel | 👏 👍!\``))
    if (!emojis.length > 5) return message.channel.send(new client.embed().setDescription('Sorry but i cant react with more than 5 emojis!'))
    if (client.settings.get(message.guild.id, `reacts.${trig}`)) return message.channel.send(new client.embed().setDescription(`An auto reacter with that trigger already exists! choose another.`))

    message.channel.send(new client.embed().setDescription(`I will now react to \`${trig}\`\nWith \`${emojis.join(' ')}\``))
    client.settings.set(message.guild.id, emojis, `reacts.${trig}.emojis`)
}