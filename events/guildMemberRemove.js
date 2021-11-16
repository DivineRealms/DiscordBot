const { MessageAttachment } = require("discord.js");
const Canvas = require("discord-canvas")
const im = require('is-image-url')

module.exports = async(client, member) => {
    if (client.conf.leveling.remove_XP_on_Leave) client.members.set(member.guild.id, { level: 0, xp: 0, totalXP: 0 }, `${member.id}.xp`)
    const settings = client.conf.goodbyeSystem
    const log = client.channels.cache.get(settings.goodbyeChannel)
    if (!log) return

    if (settings.goodbyeType === 'card') {
        if (!im(settings.goodbyeCardBackGroundURL)) return console.log('[ERROR] Invalid image url in welcomeSystem > goodbyeCardBackGroundURL')
        const image = await new Canvas.Goodbye()
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
            .setBackground(settings.goodbyeCardBackGroundURL)
            .toAttachment();

        const attachment = new MessageAttachment(image.toBuffer(), "goodbye-image.png");
        log.send(attachment);
    } else if (settings.goodbyeType === 'embed') {
        const embed = new client.embed()
            .setTitle(settings.goodbyeEmbed.title.replace('{username}', member.user.username))
            .setDescription(settings.goodbyeEmbed.description.replace('{member}', member))
            .setColor(settings.goodbyeEmbed.color)

        log.send(embed)
    } else if (settings.goodbyeType === 'message') log.send(settings.goodbyeMessage.replace('{member}', member))

}