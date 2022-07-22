const { QuickDB } = require("quick.db");
const db = new QuickDB();

module.exports = {
  name: "work",
  category: "economy",
  description: "Check your balance on the server.",
  permissions: [],
  cooldown: 120,
  aliases: [],
  usage: "work",
  slash: true
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
      client.embedBuilder(client, message, "", "", "#3db39e").setAuthor({
        name: `You have worked as ${
          jobs[Math.floor(Math.random() * jobs.length)]
        } and earned $${amount}.`,
        iconURL: `https://cdn.upload.systems/uploads/6KOGFYJM.png`,
      }),
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
      client.embedBuilder(client, interaction, "", "", "#3db39e").setAuthor({
        name: `You have worked as ${
          jobs[Math.floor(Math.random() * jobs.length)]
        } and earned $${amount}.`,
        iconURL: `https://cdn.upload.systems/uploads/6KOGFYJM.png`,
      }),
    ],
  });

  await db.add(`money_${interaction.guild.id}_${interaction.user.id}`, amount);
};
