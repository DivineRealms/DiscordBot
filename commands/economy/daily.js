const db = require('quick.db')

module.exports = {
    description: 'Claim that daily reward of yours.',
    permissions: [],
    aliases: [],
    usage: 'balance [@User]'
}

module.exports.run = async(client, message, args) => {
  let cooldown = db.fetch(`daily_${message.guild.id}_${message.author.id}`);
  let day = 86400000; 
    
  if(cooldown != null && day - (Date.now() - cooldown) > 0) return message.channel.send({ embeds: [client.embedBuilder(client, message.author, "Error", "You're on cooldown, try again later.", "RED")] });
    
  const embed = client.embedBuilder(client, message, "Daily", `You have claimed Daily Reward of $2500`, "YELLOW");
  message.channel.send({ embeds: [embed] });

  db.add(`money_${message.guild.id}_${message.author.id}`, 2500);
  db.set(`daily_${message.guild.id}_${message.author.id}`, Date.now());
}