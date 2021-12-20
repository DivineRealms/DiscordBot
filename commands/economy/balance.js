const db = require("quick.db");

module.exports = {
  name: "balance",
  category: "economy",
  description: "Check your balance on the server.",
  permissions: [],
  cooldown: 0,
  aliases: ["bal", "b"],
  usage: "balance [@User]",
};

module.exports.run = async (client, message, args) => {
  const user =
      message.mentions.users.first() ||
      client.users.cache.get(args[0]) ||
      message.author,
    bank = db.fetch(`bank_${message.guild.id}_${user.id}`) || 0,
    balance = db.fetch(`money_${message.guild.id}_${user.id}`) || 0;

  if (!client.conf.Economy.Enabled)
    return message.channel.send({
      embeds: [
        client.utils.errorEmbed(client, message, "Economy is not enabled."),
      ],
    });

  message.channel.send({
    embeds: [
      client
        .embedBuilder(
          client,
          message,
          "",
          `<:ArrowRightGray:813815804768026705> Bank: **$${bank}**
<:ArrowRightGray:813815804768026705> Balance: **$${balance}**
<:ArrowRightGray:813815804768026705> Total: **$${balance + bank}**`,
          "#47a047"
        )
        .setAuthor(
          user.username + "'s Balance",
          `https://cdn.upload.systems/uploads/LrdB6F1N.png`
        ),
    ],
  });
};
