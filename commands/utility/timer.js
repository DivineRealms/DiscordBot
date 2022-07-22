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
  options: [{
    name: "time",
    description: "Time for timer",
    type: ApplicationCommandOptionType.String,
    required: true
  }]
};

module.exports.run = async (client, message, args) => {
  let errEmb = client.utils.errorEmbed(
    client,
    message,
    "Please provide a valid time."
  );

  if (!args[0]) return message.channel.send({ embeds: [errEmb] });
  if (isNaN(parse(args[0]))) return message.channel.send({ embeds: [errEmb] });

  const end = Date.now() + parse(args[0]);
  const msg = await message.reply({
    embeds: [
      client
        .embedBuilder(
          client,
          message,
          "",
          `<:ArrowRightGray:813815804768026705>Time: **${client.utils.formatTime(
            end - Date.now(),
            {
              round: true,
            }
          )}**.`,
          "#ffc13f"
        )
        .setAuthor({
          name: "Active Timer",
          iconURL:  `https://cdn.upload.systems/uploads/40vZa4wv.png`
        }),
    ],
  });

  const timer = setInterval(() => {
    const embed2 = client
      .embedBuilder(
        client,
        message,
        "",
        `<:ArrowRightGray:813815804768026705>Time: **${client.utils.formatTime(
          end - Date.now(),
          {
            round: true,
          }
        )}**.`,
        "#ffc13f"
      )
      .setAuthor({
        name: "Active Timer",
        iconURL: `https://cdn.upload.systems/uploads/40vZa4wv.png`
      });

    if (Date.now() > end) {
      const done = client
        .embedBuilder(client, message, "", "", "#ffc13f")
        .setAuthor({
          name: "Timer has ended!",
          iconURL: `https://cdn.upload.systems/uploads/40vZa4wv.png`
        });

      clearInterval(timer);
      return msg.edit({ embeds: [done] });
    } else msg.edit({ embeds: [embed2] });
  }, 5000);
};


module.exports.slashRun = async (client, interaction) => {
  const time = interaction.options.getString("time");
  let errEmb = client.utils.errorEmbed(
    client,
    interaction,
    "Please provide a valid time."
  );

  if (isNaN(parse(time))) return interaction.reply({ embeds: [errEmb] });

  const end = Date.now() + parse(time);
  const msg = await interaction.reply({
    embeds: [
      client
        .embedBuilder(
          client,
          interaction,
          "",
          `<:ArrowRightGray:813815804768026705>Time: **${client.utils.formatTime(
            end - Date.now(),
            {
              round: true,
            }
          )}**.`,
          "#ffc13f"
        )
        .setAuthor({
          name: "Active Timer",
          iconURL:  `https://cdn.upload.systems/uploads/40vZa4wv.png`
        }),
    ], fetchReply: true
  });

  const timer = setInterval(() => {
    const embed2 = client
      .embedBuilder(
        client,
        interaction,
        "",
        `<:ArrowRightGray:813815804768026705>Time: **${client.utils.formatTime(
          end - Date.now(),
          {
            round: true,
          }
        )}**.`,
        "#ffc13f"
      )
      .setAuthor({
        name: "Active Timer",
        iconURL: `https://cdn.upload.systems/uploads/40vZa4wv.png`
      });

    if (Date.now() > end) {
      const done = client
        .embedBuilder(client, interaction, "", "", "#ffc13f")
        .setAuthor({
          name: "Timer has ended!",
          iconURL: `https://cdn.upload.systems/uploads/40vZa4wv.png`
        });

      clearInterval(timer);
      return msg.edit({ embeds: [done] });
    } else msg.edit({ embeds: [embed2] });
  }, 5000);
};
