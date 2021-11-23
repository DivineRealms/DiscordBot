const parse = require('ms');

module.exports = {
  name: 'reminder',
  category: 'utility',
  description: 'Lets you set a reminder.',
  permissions: [],
  cooldown: 0,
  aliases: [`remindme`],
  usage: 'reminder <Time> <Reason>'
}

module.exports.run = async(client, message, args) => {
  let [end, ...reason] = args

  if (!args[0] || isNaN(parse(end))) return message.channel.send({ embeds: [client.embedBuilder(client, message, "Error", "You need to provide time.", "RED")] });
  if (!reason[0]) return message.channel.send({ embeds: [client.embedBuilder(client, message, "Error", "You need to enter reminder reason.", "RED")] });

  const embed = client.embedBuilder(client, message, "Reminder!", `**Reminder**\n${reason.join(' ')}\n\n**Reminded At**\n${require('moment')().format('dddd, MMMM Do YYYY [at] h:mm A')}`)

  message.channel.send({ embeds: [client.embedBuilder(client, message, "Reminder", `I'll remind you for \`${reason.join(' ')}\` in ${client.utils.formatTime(parse(end))}.`)] })

  setTimeout(() => {
    message.channel.send({ content: `${message.author}`, embeds: [embed] }).catch(() => {})
  }, parse(end))
}