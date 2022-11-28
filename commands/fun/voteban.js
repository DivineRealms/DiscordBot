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
    users: []
  };
  if(user.id == message.author.id || currentBans.users.includes(message.author.id)) return;

  message.channel.send({
    content: `> ${message.author} je glasao da se ${user} banuje (${Number(currentBans.votes) + 1}/6)`
  });

  client.voteBans.set(user.id, { votes: Number(currentBans) + 1, users: currentBans.users.push(message.author.id) });

  if(Number(currentBans.votes) + 1 == 6)
    message.channel.send({
      content: `> Sa ukupno **6 glasova**, izglasano je da ${user} bude banovan sa servera!\n> Korisnici koji su glasali: ||${currentBans.users.map(x => `<@!${x}>`).join(", ").trim()}||`
    });
};

module.exports.slashRun = async (client, interaction) => {
  const user = interaction.options.getUser("user");
  const currentBans = client.voteBans.get(user.id) || {
    votes: 0,
    users: []
  };
  if(user.id == interaction.user.id || currentBans.users.includes(interaction.user.id)) return;

  await interaction.reply({
    content: `> ${interaction.user} je glasao da se ${user} banuje (${Number(currentBans.votes) + 1}/6)`
  });

  client.voteBans.set(user.id, { votes: Number(currentBans) + 1, users: currentBans.users.push(interaction.user.id) });

  if(Number(currentBans.votes) + 1 == 6)
    await interaction.channel.send({
      content: `> Sa ukupno **6 glasova**, izglasano je da ${user} bude banovan sa servera!\n> Korisnici koji su glasali: ||${currentBans.users.map(x => `<@!${x}>`).join(", ").trim()}||`
    });
};
