const { QuickDB } = require("quick.db");
const db = new QuickDB();

const bump = (client) => {
  setInterval(async () => {
    let time = await db.get(`serverBump_${client.conf.Settings.Guild_ID}`);
    let last = await db.get(`lastBump_${client.conf.Settings.Guild_ID}`);
    if (time && Date.now() > time) {
      let bumpChannel = client.channels.cache.get(client.conf.Logging.Bumps);
      let embed = client
        .embedBuilder(client, null, "Server can be bumped again, use /bump", "", "#1cc0f9");

      await db.delete(`serverBump_${client.conf.Settings.Guild_ID}`);
      if (bumpChannel)
        bumpChannel.send({ content: `<@!${last}>`, embeds: [embed] });
      await db.delete(`lastBump_${client.conf.Settings.Guild_ID}`);
    }
  }, 30000);
};

module.exports = { bump };
