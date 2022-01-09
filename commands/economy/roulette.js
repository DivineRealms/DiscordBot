const Discord = require("discord.js");
const db = require("quick.db");

module.exports = {
  name: "roulette",
  category: "economy",
  description: "Play roulette.",
  permissions: [],
  cooldown: 15,
  aliases: ["rt"],
  usage: "roulette [black(b), red(r), green(g)] [amount]",
};

module.exports.run = async (client, message, args) => {
  let color = args[0];
  let money = args[1];
  let balance = db.fetch(`money_${message.guild.id}_${message.author.id}`);

  if (!color)
    return message.channel.send({
      embeds: [
        client.utils.errorEmbed(
          client,
          message,
          `Invalid usage; see ${message.px}help roulette for correct usage.`
        ),
      ],
    });

  if (color.toLowerCase() == "b" || color.toLowerCase() == "black") color = 0;
  else if (color.toLowerCase() == "r" || color.toLowerCase() == "red")
    color = 1;
  else if (color.toLowerCase() == "g" || color.toLowerCase() == "green")
    color = 2;
  else
    return message.channel.send({
      embeds: [
        client.utils.errorEmbed(
          client,
          message,
          "Invalid color, available: black (b), red (r), green (g)."
        ),
      ],
    });

  if (!money || (isNaN(money) && money != "all") || args[1].includes("-"))
    return message.channel.send({
      embeds: [client.utils.errorEmbed(client, message, "Invalid amount.")],
    });

  if (money == "all") money = Number(balance);
  else money = Number(money);

  if (balance < money)
    return message.channel.send({
      embeds: [
        client.utils.errorEmbed(
          client,
          message,
          "You don't have enough money."
        ),
      ],
    });

  if (money < 100 || money > 20000)
    return message.channel.send({
      embeds: [
        client.utils.errorEmbed(
          client,
          message,
          "Amount needs to be between $100-20.000."
        ),
      ],
    });

  let randomNumber = Math.floor(Math.random() * 37);

  if (randomNumber == 0 && color == 2) {
    let oldMoney = money;
    money *= 15;
    db.add(`money_${message.guild.id}_${message.author.id}`, money);
    message.channel.send({
      embeds: [
        client
          .embedBuilder(client, message, "", "", "#3db39e")
          .addField(
            "Options",
            `Color: **\`Green\`**\nAmount: **\`$${oldMoney}\`**\nMultiplier: **\`15x\`**`,
            true
          )
          .addField(
            "Result:",
            `Number: **\`${randomNumber}\`**\nReward: **\`$${money}\`**`,
            true
          )
          .setAuthor({
            name: "Roulette",
            iconURL: `https://cdn.upload.systems/uploads/HJGA3pxp.png`,
          }),
      ],
    });
  } else if (isOdd(randomNumber) && color == 1) {
    let oldMoney = money;
    money = parseInt(money * 1.5);
    db.add(`money_${message.guild.id}_${message.author.id}`, money);
    message.channel.send({
      embeds: [
        client
          .embedBuilder(client, message, "", "", "#3db39e")
          .addField(
            "Options",
            `Color: **\`Red\`**\nAmount: **\`$${oldMoney}\`**\nMultiplier: **\`1.5x\`**`,
            true
          )
          .addField(
            "Result:",
            `Number: **\`${randomNumber}\`**\nReward: **\`$${money}\`**`,
            true
          )
          .setAuthor({
            name: "Roulette",
            iconURL: `https://cdn.upload.systems/uploads/HJGA3pxp.png`,
          }),
      ],
    });
  } else if (!isOdd(randomNumber) && color == 0) {
    // Black
    let oldMoney = money;
    money = parseInt(money * 2);
    db.add(`money_${message.guild.id}_${message.author.id}`, money);
    message.channel.send({
      embeds: [
        client
          .embedBuilder(client, message, "", "", "#3db39e")
          .addField(
            "Options",
            `Color: **\`Black\`**\nAmount: **\`$${oldMoney}\`**\nMultiplier: **\`2x\`**`,
            true
          )
          .addField(
            "Result:",
            `Number: **\`${randomNumber}\`**\nReward: **\`$${money}\`**`,
            true
          )
          .setAuthor({
            name: "Roulette",
            iconURL: `https://cdn.upload.systems/uploads/HJGA3pxp.png`,
          }),
      ],
    });
  } else {
    if (color == 0) color = "Black";
    else if (color == 1) color = "Red";
    else if (color == 2) color = "Green";
    db.subtract(`money_${message.guild.id}_${message.author.id}`, money);
    message.channel.send({
      embeds: [
        client
          .embedBuilder(client, message, "", "", "RED")
          .addField(
            "Options",
            `Color: **\`${color}\`**\nAmount: **\`$${money}\`**`,
            true
          )
          .addField(
            "Result:",
            `Number: **\`${randomNumber}\`**\nLoss: **\`$${money}\`**`,
            true
          )
          .setAuthor({
            name: "Roulette",
            iconURL: `https://cdn.upload.systems/uploads/HJGA3pxp.png`,
          }),
      ],
    });
  }
};

function isOdd(num) {
  if (num % 2 == 0) return false;
  else if (num % 2 == 1) return true;
}
