const fetch = require("node-fetch");

module.exports = {
  name: "advice",
  category: "fun",
  description: "Gives you an advice.",
  permissions: [],
  cooldown: 0,
  aliases: [],
  usage: "advice",
  slash: true,
};

module.exports.run = async (client, message, args) => {
  const res = await fetch("http://api.adviceslip.com/advice").then((r) =>
    r.json()
  );

  message.channel.send({
    embeds: [
      client
        .embedBuilder(client, message, "Advice", res.slip.advice, "#ec3d93"),
    ],
  });
};

module.exports.slashRun = async (client, interaction) => {
  const res = await fetch("http://api.adviceslip.com/advice").then((r) =>
    r.json()
  );

  interaction.reply({
    embeds: [
      client
        .embedBuilder(client, interaction, "Advice", res.slip.advice, "#ec3d93"),
    ],
  });
};
