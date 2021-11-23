module.exports = {
  name: 'deletemembers',
  category: 'owner',
  description: 'Deletes all the member data for the bot (PERMANENT)'
}

module.exports.run = (client, message, args) => {
  if (!client.conf.settings.BotOwnerDiscordID.includes(message.author.id)) return message.channel.send({ embeds: [client.embedBuilder(client, message, "Error", `You're not Owner`, "RED")] });
  client.members.deleteAll()
}