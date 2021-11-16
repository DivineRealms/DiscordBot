const { random, shuffle } = require('lodash')
const fetch = require('node-fetch')

module.exports = {
    description: 'Test your knowledge with a round of trivia.',
    aliases: ['trv'],
    usage: 'trv [category] [difficulty]'
}

module.exports.run = async(client, message, args) => {
    const categories = ['**1.** Any Category', '**2.** General Knowledge', '**3.** Entertainment: Books', '**4.** Entertainment: Film', '**5.** Entertainment: Music', '**6.** Entertainment: Musicals & Theatres', '**7.** Entertainment: Television', '**8.** Entertainment: Video Games', '**9.** Entertainment: Board Games', '**10.** Science &amp Nature', '**11.** Science: Computers', '**12.** Science: Mathematics', '**13.** Mythology', '**14.** Sports', '**15.** Geography', '**16.** History', '**17.** Politics', '**18.** Art', '**19.** Celebrities', '**20.** Animals', '**21.** Vehicles', '**22.** Entertainment: Comics', '**23.** Science: Gadgets', '**24.** Entertainment: Japanese Anime & Manga', '**25.** Entertainment: Cartoon & Animations']
    const entities = await fetch('https://raw.githubusercontent.com/mathiasbynens/he/master/data/entities.json').then(r => r.json())
    const entNames = Object.keys(entities).filter(s => s.endsWith(';'))
    let category = '',
        difficulty = ''

    if (args[0] == 'list') {

        const list = new client.embed()
            .setTitle('Here are a list of categories')
            .setDescription(`${categories.slice(0, 5).join('\n')}\n\nUse \`${message.px}trivia [category]\` to choose a category`)
            .setFooter(message.author.username, message.author.displayAvatarURL({ dynamic: true, size: 1024 }))
        return message.channel.send(list).then(async emb => {
            ['⏮️', '◀️', '▶️', '⏭️', '⏹️', '🔢'].forEach(async m => await emb.react(m))

            const filter = (reaction, user) => user.id === message.author.id
            const collector = emb.createReactionCollector(filter, { time: 60000 })
            let page = 1

            collector.on('collect', async(r, u) => {
                let current = page;
                emb.reactions.cache.get(r.emoji.name).users.remove(u.id)
                if (r.emoji.name === '◀️' && page != 1) page--;
                else if (r.emoji.name === '▶️' && page != 5) page++;
                else if (r.emoji.name === '⏮️') page = 1
                else if (r.emoji.name === '⏭️') page = 5
                else if (r.emoji.name === '⏹️') return collector.stop()
                else if (r.emoji.name === '🔢') {
                    let msg = await message.channel.send('What page would you like to flip to?')
                    let collector = await message.channel.awaitMessages(m => m.author.id === message.author.id && m.content > 0 && m.content <= 5, { max: 1, time: 15000 })
                    msg.delete()
                    if (collector.first() && collector.first().content > 0 && collector.first().content <= 5) page = collector.first().content
                }

                if (current !== page) emb.edit(list.setDescription(`${categories.slice(page * 5 - 5, page * 5 - 5 + 5).join('\n')}\n\nUse \`${client.prefix(message)}trivia <category number>\` to choose a category`))
            })
        })
    } else if (args[0] > 0 && args[0] < 26) category = `category=${parseInt(args[0]) + 7}`
    else if (args[0]) return message.channel.send(`You need to enter a valid category number. run \`${message.px}trivia list\` for a list of categories.\nExample: \`${message.px}trivia 10 easy\``)

    if (args[1] && ['easy', 'medium', 'hard'].includes(args[1].toLowerCase())) difficulty = `difficulty=${args[1]}`

    let body = await fetch(`https://opentdb.com/api.php?amount=1&${category}&${difficulty}&type=multiple`).then(r => r.text())
    body = body.replace(/&quot;/g, '\\"').replace(/&#039;/g, '\'').replace(/&amp;/, '&')

    let obj = JSON.parse(body).results[0]
    let arr = shuffle(Object.values(obj.incorrect_answers).concat(obj.correct_answer))
    let prize = random(10, 20)

    const embed = new client.embed()
        .setTitle(`${obj.question}`)
        .setDescription(`You have 15 seconds to answer\n\nA) ${arr[0]}\nB) ${arr[1]}\nC) ${arr[2]}\nD) ${arr[3]}`)
        .addField('Prize', `\`${prize}\``, true)
        .addField('Difficulty', `\`${obj.difficulty}\``, true)
        .addField(`Category`, `\`${obj.category}\``, true)
        .setFooter(message.author.username, message.author.displayAvatarURL({ dynamic: true, size: 1024 }))

    await message.channel.send(embed).then(async() => {
        let msg = await message.channel.awaitMessages(m => m.author.id == message.author.id, { max: 1, time: 10000 })

        if (!msg.size) return message.channel.send(`Time out! The answer was ${obj.correct_answer}`)

        if ([obj.correct_answer.toLowerCase(), String.fromCharCode(97 + arr.indexOf(obj.correct_answer))].includes(msg.first().content.toLowerCase())) {
            message.channel.send(`${msg.first().author} got it right! +${prize} ${message.coin}!`)
            client.members.math(message.guild.id, '+', prize, `${msg.first().author.id}.balance.wallet`)
        } else message.channel.send(`Good try, but the answer was ${obj.correct_answer}`)
    })
}