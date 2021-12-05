const weather = require("weather-js");

module.exports = {
  name: "weather",
  category: "info",
  description: "Want to check the weather?",
  permissions: [],
  cooldown: 0,
  aliases: ["weath", "temp"],
  usage: "weather <place>",
};

module.exports.run = async (client, message, args) => {
  weather.find(
    { search: args.join(" "), degreeType: "C" },
    function (error, result) {
      if (error)
        return message.channel.send({
          embeds: [
            client.embedBuilder(
              client,
              message,
              "Error",
              "Invalid Location.",
              "error"
            ),
          ],
        });
      if (!args[0])
        return message.channel.send({
          embeds: [
            client.embedBuilder(
              client,
              message,
              "Error",
              "You need to enter location.",
              "error"
            ),
          ],
        });
      if (result === undefined || result.length === 0)
        return message.channel.send({
          embeds: [
            client.embedBuilder(
              client,
              message,
              "Error",
              "You have entered Invalid Location.",
              "error"
            ),
          ],
        });
      var current = result[0].current;
      var location = result[0].location;

      let embed = client
        .embedBuilder(
          client,
          message,
          "",
          `<:ArrowRightGray:813815804768026705>Deegre Type: **${location.degreeType}**
<:ArrowRightGray:813815804768026705>Temperature: **${current.temperature}**
<:ArrowRightGray:813815804768026705>Timezone: **UTC${location.timezone}**
<:ArrowRightGray:813815804768026705>Humidity: **${current.humidity}%**
<:ArrowRightGray:813815804768026705>Wind: **${current.winddisplay}**
`
        )
        .setAuthor(`Weather in ${current.observationpoint}`, current.imageUrl);
      message.channel.send({ embeds: [embed] });
    }
  );
};
