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
  permissions: ["ManageMessages"],
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
          name: "Svebalkan Superliga",
          value: "ssl",
        },
        {
          name: "FCFA Challenge",
          value: "challenge",
        },
        {
          name: "FCFA Cup",
          value: "cup",
        },
        {
          name: "World Cup",
          value: "worldcup",
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

  let scorersField = new ActionRowBuilder().addComponents(
    new TextInputBuilder()
      .setCustomId("scorers_stats")
      .setLabel("List of Goal Scorers")
      .setPlaceholder("Players which scored goal(s)")
      .setRequired(false)
      .setStyle(TextInputStyle.Paragraph)
  );

  let assistsField = new ActionRowBuilder().addComponents(
    new TextInputBuilder()
      .setCustomId("assists_stats")
      .setLabel("List of Assists")
      .setPlaceholder("Players who assisted")
      .setRequired(false)
      .setStyle(TextInputStyle.Paragraph)
  );

  let csField = new ActionRowBuilder().addComponents(
    new TextInputBuilder()
      .setCustomId("cs_stats")
      .setLabel("List of CleanSheets")
      .setPlaceholder("Players which did Clean Sheet")
      .setRequired(false)
      .setStyle(TextInputStyle.Paragraph)
  );

  let yellowCardField = new ActionRowBuilder().addComponents(
    new TextInputBuilder()
      .setCustomId("yellow_stats")
      .setLabel("List of Yellow Cards")
      .setPlaceholder("Players which got Yellow Card(s)")
      .setRequired(false)
      .setStyle(TextInputStyle.Paragraph)
  );

  let redCardField = new ActionRowBuilder().addComponents(
    new TextInputBuilder()
      .setCustomId("red_stats")
      .setLabel("List of Red Cards")
      .setPlaceholder("Players which got Red Card(s)")
      .setRequired(false)
      .setStyle(TextInputStyle.Paragraph)
  );

  let statsModal = new ModalBuilder()
    .setTitle("Send Statistics")
    .setCustomId("stats_modal")
    .addComponents([
      scorersField,
      assistsField,
      csField,
      yellowCardField,
      redCardField,
    ]);

  const statsFormat = (string) =>
    string
      .split("\n")
      .map((s, i) => {
        if (i == 0)
          s = `**${s.replace(
            /\s([0-9]{1,2}\s(gol(a|ova)|asistencij(a|e)|CS|(z|ž)ut(ih|i)|crven(ih|i)))/g,
            (a) => `<:ArrowRightGray:813815804768026705>${a.trim()}`
          )}**`;
        else
          s = s.replace(
            /\s([0-9]{1,2}\s(gol(a|ova)|asistencij(a|e)|CS|Clean Sheets|(z|ž)ut(ih|i)|crven(ih|i)))/g,
            (a) => `<:ArrowRightGray:813815804768026705>**${a.trim()}**`
          );
        return `\`${medalEmojis[i]}\` ` + s;
      })
      .join("\n");

  await interaction.showModal(statsModal);
  const filter = (i) =>
    i.user.id == interaction.user.id && i.customId == "stats_modal";
  const medalEmojis = ["🥇", "🥈", "🥉"];
  await interaction
    .awaitModalSubmit({ filter, time: 600_000 })
    .then(async (i) => {
      let scorers = i.fields.getTextInputValue("scorers_stats");
      let assists = i.fields.getTextInputValue("assists_stats");
      let cs = i.fields.getTextInputValue("cs_stats");
      let yellow = i.fields.getTextInputValue("yellow_stats");
      let red = i.fields.getTextInputValue("red_stats");

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

      if (league == "svebalkan")
        embed.setColor("#096feb").setAuthor({
          name: title,
          iconURL: `https://i.imgur.com/JAJ18E5.png?1`,
        });
      else if (league == "ssl")
        embed.setColor("#4295fb").setAuthor({
          name: title,
          iconURL: `https://i.imgur.com/Mold4jE.png`,
        });
      else if (league == "challenge")
        embed.setColor("#00a100").setAuthor({
          name: title,
          iconURL: `https://i.imgur.com/WOLpIf2.png?1`,
        });
      else if (league == "cup")
        embed.setColor("#ef9f03").setAuthor({
          name: title,
          iconURL: `https://i.imgur.com/fZBoubi.png`,
        });
      else if (league == "worldcup")
        embed.setColor("#9b0415").setAuthor({
          name: title,
          iconURL: `https://i.imgur.com/nIf6zc3.png`,
        });

      if (scorers.length >= 6) {
        embed.addFields([
          {
            name: "Najbolji Strelci:",
            value: statsFormat(scorers),
          },
        ]);
      }
      if (assists.length >= 6) {
        embed.addFields([
          {
            name: "Najbolji Asisteni:",
            value: statsFormat(assists),
          },
        ]);
      }
      if (cs.length >= 6) {
        embed.addFields([
          {
            name: "Najviše Clean Sheet:",
            value: statsFormat(cs),
          },
        ]);
      }
      if (yellow.length >= 6) {
        embed.addFields([
          {
            name: "Najviše žutih kartona:",
            value: statsFormat(yellow),
          },
        ]);
      }
      if (red.length >= 6) {
        embed.addFields([
          {
            name: "Najviše crvenih kartona:",
            value: statsFormat(red),
          },
        ]);
      }

      i.reply({
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
    });
};
