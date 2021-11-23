module.exports = {
  name: 'slowmode',
  category: 'moderation',
  description: 'Sets the channel slowmode to the requested time.',
  permissions: ["MANAGE_CHANNELS"],
  cooldown: 0,
  aliases: [`smode`],
  usage: 'slowmode <Time>'
}

module.exports.run = async(client, message, args) => {
  if (isNaN(args[0])) return message.channel.send({ embeds: [new client.embed().setDescription(`You have entered invalid number of seconds`)]})

  message.channel.setRateLimitPerUser(args[0]);
  message.channel.send({ embeds: [client.embedBuilder(client, message, "Slowmode", `Slowmode for ${message.channel} have been changed to ${args[0]}s`)] });
}
