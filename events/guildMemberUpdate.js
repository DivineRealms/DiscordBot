const db = require("quick.db");

module.exports = (client, oldMember, newMember) => {
  const settings = client.conf;

  if (
    settings.Welcome_System.Enabled &&
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
      welcomeChannel
        .send({
          embeds: [
            client
              .embedBuilder(
                client,
                "",
                "",
                `<:ArrowRightGray:813815804768026705>Welcome ${newMember.user.toString()} to **Divine Realms**.\n<:ArrowRightGray:813815804768026705>For more info, see <#818930313593487380>.`,
                "#ffdc5d"
              )
              .setAuthor(
                `A new member appeared! (#${newMember.guild.memberCount})`,
                `https://cdn.upload.systems/uploads/hhgfsHXT.png`
              )
              .setThumbnail(
                newMember.displayAvatarURL({ size: 64, dynamic: true })
              ),
          ],
        })
        .then((msg) =>
          db.set(`wlcmEmbed_${newMember.guild.id}_${newMember.id}`, {
            msg: msg.id,
            channel: msg.channel.id,
          })
        );
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
