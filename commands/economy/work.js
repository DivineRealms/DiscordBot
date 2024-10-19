const { QuickDB } = require("quick.db");
const db = new QuickDB();

module.exports = {
  name: "work",
  category: "economy",
  description: "Earn money by working.",
  permissions: [],
  cooldown: 120,
  aliases: [],
  usage: "work",
  slash: true,
};

module.exports.run = async (client, message, args) => {
  let jobs = [
      "farmer",
      "programmer",
      "pilot",
      "bus driver",
      "mechanic",
      "doctor",
      "tv host",
    ],
    amount = Math.floor(Math.random() * 600) + 1;

  message.channel.send({
    embeds: [
      client.embedBuilder(client, message, `You have worked as ${
          jobs[Math.floor(Math.random() * jobs.length)]
        } and earned $${amount}.`, "", "#3db39e"),
    ],
  });

  await db.add(`money_${message.guild.id}_${message.author.id}`, amount);
};

module.exports.slashRun = async (client, interaction) => {
  let jobs = [
      "farmer",
      "programmer",
      "pilot",
      "bus driver",
      "mechanic",
      "doctor",
      "tv host",
    ],
    amount = Math.floor(Math.random() * 600) + 1;

  interaction.reply({
    embeds: [
      client.embedBuilder(client, interaction, `You have worked as ${
          jobs[Math.floor(Math.random() * jobs.length)]
        } and earned $${amount}.`, "", "#3db39e"),
    ],
  });

  await db.add(`money_${interaction.guild.id}_${interaction.user.id}`, amount);
};
