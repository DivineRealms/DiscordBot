module.exports = {
  name: 'announce',
  category: 'moderation',
  description: 'Allows you to send an announcement on your behalf.',
  permissions: ["ADMINISTRATOR"],
  cooldown: 0,
  aliases: [],
  usage: 'announce <Type> | <Mention> | <Title> | <Description> | <Size> | <Field1 Title> | <Field1 Description> | ...'
}

module.exports.run = async(client, message, args) => {
  let [type, mention, title, description, size, title1, description1, title2, description2, title3, description3, title4, description4] = args.join(' ').split(/\s*\|\s*/)

  if (!type) return message.channel.send({ embeds: [client.embedBuilder(client, message, "Error", "You need to provide a type.", "RED")] });
  if (!mention) return message.channel.send({ embeds: [client.embedBuilder(client, message, "Error", "You need to select `yes` or `no` for the mention.", "RED")] });
  if (!title) return message.channel.send({ embeds: [client.embedBuilder(client, message, "Error", "You need to provide a title.", "RED")] });
  if (!description) return message.channel.send({ embeds: [client.embedBuilder(client, message, "Error", "You need to provide the description.", "RED")] });
  if (!size) return message.channel.send({ embeds: [client.embedBuilder(client, message, "Error", "You need to provide the field amounts.", "RED")] });

  let embed = client.embedBuilder(client, message, title, description.replace(/%n/g, "\n")).setFooter(`Sent by ${message.author.tag}`, message.author.displayAvatarURL({size: 1024, dynamic: true}));

  if (size == "0") { 
    embed;
  } else if (size == "1") {
    embed.addField(title1, description1.replace(/%n/g, "\n"), false);
    if (!title1) return message.channel.send({ embeds: [client.embedBuilder(client, message, "Error", "You need to provide a second title.", "RED")] });
    if (!description1) return message.channel.send({ embeds: [client.embedBuilder(client, message, "Error", "You need to provide the second description.", "RED")] });
  } else if (size == "2") {
    embed.addField(title1, description1.replace(/%n/g, "\n"), false).addField(title2, description2.replace(/%n/g, "\n"), false);
    if (!title2) return message.channel.send({ embeds: [client.embedBuilder(client, message, "Error", "You need to provide a third title.", "RED")] });
    if (!description2) return message.channel.send({ embeds: [client.embedBuilder(client, message, "Error", "You need to provide the third description.", "RED")] });
  } else if (size == "3") {
    embed.addField(title1, description1.replace(/%n/g, "\n"), false).addField(title2, description2.replace(/%n/g, "\n"), false).addField(title2, description2.replace(/%n/g, "\n"), false);
    if (!title1) return message.channel.send({ embeds: [client.embedBuilder(client, message, "Error", "You need to provide the fourth title.", "RED")] });
    if (!description1) return message.channel.send({ embeds: [client.embedBuilder(client, message, "Error", "You need to provide the fourth description.", "RED")] });
  } else if (size == "4") {
    embed.addField(title1, description1.replace(/%n/g, "\n"), false).addField(title2, description2.replace(/%n/g, "\n"), false).addField(title3, description3.replace(/%n/g, "\n"), false).addField(title4, description4.replace(/%n/g, "\n"), false);
    if (!title2) return message.channel.send({ embeds: [client.embedBuilder(client, message, "Error", "You need to provide the fifth title.", "RED")] });
    if (!description2) return message.channel.send({ embeds: [client.embedBuilder(client, message, "Error", "You need to provide the fifth description.", "RED")] });
  } else if (size 

  let up_aliases = ['update', 'up', '0']
  let an_aliases = ['announcement', 'announce', 'an', '1']
  let mn_aliases = ['maintenance', 'main', '2']

  if (up_aliases.includes(type)) {
    embed.setColor("#7edd8a");
  } else if (an_aliases.includes(type)) {
    embed;
  } else if (mn_aliases.includes(type)) {
    embed.setColor("#ffae63");
  } else {
    message.channel.send({ embeds: [client.embedBuilder(client, message, "Error", "Invalid announcement.\nSelect one of the following: `update, announcement, maintenance`.", "RED")] });
    return;
  }

  message.delete();
  message.channel.send({ embeds: [embed] });

  if (mention == "yes") {
    message.channel.send(`@everyone`).then((msg) => setTimeout(() => msg.delete(), 2000));
  } else return;
}
