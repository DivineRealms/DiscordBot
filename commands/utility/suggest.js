module.exports = {
    description: 'Lets you submit a suggestion.',
    aliases: [`sug`],
    usage: 'suggest <Suggestion>'
}

module.exports.run = async(client, message, args) => {
    let channel = client.channels.cache.get(client.conf.logging.Suggestion_Channel_Logs)

    if (!channel) return message.channel.send(new client.embed().setDescription('A suggestions channel hasnt been setup for this server!').setFooter(message.author.username, message.author.displayAvatarURL({ dynamic: true, size: 1024 })))
    if (!args[0]) return message.channel.send(new client.embed().setDescription(`Please provide me a suggestion!`).setFooter(message.author.username, message.author.displayAvatarURL({ dynamic: true, size: 1024 })));

    const suggestionembed = new client.embed()
        .setTitle(`A New Suggestion Has Came In!`)
        .addField('Submitter', message.author)
        .addField('Suggestion', args.join(' '))
        .addField('Suggestion ID', message.id)
        .addField('Time', require('moment')().format('ddd, MMMM Do YYYY [at] hh:mm A'))

    message.delete()
    message.channel.send(new client.embed().setDescription(`Your suggestion for \`${args.join(' ')}\` was submitted!`))
    const msg = await channel.send(suggestionembed)
    await msg.react('✅')
    await msg.react('❌')

    client.settings.set(message.guild.id, { user: message.author.id, suggestion: args.join(' ') }, `suggestions.${msg.id}`)
}