module.exports = {
  name: 'serverinfo',
  category: 'info',
  description: 'Allows you to view information on the server.',
  permissions: [],
  cooldown: 0,
  aliases: ['sinfo', 'servinfo'],
  usage: 'serverinfo'
}

module.exports.run = async(client, message, args) =>
  message.channel.send({ embeds: [client.embedBuilder(client, message, `${message.guild.name}\'s information`, "")
    .addField("Created", `${require('moment')(message.guild.createdAt).format('ddd, MMMM Do YYYY [at] hh:mm A')} | ${require('moment')(message.guild.createdAt).fromNow()}`, false)
    .addField("Guild ID", `${message.guild.id}`, false)
    .addField("Members", `${message.guild.memberCount}`, false)
    .addField("Server Owner", `<@!${message.guild.ownerId}>`, false)
    .addField("Channels", `${message.guild.channels.cache.size}`, false)
    .addField("Roles", `${message.guild.roles.cache.size}`, false)
    .addField("Servers Boost Tier", `${message.guild.premiumTier + 1}`, false)
    .addField("Emoji Count", `${message.guild.emojis.cache.size}`, false)
    .addField("Boost Count", `${message.guild.premiumSubscriptionCount || "0"}`, false)]})