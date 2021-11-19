module.exports = {
    description: 'Allows you to send an announcement on your behalf.',
    permissions: [],
    aliases: [],
    usage: 'announce <Description>'
}

module.exports.run = async(client, message, args) => {
    if (!message.member.permissions.has("ADMINISTRATOR"))
        return message.channel.send({ embeds: [new client.embed().setDescription(`You are missing permission \`ADMINISTRATOR\``).setFooter(message.author.username, message.author.displayAvatarURL({ dynamic: true, size: 1024 }))]});
    let description = args.join(' ')
    if (!description) return message.channel.send({ embeds: [client.embedBuilder(client, message, "Error", "You need to provide description.", "RED")] });
    let msg = await message.channel.send({ embeds: [new client.embed().setFooter(message.author.username, message.author.displayAvatarURL({ dynamic: true, size: 1024 })).setAuthor(`Announcement From ${message.author.tag}`, message.author.displayAvatarURL({ format: `png`, dynamic: true, size: 1024 })).setDescription(description)]})
}