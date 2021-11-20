const db = require("quick.db")

module.exports = {
    name: 'birthdayscoming',
    description: 'Views all the birthdays coming up in the week.',
    permissions: [],
    cooldown: 0,
    aliases: [`bdaylist`],
    usage: 'birthdydayscoming'
}

module.exports.run = async(client, message, args) => {
    const dates = ['January', 'Februrary', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
    const isToday = d => d ? new Date().getMonth() === new Date(d).getMonth() && new Date().getDate() <= new Date(d).getDate() : false
    let birthdays = db.all().filter(i => i.ID.startsWith(`birthday_${message.guild.id}_`)).sort((a, b) => b.data - a.data);
    birthdays = birthdays.filter((b) => isToday(b.data)).map(s => {
        let bUser = client.users.cache.get(s.ID.split("_")[2]) || "N/A";
        return `> **${s.data.slice(1,-1).trim()}** - ${bUser}\n`;
    })
    const embed = new client.embed()
        .setTitle(`Birthdays Coming Up for ${dates[new Date().getMonth()]}!`)
        .setDescription(birthdays.join(' '))
        .setFooter(`Pages 1/${birthdays.length}`)

    if (!birthdays.length) return message.channel.send({ embeds: [new client.embed().setDescription('Looks like nobodys birthday is coming up soon! try again next time!')]})

    message.channel.send({ embeds: [embed] }).then(async emb => {
        if (!birthdays[1]) return;
        ['⏮️', '◀️', '▶️', '⏭️', '⏹️'].forEach(async m => await emb.react(m))

        const filter = (_, u) => u.id === message.author.id
        const collector = emb.createReactionCollector({ filter, time: 300000 })
        let page = 1
        collector.on('collect', async(r, user) => {
            let current = page;
            emb.reactions.cache.get(r.emoji.name).users.remove(user.id)
            if (r.emoji.name === '◀️' && page !== 1) page--;
            else if (r.emoji.name === '▶️' && page !== birthdays.length) page++;
            else if (r.emoji.name === '⏮️') page = 1
            else if (r.emoji.name === '⏭️') page = birthdays.length
            else if (r.emoji.name === '⏹️') return collector.stop()

            embed.setDescription(birthdays.join(' '))
            if (current !== page) emb.edit(embed.setFooter(`Pages ${page}/${birthdays.length} - This only contains applications allowed in this channel.`))
        })
    })
}