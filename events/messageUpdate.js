module.exports = async(client, oldMessage, newMessage) => {
    const log = client.channels.cache.get(client.conf.logging.Message_Updates);
    if (!log || !oldMessage.guild || !newMessage.guild) return
    if (newMessage.partial) await newMessage.fetch()

    const embed = new client.embed()
        .setAuthor('A message has been updated!')
        .setFooter(`${newMessage.guild.name} | Made By Fuel#2649`, newMessage.guild.iconURL({ dynamic: true }))

    if (oldMessage.content && oldMessage.content !== newMessage.content) log.send(embed.setDescription(`**Author:** ${newMessage.author}\n**Old Content:** ${oldMessage.content}\n**New Content:** ${newMessage.content}`))
    else if (oldMessage.pinned && oldMessage.pinned !== newMessage.pinned) log.send(embed.setDescription(`[This message](${newMessage.url}) has been **${newMessage.pinned ? 'Pinned' : 'Unpinned'}**.`))
}