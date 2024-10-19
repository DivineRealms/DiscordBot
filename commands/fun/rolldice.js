module.exports = {
  name: "rolldice",
  category: "fun",
  description: "Lets you roll a dice.",
  permissions: [],
  cooldown: 0,
  aliases: ["diceroll", "droll"],
  usage: "rolldice [lower-upper]",
};

module.exports.run = async (client, message, args) =>
  message.channel.send({
    embeds: [
      client.embedBuilder(client, message, "Dices rolled!",
          `<:ArrowRightGray:813815804768026705>First Dice: **\`${
            ~~(Math.random() * 6) + 1
          }\`**.
<:ArrowRightGray:813815804768026705>Second Dice: **\`${
            ~~(Math.random() * 6) + 1
          }\`**.`,
          "#ec3d93"
        ),
    ],
  });
