const db = require('quick.db')

module.exports = {
  name: 'buy',
  category: 'economy',
  description: 'Buy something from the shop.',
  permissions: [],
  cooldown: 0,
  aliases: [],
  usage: 'buy <item number>'
}

module.exports.run = async(client, message, args) => {
  const settings = client.conf.economy
  let balance = db.fetch(`money_${message.guild.id}_${message.author.id}`);
  const shop = [...settings.shopItems]
  const item = shop.find((s, i) => i + 1 == args[0])

  if (!item) return message.channel.send({ embeds: [client.embedBuilder(client, message, "Error", `You have entered invalid shop id.`, "error")] });
  if (item.type == 'role') {
    if(!balance || balance < item.price) return message.channel.send({ embeds: [client.embedBuilder(client, message, "Error", `You don't have enough money.`, "error")] });
    message.member.roles.add([item.roleID, "734759761660084268"]).then(() => {
      message.channel.send({ embeds: [client.embedBuilder(client, message, "Role Purchased", `You have successfully purchased role <@&${item.roleID}> for $${item.price}.`)] });
      db.subtract(`money_${message.guild.id}_${message.author.id}`, item.price);
    }).catch(() => {
      message.channel.send({ embeds: [client.embedBuilder(client, message, "Error", `Cannot add role to that member`, "error")] });
    })
  } else if(item.type == "color") {
    let colors = db.fetch(`colors_${message.guild.id}_${message.author.id}`) || [];
    if(!balance || balance < item.price) return message.channel.send({ embeds: [client.embedBuilder(client, message, "Error", `You don't have enough money.`, "error")] });
    if(colors.includes(item.name.toLowerCase())) return message.channel.send({ embeds: [client.embedBuilder(client, message, "Error", `You already have that name color.`, "error")] });

    db.push(`colors_${message.guild.id}_${message.author.id}`, item.name.toLowerCase());
    db.subtract(`money_${message.guild.id}_${message.author.id}`, item.price);
    message.channel.send({ embeds: [client.embedBuilder(client, message, "Color Purchased", `You have successfully purchased name color **${item.name}** for $${item.price}.`)] });
  }
}
