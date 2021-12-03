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
  let leveltop = client.utils.lbContent(client, message, "level");
  let baltop = client.utils.lbMoney(client, message);
  
  let ecoEmbed = client.embedBuilder(client, message, "Economy Leaderboard", baltop);
  let lvlEmbed = client.embedBuilder(client, message, "Level Leaderboard", leveltop);
  
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
