const db = require("quick.db");

const manageLeveling = async (client, message) => {
  const levelSettings = client.conf.leveling
  if(!client.talkedRecently.has(message.author.id)) {
    client.talkedRecently.add(message.author.id);
    setTimeout(() => {
      client.talkedRecently.delete(message.author.id);
    }, 35000);

    const xp = db.fetch(`xp_${message.guild.id}_${message.author.id}`) || 0;
    const level = db.fetch(`level_${message.guild.id}_${message.author.id}`) || 1;
    const xpGive = Math.floor(Math.random() * (70 - 35 + 1) + 35); 
    
    const nextLevel = parseInt(level) + 1;
    const xpNeeded = nextLevel * 2 * 250 + 250;
    const xpChannel = client.channels.cache.get(client.conf.leveling.level_Up_Channel)

    if (xp + xpGive >= xpNeeded) {
      const embed = new client.embedBuilder(client, message, 
        levelSettings.level_Up_Title,
        levelSettings.level_Up_Message.replace('{user}', message.author.toString()).replace('{level}', level + 1))

      if (xpChannel) xpchannel.send({ embeds: [embed] })

      if(xp + xpGive > xpNeeded) {
        db.set(`xp_${message.guild.id}_${message.author.id}`, xp - (xpNeeded - xpGive));
        db.add(`level_${message.guild.id}_${message.author.id}`, 1);
      } else {
        db.set(`xp_${message.guild.id}_${message.author.id}`, 0);
        db.add(`level_${message.guild.id}_${message.author.id}`, 1);
      }
      const reward = levelSettings.level_Up_Roles.find(({ level: l }) => l == level + 1)
      if (reward) {
        message.member.roles.add(reward.role).catch(() => {})
        if(reward.id > 0) {
          let removeReward = levelSettings.level_Up_Roles.find(({ id: i }) => i == parseInt(reward.id - 1))
          message.member.roles.remove(removeReward.role)
        }
      }
    } else {
      if(!message.author.bot) {
        db.add(`xp_${message.guild.id}_${message.author.id}`, xpGive);
      }
    }
  }
}

module.exports = {
  manageLeveling,
}