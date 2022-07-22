const figlet = require("figlet");
const { ApplicationCommandOptionType } = require("discord.js");

module.exports = {
  name: "ascii",
  category: "fun",
  description: "Lets you turn text into ascii art.",
  permissions: [],
  cooldown: 0,
  aliases: [`cooltext`],
  usage: "ascii <text>",
  slash: true,
  options: [{
    name: "text",
    description: "Text which you want",
    type: ApplicationCommandOptionType.String,
    required: true
  }]
};

module.exports.run = async (client, message, args) => {
  if (!args[0])
    return message.channel.send({
      embeds: [
        client.utils.errorEmbed(client, message, "Please provide some text."),
      ],
    });

  figlet.text(args.join(" "), (err, data) => {
    if (err) return;
    if (data.length > 2000)
      return message.channel.send({
        embeds: [
          client.utils.errorEmbed(client, message, "Max 2000 charachters."),
        ],
      });

    message.channel.send("```\n" + data + "```");
  });
};

module.exports.slashRun = async (client, interaction) => {
  const text = interaction.options.getString("text");

  figlet.text(text, (err, data) => {
    if (err) return;
    if (data.length > 2000)
      return interaction.reply({
        embeds: [
          client.utils.errorEmbed(client, interaction, "Max 2000 charachters."),
        ],
      });

    interaction.reply("```\n" + data + "```");
  });
};
