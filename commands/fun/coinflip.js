module.exports = {
  name: "coinflip",
  category: "fun",
  description: "Cant decide? Flip a coin.",
  permissions: [],
  cooldown: 0,
  aliases: ["cf"],
  usage: "coinflip",
};

module.exports.run = async (client, message) =>
  message.channel.send({
    embeds: [
      client
        .embedBuilder(
          client,
          message,
          "",
          `Coin flipped by <@!${message.author.id}> and it landed on **${
            Math.random() > 0.5 ? "Heads" : "Tails"
          }**.`,
          "#ec3d93"
        )
        .setAuthor(
          "Coinflip",
          `https://cdn.upload.systems/uploads/ZdKDK7Tx.png`
        ),
    ],
  });
