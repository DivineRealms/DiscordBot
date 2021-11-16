const { load } = require('cheerio');
const fetch = require('node-fetch');

module.exports = {
    description: 'Search online for a random gif.',
    aliases: [],
    usage: 'gif <search>'
}

module.exports.run = async(client, message, args) => {
    if (!args[0]) return message.channel.send(new client.embed().setDescription('You need to enter something to search for!'))

    const body = await fetch(`https://tenor.com/search/${args.join('-')}-gifs`).then(r => r.text())
    const data = load(body)('div.Gif > img')
    const urls = new Array(data.length).fill(0).map((s, i) => data.eq(i).attr('src'))
    if (!urls[0]) return message.channel.send(new client.embed().setDescription('No search results found, did you check your spelling?'))

    const embed = new client.embed()
        .setDescription(`Image not loading? click [here](${urls[0]})`)
        .setImage(urls[0])
        .setFooter(`Pages 1/${urls.length}`)

    message.channel.send(embed).then(async emb => {
        ['⏮️', '◀️', '▶️', '⏭️', '⏹️', '🔢'].forEach(async m => await emb.react(m))

        const filter = (_, u) => u.id === message.author.id
        const collector = emb.createReactionCollector(filter, { time: 300000 })
        let page = 1
        collector.on('collect', async(r, user) => {
            let current = page;
            emb.reactions.cache.get(r.emoji.name).users.remove(user.id)
            if (r.emoji.name === '◀️' && page !== 1) page--;
            else if (r.emoji.name === '▶️' && page !== urls.length) page++;
            else if (r.emoji.name === '⏮️') page = 1
            else if (r.emoji.name === '⏭️') page = urls.length
            else if (r.emoji.name === '⏹️') return collector.stop()
            else if (r.emoji.name === '🔢') {
                let msg = await message.channel.send('What page would you like to flip to?')
                let collector = await message.channel.awaitMessages(m => m.author.id === message.author.id && m.content > 0 && m.content <= urls.length, { max: 1, time: 8000 })
                msg.delete()
                if (collector.first() && collector.first().content > 0 && collector.first().content <= urls.length) page = collector.first().content
            }

            embed.setDescription(`Image not loading? click [here](${urls[page - 1]})`)
            embed.setImage(urls[page - 1])
            if (current !== page) emb.edit(embed.setFooter(`Pages ${page}/${urls.length}`))
        })
    })
}