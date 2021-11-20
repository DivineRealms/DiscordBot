const weather = require('weather-js');

module.exports = {
    name: 'weather',
    category: 'info',
    description: 'Want to check the weather?',
    permissions: [],
    cooldown: 0,
    aliases: ['weath', 'temp'],
    usage: 'Weather <PLACE>'
}

module.exports.run = async(client, message, args) => {
    weather.find({ search: args.join(" "), degreeType: 'F' }, function(error, result) {
        if (error) return message.channel.send({ embeds: [error]});
        if (!args[0]) return message.channel.send({ embeds: [client.embedBuilder(client, message, "Error", "You need to enter location.", "RED")] });
        if (result === undefined || result.length === 0) return message.channel.send({ embeds: [client.embedBuilder(client, message, "Error", "You have entered Invalid Location.", "RED")] });
        var current = result[0].current;

        let embed = new Discord.MessageEmbed()
            .setAuthor("Weather", message.client.user.displayAvatarURL())
            .setDescription(`Weather for Location \`${current.observationpoint}\`.`)
            .addField("🛰・Degree Type", location.degreetype + "°", true)
            .addField("🌡・Temperature", current.temperature + "°", true)
            .addField("⌛・Time Zone", `UTC${location.timezone}`, true)
            .addField("🌧・Humidity", `${current.humidity}%`, true)
            .addField("🌬・Wind", current.winddisplay, true)
            .setColor("YELLOW")
            .setThumbnail(current.imageUrl);
        message.channel.send({ embeds: [embed]})
    })
}