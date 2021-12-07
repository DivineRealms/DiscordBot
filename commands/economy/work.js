const db = require("quick.db");

module.exports = {
  name: "work",
  category: "economy",
  description: "Check your balance on the server.",
  permissions: [],
  cooldown: 120,
  aliases: ["bal"],
  usage: "balance [@User]",
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
    amount = Math.floor(Math.random() * 2500) + 1;

  message.channel.send({
    embeds: [
      client.embedBuilder(
        client,
        message,
        `You have worked as ${
          jobs[Math.floor(Math.random() * jobs.length)]
        } and earned $${amount}.`,
        "",
        "GREEN"
      ),
    ],
  });

  db.add(`money_${message.guild.id}_${message.author.id}`, amount);
};
