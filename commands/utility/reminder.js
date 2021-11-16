const parse = require('parse-duration');

module.exports = {
    description: 'Lets you set a reminder.',
    aliases: [`rem`],
    usage: 'reminder <TIME> <Reason>'
}

module.exports.run = async(client, message, args) => {
    let embed3 = new client.embed()
        .setDescription(`Please provide a valid time!`)
        .setFooter(message.author.username, message.author.displayAvatarURL({ dynamic: true, size: 1024 }))
    let [end, ...reason] = args

    if ([null, Infinity].includes(parse(end))) return message.channel.send(embed3);
    if (!reason[0]) return message.channel.send(new client.embed().setDescription('You need to enter what to remind you about!').setFooter(message.author.username, message.author.displayAvatarURL({ dynamic: true, size: 1024 })))

    const embed = new client.embed()
        .setAuthor('Reminder!')
        .setDescription(`**Reminder**\n${reason.join(' ')}\n\n**Reminded At**\n${require('moment')().format('dddd, MMMM Do YYYY [at] h:mm A')}`)
        .setFooter(message.author.username, message.author.displayAvatarURL({ dynamic: true, size: 1024 }))

    setTimeout(() => {
        message.author.send(embed).catch(() => {})
    }, parse(end))
}