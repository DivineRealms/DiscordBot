const { ApplicationCommandOptionType } = require("discord.js");

module.exports = {
  name: "afk",
  category: "utility",
  description: "Sets your status to afk so people know.",
  permissions: [],
  cooldown: 0,
  aliases: [`brb`],
  usage: "afk <Reason>",
  slash: true,
  options: [
    {
      name: "reason",
      description: "AFK Reason",
      type: ApplicationCommandOptionType.String,
      required: false,
    },
  ],
};

module.exports.run = async (client, message, args) => {
  client.afk.set(message.author.id, {
    time: Date.now(),
    message: args.join(" ") || "AFK",
  });

  message.member
    .setNickname(
      `[AFK] ${message.member.displayName.replace(/(\[AFK\])/g, "")}`
    )
    .catch(() => {});

  message.channel.send({
    embeds: [
      client.embedBuilder(client, message, "", "", "#7bc2cc").setAuthor({
        name: `I have set your AFK status to ${
          args[0] ? args.join(" ") : "AFK"
        }`,
        iconURL: `https://cdn.upload.systems/uploads/Za4oLQsR.png`,
      }),
    ],
  });
};

module.exports.slashRun = async (client, interaction) => {
  client.afk.set(interaction.user.id, {
    time: Date.now(),
    message: interaction.options.getString("reason") || "AFK",
  });

  interaction.member
    .setNickname(
      `[AFK] ${interaction.member.displayName.replace(/(\[AFK\])/g, "")}`
    )
    .catch(() => {});

  interaction.reply({
    embeds: [
      client.embedBuilder(client, interaction, "", "", "#7bc2cc").setAuthor({
        name: `I have set your AFK status to ${
          interaction.options.getString("reason")
            ? interaction.options.getString("reason")
            : "AFK"
        }`,
        iconURL: `https://cdn.upload.systems/uploads/Za4oLQsR.png`,
      }),
    ],
  });
};
