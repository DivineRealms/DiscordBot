const fetch = require("node-fetch");

module.exports = {
  name: "advice",
  category: "fun",
  description: "Gives you an advice.",
  permissions: [],
  cooldown: 0,
  aliases: [],
  usage: "advice",
  slash: true
};

module.exports.run = async (client, message, args) => {
  const res = await fetch("http://api.adviceslip.com/advice").then((r) =>
    r.json()
  );

  message.channel.send({
    embeds: [
      client
        .embedBuilder(client, message, "", res.slip.advice, "#ec3d93")
        .setAuthor({
          name: "Advice",
          iconURL: `https://cdn.upload.systems/uploads/ZdKDK7Tx.png`,
        }),
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
        .embedBuilder(client, interaction, "", res.slip.advice, "#ec3d93")
        .setAuthor({
          name: "Advice",
          iconURL: `https://cdn.upload.systems/uploads/ZdKDK7Tx.png`,
        }),
    ],
  });
};
