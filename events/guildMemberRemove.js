const { MessageAttachment } = require("discord.js");
const db = require("quick.db");

module.exports = async (client, member) => {
  const settings = client.conf,
    channel = client.channels.cache.get(settings.Goodbye_System.Channel),
    embedWelcome = db.fetch(`wlcmEmbed_${member.guild.id}_${member.id}`);

  let fetchedMessages = await member.guild.channels.cache.get("512570600682684436").messages.fetch({ limit: 50 });
  fetchedMessages.forEach(async(msg) => {
    if(msg.author.id == member.id || msg.content.toLowerCase().includes(member.id)) {
      await msg.delete();
    }
  });

  if (embedWelcome) {
    let wlcmCh = client.channels.cache.get(embedWelcome.channel),
      msgDelete = await wlcmCh.messages.fetch(embedWelcome.msg);

    if (wlcmCh && msgDelete) msgDelete.delete();
  }

  let data = await db.all().filter((data) => data.ID.includes(member.id));
  data.forEach((data) => db.delete(data.ID));

  if (!settings.Goodbye_System.Enabled) return;

  if (settings.Goodbye_System.Type === "card") {
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

    channel.send({
      files: [new MessageAttachment(image.toBuffer(), "goodbye-image.png")],
    });
  } else if (settings.Goodbye_System.Type === "embed") {
    channel.send({
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
  } else if (settings.Goodbye_System.Type === "message") {
    channel.send(`${member} just left the server, hope you enjoyed your stay!`);
  } else if (settings.Goodbye_System.Type === "dm")
    member.user.send(
      `${member} we're sad to see you go! We hope to see you soon.`
    );
};
