const { MessageAttachment } = require("discord.js");
const Canvas = require("discord-canvas")
const ord = require('ordinal')
const muteChecks = require('../utils/muteChecks.js')

module.exports = async(client, member) => {
    client.members.ensure(member.guild.id, {})
    let guild = client.settings.ensure(member.guild.id, client.defaultSettings)
    if (guild.locked) {
        await member.send({ embeds: [new client.embed().setDescription(`${member.guild.name} is currently under a **SERVER-WIDE LOCKDOWN!** Please try joining back a little later!`).setFooter(`Divine Realms`, client.user.displayAvatarURL({ size: 1024 }))]}).catch(() => {})
        member.kick().catch(() => {})
    }

    member.roles.set(client.conf.automation.Roles_On_Join.slice(0, 5)).catch(() => {})
    await muteChecks.checkMuteOnJoin(client, member, member.guild);
    const settings = client.conf.welcomeSystem
    const log = client.channels.cache.get(settings.welcomeChannel)

    if (settings.welcomeType === 'card') {
        const img = await new Canvas.Welcome()
            .setUsername(member.user.username)
            .setDiscriminator(member.user.discriminator)
            .setMemberCount(member.guild.memberCount)
            .setGuildName(member.guild.name)
            .setAvatar(member.user.displayAvatarURL({ format: 'png', size: 2048 }))
            .setColor("border", "#4CAAFF")
            .setColor("username-box", "RANDOM")
            .setColor("discriminator-box", "#4CAAFF")
            .setColor("message-box", "#4CAAFF")
            .setColor("title", "#4CAAFF")
            .setColor("avatar", "#4CAAFF")
            .setBackground(settings.welcomeCardBackGroundURL)
            .toAttachment()

        const attachment = new MessageAttachment(img.toBuffer(), "welcome-image.png");
        if(log) log.send({ files: [attachment] });
    } else if (settings.welcomeType == 'embed') {
        const embed = new client.embed()
            .setTitle(settings.welcomeEmbed.title.replace('{username}', member.user.username))
            .setDescription(settings.welcomeEmbed.description.replace('{member}', member).replace('{joinPosition}', `${member.guild.memberCount}`))
            .setColor(settings.welcomeEmbed.color)

        if(log) log.send({ embeds: [embed] })
    } else if (settings.welcomeType == 'message') {
        if(log) log.send(settings.welcomeMessage.replace('{member}', member).replace('{joinPosition}', `${member.guild.memberCount}`))
    } else if (settings.welcomeType == 'dm') {
        member.user.send(settings.welcomeDM.replace('{member}', member).replace('{joinPosition}', `${member.guild.memberCount}`)).catch(() => {})
    }
}