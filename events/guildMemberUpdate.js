const { QuickDB } = require("quick.db");
const db = new QuickDB();

module.exports = async (client, oldMember, newMember) => {
  const settings = client.conf;

  // Join
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
      /*       let fetchedMessages = await oldMember.guild.channels.cache.get("512570600682684436").messages.fetch({ limit: 50 });
      fetchedMessages.forEach(async(msg) => {
        if(msg.author.id == oldMember.id || msg.content.toLowerCase().includes(oldMember.id)) {
          await msg.delete();
        }
      }); */

      if (welcomeChannel)
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
                .setAuthor({
                  name: `A new member appeared! (#${newMember.guild.memberCount})`,
                  iconURL: `https://cdn.upload.systems/uploads/hhgfsHXT.png`,
                })
                .setThumbnail(
                  newMember.displayAvatarURL({ size: 64, dynamic: true })
                ),
            ],
          })
          .then(
            async (msg) =>
              await db.set(`wlcmEmbed_${newMember.guild.id}_${newMember.id}`, {
                msg: msg.id,
                channel: msg.channel.id,
              })
          );
    }
  }

  if (oldMember.pending && !newMember.pending)
    await newMember.roles.add("597888019663421440");

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
      /*       let fetchedMessages = await oldMember.guild.channels.cache.get("512570600682684436").messages.fetch({ limit: 50 });
      fetchedMessages.forEach(async(msg) => {
        if(msg.author.id == oldMember.id || msg.content.toLowerCase().includes(oldMember.id)) {
          await msg.delete();
        }
      }); */

      let embedWelcome = await db.get(
        `wlcmEmbed_${oldMember.guild.id}_${newMember.id}`
      );

      if (embedWelcome) {
        let wlcmCh = client.channels.cache.get(embedWelcome.channel);
        if (wlcmCh)
          await wlcmCh.messages
            .fetch(embedWelcome.msg)
            .then((msg) => msg.delete());
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
