const parse = require("ms");

module.exports = {
  name: "reminder",
  category: "utility",
  description: "Lets you set a reminder.",
  permissions: [],
  cooldown: 0,
  aliases: [`remindme`],
  usage: "reminder <Time> <Reason>",
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
          iconURL: `https://cdn.upload.systems/uploads/PX2kS3Kp.png`
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
              iconURL: `https://cdn.upload.systems/uploads/PX2kS3Kp.png`
            }),
        ],
      })
      .catch(() => {});
  }, parse(end));
};
