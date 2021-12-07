module.exports = (client, oldMember, newMember) => {
  const settings = client.conf.automation,
    channel = client.channels.cache.get(settings.Booster_Channel);

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
                settings.Booster_Title.replace(
                  /{member}/,
                  newMember.user.username
                ),
                settings.Booster_Message.replace(
                  /{member}/g,
                  newMember.user.username
                ).replace("{boosters}", boosters)
              )
              .setThumbnail(
                settings.Booster_Thumbnail === "{member}"
                  ? newMember.user.displayAvatarURL({
                      dynamic: true,
                      format: "png",
                    })
                  : settings.Booster_Thumbnail || null
              ),
          ],
        })
        .catch(() => {});
  }
};
