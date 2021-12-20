const db = require("quick.db");

module.exports = (client, oldMember, newMember) => {
  const settings = client.conf;
  let channel = client.channels.cache.get(settings.Automation.Boosts.Channel);

  if (settings.Welcome_System.Enabled) {
    if (
      settings.Welcome_System.Type === "embed" &&
      [...newMember.roles.cache.keys()].join("") !==
        [...oldMember.roles.cache.keys()].join("")
    ) {
      const addedRoles = newMember.roles.cache.filter(
        (r) => !oldMember.roles.cache.has(r.id)
      );

      const added = addedRoles.map((r) => r.id);
      const welcomeChannel = client.channels.cache.get(
        settings.Welcome_System.Channel
      );

      if (added.includes("597888019663421440")) {
        const embed = client
          .embedBuilder(client, "", "", "", "#ffdc5d")
          .setAuthor(
            `A new member appeared! (#${newMember.guild.memberCount})`,
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
  }

  if (
    newMember.guild.premiumSubscriptionCount !==
      oldMember.guild.premiumSubscriptionCount &&
    newMember.premiumSince &&
    newMember.premiumSince !== oldMember.premiumSince
  ) {
    const boosters = newMember.guild.premiumSubscriptionCount;

    if (settings.Automation.Boosts.Enabled)
      channel
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
                settings.Automation.Boosts.Thumbnail === "{member}"
                  ? newMember.user.displayAvatarURL({
                      dynamic: true,
                      format: "png",
                    })
                  : settings.Automation.Boosts.Thumbnail || null
              ),
          ],
        })
        .catch(() => {});
  }
};
