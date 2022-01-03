const db = require("quick.db");

const bump = (client) => {
  setInterval(async () => {
    let time = db.fetch(`serverBump_${client.conf.Settings.Guild_ID}`);
    let last = db.fetch(`lastBump_${client.conf.Settings.Guild_ID}`);
    if (time && Date.now() > time) {
      let bumpChannel = client.channels.cache.get(client.conf.Logging.Bumps);
      let embed = client
        .embedBuilder(
          client,
          null,
          "",
          "<:ArrowRightGray:813815804768026705>Server can be bumped again, use **`!d bump`**.",
          "#1cc0f9"
        )
        .setAuthor({
          name: "Server Bump",
          iconURL: `https://cdn.upload.systems/uploads/pVry3Mav.png`
        });

      db.delete(`serverBump_${client.conf.Settings.Guild_ID}`);
      if (bumpChannel)
        bumpChannel.send({ content: `<@!${last}>`, embeds: [embed] });
      db.delete(`lastBump_${client.conf.Settings.Guild_ID}`);
    }
  }, 30000);
};

module.exports = { bump };
