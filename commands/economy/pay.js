const db = require("quick.db");

module.exports = {
  name: "pay",
  category: "economy",
  description: "Give money to a user on the server.",
  permissions: [],
  cooldown: 0,
  aliases: ["gv"],
  usage: "pay [@User] <amount>",
};

module.exports.run = async (client, message, args) => {
  const user =
      message.mentions.users.first() || client.users.cache.get(args[0]),
    bal = db.fetch(`money_${message.guild.id}_${message.author.id}`);

  if (!client.conf.Economy.Enabled)
    return message.channel.send({
      embeds: [
        client.utils.errorEmbed(client, message, "Economy is not enabled."),
      ],
    });

  if (!user)
    return message.channel.send({
      embeds: [
        client.utils.errorEmbed(client, message, "You need to mention a user."),
      ],
    });

  if (isNaN(args[1]) || args[1] < 1 || args[1].includes("-"))
    return message.channel.send({
      embeds: [
        client.utils.errorEmbed(
          client,
          message,
          "You have entered an invalid amount."
        ),
      ],
    });

  if (bal < args[1])
    return message.channel.send({
      embeds: [
        client.utils.errorEmbed(
          client,
          message,
          "You don't have enough money."
        ),
      ],
    });

  db.add(`money_${message.guild.id}_${user.id}`, Number(args[1]));
  db.subtract(
    `money_${message.guild.id}_${message.author.id}`,
    Number(args[1])
  );

  message.channel.send({
    embeds: [
      client
        .embedBuilder(client, message, "", "", "#3db39e")
        .setAuthor(
          `You have paid $${args[1]} to ${user.tag}.`,
          `https://cdn.upload.systems/uploads/6KOGFYJM.png`
        ),
    ],
  });
};
