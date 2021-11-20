const parse = require('ms');

module.exports = {
    description: 'Lets you set a reminder.',
    permissions: [],
    aliases: [`rem`],
    usage: 'reminder <TIME> <Reason>'
}

module.exports.run = async(client, message, args) => {
    let [end, ...reason] = args

    if ([null, Infinity].includes(parse(end))) return message.channel.send({ embeds: [client.embedBuilder(client, message, "Error", "You need to provide time.", "RED")] });
    if (!reason[0]) return message.channel.send({ embeds: [client.embedBuilder(client, message, "Error", "You need to enter reminder reason.", "RED")] });

    const embed = new client.embed()
        .setAuthor('Reminder!')
        .setDescription(`**Reminder**\n${reason.join(' ')}\n\n**Reminded At**\n${require('moment')().format('dddd, MMMM Do YYYY [at] h:mm A')}`)
        .setFooter(message.author.username, message.author.displayAvatarURL({ dynamic: true, size: 1024 }))

    setTimeout(() => {
        message.author.send({ embeds: [embed] }).catch(() => {})
    }, parse(end))
}