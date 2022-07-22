const { ApplicationCommandOptionType } = require("discord.js");

module.exports = {
  name: "dm",
  category: "moderation",
  description: "I will dm someone for you.",
  permissions: ["ManageGuild"],
  cooldown: 0,
  aliases: [`direct-message`],
  usage: "dm <@User> <Text>",
  slash: true,
  options: [{
    name: "user",
    description: "User which to DM",
    type: ApplicationCommandOptionType.User,
    required: true
  }, {
    name: "message",
    description: "Message to send",
    type: ApplicationCommandOptionType.String,
    required: true
  }]
};

module.exports.run = async (client, message, args) => {
  const user =
    message.mentions.users.first() || message.guild.members.cache.get(args[0]);

  if (!user)
    return message.channel.send({
      embeds: [
        client.utils.errorEmbed(
          client,
          message,
          "You have provided an invalid user."
        ),
      ],
    });

  const text = args.slice(1).join(" ");

  if (!text)
    return message.channel.send({
      embeds: [
        client.utils.errorEmbed(
          client,
          message,
          "You need to provide text to send."
        ),
      ],
    });

  user.send({ content: text }).catch(() => {
    return message.channel.send({
      embeds: [
        client.utils.errorEmbed(client, message, "Their DMs are closed."),
      ],
    });
  });

  message.channel.send({
    embeds: [
      client
        .embedBuilder(client, message, "", "", "#3db39e")
        .setAuthor({
          name: `Successfully sent a DM to ${user.username}.`,
          iconURL: `https://cdn.upload.systems/uploads/6KOGFYJM.png`,
        }),
    ],
  });
};

module.exports.slashRun = async (client, interaction) => {
  const user = interaction.options.getUser("user");
  const text = interaction.options.getString("message");

  user.send({ content: text }).catch(() => {
    return interaction.reply({
      embeds: [
        client.utils.errorEmbed(client, interaction, "Their DMs are closed."),
      ],
    });
  });

  interaction.reply({
    embeds: [
      client
        .embedBuilder(client, interaction, "", "", "#3db39e")
        .setAuthor({
          name: `Successfully sent a DM to ${user.username}.`,
          iconURL: `https://cdn.upload.systems/uploads/6KOGFYJM.png`,
        }),
    ],
  });
};
