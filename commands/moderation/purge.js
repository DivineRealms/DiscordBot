module.exports = {
  name: 'purge',
  category: 'moderation',
  description: 'Clears the requested ammount of messages.',
  permissions: ["MANAGE_MESSAGES"],
  cooldown: 0,
  aliases: ['clear'],
  usage: 'purge <count>'
}

module.exports.run = async(client, message, args) => {
  if (!args[0] || isNaN(args[0])) return message.channel.send({ embeds: [client.embedBuilder(client, message, "Error", "You need to provide amount of messages to remove.", "RED")] });
  if (args[0] > 100) return message.channel.send({ embeds: [client.embedBuilder(client, message, "Error", "You cannot purge more than 100 messages at once.", "RED")] });
  if (args[0] < 1) return message.channel.send({ embeds: [client.embedBuilder(client, message, "Error", "You need to delete at least 1 message.", "RED")] });

  message.channel.bulkDelete(args[0], true).then(messages => {
    message.channel.send({ embeds: [client.embedBuilder(client, message, "Purge", `${message.author} has purged ${args[0]} messages from channel.`)] });
  }).catch(() =>
    message.channel.send({ embeds: [client.embedBuilder(client, message, "Error", "Cannot remove messages older than 14 days.", "RED")] })
  )
}
