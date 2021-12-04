const { MessageAttachment } = require("discord.js");
const Canvas = require("discord-canvas");
const db = require("quick.db");

module.exports = async (client, member) => {
  const settings = client.conf.welcomeSystem;
  const log = client.channels.cache.get(settings.welcomeChannel);

  if (settings.welcomeType === "card") {
    const img = await new Canvas.Welcome()
      .setUsername(member.user.username)
      .setDiscriminator(member.user.discriminator)
      .setMemberCount(member.guild.memberCount)
      .setGuildName(member.guild.name)
      .setAvatar(member.user.displayAvatarURL({ format: "png", size: 2048 }))
      .setColor("border", "#4CAAFF")
      .setColor("username-box", "RANDOM")
      .setColor("discriminator-box", "#4CAAFF")
      .setColor("message-box", "#4CAAFF")
      .setColor("title", "#4CAAFF")
      .setColor("avatar", "#4CAAFF")
      .setBackground(settings.welcomeCardBackGroundURL)
      .toAttachment();

    const attachment = new MessageAttachment(
      img.toBuffer(),
      "welcome-image.png"
    );
    if (log)
      log
        .send({ files: [attachment] })
        .then((msg) =>
          db.set(`wlcmEmbed_${member.guild.id}_${member.id}`, {
            msg: msg.id,
            channel: msg.channel.id,
          })
        );
  } else if (settings.welcomeType == "embed") {
    const embed = client.embedBuilder(
      client,
      "",
      settings.welcomeEmbed.title.replace("{username}", member.user.username),
      settings.welcomeEmbed.description
        .replace("{member}", member)
        .replace("{joinPosition}", `${member.guild.memberCount}`)
    );

    if (log)
      log
        .send({ embeds: [embed] })
        .then((msg) =>
          db.set(`wlcmEmbed_${member.guild.id}_${member.id}`, {
            msg: msg.id,
            channel: msg.channel.id,
          })
        );
  } else if (settings.welcomeType == "message") {
    if (log)
      log
        .send(
          settings.welcomeMessage
            .replace("{member}", member)
            .replace("{joinPosition}", `${member.guild.memberCount}`)
        )
        .then((msg) =>
          db.set(`wlcmEmbed_${member.guild.id}_${member.id}`, {
            msg: msg.id,
            channel: msg.channel.id,
          })
        );
  } else if (settings.welcomeType == "dm") {
    member.user
      .send(
        settings.welcomeDM
          .replace("{member}", member)
          .replace("{joinPosition}", `${member.guild.memberCount}`)
      )
      .catch(() => {});
  }
};
