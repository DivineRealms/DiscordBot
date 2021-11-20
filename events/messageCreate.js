const escapeRegex = str => str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
const utils = require('../handler/utilities')
const leveling = require("../utils/leveling.js");
const db = require('quick.db')

const cooldownList = [];

module.exports = async(client, message) => {
    if(message.channel.type == "DM") return;
    if (!message.guild || message.author.bot) return
    utils.automod(client, message);

    let level = db.fetch(`level_${message.guild.id}_${message.author.id}`);
    let xp = db.fetch(`xp_${message.guild.id}_${message.author.id}`);
    if(level == null || xp == null) {
      db.add(`level_${message.guild.id}_${message.author.id}`, 1);
      db.add(`xp_${message.guild.id}_${message.author.id}`, 1);
    }

    if (client.afk.has(message.author.id)) {
        message.channel.send(`> Hey ${message.author}, I removed your AFK Status`).then((m) => setTimeout(() => m.delete(), 5000))
        client.afk.delete(message.author.id)
        return message.member.setNickname(message.member.displayName.replace(/(\[AFK\])/g, '')).catch(() => {})
    }

    if(client.conf.leveling.enabled == true) {
      await leveling.manageLeveling(client, message);
    }

    const prefixRegex = new RegExp(`^(${client.conf.settings.mentionPrefix ? `<@!?${client.user.id}>|` : ''}${escapeRegex(message.px)})\\s*`)
    if (!prefixRegex.test(message.content)) return;

    const [, matchedPrefix] = message.content.match(prefixRegex);
    const args = message.content.slice(matchedPrefix.length).trim().split(/ +/);
    const cmd = args.shift().toLowerCase()
    const command = client.commands.find((c, a) => a === cmd || c.aliases && c.aliases.includes(cmd))

    if(command) {
      let userPerms = [];
      command.permissions.forEach((perm) => {
        if(!message.channel.permissionsFor(message.member).has(perm)) {
          userPerms.push(perm);
        }
      });
      if(userPerms.length > 0) return message.channell.send({ embeds: [client.embedBuilder(client, message, "Error", `You don't have Permission to use this command`, "RED")] });
      let findCooldown = cooldownList.find((c) => c.name == command && c.id == message.author.id);
      if(!client.conf.automod.Bypass_Cooldown.some((r) => message.member.roles.cache.has(r))) {
        if(findCooldown) {
          let time = client.utils.formatTime(findCooldown.expiring - Date.now());
          return message.channel.send({ embeds: [client.embedBuilder(client, message, "Error", `You can use that command again in ${time}`, "RED")] });
        } else if(!findCooldown && command.cooldown > 0) {
          let cooldown = {
            id: message.author.id,
            name: command,
            expiring: Date.now() + (command.cooldown * 1000),
          };
  
          cooldownList.push(cooldown);
  
          setTimeout(() => {
            cooldownList.splice(cooldownList.indexOf(cooldown), 1);
          }, command.cooldown * 1000);
        }
      }
    }

    if (command && !client.conf.economy.enabled && command.category === 'economy') return message.channel.send({ embeds: [new client.embed().setDescription('The economy hasnt been enabled!')]})
    if (command) command.run(client, message, args)
}