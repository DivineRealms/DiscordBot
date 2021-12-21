const { MessageAttachment } = require("discord.js");
const db = require("quick.db");
const Canvas = require("discord-canvas");

module.exports = async (client, member) => {
  const settings = client.conf.Goodbye_System,
    log = client.channels.cache.get(settings.Channel),
    embedWelcome = db.fetch(`wlcmEmbed_${member.guild.id}_${member.id}`);

  if (!settings.Enabled) return;

  if (embedWelcome) {
    let wlcmCh = client.channels.cache.get(embedWelcome.channel),
      msgDelete = await wlcmCh.messages.fetch(embedWelcome.msg);

    if (wlcmCh && msgDelete) msgDelete.delete();
  }

  let data = await db.all().filter((data) => data.ID.includes(member.id));
  data.forEach((data) => db.delete(data.ID));

  if (settings.Type === "card") {
    const image = await new Canvas.Goodbye()
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

    if (log)
      log.send({
        files: [new MessageAttachment(image.toBuffer(), "goodbye-image.png")],
      });
  } else if (settings.Type === "embed") {
    if (log)
      log.send({
        embeds: [
          client.embedBuilder(
            client,
            "",
            `${member.user.username} left!`,
            `${member} just left the server, hope you enjoyed your stay!`,
            "#ee6e84"
          ),
        ],
      });
  } else if (settings.Type === "message") {
    if (log)
      log.send(`${member} just left the server, hope you enjoyed your stay!`);
  } else if (settings.Type === "dm")
    member.user.send(
      `${member} we're sad to see you go! We hope to see you soon.`
    );
};
