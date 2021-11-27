const { MessageAttachment } = require("discord.js");
const db = require("quick.db")
const Canvas = require("discord-canvas")

module.exports = async(client, member) => {
  if (client.conf.leveling.remove_XP_on_Leave) client.members.set(member.guild.id, { level: 0, xp: 0, totalXP: 0 }, `${member.id}.xp`)
  const settings = client.conf.goodbyeSystem
  const log = client.channels.cache.get(settings.goodbyeChannel)
  let embedWelcome = db.fetch(`wlcmEmbed_${member.guild.id}_${member.id}`);
  if(embedWelcome) {
    let wlcmCh = client.channels.cache.get(embedWelcome.channel);
    let msgDelete = wlcmCh.messages.fetch(embedWelcome.msg)
    if(wlcmCh && msgDelete) {
      await msgDelete.delete();
    }
  }

  if (settings.goodbyeType === 'card') {
    const image = await new Canvas.Goodbye()
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
      .setBackground(settings.goodbyeCardBackGroundURL)
      .toAttachment();

    const attachment = new MessageAttachment(image.toBuffer(), "goodbye-image.png");
    if(log) log.send({ files: [attachment] });
  } else if (settings.goodbyeType === 'embed') {
    const embed = client.embedBuilder(client, "", 
      settings.goodbyeEmbed.title.replace('{username}', member.user.username),
      settings.goodbyeEmbed.description.replace('{member}', member))

      if(log) log.send({ embeds: [embed] })
  } else if (settings.goodbyeType === 'message') {
    if(log) log.send(settings.goodbyeMessage.replace('{member}', member))
  }
}