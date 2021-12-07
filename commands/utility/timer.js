const parse = require("ms");

module.exports = {
  name: "timer",
  category: "utility",
  description: "Lets you set a timer.",
  permissions: [],
  cooldown: 0,
  aliases: [`time`],
  usage: "timer <Time>",
};

module.exports.run = async (client, message, args) => {
  if (isNaN(parse(args[0])))
    return message.channel.send({
      embeds: [
        client.utils.errorEmbed(
          client,
          message,
          "Please provide a valid time."
        ),
      ],
    });

  const end = Date.now() + parse(args[0]);

  const msg = await message.channel.send({
    embeds: [
      client.embedBuilder(
        client,
        message,
        "Active Timer",
        `⏰ Time: ${client.utils.formatTime(end - Date.now(), {
          round: true,
        })}`
      ),
    ],
  });

  const timer = setInterval(() => {
    const embed2 = client.embedBuilder(
      client,
      message,
      "Active Timer",
      `⏰ Time: ${client.utils.formatTime(end - Date.now(), {
        round: true,
      })}`
    );

    if (Date.now() > end) {
      const done = client.embedBuilder(
        client,
        message,
        "Timer has ended!",
        "",
        "GREEN"
      );
      
      clearInterval(timer);
      return msg.edit({ embeds: [done] });
    } else msg.edit({ embeds: [embed2] });
  }, 5000);
};
