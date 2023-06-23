const { ApplicationCommandOptionType } = require("discord.js");

module.exports = {
  name: "avatar",
  category: "fun",
  description: "Lets you view the requested avatar.",
  permissions: [],
  cooldown: 0,
  aliases: ["pfp", "av"],
  usage: "avatar <@User>",
  slash: true,
  options: [
    {
      name: "user",
      description: "User whose avatar to see",
      type: ApplicationCommandOptionType.User,
      required: false,
    },
  ],
};

module.exports.run = async (client, message, args) => {
  const user =
    message.mentions.users.first() ||
    client.users.cache.get(args[0]) ||
    message.author;

  message.channel.send({
    embeds: [
      client
        .embedBuilder(client, message, "", "", "#ec3d93")
        .setImage(user.displayAvatarURL({ dynamic: true, size: 4096 }))
        .setAuthor({
          name: `${user.tag}'s Avatar`,
          iconURL: `https://cdn.upload.systems/uploads/ZdKDK7Tx.png`,
        }),
    ],
  });
};

module.exports.slashRun = async (client, interaction) => {
  const user = interaction.options.getUser("user") || interaction.user;

  interaction.reply({
    embeds: [
      client
        .embedBuilder(client, interaction, "", "", "#ec3d93")
        .setImage(user.displayAvatarURL({ dynamic: true, size: 4096 }))
        .setAuthor({
          name: `${user.tag}'s Avatar`,
          iconURL: `https://cdn.upload.systems/uploads/ZdKDK7Tx.png`,
        }),
    ],
  });
};
