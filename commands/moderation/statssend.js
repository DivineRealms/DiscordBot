const {
  ApplicationCommandOptionType,
  ActionRowBuilder,
  ModalBuilder,
  TextInputBuilder,
  TextInputStyle,
} = require("discord.js");

module.exports = {
  name: "statssend",
  category: "moderation",
  description: "Allows you to send football league statistics.",
  permissions: [],
  cooldown: 0,
  aliases: ["statisticssend"],
  usage: "statssend <Title> | <Field Title> | <Field Description> | ...",
  slash: true,
  options: [
    {
      name: "title",
      description: "Title for League",
      type: ApplicationCommandOptionType.String,
      required: true,
    },
    {
      name: "league",
      description: "League Type",
      type: ApplicationCommandOptionType.String,
      choices: [
        {
          name: "Svebalkan",
          value: "svebalkan",
        },
        {
          name: "FCFA Challenge",
          value: "challenge",
        },
        {
          name: "FCFA Cup",
          value: "cup",
        },
      ],
      required: true,
    },
  ],
};

module.exports.run = async (client, message, args) => {};

module.exports.slashRun = async (client, interaction) => {
  const league = interaction.options.getString("league");
  const title = interaction.options.getString("title");

  const statisticsChannel = interaction.guild.channels.cache.get(
    client.conf.Settings.Football.Statistics_Channel
  );

  let fieldsInput = new ActionRowBuilder().addComponents(
    new TextInputBuilder()
      .setCustomId("stats_data")
      .setLabel("Statistics Fields")
      .setPlaceholder(
        "Fields for your Statistics, separate using |\nExample: <Field Title> | <Field Description> | ..."
      )
      .setRequired(false)
      .setStyle(TextInputStyle.Paragraph)
  );

  let statsModal = new ModalBuilder()
    .setTitle("Create Statistics")
    .setCustomId("stats_modal")
    .addComponents(fieldsInput);

  let embed = client
    .embedBuilder(client, interaction, "", "")
    .setFooter({
      text: `Statistics sent by ${interaction.user.tag}`,
      iconURL: interaction.user.displayAvatarURL({
        size: 1024,
        dynamic: true,
      }),
    })
    .setTimestamp();

  if (type == "svebalkan")
    embed
      .setColor("#096feb")
      .setAuthor({
        name: title,
        iconURL: `https://cdn.upload.systems/uploads/aKT2mjr0.png`,
      })
      .setThumbnail(`https://i.imgur.com/JAJ18E5.png?1`);
  else if (type == "challenge")
    embed
      .setColor("#00a100")
      .setAuthor({
        name: title,
        iconURL: `https://cdn.upload.systems/uploads/vRfWnVT5.png`,
      })
      .setThumbnail(`https://i.imgur.com/WOLpIf2.png?1`);
  else if (type == "cup")
    embed
      .setColor("#ef9f03")
      .setAuthor({
        name: title,
        iconURL: `https://cdn.upload.systems/uploads/KSTCcy4V.png`,
      })
      .setThumbnail(`https://i.imgur.com/fZBoubi.png`);

  interaction.showModal(statsModal);

  const filter = (i) =>
    i.customId == "stats_modal" && i.user.id == interaction.user.id;
  interaction
    .awaitModalSubmit({ filter, time: 300_300 })
    .then(async (md) => {
      let fieldsValue = md.fields.getTextInputValue("stats_data");
      fieldsValue = fieldsValue.split(/\s*\|\s*/);

      if (fieldsValue.length > 1) {
        if (fieldsValue.length % 2 !== 0)
          return md.reply({
            embeds: [
              client.utils.errorEmbed(
                client,
                interaction,
                "You are missing a title or a description."
              ),
            ],
            ephemeral: true,
          });

        const fields = [];
        for (let i = 0; i < fieldsValue.length; i += 2)
          fields.push({
            title: fieldsValue[i],
            description: fieldsValue[i + 1],
          });

        for (let i = 0; i < fields.length && fields.length <= 25; i++) {
          embed.addFields({
            name: fields[i].title,
            value: fields[i].description,
          });
          if (!fields[i].title || !fields[i].description)
            return md.followUp({
              embeds: [
                client.utils.errorEmbed(
                  client,
                  interaction,
                  "You need to provide both a title and a description."
                ),
              ],
              ephemeral: true,
            });
        }

        md.reply({
          embeds: [
            client
              .embedBuilder(client, interaction, "", "", "#3db39e")
              .setAuthor({
                name: `Statistics have been sent!`,
                iconURL: `https://cdn.upload.systems/uploads/6KOGFYJM.png`,
              }),
          ],
          ephemeral: true,
        });

        statisticsChannel.send({ embeds: [embed] });
      } else {
        md.reply({
          embeds: [
            client
              .embedBuilder(client, interaction, "", "", "#3db39e")
              .setAuthor({
                name: `Statistics have been sent!`,
                iconURL: `https://cdn.upload.systems/uploads/6KOGFYJM.png`,
              }),
          ],
          ephemeral: true,
        });

        statisticsChannel.send({ embeds: [embed] });
      }
    })
    .catch((err) => {
      console.log(err);
      interaction.followUp({
        embeds: [
          client.utils.errorEmbed(
            client,
            interaction,
            "Time for entering statistics fields has passed without answer."
          ),
        ],
        ephemeral: true,
      });
    });
};
