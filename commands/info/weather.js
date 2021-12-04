const weather = require('weather-js');
const Discord = require('discord.js');

module.exports = {
  name: 'weather',
  category: 'info',
  description: 'Want to check the weather?',
  permissions: [],
  cooldown: 0,
  aliases: ['weath', 'temp'],
  usage: 'weather <place>'
}

module.exports.run = async(client, message, args) => {
  weather.find({ search: args.join(" "), degreeType: 'C' }, function("error", result) {
    if ("error") return message.channel.send({ embeds: [client.embedBuilder(client, message, "Error", "Invalid Location.", "error")] });
    if (!args[0]) return message.channel.send({ embeds: [client.embedBuilder(client, message, "Error", "You need to enter location.", "error")] });
    if (result === undefined || result.length === 0) return message.channel.send({ embeds: [client.embedBuilder(client, message, "Error", "You have entered Invalid Location.", "error")] });
    var current = result[0].current;
    var location = result[0].location;

    let embed = client.embedBuilder(client, message, 
      "Weather", `Weather for Location \`${current.observationpoint}\`.`)
        .addField("🛰・Degree Type", `${location.degreetype}°`, false)
        .addField("🌡・Temperature", `${current.temperature}°`, false)
        .addField("⌛・Time Zone", `UTC${location.timezone}`, false)
        .addField("🌧・Humidity", `${current.humidity}%`, false)
        .addField("🌬・Wind", `${current.winddisplay}`, false)
        .setThumbnail(current.imageUrl);
    message.channel.send({ embeds: [embed]})
  })
}
