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
    return;

  message.channel.send({
    embeds: [
      client.embedBuilder(client, message, "", "", "#f44336").setAuthor({
        name: `${message.author.username} has voted to ban ${
          user.username
        } (${Number(currentBans.votes) + 1}/6).`,
        iconURL: `https://cdn.upload.systems/uploads/6Xdg16Gh.png`,
      }),
    ],
  });

  currentBans.users.push(message.author.id)

  client.voteBans.set(user.id, {
    votes: Number(currentBans.votes) + 1,
    users: currentBans.users,
  });

  if (Number(currentBans.votes) + 1 == 6)
    message.channel.send({
      embeds: [
        client.embedBuilder(client, message, "", "", "#f44336").setAuthor({
          name: `${
            user.username
          } got banned after reaching **6 votes**! \nPeople who voted: ||${currentBans.users
            .map((x) => `${x}`)
            .join(", ")
            .trim()}||`,
          iconURL: `https://cdn.upload.systems/uploads/6Xdg16Gh.png`,
        }),
      ],
    });
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
        client.embedBuilder(client, interaction, "", "", "Red").setAuthor({
          name: `You have already voted to ban ${
            user.username
          } (${Number(currentBans.votes)}/6).`,
          iconURL: `https://cdn.upload.systems/uploads/6Xdg16Gh.png`,
        }),
      ], ephemeral: true
    });

  await interaction.reply({
    embeds: [
      client.embedBuilder(client, interaction, "", "", "#f44336").setAuthor({
        name: `${interaction.user.username} has voted to ban ${
          user.username
        } (${Number(currentBans.votes) + 1}/6).`,
        iconURL: `https://cdn.upload.systems/uploads/6Xdg16Gh.png`,
      }),
    ],
  });

  currentBans.users.push(interaction.user.id)

  client.voteBans.set(user.id, {
    votes: Number(currentBans.votes) + 1,
    users: currentBans.users,
  });

  if (Number(currentBans.votes) + 1 == 6)
    await interaction.channel.send({
      embeds: [
        client.embedBuilder(client, interaction, "", "", "#f44336").setAuthor({
          name: `${
            user.username
          } got banned after reaching **6 votes**! \nPeople who voted: ||${currentBans.users
            .map((x) => `${x}`)
            .join(", ")
            .trim()}||`,
          iconURL: `https://cdn.upload.systems/uploads/6Xdg16Gh.png`,
        }),
      ],
    });
};
