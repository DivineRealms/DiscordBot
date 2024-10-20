module.exports = {
  name: "emojis",
  category: "info",
  description: "Lets you view all the emojis in the guild.",
  permissions: [],
  cooldown: 0,
  aliases: ["emoji", "whatstheemojis"],
  usage: "emojis",
  slash: true,
};

module.exports.run = async (client, message, args) => {
  let TEHEMOJIS = "",
    AnimeOnesLolDisplaying = "",
    RegularEmojis = 0,
    AnimeOnesLol = 0,
    totalemojislol = 0;

  function Emoji(id) {
    return client.emojis.cache.get(id).toString();
  }

  message.guild.emojis.cache.forEach((emoji) => {
    totalemojislol++;

    if (emoji.animated) {
      AnimeOnesLol++;
      AnimeOnesLolDisplaying += Emoji(emoji.id);
    } else {
      RegularEmojis++;
      TEHEMOJIS += Emoji(emoji.id);
    }
  });

  message.channel.send({
    embeds: [
      client
        .embedBuilder(client, message, `Emojis in ${message.guild.name}`, "", "#60b8ff")
        .addFields([
          { name: `Regular Emojis:`, value: `${RegularEmojis}`, inline: false },
          { name: `Animated Emojis:`, value: `${AnimeOnesLol}`, inline: false },
          {
            name: `Emojis Displaying:`,
            value: `${AnimeOnesLolDisplaying} ${TEHEMOJIS}`,
            inline: false,
          },
          {
            name: `Total Count Of Emojis:`,
            value: `${totalemojislol}`,
            name: false,
          },
        ]),
    ],
  });
};

module.exports.slashRun = async (client, interaction) => {
  let TEHEMOJIS = "",
    AnimeOnesLolDisplaying = "",
    RegularEmojis = 0,
    AnimeOnesLol = 0,
    totalemojislol = 0;

  function Emoji(id) {
    return client.emojis.cache.get(id).toString();
  }

  interaction.guild.emojis.cache.forEach((emoji) => {
    totalemojislol++;

    if (emoji.animated) {
      AnimeOnesLol++;
      AnimeOnesLolDisplaying += Emoji(emoji.id);
    } else {
      RegularEmojis++;
      TEHEMOJIS += Emoji(emoji.id);
    }
  });

  interaction.reply({
    embeds: [
      client
        .embedBuilder(client, interaction, `Emojis in ${interaction.guild.name}`, "", "#60b8ff")
        .addFields([
          { name: `Regular Emojis:`, value: `${RegularEmojis}`, inline: false },
          { name: `Animated Emojis:`, value: `${AnimeOnesLol}`, inline: false },
          {
            name: `Emojis Displaying:`,
            value: `${AnimeOnesLolDisplaying} ${TEHEMOJIS}`,
            inline: false,
          },
          {
            name: `Total Count Of Emojis:`,
            value: `${totalemojislol}`,
            name: false,
          },
        ]),
    ],
  });
};
