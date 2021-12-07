const db = require("quick.db");

module.exports = {
  name: "rob",
  category: "economy",
  description: "Try to rob that one dood you want.",
  permissions: [],
  cooldown: 120,
  aliases: ["r0b"],
  usage: "rob <@User>",
};

module.exports.run = async (client, message, args) => {
  const member =
    message.mentions.members.first() ||
    message.guild.members.cache.get(args[0]);

  if (!member)
    return message.channel.send({
      embeds: [
        client.utils.errorEmbed(client, message, "You need to provide a user."),
      ],
    });

  if (member.id === message.author.id)
    return message.channel.send({
      embeds: [
        client.utils.errorEmbed(client, message, "You cannot rob yourself."),
      ],
    });

  const memberbal = db.fetch(`money_${message.guild.id}_${member.id}`),
    rob = ~~(Math.random() * 3),
    amount = ~~(memberbal / 10);

  if (!memberbal || memberbal < 200)
    return message.channel.send({
      embeds: [
        client.utils.errorEmbed(
          client,
          message,
          "That Member doesn't have money."
        ),
      ],
    });

  if (rob) {
    client.utils.errorEmbed(
      client,
      message,
      `You attempted to rob ${member.username} but got caught! The fine is **${amount}**.`
    );

    db.subtract(`money_${message.guild.id}_${message.author.id}`, amount);
  } else {
    client.utils.errorEmbed(
      client,
      message,
      `You successfully robbed ${member.username} gaining yourself **${amount}**.`
    );

    db.subtract(`money_${message.guild.id}_${message.author.id}`, amount);
    db.add(`money_${message.guild.id}_${message.author.id}`, amount);
  }
};
