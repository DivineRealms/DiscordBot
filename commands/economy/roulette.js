const db = require("quick.db");

module.exports = {
  name: "roulette",
  category: "economy",
  description: "Play roulette.",
  permissions: [],
  cooldown: 0,
  aliases: ["rulet"],
  usage: "roulette [black(b), red(r), green(g)] [amount]",
};

module.exports.run = async (client, message, args) => {
  let color = args[0];
  let money = args[1];
  let balance = db.fetch(`money_${message.guild.id}_${message.author.id}`);

  if(!color) return message.channel.send({ embeds: [client.embedBuilder(client, message, "Error", "You didn't provide Color", "#3db39e")] })

  if(color.toLowerCase() == "b" || color.toLowerCase() == "black") color = 0;
  else if(color.toLowerCase() == "r" || color.toLowerCase() == "red") color = 1;
  else if(color.toLowerCase() == "g" || color.toLowerCase() == "green") color = 2;
  else return message.channel.send({ embeds: [client.embedBuilder(client, message, "Error", "You have entered invalid Color\nBlack (b), Red (r), Green (g)", "#3db39e")] })

  if(!money || (isNaN(money) && money != "all") || args[1].includes("-")) return message.channel.send({ embeds: [client.embedBuilder(client, message, "Error", "You have entered Invalid Amount", "#3db39e")] })
  
  if(money == "all") money = Number(balance);
  else money = Number(money);

  if(balance < money) return message.channel.send({ embeds: [client.embedBuilder(client, message, "Error", "You don't have enough money.", "#3db39e")] })
  if(money < 100 || money > 20000) return message.channel.send({ embeds: [client.embedBuilder(client, message, "Error", "Amount need to be between $100 - $20.000", "#3db39e")] })

  let randomNumber = Math.floor(Math.random() * 37);
  
  if (randomNumber == 0 && color == 2) {
    let oldMoney = money;
    money *= 15
    let embedGreen = new Discord.MessageEmbed()
      .setColor("YELLOW")
      .setAuthor({ name: "Economy", iconURL: this.client.user.displayAvatarURL() })
      .setFooter({ text: `${message.author.username}`, iconURL: message.author.displayAvatarURL({size: 1024, dynamic: true}) })
      .setTimestamp()
      .setDescription(
      `> **Color:** Green
> **Amount:** $${oldMoney}
> **Multiplier:** 15x

The Ball fell to the Number \`${randomNumber}\` and you won **$${money}**.`
      );
    db.add(`money_${message.guild.id}_${message.author.id}`, money);
    message.channel.send({ embeds: [embedGreen] });
  } else if (isOdd(randomNumber) && color == 1) {
    let oldMoney = money;
    money = parseInt(money * 1.5);
    let embedRed = new Discord.MessageEmbed()
      .setColor("YELLOW")
      .setAuthor({ name: "Economy", iconURL: this.client.user.displayAvatarURL() })
      .setFooter({ text: `${message.author.username}`, iconURL: message.author.displayAvatarURL({size: 1024, dynamic: true}) })
      .setTimestamp()
      .setDescription(
      `> **Color:** Red
> **Amount:** $${oldMoney}
> **Multiplier:** 1.5x

The Ball fell to the Number \`${randomNumber}\` and you won **$${money}**.`
      );
    db.add(`money_${message.guild.id}_${message.author.id}`, money);
    message.channel.send({ embeds: [embedRed] });
  } else if (!isOdd(randomNumber) && color == 0) { // Black
    let oldMoney = money;
    money = parseInt(money * 2);
    let embedBlack = new Discord.MessageEmbed()
      .setColor("YELLOW")
      .setAuthor({ name: "Economy", iconURL: this.client.user.displayAvatarURL() })
      .setFooter({ text: `${message.author.username}`, iconURL: message.author.displayAvatarURL({size: 1024, dynamic: true}) })
      .setTimestamp()
      .setDescription(
      `> **Color:** Black
> **Amount:** $${oldMoney}
> **Multiplier:** 2x

The Ball fell to the Number \`${randomNumber}\` and you won **$${money}**.`
      );
    db.add(`money_${message.guild.id}_${message.author.id}`, money);
    message.channel.send({ embeds: [embedBlack] });
  } else {
    if(color == 0) color = "Black";
    else if(color == 1) color = "Red";
    else if(color == 2) color = "Green";

    let embedLost = new Discord.MessageEmbed()
      .setColor("RED")
      .setAuthor({ name: "Economy", iconURL: this.client.user.displayAvatarURL() })
      .setFooter({ text: `${message.author.username}`, iconURL: message.author.displayAvatarURL({size: 1024, dynamic: true}) })
      .setTimestamp()
      .setDescription(
      `> **Color:** ${color}
> **Amount:** $${money}
> **Multiplier:** /

The Ball fell to the Number \`${randomNumber}\` and you lost **$${money}**.`
      );
    db.subtract(`money_${message.guild.id}_${message.author.id}`, money);
    message.channel.send({ embeds: [embedLost] });
  }
};

function isOdd(num) { 
	if ((num % 2) == 0) return false;
	else if ((num % 2) == 1) return true;
}