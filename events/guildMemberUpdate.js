const db = require("quick.db");

module.exports = (client, oldMember, newMember) => {
  const settings = client.conf;
  let channel = client.channels.cache.get(settings.Booster_Channel);

  if (
    settings.welcomeSystem.welcomeType === "embed" &&
    [...newMember.roles.cache.keys()].join("") !==
      [...oldMember.roles.cache.keys()].join("")
  ) {
    const addedRoles = newMember.roles.cache.filter(
      (r) => !oldMember.roles.cache.has(r.id)
    );

    const added = addedRoles.map((r) => r.id);
    const welcomeChannel = client.channels.cache.get(settings.welcomeSystem.welcomeChannel);

    if (added.includes("597888019663421440")) {
      const embed = client
        .embedBuilder(
          client,
          "",
          "",
          settings.welcomeSystem.welcomeEmbed.description,
          settings.welcomeSystem.welcomeEmbed.color
        )
        .setAuthor(
          settings.welcomeSystem.welcomeEmbed.title
            .replace("{username}", newMember.user.username)
            .replace("{joinPosition}", `${newMember.guild.memberCount}`),
          `https://cdn.upload.systems/uploads/hhgfsHXT.png`
        )
        .setThumbnail(newMember.displayAvatarURL({ size: 1024, dynamic: true }));

      if (welcomeChannel)
        welcomeChannel.send({ embeds: [embed] }).then((msg) =>
          db.set(`wlcmEmbed_${member.guild.id}_${member.id}`, {
            msg: msg.id,
            channel: msg.channel.id,
          })
        );
    }
  }

  if (
    newMember.guild.premiumSubscriptionCount !==
      oldMember.guild.premiumSubscriptionCount &&
    newMember.premiumSince &&
    newMember.premiumSince !== oldMember.premiumSince
  ) {
    const boosters = newMember.guild.premiumSubscriptionCount;

    if (channel)
      channel
        .send({
          embeds: [
            client
              .embedBuilder(
                client,
                "",
                settings.automation.Booster_Title.replace(
                  /{member}/,
                  newMember.user.username
                ),
                settings.automation.Booster_Message.replace(
                  /{member}/g,
                  newMember.user.username
                ).replace("{boosters}", boosters)
              )
              .setThumbnail(
                settings.automation.Booster_Thumbnail === "{member}"
                  ? newMember.user.displayAvatarURL({
                      dynamic: true,
                      format: "png",
                    })
                  : settings.automation.Booster_Thumbnail || null
              ),
          ],
        })
        .catch(() => {});
  }
};
