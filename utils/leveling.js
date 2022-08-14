const { QuickDB } = require("quick.db");
const db = new QuickDB();

const manageLeveling = async (client, message) => {
  const levelSettings = client.conf.Leveling;
  if (!client.talkedRecently.has(message.author.id)) {
    client.talkedRecently.add(message.author.id);
    setTimeout(() => {
      client.talkedRecently.delete(message.author.id);
    }, 35000);

    const xp =
      (await db.get(`xp_${message.guild.id}_${message.author.id}`)) || 0;
    const level =
      (await db.get(`level_${message.guild.id}_${message.author.id}`)) || 1;
    const xpGive = Math.floor(Math.random() * (70 - 35 + 1) + 35);

    const nextLevel = parseInt(level) + 1;
    const xpNeeded = nextLevel * 2 * 250 + 250;
    // const xpChannel = client.channels.cache.get(levelSettings.Level_Up.Channel);

    if (xp + xpGive >= xpNeeded) {
      const embed = client
        .embedBuilder(client, "", "", "", "#b7e445")
        .setAuthor({
          name: `${message.author.username} has just reached Level ${
            level + 1
          }!`,
          iconURL: `https://cdn.upload.systems/uploads/OJ9pgcy2.png`,
        });

      message.channel.send({ embeds: [embed] });

      if (xp + xpGive > xpNeeded) {
        await db.set(
          `xp_${message.guild.id}_${message.author.id}`,
          xp - (xpNeeded - xpGive)
        );
        await db.add(`level_${message.guild.id}_${message.author.id}`, 1);
      } else {
        await db.set(`xp_${message.guild.id}_${message.author.id}`, 0);
        await db.add(`level_${message.guild.id}_${message.author.id}`, 1);
      }
      const reward = levelSettings.Level_Up.Roles.find(
        ({ Level: l }) => l == level + 1
      );
      if (reward) {
        message.member.roles.add(reward.Role).catch(() => {});
        if (reward.id > 0) {
          let removeReward = levelSettings.Level_Up.Roles.find(
            ({ ID: i }) => i == parseInt(reward.id - 1)
          );
          message.member.roles.remove(removeReward.Role);
        }
      }
    } else {
      if (!message.author.bot) {
        await db.add(`xp_${message.guild.id}_${message.author.id}`, xpGive);
      }
    }
  }
};

module.exports = { manageLeveling };
