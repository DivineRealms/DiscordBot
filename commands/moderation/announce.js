module.exports = {
    name: 'announce',
    category: 'moderation',
    description: 'Allows you to send an announcement on your behalf.',
    permissions: ["ADMINISTRATOR"],
    cooldown: 0,
    aliases: [],
    usage: 'announce <Description>'
}

module.exports.run = async(client, message, args) => {
    let description = args.join(' ')
    if (!description) return message.channel.send({ embeds: [client.embedBuilder(client, message, "Error", "You need to provide description.", "RED")] });
    let msg = await message.channel.send({ embeds: [new client.embed().setFooter(message.author.username, message.author.displayAvatarURL({ dynamic: true, size: 1024 })).setAuthor(`Announcement From ${message.author.tag}`, message.author.displayAvatarURL({ format: `png`, dynamic: true, size: 1024 })).setDescription(description)]})
}