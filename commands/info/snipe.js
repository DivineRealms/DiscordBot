module.exports = {
  name: "snipe",
  category: "info",
  description: "Lets you see the last deleted message.",
  permissions: [],
  cooldown: 0,
  aliases: ["snip3"],
  usage: "snipe",
  slash: true,
};

module.exports.run = async (client, message, args) => {
  let snipe = client.snipes.get(message.channel.id);

  if (!snipe || !snipe.content)
    return message.channel.send({
      embeds: [
        client.utils.errorEmbed(client, message, "There's nothing to snipe."),
      ],
    });

  let user = await client.users.fetch(snipe.user);

  message.channel.send({
    embeds: [
      client
        .embedBuilder(
          client,
          message,
          `Last deleted message was from: ${user.username}`,
          `\`\`\`xl
${snipe.content}
\`\`\``,
          "#60b8ff"
        ),
    ],
  });
};

module.exports.slashRun = async (client, interaction) => {
  let snipe = client.snipes.get(interaction.channel.id);

  if (!snipe || !snipe.content)
    return interaction.reply({
      embeds: [
        client.utils.errorEmbed(
          client,
          interaction,
          "There's nothing to snipe."
        ),
      ],
      ephemeral: true,
    });

  let user = await client.users.fetch(snipe.user);

  interaction.reply({
    embeds: [
      client
        .embedBuilder(
          client,
          interaction,
          `Last deleted message was from: ${user.username}`,
          `\`\`\`xl
${snipe.content}
\`\`\``,
          "#60b8ff"
        ),
    ],
  });
};
