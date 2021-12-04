const db = require('quick.db')
const Discord = require("discord.js")

module.exports = {
  name: 'colors',
  category: 'economy',
  description: 'Choose your name color.',
  permissions: [],
  cooldown: 0,
  aliases: [],
  usage: 'color [list/use/reset] [color]'
}

module.exports.run = async(client, message, args) => {
  let option = args[0];
  let colors = db.fetch(`colors_${message.guild.id}_${message.author.id}`) || [];
  if(!option) return message.channel.send({ embeds: [client.embedBuilder(client, message, "Error", `You have entered invalid option, options: \`use, list, reset\`.`, "error")] });
  if(option.toLowerCase() == "list") {
  if(colors.length == 0) return message.channel.send({ embeds: [client.embedBuilder(client, message, "Error", `You don't have any color.`, "error")] });
  let embed = client.embedBuilder(client, message, "List of Colors", `You have total of ${colors.length} colors available\n\n> ${colors.join(" ")}`)

  message.channel.send({ embeds: [embed] });
  } else if(option.toLowerCase() == "use") {
    let select = args[1];
    if(!colors.includes(select.toLowerCase())) return message.channel.send({ embeds: [client.embedBuilder(client, message, "Error", `You don't have that color in your inventory`, "error")] });
    let apply = client.conf.colors.list.find((c) => c.name.toLowerCase() == select.toLowerCase());
    if(!apply) return message.channel.send({ embeds: [client.embedBuilder(client, message, "Error", `You have provided invalid color`, "error")] });

    client.conf.colors.list.forEach((m) => {
      if(message.member.roles.cache.has(m.role)) message.member.roles.remove(m.role);
    })

    let color = client.conf.colors.list.find((n) => n.name.toLowerCase() == select.toLowerCase());
    if(message.member.roles.cache.has(color.role)) return message.channel.send({ embeds: [client.embedBuilder(client, message, "Error", `You already have that color selected.`, "error")] });
    message.member.roles.add(color.role);
    message.channel.send({ embeds: [client.embedBuilder(client, message, "Color Selected", `Color Role <@&${color.role}> has been equiped.`)] });
  } else if(option.toLowerCase() == "reset") {
    client.conf.colors.list.forEach((m) => {
      if(message.member.roles.cache.has(m.role)) message.member.roles.remove(m.role);
    });
    message.channel.send({ embeds: [client.embedBuilder(client, message, "Color Selected", `Your Name Color has been reseted.`)] });
  }
}
