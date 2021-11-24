const ms = require("ms");
const db = require("quick.db")
const Timeout = require("smart-timeout");

module.exports = {
  name: 'mute',
  category: 'moderation',
  description: 'Lets you mute the requested user.',
  permissions: ["MUTE_MEMBERS"],
  cooldown: 0,
  aliases: ['stopspeaking'],
  usage: 'mute <@User> [time | reason] [reason]'
}

module.exports.run = async(client, message, args) => {
  const member = message.mentions.members.first() || message.guild.members.cache.get(args[0])
  const muterole = message.guild.roles.cache.get(client.conf.moderation.Mute_Role)
  const time = args[1]
  const reason = args.slice(2).join(' ') || 'No Reason Provided'

  if (!member) return message.channel.send({ embeds: [client.embedBuilder(client, message, "Error", "You need to enter valid user.", "RED")] });
  if (!time) return message.channel.send({ embeds: [client.embedBuilder(client, message, "Error", "You need to enter duration.", "RED")] });
  if (!muterole) return  message.channel.send({ embeds: [client.embedBuilder(client, message, "Error", "I can't find Mute Role.", "RED")] });
  if (member.id === message.author.id) return message.channel.send({ embeds: [client.embedBuilder(client, message, "Error", "Stop being a dumbass... You can\'t mute yourself.", "RED")]})
  if (member.user.bot) return message.channel.send({ embeds: [client.embedBuilder(client, message, "Error", "You can\'t mute a bot!", "RED")]})
  if (member.roles.highest.position >= message.member.roles.highest.position) return message.channel.send({ embeds: [client.embedBuilder(client, message, "Error", "You can only mute members that have a lower role than you.", "RED")]})
  if (member.permissions.has('ADMINISTRATOR') || member.roles.highest.position >= message.guild.me.roles.highest.position) return message.channel.send({ embeds: [client.embedBuilder(client, message, "Error", "I cant mute that member", "RED")]})
  if (member.roles.cache.has(muterole.id)) return message.channel.send({ embeds: [client.embedBuilder(client, message, "Error", "That member is already muted!", "RED")]})

  db.set(`muteInfo_${message.guild.id}_${member.id}`, {
    time: ms(time),
    date: Date.now(),
    reason: reason,
    staff: message.author.tag,
    duration: ms(time),
  });

  Timeout.set(`mute_${message.guild.id}_${member.id}`, () => {
    member.roles.remove(muterole).then(() => {
      db.delete(`muteInfo_${message.guild.id}_${member.id}`);
    })
  }, ms(time));

  await member.roles.add(muterole)

  let embed = client.embedBuilder(client, message, "User Muted", `${member.user} have been muted by ${message.author} for \`${reason}\`, duration ${client.utils.formatTime(time)}`);

  client.utils.logs(client, message.guild, "User Muted", [{
    name: "User",
    desc: member.user
  },{
    name: "Staff",
    desc: message.author
  },{
    name: "Reason",
    desc: reason
  },{
    name: "Duration",
    desc: `${client.utils.formatTime(ms(time))}`
  }], member.user);

  await message.channel.send({ embeds: [embed] })
}
