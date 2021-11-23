const db = require("quick.db")
const paginateContent = require('../../utils/paginateContent.js')

module.exports = {
  name: 'birthdayscoming',
  category: 'utility',
  description: 'Views all the birthdays coming up in the week.',
  permissions: [],
  cooldown: 0,
  aliases: [`bdaylist`],
  usage: 'birthdydayscoming'
}

module.exports.run = async(client, message, args) => {
  const dates = ['January', 'Februrary', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
  const isToday = d => d ? new Date().getMonth() === new Date(d).getMonth() && new Date().getDate() <= new Date(d).getDate() : false
  let birthdays = db.all().filter(i => i.ID.startsWith(`birthday_${message.guild.id}_`)).sort((a, b) => b.data - a.data);
  birthdays = birthdays.filter((b) => isToday(b.data)).map(s => {
    let bUser = client.users.cache.get(s.ID.split("_")[2]) || "N/A";
    return `> **${s.data.slice(1,-1).trim()}** - ${bUser}\n`;
  })

  if (!birthdays.length) return message.channel.send({ embeds: [client.embedBuilder(client, message, "Error", `There's no upcoming birthdays.`, "RED")] });
  
  paginateContent(client, birthdays, 10, 1, message, `Birthdays Coming Up for ${dates[new Date().getMonth()]}!`, "BLURPLE")
}