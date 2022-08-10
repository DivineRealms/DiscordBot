const { QuickDB } = require("quick.db");
const db = new QuickDB();

module.exports = async (client, member) => {
  const settings = client.conf,
    channel = client.channels.cache.get(settings.Goodbye_System.Channel),
    embedWelcome = await db.get(`wlcmEmbed_${member.guild.id}_${member.id}`),
    newcomersId = await db.get(`newcomers_${member.guild.id}_${member.id}`);

  if(client.conf.Settings.Save_Roles == true) {
    await db.set(`savedRoles_${member.guild.id}_${member.id}`, member.roles.cache);
  }

  if (newcomersId) {
    let nwcCh = client.channels.cache.get(newcomersId.channel);
    if (nwcCh)
      await nwcCh.messages.fetch(newcomersId.msg).then((msg) => msg.delete());
  }

  if (embedWelcome) {
    let wlcmCh = client.channels.cache.get(embedWelcome.channel);
    if (wlcmCh)
      await wlcmCh.messages.fetch(embedWelcome.msg).then((msg) => msg.delete());
  }

  let data = (await db.all()).filter((data) => data.id.includes(member.id));
  data.forEach(async (data) => {
    await db.delete(data.id);
  });

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
