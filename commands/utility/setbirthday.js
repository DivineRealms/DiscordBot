const datetime = require('date-and-time')
const db = require('quick.db')

module.exports = {
  name: 'setbirthday',
  category: 'utility',
  description: 'Set a users birthday.',
  permissions: ["MANAGE_ROLES"],
  cooldown: 0,
  aliases: [`setbday`],
  usage: 'setbirthday'
}

module.exports.run = async(client, message, args) => {
  const embed = client.embedBuilder(client, message, "Birthday", "")
  const user = message.mentions.users.first()
  const birthd = args.slice(1).join(' ').toLowerCase().charAt(0).toUpperCase() + args.slice(1).join(' ').slice(1).toLowerCase()
  const date = datetime.parse(birthd, 'MMM D YYYY')

  if (!user || !date.getDay()) return message.channel.send({ embeds: [embed.setDescription(`You need to mention a user and enter the date of that users birthday!\nExample: \`${message.px}setbirthday @user Sep 4 2004\``)]})

  const age = getAge(args.slice(1).join(' '))
  if (age <= 12) return message.channel.send({ embeds: [embed.setDescription(`You can\'t enter a year greater than ${new Date().getFullYear() - 12}!`)]})

  message.channel.send({ embeds: [embed
    .setTitle(`🥳 Successfully set their birthday! 🥳`)
    .setDescription(`I have set ${user}'s birthday to ${args.slice(1).join(' ')}!\n\nThey will be ${age + 1}`)
  ]})

  db.set(`birthday_${message.guild.id}_${user.id}`, args.slice(1).join(" "));
}

const getAge = b => {
  let age = new Date().getFullYear() - new Date(b).getFullYear()
  const m = new Date().getMonth() - new Date(b).getMonth()
  if (m < 0 || (m === 0 && new Date().getDate() < new Date(b).getDate()))
    age--;

  return age
}