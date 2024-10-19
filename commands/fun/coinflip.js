module.exports = {
  name: "coinflip",
  category: "fun",
  description: "Cant decide? Flip a coin.",
  permissions: [],
  cooldown: 0,
  aliases: ["cf"],
  usage: "coinflip",
  slash: true,
};

module.exports.run = async (client, message) =>
  message.channel.send({
    embeds: [
      client
        .embedBuilder(
          client,
          message,
          "Coinflip",
          `Coin flipped by <@!${message.author.id}> and it landed on **${
            Math.random() > 0.5 ? "Heads" : "Tails"
          }**.`,
          "#ec3d93"
        )
    ],
  });

module.exports.slashRun = async (client, interaction) =>
  interaction.reply({
    embeds: [
      client
        .embedBuilder(
          client,
          interaction,
          "Coinflip",
          `Coin flipped by <@!${interaction.user.id}> and it landed on **${
            Math.random() > 0.5 ? "Heads" : "Tails"
          }**.`,
          "#ec3d93"
        ),
    ],
  });
