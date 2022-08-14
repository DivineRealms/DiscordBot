const { QuickDB } = require("quick.db");
const db = new QuickDB();

module.exports = async (client, member) => {
  const settings = client.conf.Welcome_System,
    channel = client.channels.cache.get(settings.Channel);

  if (!settings.Enabled) return;

  let nwcCh = client.channels.cache.get(client.conf.Settings.Newcomers_Channel);
  if (nwcCh)
    nwcCh
      .send({
        content: `<a:walcome1_animiran:683092691793215490><a:walcome2_animiran:683092691571048449> ${member.user.toString()} please accept the rules to proceed.`,
      })
      .then(
        async (msg) =>
          await db.set(`newcomers_${member.guild.id}_${member.id}`, {
            msg: msg.id,
          })
      );

  if (settings.Type == "message") {
    channel
      .send(
        `Welcome ${member} to the server, You are our ${member.guild.memberCount} member!`
      )
      .then(
        async (msg) =>
          await db.set(`wlcmEmbed_${member.guild.id}_${member.id}`, {
            msg: msg.id,
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
