const { ApplicationCommandOptionType } = require("discord.js");

module.exports = {
  name: "setstatus",
  category: "moderation",
  description: "Allows you to set the bots status.",
  permissions: ["Administrator"],
  cooldown: 0,
  aliases: [],
  usage: "setstatus <TEXT>",
  slash: true,
  options: [
    {
      name: "text",
      description: "Text for Custom Status",
      type: ApplicationCommandOptionType.String,
      required: true,
    },
  ],
};

module.exports.run = async (client, message, args) => {
  const status = args.join(" ");

  if (!status)
    return message.channel.send({
      embeds: [
        client.utils.errorEmbed(client, message, `You need to provide Custom Status.`),
      ],
    });

  message.channel.send({
    embeds: [
      client.embedBuilder(client, message, `Status has been changed to ${status}.`, "", "#f44336"),
    ],
  });

  client.user.setActivity(status);
};

module.exports.slashRun = async (client, interaction) => {
  interaction.reply({
    embeds: [
      client.embedBuilder(client, interaction, `Status has been changed to ${interaction.options.getString(
          "text"
        )}.`, "#f44336"),
    ],
  });

  client.user.setActivity(interaction.options.getString("text"));
};
