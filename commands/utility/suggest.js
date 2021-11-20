const db = require('quick.db');

module.exports = {
    name: 'suggest',
    description: 'Lets you submit a suggestion.',
    permissions: [],
    cooldown: 0,
    aliases: [`sug`],
    usage: 'suggest <Suggestion>'
}

module.exports.run = async(client, message, args) => {
    let channel = client.channels.cache.get(client.conf.logging.Suggestion_Channel_Logs)

    if (!channel) return message.channel.send({ embeds: [new client.embed().setDescription('A suggestions channel hasnt been setup for this server!').setFooter(message.author.username, message.author.displayAvatarURL({ dynamic: true, size: 1024 }))]})
    if (!args[0]) return message.channel.send({ embeds: [new client.embed().setDescription(`Please provide me a suggestion!`).setFooter(message.author.username, message.author.displayAvatarURL({ dynamic: true, size: 1024 }))]});

    const embed = new client.embed()
        .setTitle("Suggestion")
        .setDescription(`${args.join(' ')}`)
        .setTimestamp()
        .setFooter(message.author.username, message.author.displayAvatarURL({ dynamic: true }))

    message.delete()
    message.channel.send({ embeds: [client.embedBuilder(client, message, "Suggestion", "Your suggestion have been submitted successfully.", "YELLOW")] });
    const msg = await channel.send({ embeds: [embed] })
    await msg.react(client.conf.settings.Emojis.Yes)
    await msg.react(client.conf.settings.Emojis.No)
    db.set(`suggestion_${msg.id}`, {
        user: message.author,
        suggestion: args.join(' ')
    });
}