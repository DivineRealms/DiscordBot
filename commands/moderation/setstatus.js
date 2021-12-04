module.exports = {
  name: 'setstatus',
  category: 'moderation',
  description: 'Allows you to set the bots status.',
  permissions: ["ADMINISTRATOR"],
  cooldown: 0,
  aliases: [],
  usage: 'setstatus <TEXT>'
}
module.exports.run = async(client, message, args) => {
  const status = args.join(' ');
  if (!status) return message.channel.send({ embeds: [client.embedBuilder(client, message, "Error", `You need to provide Custom Status.`, error)] });

  const embed = client.embedBuilder(client, message, "Bot Status", `Status has been changed to \`${status}\``)

  message.channel.send({ embeds: [embed] });

  client.user.setActivity(status);
}