module.exports = {
  name: 'restart',
  category: 'owner',
  description: 'Lets you restart the bot via discord.',
  permissions: [],
  cooldown: 0,
  aliases: ['bootup'],
  usage: 'restart'
}

module.exports.run = async(client, message, args) => {
  if (!client.conf.settings.BotOwnerDiscordID.includes(message.author.id)) return message.channel.send({ embeds: [client.embedBuilder(client, message, "Error", `You're not Owner`, "RED")] });
  let restarting = client.embedBuilder(client, message, "Restart", "Bot is restarting..");
  message.channel.send({ embeds: [restarting] })
  let restarted = client.embedBuilder(client, message, "Restart", "Bot has been restarted by " + message.author + ".");

  message.channel.send({ embeds: [restarted] }).then(() => {
    process.exit()
  })
}
