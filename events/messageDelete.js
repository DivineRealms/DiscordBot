module.exports = async (client, message) => {
  if (!message.author || !message.guild || message.author.bot) return;
  client.snipes.set(message.channel.id, {
    user: message.author.id,
    content: message.content,
  });
  setTimeout(() => {
    if (
      client.snipes.get(message.channel.id) &&
      client.snipes.get(message.channel.id).id === message.id
    )
      client.snipes.delete(message.channel.id);
  }, 300000);
};
