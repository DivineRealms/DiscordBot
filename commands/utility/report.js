module.exports = {
  name: 'report',
  category: 'utility',
  description: 'Lets you submit a report.',
  permissions: [],
  cooldown: 0,
  aliases: [`rep`],
  usage: 'report <Report>'
}

module.exports.run = async(client, message, args) => {
  let channel = client.channels.cache.get(client.conf.logging.Report_Channel_Logs)

  if (!channel) return message.channel.send({ embeds: [new client.embedBuilder(client, message, "Error", "A report channel hasn't been setup for this server!", "RED")]})
  if (!args[0]) return message.channel.send({ embeds: [new client.embedBuilder(client, message, "Error", "Please provide me a report!", "RED")]});

  const report = new client.embedBuilder(client, message, "New Report", "")
    .addField('Submitter', `${message.author}`)
    .addField('Report', `${args.join(' ')}`)
    .addField('Time', `${require('moment')().format('ddd, MMMM Do YYYY [at] hh:mm A')}`)

  message.delete()
  message.channel.send({ embeds: [new client.embedBuilder(client, message, "Report", `Your report for \`${args.join(' ')}\` was submitted!`)]})
  const msg = await channel.send({ embeds: [report] })
}