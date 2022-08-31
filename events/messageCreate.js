const escapeRegex = (str) => str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
const utils = require("../handler/utilities");
const leveling = require("../utils/leveling.js");
const { QuickDB } = require("quick.db");
const db = new QuickDB();
const { MessageType, ChannelType } = require("discord.js");

module.exports = async (client, message) => {
  if (message.channel.type == ChannelType.DM) return;

  if (
    message.author.id === "302050872383242240" &&
    message.type == MessageType.ChatInputCommand
  ) {
    if (message.embeds[0].data.description.includes("Bump done")) {
      let dbumper = message.interaction.user.id;
      let bumpChannel = client.channels.cache.get(client.conf.Logging.Bumps);

      let timeout = 7200000;
      let time = Date.now() + timeout;

      await db.set(`serverBump_${client.conf.Settings.Guild_ID}`, time);
      await db.set(`lastBump_${client.conf.Settings.Guild_ID}`, dbumper);

      setTimeout(async () => {
        let bumpAgain = client
          .embedBuilder(client, message, "", "", "#1cc0f9")
          .setAuthor({
            name: "Server can be bumped again, use /bump",
            iconURL: `https://cdn.upload.systems/uploads/pVry3Mav.png`,
          });

        if (client.conf.Logging.Enabled)
          bumpChannel.send({
            content: `<@!${dbumper}>`,
            embeds: [bumpAgain],
          });

        await db.delete(`serverBump_${client.conf.Settings.Guild_ID}`);
        await db.delete(`lastBump_${client.conf.Settings.Guild_ID}`);
      }, timeout);

      const bump = client
        .embedBuilder(client, message, "", "", "#1cc0f9")
        .setAuthor({
          name: "Thank you for bumping! You've received $1000 as a reward.",
          iconURL: `https://cdn.upload.systems/uploads/pVry3Mav.png`,
        });

      await db.add(`bumps_${message.guild.id}_${dbumper}`, 1);
      await db.add(`money_${message.guild.id}_${dbumper}`, 1000);

      if (client.conf.Logging.Enabled) message.reply({ embeds: [bump] });
    }
  }

  if (!message.guild || message.author.bot) return;
  utils.automod(client, message);

  let level = await db.get(`level_${message.guild.id}_${message.author.id}`);
  let xp = await db.get(`xp_${message.guild.id}_${message.author.id}`);

  if (level == null || xp == null) {
    await db.add(`level_${message.guild.id}_${message.author.id}`, 1);
    await db.add(`xp_${message.guild.id}_${message.author.id}`, 1);
  }

  const autoResponse = client.conf.Automation.Auto_Response;
  if(autoResponse.Enabled == true) {
    if(autoResponse.Channels.includes(message.channel.id)) {
      if(Object.keys(autoResponse.List).some((w) => message.content.toLowerCase() == w.toLowerCase() || message.content.toLowerCase().startsWith(w.toLowerCase()) || message.content.toLowerCase().includes(w.toLowerCase()))) {
        let rWord = Object.keys(autoResponse.List).filter((w) => Object.keys(autoResponse.List).some((a) => message.content.toLowerCase().includes(w.toLowerCase())));
        let respIndex = Object.keys(autoResponse.List).indexOf(rWord[0]);
        
        let resp = Object.values(autoResponse.List)[respIndex];
        message.channel.send({
          embeds: [
            client.embedBuilder(client, message, "", `${resp}`).setAuthor({
              name: `Auto Response`,
              iconURL: message.author.displayAvatarURL({ dynamic: true }),
            }),
          ],
        });
      }
    }
  }

  if (client.afk.has(message.author.id)) {
    message.channel
      .send(
        `<:ArrowRightGray:813815804768026705>Hey ${message.author}, I removed your AFK Status.`
      )
      .then((m) => setTimeout(() => m.delete(), 5000));

    client.afk.delete(message.author.id);

    return message.member
      .setNickname(message.member.displayName.replace(/(\[AFK\])/g, ""))
      .catch(() => {});
  }

  if (
    client.conf.Leveling.Enabled &&
    !client.conf.Leveling.Ignore_XP_Channels.includes(message.channel.id)
  )
    await leveling.manageLeveling(client, message);

  const prefixRegex = new RegExp(
    `^(${
      client.conf.Settings.Mention_Prefix ? `<@!?${client.user.id}>|` : ""
    }${escapeRegex(message.px)})\\s*`
  );

  if (!prefixRegex.test(message.content)) return;

  const [, matchedPrefix] = message.content.match(prefixRegex);
  const args = message.content.slice(matchedPrefix.length).trim().split(/ +/);
  const cmd = args.shift().toLowerCase();
  const command = client.commands.find(
    (c, a) => a == cmd || (c.aliases && c.aliases.includes(cmd))
  );
  if (!command) return;

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
            client.utils.errorEmbed(
              client,
              message,
              `Insufficient permission.`
            ),
          ],
        })
        .then((m) => setTimeout(() => m.delete(), 7000));

    let findCooldown = client.cmdCooldowns.find(
      (c) => c.name == command.name && c.id == message.author.id
    );

    if (
      !client.conf.Automod.Bypass_Cooldown.some((r) =>
        message.member.roles.cache.has(r)
      )
    ) {
      if (findCooldown) {
        let time = client.utils.formatTime(findCooldown.expiring - Date.now());
        return message.channel.send({
          embeds: [
            client.utils.errorEmbed(
              client,
              message,
              `You can use that command again in ${time}.`
            ),
          ],
        });
      } else if (!findCooldown && command.cooldown > 0) {
        let cooldown = {
          id: message.author.id,
          name: command.name,
          expiring: Date.now() + command.cooldown * 1000,
        };

        client.cmdCooldowns.push(cooldown);

        setTimeout(() => {
          client.cmdCooldowns.splice(client.cmdCooldowns.indexOf(cooldown), 1);
        }, command.cooldown * 1000);
      }
    }
  }

  if (
    !client.conf.Automod.Commands_Channel.includes(message.channel.id) &&
    !message.member.permissions.has("ManageRoles") &&
    !message.member.roles.cache.has(client.conf.Automod.Bypass_Command) &&
    command.name != "eval"
  )
    return message.channel
      .send({
        embeds: [
          client.utils.errorEmbed(
            client,
            message,
            `Please use the commands channel.`
          ),
        ],
      })
      .then((m) => setTimeout(() => m.delete(), 7000));

  if (command && !client.conf.Economy.Enabled && command.category === "economy")
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
