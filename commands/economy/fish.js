const db = require("quick.db");

module.exports = {
  name: "fish",
  category: "economy",
  description: "Go fishing and get some tasty fish.",
  permissions: [],
  cooldown: 120,
  aliases: [],
  usage: "fish",
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
      client
        .embedBuilder(client, message, "", "", "#3db39e")
        .setAuthor(
          `You have caught a ${
            fish[Math.floor(Math.random() * fish.length)]
          } and earned $${amount}.`,
          `https://cdn.upload.systems/uploads/6KOGFYJM.png`
        ),
    ],
  });

  db.add(`money_${message.guild.id}_${message.author.id}`, amount);
};
