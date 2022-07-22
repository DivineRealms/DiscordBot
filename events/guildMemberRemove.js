const { AttachmentBuilder } = require("discord.js");
const { QuickDB } = require("quick.db");
const db = new QuickDB();

module.exports = async (client, member) => {
  const settings = client.conf,
    channel = client.channels.cache.get(settings.Goodbye_System.Channel),
    embedWelcome = await db.get(`wlcmEmbed_${member.guild.id}_${member.id}`);

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

  let data = (await db.all()).filter((data) => data.id.includes(member.id));
  data.forEach(async(data) => await db.delete(data.id));

  if (!settings.Goodbye_System.Enabled) return;

  if (settings.Goodbye_System.Type === "embed") {
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
