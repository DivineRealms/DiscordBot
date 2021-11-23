module.exports = {
    name: 'embed',
    category: 'moderation',
    description: 'Allows you to put text into an embed.',
    permissions: ["MANAGE_GUILD"],
    cooldown: 0,
    aliases: [],
    usage: 'embed  <Title> | <Description>'
}

module.exports.run = async(client, message, args) => {
    let [title, description] = args.join(' ').split(/\s*\|\s*/)
    if (!title) return message.channel.send({ embeds: [client.embedBuilder(client, message, "Error", "You need to provide title.", "RED")] });
    if (!description) return message.channel.send({ embeds: [client.embedBuilder(client, message, "Error", "You need to provide description.", "RED")] });
    await message.channel.send({ embeds: [new client.embed().setTitle(title).setDescription(description).setFooter(message.author.username, message.author.displayAvatarURL({ dynamic: true, size: 1024 }))]})
}
