module.exports = {
    name: 'basicpoll',
    category: 'moderation',
    description: 'Lets you create a Yes or no poll.',
    permissions: [],
    cooldown: 0,
    aliases: ['bpoll', 'simplepoll.'],
    usage: 'basicpoll <question>'
}

module.exports.run = async(client, message, args) => {
    const channel = message.mentions.channels.first() || message.guild.channels.cache.get(args[0])
    const description = args.slice(1).join(" ")

    if (!channel) return message.channel.send({ embeds: [client.embedBuilder(client, message, "Error", "You have entered invalid channel.", "RED")] });
    if (!args[1]) return message.channel.send({ embeds: [client.embedBuilder(client, message, "Error", "You didn't specified question.", "RED")] });

    const embed = new client.embed({ description })
        .setAuthor(`Poll Created By ${message.author.tag}`, 'https://cdn.discordapp.com/attachments/745089083008745553/758900685919223858/poll.png')
        .setTimestamp()

    const msg = await client.channels.cache.get(channel.id).send({ embeds: [embed] })
    msg.react('✅').then(msg.react('❌'))
    message.delete();
}