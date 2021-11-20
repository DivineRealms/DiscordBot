module.exports = {
    name: 'report',
    description: 'Lets you submit a report.',
    permissions: [],
    cooldown: 0,
    aliases: [`rep`],
    usage: 'report <Report>'
}

module.exports.run = async(client, message, args) => {
    let channel = client.channels.cache.get(client.conf.logging.Report_Channel_Logs)

    if (!channel) return message.channel.send({ embeds: [new client.embed().setDescription('A report channel hasnt been setup for this server!').setFooter(message.author.username, message.author.displayAvatarURL({ dynamic: true, size: 1024 }))]})
    if (!args[0]) return message.channel.send({ embeds: [new client.embed().setDescription(`Please provide me a report!`).setFooter(message.author.username, message.author.displayAvatarURL({ dynamic: true, size: 1024 }))]});

    const report = new client.embed()
        .setTitle(`New __REPORT__`)
        .addField('Submitter', message.author)
        .addField('Report', args.join(' '))
        .addField('Time', require('moment')().format('ddd, MMMM Do YYYY [at] hh:mm A'))

    message.delete()
    message.channel.send({ embeds: [new client.embed().setDescription(`Your report for \`${args.join(' ')}\` was submitted!`)]})
    const msg = await channel.send(report)
}