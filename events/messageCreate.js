const escapeRegex = (str) => str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
const utils = require("../handler/utilities");
const leveling = require("../utils/leveling.js");
const db = require("quick.db");

const cooldownList = [];

module.exports = async (client, message) => {
  if (message.channel.type == "DM") return;

  if (
    message.channel.id == "512570600682684436" &&
    !message.member.permissions.has("MANAGE_GUILD")
  ) {
    setTimeout(() => {
      message.delete();
    }, 600 * 1000);
  }

  if (message.author.id === "302050872383242240") {
    if (message.embeds[0].description.includes("Bump done")) {
      message.channel.messages.fetch().then((messages) => {
        let dbumper = messages
          .filter((msg) => msg.content.toLowerCase().startsWith("!d bump"))
          .map((msg) => msg.author.id);

        let bumpChannel = client.channels.cache.get(
          client.conf.logging.Bump_Channel
        );

        let bumpMsg = messages
          .filter((msg) => msg.content.toLowerCase().startsWith("!d bump"))
          .map((msg) => msg);

        let timeout = 7200000;
        let time = Date.now() + timeout;

        db.set(`serverBump_${client.conf.settings.guildID}`, time);
        db.set(`lastBump_${client.conf.settings.guildID}`, dbumper[0]);

        setTimeout(() => {
          let bumpAgain = client.embedBuilder(
            client,
            message,
            "Server Bump",
            "Server can be bumped again, use `!d bump`"
          );

          bumpChannel.send({
            content: `<@!${dbumper[0]}>`,
            embeds: [bumpAgain],
          });

          db.delete(`serverBump_${client.conf.settings.guildID}`);
          db.delete(`lastBump_${client.conf.settings.guildID}`);
        }, timeout);

        const bump = client.embedBuilder(
          client,
          message,
          "Server Bumped",
          "Thank you for bumping."
        );

        db.add(`bumps_${message.guild.id}_${dbumper[0]}`, 1);

        bumpMsg[0].reply({ embeds: [bump] });
      });
    }
  }

  if (!message.guild || message.author.bot) return;
  utils.automod(client, message);

  let level = db.fetch(`level_${message.guild.id}_${message.author.id}`);
  let xp = db.fetch(`xp_${message.guild.id}_${message.author.id}`);

  if (level == null || xp == null) {
    db.add(`level_${message.guild.id}_${message.author.id}`, 1);
    db.add(`xp_${message.guild.id}_${message.author.id}`, 1);
  }

  if (client.afk.has(message.author.id)) {
    message.channel
      .send(`> Hey ${message.author}, I removed your AFK Status`)
      .then((m) => setTimeout(() => m.delete(), 5000));

    client.afk.delete(message.author.id);

    return message.member
      .setNickname(message.member.displayName.replace(/(\[AFK\])/g, ""))
      .catch(() => {});
  }

  if (
    client.conf.leveling.enabled == true &&
    !client.conf.leveling.ignore_Xp_Channels.includes(message.channel.id)
  )
    await leveling.manageLeveling(client, message);

  const prefixRegex = new RegExp(
    `^(${
      client.conf.settings.mentionPrefix ? `<@!?${client.user.id}>|` : ""
    }${escapeRegex(message.px)})\\s*`
  );
  if (!prefixRegex.test(message.content)) return;

  const [, matchedPrefix] = message.content.match(prefixRegex);
  const args = message.content.slice(matchedPrefix.length).trim().split(/ +/);
  const cmd = args.shift().toLowerCase();
  const command = client.commands.find(
    (c, a) => a === cmd || (c.aliases && c.aliases.includes(cmd))
  );

  if (command) {
    let userPerms = [];
    command.permissions.forEach((perm) => {
      if (!message.channel.permissionsFor(message.member).has(perm)) {
        userPerms.push(perm);
      }
    });

    if (userPerms.length > 0)
      return message.channel
        .send({
          embeds: [
            client.embedBuilder(
              client,
              message,
              "Error",
              `You don't have Permission to use this command`,
              "error"
            ),
          ],
        })
        .then((m) => setTimeout(() => m.delete(), 7000));
    let findCooldown = cooldownList.find(
      (c) => c.name == command && c.id == message.author.id
    );

    if (
      !client.conf.automod.Bypass_Cooldown.some((r) =>
        message.member.roles.cache.has(r)
      )
    ) {
      if (findCooldown) {
        let time = client.utils.formatTime(findCooldown.expiring - Date.now());
        return message.channel.send({
          embeds: [
            client.embedBuilder(
              client,
              message,
              "Error",
              `You can use that command again in ${time}`,
              "error"
            ),
          ],
        });
      } else if (!findCooldown && command.cooldown > 0) {
        let cooldown = {
          id: message.author.id,
          name: command,
          expiring: Date.now() + command.cooldown * 1000,
        };

        cooldownList.push(cooldown);

        setTimeout(() => {
          cooldownList.splice(cooldownList.indexOf(cooldown), 1);
        }, command.cooldown * 1000);
      }
    }
  }

  let cmdChannels = client.conf.automod.Command_Channel.map((x) =>
    client.channels.cache.get(x)
  );

  if (
    !client.conf.automod.Command_Channel.includes(message.channel.id) &&
    !message.member.permissions.has("MANAGE_ROLES") &&
    !message.member.roles.cache.has(client.conf.automod.Bypass_Command)
  )
    return message.channel.send({
      embeds: [
        client.utils
          .errorEmbed(
            client,
            message,
            `Commands can only be used in ${cmdChannels.join(",").trim()}.`
          )
          .then((m) => setTimeout(() => m.delete(), 7000)),
      ],
    });

  if (command && !client.conf.economy.enabled && command.category === "economy")
    return message.channel.send({
      embeds: [
        client.utils.errorEmbed(
          client,
          message,
          "The economy hasn't been enabled!"
        ),
      ],
    });

  if (command) command.run(client, message, args);
};
