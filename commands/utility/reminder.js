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
          `I'll remind you for **\`${reason.join(
            " "
          )}\`** in ${client.utils.formatTime(parse(end))}.`
        )
        .setAuthor(
          "Reminder",
          `https://cdn.upload.systems/uploads/PX2kS3Kp.png`
        ),
    ],
  });

  setTimeout(() => {
    message
      .reply({
        embeds: [
          client
            .embedBuilder(client, message, "", `${reason.join(" ")}`)
            .setAuthor(
              "Reminder",
              `https://cdn.upload.systems/uploads/PX2kS3Kp.png`
            ),
        ],
      })
      .catch(() => {});
  }, parse(end));
};
