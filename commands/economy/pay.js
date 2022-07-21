const { QuickDB } = require("quick.db");
const db = new QuickDB();

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
    bal = await db.get(`money_${message.guild.id}_${message.author.id}`);

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

  await db.add(`money_${message.guild.id}_${user.id}`, Number(args[1]));
  await db.sub(
    `money_${message.guild.id}_${message.author.id}`,
    Number(args[1])
  );

  message.channel.send({
    embeds: [
      client.embedBuilder(client, message, "", "", "#3db39e").setAuthor({
        name: `You have paid $${args[1]} to ${user.tag}.`,
        iconURL: `https://cdn.upload.systems/uploads/6KOGFYJM.png`,
      }),
    ],
  });
};
