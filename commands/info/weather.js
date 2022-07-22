const weather = require("weather-js");
const { ApplicationCommandOptionType } = require("discord.js");

module.exports = {
  name: "weather",
  category: "info",
  description: "Want to check the weather?",
  permissions: [],
  cooldown: 0,
  aliases: ["weath", "temp"],
  usage: "weather <place>",
  slash: true,
  options: [{
    name: "place",
    description: "Place which weather to see",
    type: ApplicationCommandOptionType.String,
    required: true
  }]
};

module.exports.run = async (client, message, args) => {
  weather.find(
    { search: args.join(" "), degreeType: "C" },
    function (error, result) {
      if (error)
        return message.channel.send({
          embeds: [
            client.utils.errorEmbed(client, message, "Invalid Location."),
          ],
        });

      if (!args[0])
        return message.channel.send({
          embeds: [
            client.utils.errorEmbed(
              client,
              message,
              "You need to enter a location."
            ),
          ],
        });

      if (result === undefined || result.length === 0)
        return message.channel.send({
          embeds: [
            client.utils.errorEmbed(
              client,
              message,
              "You have entered an Invalid Location."
            ),
          ],
        });

      var current = result[0].current,
        location = result[0].location;

      message.channel.send({
        embeds: [
          client
            .embedBuilder(
              client,
              message,
              "",
              `<:ArrowRightGray:813815804768026705>Temperature: **${current.temperature}°${location.degreetype}**
<:ArrowRightGray:813815804768026705>Timezone: **UTC${location.timezone}**
<:ArrowRightGray:813815804768026705>Humidity: **${current.humidity}%**
<:ArrowRightGray:813815804768026705>Wind: **${current.winddisplay}**`,
              "#60b8ff"
            )
            .setAuthor({
              name: `Weather in ${current.observationpoint}`,
              iconURL: `https://cdn.upload.systems/uploads/6uDK0XAN.png`,
            })
            .setThumbnail(current.imageUrl),
        ],
      });
    }
  );
};

module.exports.slashRun = async (client, interaction) => {
  weather.find(
    { search: interaction.options.getString("place"), degreeType: "C" },
    function (error, result) {
      if (error)
        return interaction.reply({
          embeds: [
            client.utils.errorEmbed(client, interaction, "Invalid Location."),
          ],
        });

      if (result === undefined || result.length === 0)
        return interaction.reply({
          embeds: [
            client.utils.errorEmbed(
              client,
              interaction,
              "You have entered an Invalid Location."
            ),
          ],
        });

      var current = result[0].current,
        location = result[0].location;

      interaction.reply({
        embeds: [
          client
            .embedBuilder(
              client,
              interaction,
              "",
              `<:ArrowRightGray:813815804768026705>Temperature: **${current.temperature}°${location.degreetype}**
<:ArrowRightGray:813815804768026705>Timezone: **UTC${location.timezone}**
<:ArrowRightGray:813815804768026705>Humidity: **${current.humidity}%**
<:ArrowRightGray:813815804768026705>Wind: **${current.winddisplay}**`,
              "#60b8ff"
            )
            .setAuthor({
              name: `Weather in ${current.observationpoint}`,
              iconURL: `https://cdn.upload.systems/uploads/6uDK0XAN.png`,
            })
            .setThumbnail(current.imageUrl),
        ],
      });
    }
  );
};
