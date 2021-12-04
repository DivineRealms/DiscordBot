const db = require('quick.db')

module.exports = {
  name: 'balance',
  category: 'economy',
  description: 'Check your balance on the server.',
  permissions: [],
  cooldown: 0,
  aliases: ['bal'],
  usage: 'balance [@User]'
}

module.exports.run = async(client, message, args) => {
  const user = message.mentions.users.first() || client.users.cache.get(args[0]) || message.author;
  
  let bank = db.fetch(`bank_${message.guild.id}_${user.id}`) || 0;
  let balance = db.fetch(`money_${message.guild.id}_${user.id}`) || 0;

  let embed = client.embedBuilder(client, message, "", `<:ArrowRightGray:813815804768026705> Bank: **$${bank}**
<:ArrowRightGray:813815804768026705> Balance: **$${balance}**
<:ArrowRightGray:813815804768026705> Total: **$${balance + bank}**`)
    .setAuthor(user.username, user.displayAvatarURL({ size: 1024, dynamic: true }));

  message.channel.send({ embeds: [embed] })
}
