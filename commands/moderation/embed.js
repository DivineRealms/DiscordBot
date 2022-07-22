const { ApplicationCommandOptionType } = require("discord.js");

module.exports = {
  name: "embed",
  category: "moderation",
  description: "Allows you to put text into an embed.",
  permissions: ["ManageGuild"],
  cooldown: 0,
  aliases: [],
  usage: "embed <Title> | <Description>",
  slash: true,
  options: [{
    name: "title",
    description: "Title for Embed",
    type: ApplicationCommandOptionType.String,
    required: true
  }, {
    name: "description",
    description: "Description for Embed",
    type: ApplicationCommandOptionType.String,
    required: true
  }]
};

module.exports.run = async (client, message, args) => {
  let [title, description] = args.join(" ").split(/\s*\|\s*/);

  if (!title)
    return message.channel.send({
      embeds: [
        client.utils.errorEmbed(
          client,
          message,
          "You need to provide a title."
        ),
      ],
    });

  if (!description)
    return message.channel.send({
      embeds: [
        client.utils.errorEmbed(
          client,
          message,
          "You need to provide a description."
        ),
      ],
    });

  message.channel.send({
    embeds: [client.embedBuilder(client, message, title, description)],
  });
};

module.exports.slashRun = async (client, interaction) => {
  let [title, description] = interaction.options;

  interaction.reply({
    embeds: [client.embedBuilder(client, interaction, title, description)],
  });
};
