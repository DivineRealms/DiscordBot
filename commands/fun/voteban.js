const { ApplicationCommandOptionType } = require("discord.js");

module.exports = {
  name: "voteban",
  category: "fun",
  description: "Voteban user.",
  permissions: [],
  cooldown: 0,
  aliases: [],
  usage: "voteban",
  slash: true,
  options: [
    {
      name: "user",
      description: "User which to vote for ban",
      type: ApplicationCommandOptionType.User,
      required: true,
    },
  ],
};

module.exports.run = async (client, message, args) => {
  const user = message.mentions.users.first();
  const currentBans = client.voteBans.get(user.id) || {
    votes: 0,
    users: [],
  };
  
  if (
    user.id == message.author.id ||
    currentBans.users.includes(message.author.id)
  )
    return await message.channel.send({
      embeds: [
        client.utils.errorEmbed(client, message, `You have already voted to ban ${
            user.username
          } (${Number(currentBans.votes)}/6).`),
      ]
    });

  message.channel.send({
    embeds: [
      client.embedBuilder(client, message, `${message.author.username} has voted to ban ${
          user.username
        } (${Number(currentBans.votes) + 1}/6).`, "", "#f44336"),
    ],
  });

  currentBans.users.push(message.author.id)

  client.voteBans.set(user.id, {
    votes: Number(currentBans.votes) + 1,
    users: currentBans.users,
  });

  if (Number(currentBans.votes) + 1 == 6) {
    client.voteBans.delete(user.id);
    message.channel.send({
      embeds: [
        client.embedBuilder(client, message,
          `${user.username} got banned after reaching 6 votes!`,
          `People who voted: ||${currentBans.users
            .map((x) => `<@!${x}>`)
            .join(", ")
            .trim()}||`,
          "#f44336"
        ),
      ],
    });
  }
};

module.exports.slashRun = async (client, interaction) => {
  const user = interaction.options.getUser("user");
  const currentBans = client.voteBans.get(user.id) || {
    votes: 0,
    users: [],
  };

  if (
    user.id == interaction.user.id ||
    currentBans.users.includes(interaction.user.id)
  )
    return await interaction.reply({
      embeds: [
        client.utils.errorEmbed(client, interaction, `You have already voted to ban ${
            user.username
          } (${Number(currentBans.votes)}/6).`,),
      ], ephemeral: true
    });

  await interaction.reply({
    embeds: [
      client.embedBuilder(client, interaction, `${interaction.user.username} has voted to ban ${
          user.username
        } (${Number(currentBans.votes) + 1}/6).`, "", "#f44336"),
    ],
  });

  currentBans.users.push(interaction.user.id)

  client.voteBans.set(user.id, {
    votes: Number(currentBans.votes) + 1,
    users: currentBans.users,
  });

  if (Number(currentBans.votes) + 1 == 6) {
    client.voteBans.delete(user.id);
    await interaction.channel.send({
      embeds: [
        client.embedBuilder(client, interaction,
          `${user.username} got banned after reaching 6 votes!`,
          `People who voted: ||${currentBans.users
            .map((x) => `<@!${x}>`)
            .join(", ")
            .trim()}||`,
          "#f44336"
        ),
      ],
    });
  }
};
