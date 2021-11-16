const { MessageAttachment } = require("discord.js");
const Canvas = require("discord-canvas")
const image = require('is-image-url')
const ord = require('ordinal')

module.exports = async(client, member) => {
    client.members.ensure(member.guild.id, {})
    let guild = client.settings.ensure(member.guild.id, client.defaultSettings)
    if (guild.locked) {
        await member.send(new client.embed().setDescription(`${member.guild.name} is currently under a **SERVER-WIDE LOCKDOWN!** Please try joining back a little later!`).setFooter(`${member.guild.name} | Made By Fuel#2649`, member.guild.iconURL({ dynamic: true }))).catch(() => {})
        member.kick().catch(() => {})
    }

    member.roles.set(client.conf.automation.Roles_On_Join.slice(0, 5)).catch(() => {})
    const data = client.members.ensure(member.guild.id, client.memberSettings, member.id)
    if (data.muted.muted) member.roles.add(client.conf.moderation.Mute_Role).catch(() => {})
    const settings = client.conf.welcomeSystem
    const log = client.channels.cache.get(settings.welcomeChannel)
    if (!log) return

    if (settings.welcomeType === 'card') {
        if (!image(settings.welcomeCardBackGroundURL)) return console.log('[ERROR] Invalid image url in welcomeSystem > welcomeCardBackGroundURL')
        const img = await new Canvas.Welcome()
            .setUsername(member.user.username)
            .setDiscriminator(member.user.discriminator)
            .setMemberCount(member.guild.memberCount)
            .setGuildName(member.guild.name)
            .setAvatar(member.user.displayAvatarURL({ format: 'png', size: 2048 }))
            .setColor("border", "#FF0000")
            .setColor("username-box", "RANDOM")
            .setColor("discriminator-box", "#FF0000")
            .setColor("message-box", "#FF0000")
            .setColor("title", "#FF0000")
            .setColor("avatar", "#FF0000")
            .setBackground(settings.welcomeCardBackGroundURL)
            .toAttachment()

        const attachment = new MessageAttachment(img.toBuffer(), "welcome-image.png");
        log.send(attachment);
    } else if (settings.welcomeType === 'embed') {
        const embed = new client.embed()
            .setTitle(settings.welcomeEmbed.title.replace('{username}', member.user.username))
            .setDescription(settings.welcomeEmbed.description.replace('{member}', member).replace('{joinPosition}', ord(member.guild.memberCount)))
            .setColor(settings.welcomeEmbed.color)

        log.send(embed)
    } else if (settings.welcomeType === 'message') log.send(settings.welcomeMessage.replace('{member}', member).replace('{joinPosition}', ord(member.guild.memberCount)))
    else if (settings.welcomeType === 'dm') member.user.send(settings.welcomeDM.replace('{member}', member).replace('{joinPosition}', ord(member.guild.memberCount))).catch(() => {})
}