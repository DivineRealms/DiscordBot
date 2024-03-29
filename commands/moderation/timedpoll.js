const ms = require("ms");

module.exports = {
  name: "timedpoll",
  category: "moderation",
  description: "Creates a timed poll.",
  permissions: ["ManageChannels"],
  cooldown: 0,
  aliases: ["tp"],
  usage: "timedpoll <time> <question> | op1 | op2 | etc",
};

module.exports.run = async (client, message, args, cmd) => {
  const options = args
      .slice(1)
      .join(" ")
      .split("|")
      .map((s) => s.trim().replace(/\s\s+/g, " ")),
    question = options.shift(),
    emoji = ["🇦", "🇧", "🇨", "🇩", "🇪", "🇫", "🇬", "🇭", "🇮", "🇯"],
    time = ms(args[0]),
    end = Date.now() + ms(args[0]);

  if (!options[1])
    return message.channel.send(
      `To create a poll, do \`${client.conf.Settings.Prefix}timedpoll <time> <question> | op1 | op2 | etc\`\nMinimum of 2 options are required`
    );
  if ([null, Infinity].includes(time))
    return message.channel.send(
      "To create a poll, enter a valid time. For example: `1d`"
    );

  await message.delete();
  const embed = client
    .embedBuilder(
      client,
      message,
      question,
      `Poll Created By ${message.author.username}`,
      ""
    )
    .setDescription(
      `${question}\n\n**__TIME REMAINING__** ${client.utils.formatTime(time, {
        conjunction: " and ",
        serialComma: false,
        round: true,
      })}`
    );

  for (let i = 0; i < options.length && i < 10; i++)
    embed.addFields({ name: "\u200b", value: `${emoji[i]} ${options[i]}` });

  const msg = await message.channel.send({ embeds: [embed] });
  for (let i = 0; i < options.length; i++) await msg.react(emoji[i]);

  const x = setInterval(() => {
    msg
      .edit({
        embeds: [
          embed.setDescription(
            `${question}\n\n**__TIME REMAINING__** ${client.utils.formatTime(
              end - Date.now(),
              { conjunction: " and ", serialComma: false, round: true }
            )}`
          ),
        ],
      })
      .catch(() => {});
    if (Date.now() > end) {
      msg
        .edit({
          embeds: [
            embed.setDescription(
              `${question}\n\n**__TIME REMAINING__** Times Up!`
            ),
          ],
        })
        .catch(() => {});
      message.channel.send({
        embeds: [
          client.embedBuilder(
            client,
            message,
            "Times Up!",
            `Poll created by ${message.author.username} has ended!`
          ),
        ],
      });
      clearInterval(x);
    }
  }, 5000);
};
