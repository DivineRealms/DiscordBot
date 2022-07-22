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
  let snipe = client.snipes.get(message.channel.id),
    user = await client.users.cahce.get(snipe?.user);

  if (!snipe || !snipe.content)
    return message.channel.send({
      embeds: [
        client.utils.errorEmbed(client, message, "There's nothing to snipe."),
      ],
    });

  message.channel.send({
    embeds: [
      client
        .embedBuilder(
          client,
          message,
          "",
          `\`\`\`xl${snipe.content}\`\`\``,
          "#60b8ff"
        )
        .setAuthor({
          name: `Last deleted message was from: ${user.tag}`,
          iconURL: `https://cdn.upload.systems/uploads/6uDK0XAN.png`,
        }),
    ],
  });
};

module.exports.slashRUn = async (client, interaction) => {
  let snipe = client.snipes.get(interaction.channel.id),
    user = await client.users.fetch(snipe.user);

  if (!snipe || !snipe.content)
    return interaction.reply({
      embeds: [
        client.utils.errorEmbed(client, interaction, "There's nothing to snipe."),
      ],
    });

  interaction.reply({
    embeds: [
      client
        .embedBuilder(
          client,
          interaction,
          "",
          `\`\`\`xl${snipe.content}\`\`\``,
          "#60b8ff"
        )
        .setAuthor({
          name: `Last deleted message was from: ${user.tag}`,
          iconURL: `https://cdn.upload.systems/uploads/6uDK0XAN.png`,
        }),
    ],
  });
};
