module.exports = {
    description: 'Lets you submit a suggestion.',
    permissions: [],
    aliases: [`sug`],
    usage: 'suggest <Suggestion>'
}

module.exports.run = async(client, message, args) => {
    let channel = client.channels.cache.get(client.conf.logging.Suggestion_Channel_Logs)

    if (!channel) return message.channel.send({ embeds: [new client.embed().setDescription('A suggestions channel hasnt been setup for this server!').setFooter(message.author.username, message.author.displayAvatarURL({ dynamic: true, size: 1024 }))]})
    if (!args[0]) return message.channel.send({ embeds: [new client.embed().setDescription(`Please provide me a suggestion!`).setFooter(message.author.username, message.author.displayAvatarURL({ dynamic: true, size: 1024 }))]});

    const suggestionembed = new client.embed()
        .setTitle(`Suggestion`)
        .addField('Submitter', message.author)
        .addField('Suggestion', args.join(' '))
        .addField('Suggestion ID', message.id)
        .addField('Time', require('moment')().format('ddd, MMMM Do YYYY [at] hh:mm A'))

    message.delete()
    message.channel.send({ embeds: [client.embedBuilder(client, message, "Suggestion", "Your suggestion have been submitted successfully.", "YELLOW")] });
    const msg = await channel.send({ embeds: [suggestionembed] })
    await msg.react('✅')
    await msg.react('❌')
}