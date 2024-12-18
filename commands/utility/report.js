const {
  ApplicationCommandOptionType,
  ModalBuilder,
  ActionRowBuilder,
  TextInputBuilder,
  TextInputStyle,
} = require("discord.js");

module.exports = {
  name: "report",
  category: "utility",
  description: "Lets you submit a report.",
  permissions: [],
  cooldown: 0,
  aliases: [`rep`],
  usage: "report <@User> <Report>",
  slash: true,
  options: [
    {
      name: "user",
      description: "User you want to report",
      type: ApplicationCommandOptionType.User,
      required: true,
    },
  ],
};

module.exports.run = async (client, message, args) => {
  let logChannel = client.channels.cache.get(client.conf.Logging.Reports);

  let user =
    message.mentions.members.first() || client.users.cache.get(args[0]);

  if (!logChannel)
    return message.channel.send({
      embeds: [
        client.utils.errorEmbed(client, message, "A report channel hasn't been setup for this server!"),
      ],
    });

  if (args.length < 2)
    return message.channel.send({
      embeds: [
        client.utils.errorEmbed(client, message, "Please provide a report."),
      ],
    });

  setTimeout(() => message.delete(), 1000);

  message.channel
    .send({
      embeds: [
        client.embedBuilder(client, message, "Your report was submitted!", "", "#3db39e"),
      ],
    })
    .then((msg) => setTimeout(() => msg.delete(), 3000));

  let embed = client
    .embedBuilder(client, message, "New Report", "")
    .addFields({
      name: "Submitter:",
      value: `${message.author}`,
      inline: false,
    })
    .addFields({
      name: "Timestamp:",
      value: `<t:${Math.round(Date.now() / 1000)}:R>`,
      inline: false,
    })
    .setThumbnail(
      message.author.displayAvatarURL({ size: 1024, dynamic: true })
    );

  if (user) {
    embed
      .addFields({ name: "Reported:", value: `${user}`, inline: false })
      .addFields({
        name: "Reason:",
        value: `**\`${args.slice(1).join(" ")}\`**`,
        inline: false,
      });

    logChannel.send({ embeds: [embed] });
  } else {
    logChannel.send({
      embeds: [
        embed.addFields({
          name: "Report reason:",
          value: `**\`${args.join(" ")}\`**`,
          inline: false,
        }),
      ],
    });
  }
};

module.exports.slashRun = async (client, interaction) => {
  let logChannel = client.channels.cache.get(client.conf.Logging.Reports);

  let user = interaction.options.getUser("user");

  if (!logChannel)
    return interaction.reply({
      embeds: [
        client.utils.errorEmbed(client, interaction, "A report channel hasn't been setup for this server!"),
      ],
      ephemeral: true,
    });

  let reportInput = new ActionRowBuilder().addComponents(
    new TextInputBuilder()
      .setCustomId("report_text")
      .setLabel("Your Report")
      .setPlaceholder("Enter your report here")
      .setMinLength(3)
      .setRequired(true)
      .setStyle(TextInputStyle.Paragraph)
  );

  let suggModal = new ModalBuilder()
    .setTitle("Send Report")
    .setCustomId("report_modal")
    .addComponents(reportInput);

  interaction.showModal(suggModal);

  const filter = (i) =>
    i.customId == "report_modal" && i.user.id == interaction.user.id;
  interaction
    .awaitModalSubmit({ filter, time: 120_000 })
    .then(async (md) => {
      let reportValue = md.fields.getTextInputValue("report_text");

      md.reply({
        embeds: [
          client.embedBuilder(client, interaction, "Your report was submitted!", "", "#3db39e"),
        ],
      });

      let embed = client
        .embedBuilder(client, interaction, "New Report", "")
        .addFields({
          name: "Submitter:",
          value: `${interaction.user}`,
          inline: false,
        })
        .addFields({
          name: "Timestamp:",
          value: `<t:${Math.round(Date.now() / 1000)}:R>`,
          inline: false,
        })
        .setThumbnail(
          interaction.user.displayAvatarURL({ size: 1024, dynamic: true })
        );

      if (user) {
        embed
          .addFields({ name: "Reported:", value: `${user}`, inline: false })
          .addFields({
            name: "Reason:",
            value: `**\`${reportValue}\`**`,
            inline: false,
          });

        logChannel.send({ embeds: [embed] });
      } else {
        logChannel.send({
          embeds: [
            embed.addFields({
              name: "Report reason:",
              value: `**\`${reportValue}\`**`,
              inline: false,
            }),
          ],
        });
      }
    })
    .catch((err) => {
      interaction.followUp({
        embeds: [
          client.utils.errorEmbed(client, interaction, "Time for entering report has passed without answer."),
        ],
        ephemeral: true,
      });
    });
};
