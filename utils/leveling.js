const db = require("quick.db");

const manageLeveling = async (client, message) => {
  const levelSettings = client.conf.leveling
  if(!client.talkedRecently.has(message.author.id)) {
    client.talkedRecently.add(message.author.id);
    setTimeout(() => {
      client.talkedRecently.delete(message.author.id);
    }, 35000);

    const xp = parseInt(db.fetch(`xp_${message.guild.id}_${message.author.id}`));
    const level = parseInt(db.fetch(`level_${message.guild.id}_${message.author.id}`));
    const xpGive = Math.floor(Math.random() * (50 - 30 + 1) + 30); 
    
    const nextLevel = parseInt(level) + 1;
    const xpNeeded = nextLevel * 2 * 250 + 250;

    if (xp + xpGive >= xpNeeded) {
      const embed = new client.embed()
        .setAuthor(levelSettings.level_Up_Title)
        .setDescription(levelSettings.level_Up_Message.replace('{user}', message.author.toString()).replace('{level}', level + 1))
        .setFooter(message.author.username, message.author.displayAvatarURL({ dynamic: true, size: 1024 }))
        .setTimestamp()

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
        let rIndex = levelSettings.level_Up_Roles.indexOf(reward);
        console.log(rIndex)
        message.member.roles.add(reward.role).catch(() => {})
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