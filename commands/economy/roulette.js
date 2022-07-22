const { ApplicationCommandOptionType } = require("discord.js");
const { QuickDB } = require("quick.db");
const db = new QuickDB();

module.exports = {
  name: "roulette",
  category: "economy",
  description: "Play roulette.",
  permissions: [],
  cooldown: 15,
  aliases: ["rt"],
  usage: "roulette [black(b), red(r), green(g)] [amount]",
  slash: true,
  options: [{
    name: "color",
    description: "Color you want to put on",
    type: ApplicationCommandOptionType.String,
    choices: [{
      name: "black",
      value: "b"
    }, {
      name: "red",
      value: "r"
    }, {
      name: "green",
      value: "g"
    }],
    required: true
  }, {
    name: "amount",
    description: "Amount you want to bet",
    type: ApplicationCommandOptionType.String,
    required: true
  }]
};

module.exports.run = async (client, message, args) => {
  let color = args[0];
  let money = args[1];
  let balance = await db.get(`money_${message.guild.id}_${message.author.id}`);

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
    money *= 15;
    await db.add(`money_${message.guild.id}_${message.author.id}`, money);
    message.channel.send({
      embeds: [
        client
          .embedBuilder(client, message, "", "", "#3db39e")
          .addFields([{
            name: "Options:",
            value: `Color: **\`Green\`**\nNumber: **\`${randomNumber}\`**\nMultiplier: **\`15x\`**`,
            inline: true
          }, {
            name: "Result:",
            value: `You won **$${money}**`,
            inline: true
          }])
          .setAuthor({
            name: "Roulette",
            iconURL: `https://cdn.upload.systems/uploads/HJGA3pxp.png`,
          }),
      ],
    });
  } else if (isOdd(randomNumber) && color == 1) {
    money = parseInt(money * 1.5);
    await db.add(`money_${message.guild.id}_${message.author.id}`, money);
    message.channel.send({
      embeds: [
        client
          .embedBuilder(client, message, "", "", "#3db39e")
          .addFields([{
            name: "Options:",
            value: `Color: **\`Red\`**\nNumber: **\`${randomNumber}\`**\nMultiplier: **\`1.5x\`**`,
            inline: false
          }, {
            name: "Result:",
            value: `You won **$${money}**`,
            inline: false
          }])
          .setAuthor({
            name: "Roulette",
            iconURL: `https://cdn.upload.systems/uploads/HJGA3pxp.png`,
          }),
      ],
    });
  } else if (!isOdd(randomNumber) && color == 0) {
    // Black
    money = parseInt(money * 2);
    await db.add(`money_${message.guild.id}_${message.author.id}`, money);
    message.channel.send({
      embeds: [
        client
          .embedBuilder(client, message, "", "", "#3db39e")
          .addFields([{
            name: "Options:",
            value: `Color: **\`Black\`**\nNumber: **\`${randomNumber}\`**\nMultiplier: **\`2x\`**`,
            inline: false
          }, {
            name: "Result:",
            value: `You won **$${money}**`,
            inline: false
          }])
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
    await db.sub(`money_${message.guild.id}_${message.author.id}`, money);
    message.channel.send({
      embeds: [
        client
          .embedBuilder(client, message, "", "", "Red")
          .addFields([{
            name: "Options:",
            value: `Color: **\`${color}\`**\nNumber: **\`${randomNumber}\`**`,
            inline: false
          }, { name: "Result:", value: `You lost **$${money}**`, inline: false }])
          .setAuthor({
            name: "Roulette",
            iconURL: `https://cdn.upload.systems/uploads/HJGA3pxp.png`,
          }),
      ],
    });
  }
};

module.exports.slashRun = async (client, interaction) => {
  let color = interaction.options.getString("color");
  let money = interaction.options.getString("amount");
  let balance = await db.get(`money_${interaction.guild.id}_${interaction.user.id}`);

  if (!color)
    return interaction.reply({
      embeds: [
        client.utils.errorEmbed(
          client,
          interaction,
          `Invalid usage; see ${interaction.px}help roulette for correct usage.`
        ),
      ],
    });

  if (color.toLowerCase() == "b" || color.toLowerCase() == "black") color = 0;
  else if (color.toLowerCase() == "r" || color.toLowerCase() == "red")
    color = 1;
  else if (color.toLowerCase() == "g" || color.toLowerCase() == "green")
    color = 2;
  else
    return interaction.reply({
      embeds: [
        client.utils.errorEmbed(
          client,
          interaction,
          "Invalid color, available: black (b), red (r), green (g)."
        ),
      ],
    });

  if ((isNaN(money) && money != "all") || money.includes("-"))
    return interaction.reply({
      embeds: [client.utils.errorEmbed(client, interaction, "Invalid amount.")],
    });

  if (money == "all") money = Number(balance);
  else money = Number(money);

  if (balance < money)
    return interaction.reply({
      embeds: [
        client.utils.errorEmbed(
          client,
          interaction,
          "You don't have enough money."
        ),
      ],
    });

  if (money < 100 || money > 20000)
    return interaction.reply({
      embeds: [
        client.utils.errorEmbed(
          client,
          interaction,
          "Amount needs to be between $100-20.000."
        ),
      ],
    });

  let randomNumber = Math.floor(Math.random() * 37);

  if (randomNumber == 0 && color == 2) {
    money *= 15;
    await db.add(`money_${interaction.guild.id}_${interaction.user.id}`, money);
    interaction.reply({
      embeds: [
        client
          .embedBuilder(client, interaction, "", "", "#3db39e")
          .addFields([{
            name: "Options:",
            value: `Color: **\`Green\`**\nNumber: **\`${randomNumber}\`**\nMultiplier: **\`15x\`**`,
            inline: true
          }, {
            name: "Result:",
            value: `You won **$${money}**`,
            inline: true
          }])
          .setAuthor({
            name: "Roulette",
            iconURL: `https://cdn.upload.systems/uploads/HJGA3pxp.png`,
          }),
      ],
    });
  } else if (isOdd(randomNumber) && color == 1) {
    money = parseInt(money * 1.5);
    await db.add(`money_${interaction.guild.id}_${interaction.user.id}`, money);
    interaction.reply({
      embeds: [
        client
          .embedBuilder(client, interaction, "", "", "#3db39e")
          .addFields([{
            name: "Options:",
            value: `Color: **\`Red\`**\nNumber: **\`${randomNumber}\`**\nMultiplier: **\`1.5x\`**`,
            inline: false
          }, {
            name: "Result:",
            value: `You won **$${money}**`,
            inline: false
          }])
          .setAuthor({
            name: "Roulette",
            iconURL: `https://cdn.upload.systems/uploads/HJGA3pxp.png`,
          }),
      ],
    });
  } else if (!isOdd(randomNumber) && color == 0) {
    // Black
    money = parseInt(money * 2);
    await db.add(`money_${interaction.guild.id}_${interaction.user.id}`, money);
    interaction.reply({
      embeds: [
        client
          .embedBuilder(client, interaction, "", "", "#3db39e")
          .addFields([{
            name: "Options:",
            value: `Color: **\`Black\`**\nNumber: **\`${randomNumber}\`**\nMultiplier: **\`2x\`**`,
            inline: false
          }, {
            name: "Result:",
            value: `You won **$${money}**`,
            inline: false
          }])
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
    await db.sub(`money_${interaction.guild.id}_${interaction.user.id}`, money);
    interaction.reply({
      embeds: [
        client
          .embedBuilder(client, interaction, "", "", "Red")
          .addFields([{
            name: "Options:",
            value: `Color: **\`${color}\`**\nNumber: **\`${randomNumber}\`**`,
            inline: false
          }, { name: "Result:", value: `You lost **$${money}**`, inline: false }])
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
