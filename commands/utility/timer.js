const { ApplicationCommandOptionType } = require("discord.js");
const parse = require("ms");

module.exports = {
  name: "timer",
  category: "utility",
  description: "Lets you set a timer.",
  permissions: [],
  cooldown: 0,
  aliases: [`time`],
  usage: "timer <Time>",
  slash: true,
  options: [
    {
      name: "time",
      description: "Time for timer",
      type: ApplicationCommandOptionType.String,
      required: true,
    },
  ],
};

module.exports.run = async (client, message, args) => {
  let errEmb = client.utils.errorEmbed(client, message, "Please provide a valid time.");

  if (!args[0]) return message.channel.send({ embeds: [errEmb] });
  if (isNaN(parse(args[0]))) return message.channel.send({ embeds: [errEmb] });

  const end = Date.now() + parse(args[0]);
  const msg = await message.reply({
    embeds: [
      client
        .embedBuilder(
          client,
          message,
          "Active Timer",
          `<:ArrowRightGray:813815804768026705>Time: **${client.utils.formatTime(
            end - Date.now(),
            {
              round: true,
            }
          )}**.`,
          "#ffc13f"
        ),
    ],
  });

  const timer = setInterval(() => {
    const embed2 = client
      .embedBuilder(
        client,
        message,
        "Active Timer",
        `<:ArrowRightGray:813815804768026705>Time: **${client.utils.formatTime(
          end - Date.now(),
          {
            round: true,
          }
        )}**.`,
        "#ffc13f"
      );

    if (Date.now() > end) {
      const done = client.embedBuilder(client, message, "Timer has ended!", "", "#ffc13f");

      clearInterval(timer);
      return msg.edit({ embeds: [done] });
    } else msg.edit({ embeds: [embed2] });
  }, 5000);
};

module.exports.slashRun = async (client, interaction) => {
  const time = interaction.options.getString("time");
  let errEmb = client.utils.errorEmbed(client, interaction, "Please provide a valid time.");

  if (isNaN(parse(time)))
    return interaction.reply({ embeds: [errEmb], ephemeral: true });

  const end = Date.now() + parse(time);
  const msg = await interaction.reply({
    embeds: [
      client
        .embedBuilder(
          client,
          interaction,
          "Active Timer",
          `<:ArrowRightGray:813815804768026705>Time: **${client.utils.formatTime(
            end - Date.now(),
            {
              round: true,
            }
          )}**.`,
          "#ffc13f"
        ),
    ],
    fetchReply: true,
  });

  const timer = setInterval(() => {
    const embed2 = client
      .embedBuilder(
        client,
        interaction,
        "Active Timer",
        `<:ArrowRightGray:813815804768026705>Time: **${client.utils.formatTime(
          end - Date.now(),
          {
            round: true,
          }
        )}**.`,
        "#ffc13f"
      );

    if (Date.now() > end) {
      const done = client.embedBuilder(client, interaction, "Timer has ended!", "", "#ffc13f");

      clearInterval(timer);
      return msg.edit({ embeds: [done] });
    } else msg.edit({ embeds: [embed2] });
  }, 5000);
};
