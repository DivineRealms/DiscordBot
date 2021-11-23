const db = require('quick.db');

module.exports = {
  name: 'suggest',
  category: 'utility',
  description: 'Lets you submit a suggestion.',
  permissions: [],
  cooldown: 0,
  aliases: [`sug`],
  usage: 'suggest <Suggestion>'
}

module.exports.run = async(client, message, args) => {
  let channel = client.channels.cache.get(client.conf.logging.Suggestion_Channel_Logs)

  if (!channel) return message.channel.send({ embeds: [new client.embedBuilder(client, message, "Error", "A suggestions channel hasn't been setup for this server!", "RED")]})
  if (!args[0]) return message.channel.send({ embeds: [new client.embedBuilder(client, message, "Error", "Please provide me a suggestion!", "RED")]});

  const embed = new client.embedBuilder(client, message, "Suggestion", `${args.join(' ')}`)

  message.delete()
  message.channel.send({ embeds: [client.embedBuilder(client, message, "Suggestion", "Your suggestion has been submitted successfully.")] });
  const msg = await channel.send({ embeds: [embed] })
  await msg.react(client.conf.settings.Emojis.Yes)
  await msg.react(client.conf.settings.Emojis.No)
  db.set(`suggestion_${msg.id}`, {
    user: message.author,
    suggestion: args.join(' ')
  });
}
