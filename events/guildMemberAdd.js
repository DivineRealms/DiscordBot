const { QuickDB } = require("quick.db");
const db = new QuickDB();

module.exports = async (client, member) => {
  const settings = client.conf.Welcome_System,
    channel = client.channels.cache.get(settings.Channel),
    newcomersChannel = client.channels.cache.get(
      client.conf.Settings.Newcomers_Channel
    );

  if (!settings.Enabled) return;

  if (newcomersChannel) {
    let newComMsg = await newcomersChannel
      .send({
        content: `${member.user.toString()} please accept the rules to proceed.`,
      });
    
    await db.set(`newcomers_${member.guild.id}_${member.id}`, `${newComMsg.id}`);
  }

  if (settings.Type == "message") {
    channel
      .send(
        `Welcome ${member} to the server, You are our ${member.guild.memberCount} member!`
      )
      .then(
        async (msg) =>
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
