module.exports = {
  name: "bubblewrap",
  category: "fun",
  description: "Feeling stressed? Go ahead pop some bubblewrap.",
  permissions: [],
  cooldown: 0,
  aliases: ["bubbles", "bw"],
  usage: "bubblewrap",
  slash: true,
};

module.exports.run = async (client, message, args) =>
  message.channel.send(
    `Here is some of the finest bubblewrap, enjoy popping!\n\n${`${"||pop||".repeat(
      10
    )}\n`.repeat(15)}`
  );

module.exports.slashRun = async (client, interaction) =>
  interaction.reply({
    content: `Here is some of the finest bubblewrap, enjoy popping!\n\n${`${"||pop||".repeat(
      10
    )}\n`.repeat(15)}`,
  });
