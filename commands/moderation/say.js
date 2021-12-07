module.exports = {
  name: 'say',
  category: 'moderation',
  description: 'Lets you speak as the bot and be a cool kid.',
  permissions: ["ADMINISTRATOR"],
  cooldown: 0,
  aliases: [`speak`],
  usage: 'say <Message>'
}

module.exports.run = async(client, message, args) => {
  let say = args.slice(0).join(" ")
  if (!say) return message.channel.send({ embeds: [client.embedBuilder(client, message, "You need to provide text to send.", "", "error")] });
  message.delete()
  message.channel.send({ content: say })
}