module.exports = {
    name: 'createpanel',
    category: 'moderation',
    description: 'Creates the ticket panel message!',
    permissions: ["MANAGE_GUILD"],
    cooldown: 0,
    aliases: [`cpcreate`, `panelcreate`],
    usage: 'createpanel'
}

module.exports.run = async(client, message, args) => {
    const settings = client.conf.ticketSystem
    const embed = new client.embed()
        .setFooter(message.author.username, message.author.displayAvatarURL({ dynamic: true, size: 1024 }))

    const ticketEmbed = new client.embed({ footer: 'React down below to open a ticket!' })
    const msg = await message.channel.send({ embeds: [ticketEmbed.setTitle(settings.Panel_Title).setDescription(settings.Panel_Message)]});
    await msg.react(settings.Panel_Emoji).catch(() => msg.react('✉️'))
    client.settings.push(message.guild.id, msg.id, 'panels')
}