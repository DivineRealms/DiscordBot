module.exports = {
  name: 'announce',
  category: 'moderation',
  description: 'Allows you to send an announcement on your behalf.',
  permissions: ["ADMINISTRATOR"],
  cooldown: 0,
  aliases: ['an', 'announcement'],
  usage: 'announce <Type> | <Mention> | <Title> | <Description> | <Field Title> | <Field Description> | ...'
}

module.exports.run = async(client, message, args) => {
  args = args.join(' ').split(/\s*\|\s*/);
  let [type, mention, title, description] = args;

  if (!type || !mention || !title || !description) return message.channel.send({embeds:[client.embedBuilder(client, message, "Error", "Invalid usage.", "error")]});

  let embed = client.embedBuilder(client, message, title, description.replace(/%n/g, "\n")).setFooter(`Announcement by ${message.author.tag}`, message.author.displayAvatarURL({size: 1024, dynamic: true}));
  
  args.splice(0,4);
  if (args.length % 2 !== 0) return message.channel.send({embeds:[client.embedBuilder(client, message, "Error", "Invalid number of arguments.", "error")]});
  
  const fields = [];
  for (let i = 0; i < args.length; i += 2) fields.push({title: args[i], description: args[i+1]});

  for (let i = 0; i < fields.length; i++) {
    embed.addField(fields[i].title, fields[i].description.replace(/%n/g, "\n"), false);
    if (!fields[i].title || !fields[i].description) return message.channel.send({embeds:[client.embedBuilder(client, message, "Error", "Invalid usage.", "error")]});
  }

  let up_aliases = ['update', 'up', '1'], mn_aliases = ['maintenance', 'main', '2'];

  if (up_aliases.includes(type)) embed.setColor("#7edd8a");
  else if (mn_aliases.includes(type)) embed.setColor("#ffae63");
  else embed;

  message.delete();
  message.channel.send({ embeds:[embed] });

  if (mention == "yes" || mention == "1") message.channel.send(`@everyone`).then((msg) => setTimeout(() => msg.delete(), 2000));
  else return;
}
