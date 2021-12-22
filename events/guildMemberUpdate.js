const db = require("quick.db");

module.exports = async (client, oldMember, newMember) => {
  const settings = client.conf;

  // Join
  if (
    settings.welcomeSystem.welcomeType === "embed" &&
    [...newMember.roles.cache.keys()].join("") !==
      [...oldMember.roles.cache.keys()].join("")
  ) {
    const addedRoles = newMember.roles.cache.filter(
      (r) => !oldMember.roles.cache.has(r.id)
    );

    const added = addedRoles.map((r) => r.id);
    const welcomeChannel = client.channels.cache.get(
      settings.welcomeSystem.welcomeChannel
    );

    if (added.includes("597888019663421440")) {
      const embed = client
        .embedBuilder(
          client,
          "",
          "",
          settings.welcomeSystem.welcomeEmbed.description.replace(
            "{member}",
            newMember.user.toString()
          ),
          settings.welcomeSystem.welcomeEmbed.color
        )
        .setAuthor(
          settings.welcomeSystem.welcomeEmbed.title
            .replace("{username}", newMember.user.username)
            .replace("{joinPosition}", `${newMember.guild.memberCount}`),
          `https://cdn.upload.systems/uploads/hhgfsHXT.png`
        )
        .setThumbnail(
          newMember.displayAvatarURL({ size: 1024, dynamic: true })
        );

      if (welcomeChannel)
        welcomeChannel.send({ embeds: [embed] }).then((msg) =>
          db.set(`wlcmEmbed_${newMember.guild.id}_${newMember.id}`, {
            msg: msg.id,
            channel: msg.channel.id,
          })
        );
    }
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

    if (removed.includes("597888019663421440")) {
      let embedWelcome = db.fetch(
        `wlcmEmbed_${oldMember.guild.id}_${newMember.id}`
      );

      if (embedWelcome) {
        let wlcmCh = client.channels.cache.get(embedWelcome.channel),
          msgDelete = await wlcmCh.messages.fetch(embedWelcome.msg);

        if (wlcmCh && msgDelete) msgDelete.delete();
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
