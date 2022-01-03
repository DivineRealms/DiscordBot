const db = require("quick.db");

module.exports = {
  name: "daily",
  category: "economy",
  description: "Claim that daily reward of yours.",
  permissions: [],
  cooldown: 0,
  aliases: [],
  usage: "daily",
};

module.exports.run = async (client, message, args) => {
  let cooldown = db.fetch(`daily_${message.guild.id}_${message.author.id}`),
    timeout = 86400000 - (Date.now() - cooldown),
    parsed = client.utils.formatTime(timeout);

  if (cooldown != null && timeout > 0)
    return message.channel.send({
      embeds: [
        client.utils.errorEmbed(
          client,
          message,
          `You're on cooldown, try again in ${parsed}.`
        ),
      ],
    });

  message.channel.send({
    embeds: [
      client
        .embedBuilder(client, message, "", "", "#3db39e")
        .setAuthor({
          name: "You have claimed your Daily Reward of $500.",
          iconURL: `https://cdn.upload.systems/uploads/6KOGFYJM.png`
        }),
    ],
  });

  db.add(`money_${message.guild.id}_${message.author.id}`, 500);
  db.set(`daily_${message.guild.id}_${message.author.id}`, Date.now());
};
