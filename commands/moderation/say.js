const { ApplicationCommandOptionType } = require("discord.js");

module.exports = {
  name: "say",
  category: "moderation",
  description: "Lets you speak as the bot and be a cool kid.",
  permissions: ["ADMINISTRATOR"],
  cooldown: 0,
  aliases: [`speak`],
  usage: "say <Message>",
  slash: true,
  options: [{
    name: "message",
    description: "Message to send",
    type: ApplicationCommandOptionType.String,
    required: true
  }]
};

module.exports.run = async (client, message, args) => {
  let say = args.slice(0).join(" ");

  if (!say)
    return message.channel.send({
      embeds: [
        client.utils.errorEmbed(
          client,
          message,
          "You need to provide text to send."
        ),
      ],
    });

  setTimeout(() => message.delete(), 3000);
  message.channel.send({ content: say });
};

module.exports.slashRun = async (client, interaction) => {
  setTimeout(() => message.delete(), 3000);
  message.channel.send({ content: interaction.options.getString("message") });
};
