module.exports = {
  name: "announce",
  category: "moderation",
  description: "Allows you to send an announcement on your behalf.",
  permissions: ["Administrator"],
  cooldown: 0,
  aliases: ["an", "announcement"],
  usage:
    "announce <Type> | <Mention> | <Title> | <Description> | <Field Title> | <Field Description> | ...",
};

module.exports.run = async (client, message, args) => {
  args = args.join(" ").split(/\s*\|\s*/);
  const [type, mention, title, description] = args;

  if (args.length < 3)
    return message.channel.send({
      embeds: [
        client.utils.errorEmbed(
          client,
          message,
          `Invalid usage; see ${message.px}help announce for correct usage.`
        ),
      ],
    });

  let embed = client
    .embedBuilder(client, message, "", description)
    .setFooter({
      text: `Announcement by ${message.author.tag}`,
      iconURL: message.author.displayAvatarURL({ size: 1024, dynamic: true }),
    })
    .setTimestamp();

  args.splice(0, 4);
  if (args.length % 2 !== 0)
    return message.channel.send({
      embeds: [
        client.utils.errorEmbed(
          client,
          message,
          "You are missing a title or a description."
        ),
      ],
    });

  const fields = [];
  for (let i = 0; i < args.length; i += 2)
    fields.push({ title: args[i], description: args[i + 1] });

  for (let i = 0; i < fields.length && fields.length <= 25; i++) {
    embed.addFields({ name: fields[i].title, value: fields[i].description });
    if (!fields[i].title || !fields[i].description)
      return message.channel.send({
        embeds: [
          client.utils.errorEmbed(
            client,
            message,
            "You need to provide both a title and a description."
          ),
        ],
      });
  }

  let upAliases = ["update", "up", "1"],
    mnAliases = ["maintenance", "main", "2"],
    suAliases = ["survey", "3"],
    mentionAnswer = ["yes", "1"];

  if (upAliases.includes(type))
    embed
      .setColor("#7edd8a")
      .setAuthor({
        name: title,
        iconURL: `https://cdn.upload.systems/uploads/aKT2mjr0.png`,
      });
  else if (mnAliases.includes(type))
    embed
      .setColor("#ffae63")
      .setAuthor({
        name: title,
        iconURL: `https://cdn.upload.systems/uploads/vRfWnVT5.png`,
      });
  else if (suAliases.includes(type))
    embed.setAuthor({
      name: title,
      iconURL: `https://cdn.upload.systems/uploads/KSTCcy4V.png`,
    });
  else
    embed.setAuthor({
      name: title,
      iconURL: `https://cdn.upload.systems/uploads/sYDS6yZI.png`,
    });

  message.channel.send({ embeds: [embed] });
  setTimeout(() => message.delete(), 3000);

  if (mentionAnswer.includes(mention))
    message.channel
      .send(`@everyone`)
      .then((msg) => setTimeout(() => msg.delete(), 3000));
  else return;
};
