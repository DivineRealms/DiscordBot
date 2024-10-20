const { QuickDB } = require("quick.db");
const db = new QuickDB();

module.exports = {
  name: "fish",
  category: "economy",
  description: "Go fishing and get some tasty fish.",
  permissions: [],
  cooldown: 120,
  aliases: [],
  usage: "fish",
  slash: true,
};

module.exports.run = async (client, message, args) => {
  let fish = [
      "dory",
      "coho salmon",
      "lanternfish",
      "catfish",
      "shrimp",
      "stargazer",
      "clown fish",
      "cod",
      "tropical fish",
    ],
    amount = Math.floor(Math.random() * 200) + 1;

  message.channel.send({
    embeds: [
      client.embedBuilder(client, message, `You have caught a ${
          fish[Math.floor(Math.random() * fish.length)]
        } and earned $${amount}.`, "", "#3db39e"),
    ],
  });

  await db.add(`money_${message.guild.id}_${message.author.id}`, amount);
};

module.exports.slashRun = async (client, interaction) => {
  let fish = [
      "dory",
      "coho salmon",
      "lanternfish",
      "catfish",
      "shrimp",
      "stargazer",
      "clown fish",
      "cod",
      "tropical fish",
    ],
    amount = Math.floor(Math.random() * 200) + 1;

  interaction.reply({
    embeds: [
      client.embedBuilder(client, interaction, `You have caught a ${
          fish[Math.floor(Math.random() * fish.length)]
        } and earned $${amount}.`, "", "#3db39e"),
    ],
  });

  await db.add(`money_${interaction.guild.id}_${interaction.user.id}`, amount);
};
