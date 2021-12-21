const db = require("quick.db");

module.exports = {
  name: "work",
  category: "economy",
  description: "Check your balance on the server.",
  permissions: [],
  cooldown: 120,
  aliases: [],
  usage: "work",
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
      client
        .embedBuilder(client, message, "", "", "#3db39e")
        .setAuthor(
          `You have worked as ${
            jobs[Math.floor(Math.random() * jobs.length)]
          } and earned $${amount}.`,
          `https://cdn.upload.systems/uploads/6KOGFYJM.png`
        ),
    ],
  });

  db.add(`money_${message.guild.id}_${message.author.id}`, amount);
};
