module.exports = {
  name: "snipe",
  category: "info",
  description: "Lets you see the last deleted message.",
  permissions: [],
  cooldown: 0,
  aliases: ["snip3"],
  usage: "snipe",
  slash: true
};

module.exports.run = async (client, message, args) => {
  let snipe = client.snipes.get(message.channel.id);

  if (!snipe || !snipe.content)
    return message.channel.send({
      embeds: [
        client.utils.errorEmbed(client, message, "There's nothing to snipe."),
      ],
    });

  let user = await message.guild.users.cache.get(snipe?.user)

  message.channel.send({
    embeds: [
      client
        .embedBuilder(
          client,
          message,
          "",
          `\`\`\`xl
${snipe.content}
\`\`\``,
          "#60b8ff"
        )
        .setAuthor({
          name: `Last deleted message was from: ${user.tag}`,
          iconURL: `https://cdn.upload.systems/uploads/6uDK0XAN.png`,
        }),
    ],
  });
};

module.exports.slashRun = async (client, interaction) => {
  let snipe = client.snipes.get(interaction.channel.id);

  if (!snipe || !snipe.content)
    return interaction.reply({
      embeds: [
        client.utils.errorEmbed(client, interaction, "There's nothing to snipe."),
      ],
    });

  const user = await message.guild.users.cache.get(snipe.user)

  interaction.reply({
    embeds: [
      client
        .embedBuilder(
          client,
          interaction,
          "",
          `\`\`\`xl
${snipe.content}
\`\`\``,
          "#60b8ff"
        )
        .setAuthor({
          name: `Last deleted message was from: ${user.tag}`,
          iconURL: `https://cdn.upload.systems/uploads/6uDK0XAN.png`,
        }),
    ],
  });
};
