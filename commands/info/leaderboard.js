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
  let leveltop = db.all().filter(i => i.ID.startsWith(`level_${message.guild.id}_`));
    leveltop = leveltop.sort((a, b) => b.data - a.data).map((x, i) => {
      return `**#${i + 1}** ${client.users.cache.get(x.ID.split("_")[2]) || "N/A"} - ${x.data}. level`
  });
  
  let total = db.all().filter(i => i.ID.startsWith(`money_${message.guild.id}_`)).sort((a, b) => b.data - a.data);
  total = total.map((x, i) => {
    let bank = db.fetch(`bank_${message.guild.id}_${x.ID.split("_")[2]}`) || 0;
    return { user: x.ID.split("_")[2], money: Number(x.data + bank) };
  }).sort((a, b) => b.money - a.money);

  total = total.sort((a, b) => b.money - a.money).map((x, i) => {
    return `**#${i + 1}** ${`<@!${x.user}>`} - $${x.money}`
  });
  
  let ecoEmbed = client.embedBuilder(client, message, "Economy Leaderboard", total.join("\n"));
  let lvlEmbed = client.embedBuilder(client, message, "Level Leaderboard", leveltop.join("\n"));
  
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
  }, true);
}
