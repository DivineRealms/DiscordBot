const { AttachmentBuilder } = require("discord.js");
const Canvas = require("discord-canvas");
const { QuickDB } = require("quick.db");
const db = new QuickDB();

module.exports = async (client, member) => {
  const settings = client.conf.Welcome_System,
    channel = client.channels.cache.get(settings.Channel);

  if (!settings.Enabled) return;

  if (settings.Type === "card") {
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
      .setBackground(
        "https://minecraft-mp.com/images/banners/banner-295045-1636327342.png"
      )
      .toAttachment();

    const attachment = new AttachmentBuilder(
      img.toBuffer(),
      { filename: "welcome-image.png" }
    );
    channel.send({ files: [attachment] }).then(async(msg) =>
      await db.set(`wlcmEmbed_${member.guild.id}_${member.id}`, {
        msg: msg.id,
        channel: msg.channel.id,
      })
    );
  } else if (settings.Type == "message") {
    channel
      .send(
        `Welcome ${member} to the server, You are our ${member.guild.memberCount} member!`
      )
      .then(async(msg) =>
        await db.set(`wlcmEmbed_${member.guild.id}_${member.id}`, {
          msg: msg.id,
          channel: msg.channel.id,
        })
      );
  } else if (settings.Type == "dm") {
    member.user
      .send(
        `Welcome ${member} to the server, You are our ${member.guild.memberCount} member!`
      )
      .catch(() => {});
  }
};
