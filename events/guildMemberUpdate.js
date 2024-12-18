const { QuickDB } = require("quick.db");
const db = new QuickDB();

module.exports = async (client, oldMember, newMember) => {
  const settings = client.conf;
  const autoroleId = settings.Automod.Autorole;

  // Join
  if (
    settings.Welcome_System.Enabled &&
    settings.Welcome_System.Type === "embed" &&
    [...newMember.roles.cache.keys()].join("") !==
      [...oldMember.roles.cache.keys()].join("")
  ) {
    const welcomeChannel = client.channels.cache.get(
      settings.Welcome_System.Channel
    );

    const addedRoles = newMember.roles.cache.filter(
      (r) => !oldMember.roles.cache.has(r.id)
    );
    const added = addedRoles.map((r) => r.id);
    const autorole = added.includes(settings.Automod.Autorole);

    if (settings.Automod.Autorole && autorole) {
      let newcomersId = await db.get(
        `newcomers_${newMember.guild.id}_${newMember.id}`
      );

      if (newcomersId) {
        let nwcCh = client.channels.cache.get(
          settings.Settings.Newcomers_Channel
        );
        if (nwcCh)
          await nwcCh.messages
            .fetch(newcomersId.msg)
            .then((msg) => msg.delete())
            .catch((err) => {});
      }

      if (welcomeChannel) {
        await welcomeChannel
          .send({
            embeds: [
              client
                .embedBuilder(
                  client,
                  "",
                  `A new member appeared! (#${newMember.guild.memberCount})`,
                  `<:ArrowRightGray:813815804768026705>Welcome ${newMember.user.toString()} to **Divine Realms**.\n<:ArrowRightGray:813815804768026705>For more info, see <#818930313593487380>.`,
                  "#ffdc5d"
                )
                .setThumbnail(
                  newMember.displayAvatarURL({ size: 64, dynamic: true })
                ),
            ],
          })
          .then(
            async (msg) =>
              await db.set(`wlcmEmbed_${newMember.guild.id}_${newMember.id}`, {
                msg: msg.id,
              })
          );
      }
    }
  }

  if (
    [...newMember.roles.cache.keys()].join("") !==
    [...oldMember.roles.cache.keys()].join("")
  ) {
    const addedRoles = newMember.roles.cache.filter(
      (r) => !oldMember.roles.cache.has(r.id)
    );
    const added = addedRoles.map((r) => r.id);

    if (added.includes(client.conf.Settings.Mute_Role))
      await newMember.roles.remove(client.conf.Settings.Member_Role);

    const removedRoles = oldMember.roles.cache.filter(
      (r) => !newMember.roles.cache.has(r.id)
    );
    const removed = removedRoles.map((r) => r.id);

    if (removed.includes(client.conf.Settings.Mute_Role))
      await newMember.roles.add(client.conf.Settings.Member_Role);
  }

  if (oldMember.pending && !newMember.pending) {
    const savedRoles =
      (await db.get(`savedRoles_${newMember.guild.id}_${newMember.id}`)) || [];
    if (client.conf.Settings.Save_Roles == true && savedRoles) {
      savedRoles.forEach(async (r) => {
        await newMember.roles.add(r.id).catch((err) => {});
      });
      await db.delete(`savedRoles_${newMember.guild.id}_${newMember.id}`);
    }
    await newMember.roles.add(autoroleId);
  }

  // Leave
  if (
    settings.Welcome_System.Enabled &&
    settings.Welcome_System.Type === "embed" &&
    [...newMember.roles.cache.keys()].join("") !==
      [...oldMember.roles.cache.keys()].join("")
  ) {
    const removedRoles = oldMember.roles.cache.filter(
      (r) => !newMember.roles.cache.has(r.id)
    );

    const removed = removedRoles.map((r) => r.id);

    if (settings.Automod.Autorole && removed.includes(autoroleId)) {
      let newcomersId = await db.get(
          `newcomers_${oldMember.guild.id}_${newMember.id}`
        ),
        embedWelcome = await db.get(
          `wlcmEmbed_${oldMember.guild.id}_${newMember.id}`
        );

      if (newcomersId) {
        let nwcCh = client.channels.cache.get(
          settings.Settings.Newcomers_Channel
        );
        if (nwcCh)
          await nwcCh.messages
            .fetch(newcomersId.msg)
            .then((msg) => msg.delete())
            .catch((err) => {});
      }

      if (embedWelcome) {
        let wlcmCh = client.channels.cache.get(settings.Welcome_System.Channel);
        if (wlcmCh)
          await wlcmCh.messages
            .fetch(embedWelcome.msg)
            .then((msg) => msg.delete())
            .catch((err) => {});
      }
    }
  }

  if (!settings.Automation.Boosts.Enabled) return;

  if (
    newMember.guild.premiumSubscriptionCount !==
      oldMember.guild.premiumSubscriptionCount &&
    newMember.premiumSince &&
    newMember.premiumSince !== oldMember.premiumSince
  ) {
    const boosters = newMember.guild.premiumSubscriptionCount,
      boostChannel = client.channels.cache.get(
        settings.Automation.Boosts.Channel
      );

    boostChannel
      .send({
        embeds: [
          client
            .embedBuilder(
              client,
              "",
              `${newMember.user.username} just boosted the server!`,
              `Thank you ${newMember.user.username} for boosting the server! We now have ${boosters} booster(s)!`
            )
            .setThumbnail(
              boostSettings.Thumbnail === "{member}"
                ? newMember.user.displayAvatarURL({
                    dynamic: true,
                    format: "png",
                  })
                : boostSettings.Thumbnail || null
            ),
        ],
      })
      .catch(() => {});
  }
};
