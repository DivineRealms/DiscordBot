const Discord = require('discord.js');
const db = require('quick.db')

module.exports = {
    name: 'leaderboard',
    category: 'info',
    description: 'View Leaderboard',
    permissions: [],
    cooldown: 0,
    aliases: ['baltop', 'lvltop', 'top'],
    usage: 'leaderboard'
}

module.exports.run = async(client, message, args) => {
  /*let baltop = db.all().filter(i => i.ID.startsWith(`money_${message.guild.id}_`));
  baltop = baltop.sort((a, b) => b.data - a.data).map((x, i) => {
    let bank = db.fetch(`bank_${message.guild.id}_${x.ID.split("_")[2]}`) || 0;
    return `**#${i + 1}** ${client.users.cache.get(x.ID.split("_")[2]) || "N/A"} - $${Number(bank + x.data)}`
  });*/
  let leveltop = db.all().filter(i => i.ID.startsWith(`level_${message.guild.id}_`));
  leveltop = leveltop.sort((a, b) => b.data - a.data).map((x, i) => {
    return `**#${i + 1}** ${client.users.cache.get(x.ID.split("_")[2]) || "N/A"} - ${x.data}. level`
  });
  
  
  let baltop = [];
  let money = db
    .all()
    .filter(data => data.ID.startsWith(`money_${message.guild.id}`))
    .sort((a, b) => b.data - a.data);
  
  for (var i in money) {
    let user = money[i].ID.split("_")[2];
    let userr = this.client.users.cache.get(user);
  
    if (userr === undefined || userr === null) continue;
  
    let bank = db.fetch(`bank_${message.guild.id}_${user}`);
    let bal = db.fetch(`money_${message.guild.id}_${user}`);
    let netWorth = bank + bal;
  
    baltop.push({ name: userr, balance: netWorth });
  }
  
  baltop = baltop.sort((a, b) => b.balance - a.balance).map((x, i) => {
    return `**#${i + 1}** ${client.users.cache.get(x.name) || "N/A"} - $${Number(balance)}`
  });
  
  let ecoEmbed = client.embedBuilder(client, message, "Economy Leaderboard", baltop.join("\n"), "YELLOW");
  let lvlEmbed = client.embedBuilder(client, message, "Level Leaderboard", leveltop.join("\n"), "YELLOW");
  
  let embeds = [ecoEmbed, lvlEmbed];
  let labelArr = ["Economy", "Level"];
  let emojiArr = ["💵", "⭐"];
  let data = [];
  for(let i = 0; i < embeds.length; i++) {
    data.push({
      label: labelArr[i], 
      value: "val_" + labelArr[i].toLowerCase(), 
      emoji: emojiArr[i],
      embed: embeds[i], 
    })
  }
  
  client.paginateSelect(client, message, ecoEmbed, {
    id: "leaderboard", 
    placeholder: "Select Leaderboard you want to see.", 
    options: data
  });
}