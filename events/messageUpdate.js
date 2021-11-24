module.exports = async(client, oldMessage, newMessage) => {
  const log = client.channels.cache.get(client.conf.logging.Message_Updates);
  if (!log || !oldMessage.guild || !newMessage.guild) return
  if (newMessage.partial) await newMessage.fetch()

  const embed = new client.embedBuilder(client, "", "Message has been updated!", "")

  if (oldMessage.content && oldMessage.content !== newMessage.content) log.send({ embeds: [embed.setDescription(`**Author:** ${newMessage.author}\n**Old Content:** ${oldMessage.content}\n**New Content:** ${newMessage.content}`)]})
  else if (oldMessage.pinned && oldMessage.pinned !== newMessage.pinned) log.send({ embeds: [embed.setDescription(`[This message](${newMessage.url}) has been **${newMessage.pinned ? 'Pinned' : 'Unpinned'}**.`)]})
}