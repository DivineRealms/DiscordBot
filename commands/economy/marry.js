const moment = require('moment')
const requests = new Map()
const db = require('quick.db')

module.exports = {
    description: 'Marry that special someone!',
    permissions: [],
    aliases: ['propose', 'engage'],
    usage: 'marry <@User>'
}

module.exports.run = async(client, message, args) => {
    let proposed = message.mentions.users.first()

    const data = client.members.get(message.guild.id, message.author.id)
    if (!data.inventory.items.some(s => s.name.includes('Ring'))) return message.channel.send({ embeds: [new client.embed().setDescription(`You need to buy a ring to propose! Buy one from the \`${message.px}shop\`!`).setFooter(message.author.username, message.author.displayAvatarURL({ dynamic: true, size: 1024 }))]})

    if (!proposed) return message.channel.send({ embeds: [new client.embed().setDescription('Please mention a user to propose to!').setFooter(message.author.username, message.author.displayAvatarURL({ dynamic: true, size: 1024 }))]})
    if (message.mentions.users.first().id === message.author.id) return message.channel.send('Yikes. Maybe try to marry someone other than yourself')
    if (message.mentions.users.first().bot) return message.channel.send('Sorry, but even if they may look cute, you can\'t marry a robot.')
    if (requests.get(message.guild.id + message.author.id)) return message.channel.send('Slow down, you have already proposed to someone')
    if (requests.get(message.guild.id + message.mentions.users.first().id)) return message.channel.send('That user has already been proposed to.')

    let author = client.members.get(message.guild.id, message.author.id)
    let user = client.members.ensure(message.guild.id, client.memberSettings, proposed.id)

    if (user.married) return message.channel.send('That user is already married!')
    if (author.married) return message.channel.send('You are already married!')

    requests.set(message.guild.id + message.author.id, true)
    requests.set(message.guild.id + proposed.id, true)

    setTimeout(() => {
        requests.delete(message.guild.id + message.author.id)
        requests.delete(message.guild.id + proposed.id)
    }, 10000)

    const embed = new client.embed()
        .setDescription(`${proposed}, it looks like ${message.author} just proposed to you. What do you say?`)
        .setFooter(message.author.username, message.author.displayAvatarURL({ dynamic: true, size: 1024 }))
    message.channel.send({ embeds: [embed] }).then(() => {
        message.channel.awaitMessages(r => r.author.id == proposed.id && r.content.toLowerCase().includes('yes'), { max: 1, time: 8000 })
            .then(collected => {
                if (!collected.first()) return message.channel.send({ embeds: [new client.embed().setDescription(`Looks like ${proposed.username} didn\'t feel the same way :c`).setFooter(message.author.username, message.author.displayAvatarURL({ dynamic: true, size: 1024 }))]})

                message.channel.send({ embeds: [new client.embed().setDescription(`${collected.first().author} said yes! How heart warming :sparkling_heart:! You are now engaged!`).setFooter(message.author.username, message.author.displayAvatarURL({ dynamic: true, size: 1024 }))]})

                client.members.set(message.guild.id, `${proposed.id}-|-${proposed.username}-|-${moment().format('ddd, MMM DD YYYY')}`, `${message.author.id}.married`)
                client.members.set(message.guild.id, `${message.author.id}-|-${message.author.username}-|-${moment().format('ddd, MMM DD YYYY')}`, `${proposed.id}.married`)
            })
    })
}