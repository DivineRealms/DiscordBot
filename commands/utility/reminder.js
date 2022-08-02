const parse = require("ms");
const { ApplicationCommandOptionType } = require("discord.js");

module.exports = {
  name: "reminder",
  category: "utility",
  description: "Lets you set a reminder.",
  permissions: [],
  cooldown: 0,
  aliases: [`remindme`],
  usage: "reminder <Time> <Reason>",
  slash: true,
  options: [
    {
      name: "time",
      description: "When to remind you",
      type: ApplicationCommandOptionType.String,
      required: true,
    },
    {
      name: "reason",
      description: "About what to remind you",
      type: ApplicationCommandOptionType.String,
      required: true,
    },
  ],
};

module.exports.run = async (client, message, args) => {
  let [end, ...reason] = args;

  if (!args[0] || isNaN(parse(end)))
    return message.channel.send({
      embeds: [
        client.utils.errorEmbed(client, message, "You need to provide time."),
      ],
    });

  if (!reason[0])
    return message.channel.send({
      embeds: [
        client.utils.errorEmbed(client, message, "You need to enter a reason."),
      ],
    });

  message.channel.send({
    embeds: [
      client
        .embedBuilder(
          client,
          message,
          "",
          `<:ArrowRightGray:813815804768026705>I'll remind you for **\`${reason.join(
            " "
          )}\`** in ${client.utils.formatTime(parse(end))}.`,
          "#f1d333"
        )
        .setAuthor({
          name: "Reminder",
          iconURL: `https://cdn.upload.systems/uploads/PX2kS3Kp.png`,
        }),
    ],
  });

  setTimeout(() => {
    message
      .reply({
        embeds: [
          client
            .embedBuilder(
              client,
              message,
              "",
              `<:ArrowRightGray:813815804768026705>${reason.join(" ")}.`,
              "#f1d333"
            )
            .setAuthor({
              name: "Reminder",
              iconURL: `https://cdn.upload.systems/uploads/PX2kS3Kp.png`,
            }),
        ],
      })
      .catch(() => {});
  }, parse(end));
};

module.exports.slashRun = async (client, interaction) => {
  const time = interaction.options.getString("time");
  const reason = interaction.options.getString("reason");

  if (isNaN(parse(time)))
    return interaction.reply({
      embeds: [
        client.utils.errorEmbed(
          client,
          interaction,
          "You need to provide time."
        ),
      ],
      ephemeral: true,
    });

  interaction.reply({
    embeds: [
      client
        .embedBuilder(
          client,
          interaction,
          "",
          `<:ArrowRightGray:813815804768026705>I'll remind you for **\`${reason}\`** in ${client.utils.formatTime(
            parse(time)
          )}.`,
          "#f1d333"
        )
        .setAuthor({
          name: "Reminder",
          iconURL: `https://cdn.upload.systems/uploads/PX2kS3Kp.png`,
        }),
    ],
  });

  setTimeout(() => {
    interaction.channel
      .send({
        content: interaction.user,
        embeds: [
          client
            .embedBuilder(
              client,
              message,
              "",
              `<:ArrowRightGray:813815804768026705>${reason.join(" ")}.`,
              "#f1d333"
            )
            .setAuthor({
              name: "Reminder",
              iconURL: `https://cdn.upload.systems/uploads/PX2kS3Kp.png`,
            }),
        ],
      })
      .catch(() => {});
  }, parse(time));
};
