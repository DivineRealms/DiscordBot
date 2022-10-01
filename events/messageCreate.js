const escapeRegex = (str) => str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
const utils = require("../handler/utilities");
const leveling = require("../utils/leveling.js");
const { QuickDB } = require("quick.db");
const db = new QuickDB();
const {
  MessageType,
  ChannelType,
  AttachmentBuilder,
  EmbedBuilder,
} = require("discord.js");
const { includes } = require("lodash");
const { contents } = require("cheerio/lib/api/traversing");
let msgCooldown;

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

  if (message.channel.id == client.conf.Settings.Announcement_Channel) {
    const contentSplit = message.content.split("\n");
    let defaultAliases = ["announcement", "an", "0"],
      upAliases = ["update", "up", "1"],
      mnAliases = ["maintenance", "main", "2"],
      suAliases = ["survey", "3"],
      najavaAliases = ["najava"];

    if (najavaAliases.includes(contentSplit[0].toLowerCase())) {
      const splitNajava = message.content.split("```");
      const najavaTitle = contentSplit[1];
      const najavaTime = contentSplit[2];
      const najavaField = contentSplit[3];

      let najavaContent = splitNajava[1].split("\n");
      if (najavaContent.length == 0)
        return message.channel
          .send({
            embeds: [
              client.utils.errorEmbed(
                client,
                message,
                `You need to add at least one match`
              ),
            ],
          })
          .then((msg) =>
            setTimeout(() => {
              message.delete();
              msg.delete();
            }, 3000)
          );

      let embed = client
        .embedBuilder(
          client,
          message,
          "",
          `${client.utils.timestampFormat(najavaTime)}`
        )
        .setAuthor({
          name: najavaTitle,
          iconURL: `https://cdn.upload.systems/uploads/sYDS6yZI.png`,
        })
        .setFooter({
          text: `Announcement by ${message.author.tag}`,
          iconURL: message.author.displayAvatarURL({
            size: 1024,
            dynamic: true,
          }),
        })
        .setTimestamp();

      najavaContent = client.utils.timestampFormat(najavaContent.join("\n"));

      embed.addFields([
        {
          name: najavaField,
          value: client.utils.findEmoji(client, najavaContent).join("\n"),
        },
      ]);

      message.channel.send({ embeds: [embed] }).then(() => {
        message.delete();
      });
    }

    if (
      (defaultAliases.includes(contentSplit[0].toLowerCase()) ||
        upAliases.includes(contentSplit[0].toLowerCase()) ||
        mnAliases.includes(contentSplit[0].toLowerCase()) ||
        suAliases.includes(contentSplit[0].toLowerCase())) &&
      !najavaAliases.includes(content[0].toLowerCase())
    ) {
      if (contentSplit.length < 3) {
        return message.channel
          .send({
            embeds: [
              client.utils.errorEmbed(
                client,
                message,
                `You didn't provide all arguments (Type/Title/Description)`
              ),
            ],
          })
          .then((msg) =>
            setTimeout(() => {
              message.delete();
              msg.delete();
            }, 3000)
          );
      }

      const type = contentSplit[0];
      const title = contentSplit[1];
      const description = contentSplit[2];
      let msgFields = contentSplit[3];

      let embed = client
        .embedBuilder(client, message, "", description)
        .setFooter({
          text: `Announcement by ${message.author.tag}`,
          iconURL: message.author.displayAvatarURL({
            size: 1024,
            dynamic: true,
          }),
        })
        .setTimestamp();

      if (msgFields) {
        msgFields = msgFields.split(/\s*\|\s*/);

        const fields = [];
        for (let i = 0; i < msgFields.length; i += 2)
          fields.push({ title: msgFields[i], description: msgFields[i + 1] });

        for (let i = 0; i < fields.length && fields.length <= 25; i++) {
          embed.addFields({
            name: fields[i].title,
            value: fields[i].description,
          });
          if (!fields[i].title || !fields[i].description) {
            return message.channel
              .send({
                embeds: [
                  client.utils.errorEmbed(
                    client,
                    message,
                    "You need to provide both a title and a description."
                  ),
                ],
              })
              .then((msg) =>
                setTimeout(() => {
                  message.delete();
                  msg.delete();
                }, 3000)
              );
          }
        }
      }

      if (upAliases.includes(type))
        embed.setColor("#7edd8a").setAuthor({
          name: title,
          iconURL: `https://cdn.upload.systems/uploads/aKT2mjr0.png`,
        });
      else if (mnAliases.includes(type))
        embed.setColor("#ffae63").setAuthor({
          name: title,
          iconURL: `https://cdn.upload.systems/uploads/vRfWnVT5.png`,
        });
      else if (suAliases.includes(type))
        embed.setAuthor({
          name: title,
          iconURL: `https://cdn.upload.systems/uploads/KSTCcy4V.png`,
        });
      else
        embed.setAuthor({
          name: title,
          iconURL: `https://cdn.upload.systems/uploads/sYDS6yZI.png`,
        });

      message.channel
        .send({ embeds: [embed] })
        .then(async () => await message.delete());
    }
  }

  if (message.channel.id == client.conf.Settings.Matchday_Channel) {
    let contentSplit = message.content.split("```");
    if (!contentSplit) return;
    const matchdayEmbed = client
      .embedBuilder(client, message, "", "")
      .setTitle(contentSplit[0].split("\n")[1]);

    if (contentSplit.length < 3)
      return message.channel
        .send({
          embeds: [
            client.utils.errorEmbed(
              client,
              message,
              `First two lines must be League & Round, while Matchday have to be in codeblock.`
            ),
          ],
        })
        .then((msg) =>
          setTimeout(() => {
            message.delete;
            msg.delete();
          }, 3000)
        );

    const league = contentSplit[0].split("\n")[0].toLowerCase();
    if (league.includes("fcfa"))
      matchdayEmbed
        .setAuthor({
          name: "FCFA Challenge League",
          iconURL: "https://i.imgur.com/WOLpIf2.png",
          url: "https://challenge.place/c/62aa8b995f6adfd26e923544/stage/6311f0d27f11701814dda779",
        })
        .setColor("#00a100");
    else if (league.includes("svebalkan"))
      matchdayEmbed
        .setAuthor({
          name: "Svebalkan League",
          iconURL: "https://i.imgur.com/JAJ18E5.png",
          url: "https://challenge.place/c/62aa8b995f6adfd26e923544/stage/6311ed215097d41839b2319b",
        })
        .setColor("#096feb");
    else if (league.includes("fcfa cup") || league.includes("cup"))
      matchdayEmbed
        .setAuthor({
          name: "FCFA Cup",
          iconURL: "https://i.imgur.com/fZBoubi.png",
          url: "https://challenge.place/c/62aa8b995f6adfd26e923544/stage/6311f6103034c2183a6bfe7f",
        })
        .setColor("#ef9f03");

    const splitLine = contentSplit[1].split("---");
    if (
      splitLine
        .map((r) => r.split("\n").filter(Boolean))
        .some((l) => l.length < 2)
    )
      return message.channel
        .send({
          embeds: [
            client.utils.errorEmbed(
              client,
              message,
              `You must provide Field Title & Referee.`
            ),
          ],
        })
        .then((msg) =>
          setTimeout(() => {
            message.delete();
            msg.delete();
          }, 3000)
        );

    for (const match of splitLine) {
      const matchArr = match.split("\n").filter(Boolean);
      let matchdayValue = "";

      let dateAndTeams = matchArr[0];
      let teamList = dateAndTeams.split("|")[1].trim();
      let firstEmoji = client.utils.getEmoji(client, teamList.split(" ")[0]);
      let secondEmoji = client.utils.getEmoji(
        client,
        teamList.split(" ")[teamList.split(" ").length - 1]
      );

      dateAndTeams = `<t:${Math.floor(
        new Date(`${dateAndTeams.split("|")[0]} GMT+2`).getTime() / 1000
      )}:t>`;
      dateAndTeams = `${dateAndTeams} ${firstEmoji} ${teamList} ${secondEmoji}`;

      const referee = matchArr[1];
      let teamA = matchArr[2];
      let teamB = matchArr[3];
      const fans = matchArr[4];
      const fcfa = matchArr[5];

      if (teamA && teamA != "N/A")
        matchdayValue += `${teamA.split(" ")[0].trim()} ${client.utils.getEmoji(
          client,
          teamA.split(":")[0].replace(/\**/gm, "")
        )} \`${teamA.split(" ").slice(1).join(" ")}\`\n`;
      if (teamB && teamB != "N/A")
        matchdayValue += `${teamB.split(" ")[0].trim()} ${client.utils.getEmoji(
          client,
          teamB.split(":")[0].replace(/\**/gm, "")
        )} \`${teamB.split(" ").slice(1).join(" ")}\`\n`;
      matchdayValue += `**Referee:** ${client.utils.getEmoji(
        client,
        "fcfa"
      )} \`${referee}\`\n`;
      if (fans && fans != "N/A")
        matchdayValue += `**Fans MOTM:** \`${fans}\`\n`;
      if (fcfa && fcfa != "N/A")
        matchdayValue += `**FCFA MOTM:** \`${fcfa}\`\n`;

      matchdayEmbed.addFields([
        {
          name: dateAndTeams,
          value: `>>> ${matchdayValue}`,
        },
      ]);
    }

    message.channel
      .send({ embeds: [matchdayEmbed] })
      .then(async () => await message.delete());
  }

  const rndmMessageChance = Math.floor(Math.random() * 1235);
  const lastAutoMsg = await db.get(`lastAutoMsg_${message.guild.id}`);
  if (!lastAutoMsg || 240000 - (Date.now() - lastAutoMsg) <= 0) {
    if (
      rndmMessageChance < 220 &&
      rndmMessageChance % 2 == 1 &&
      message.channel.id == client.conf.Automation.Auto_Messages.Channel
    ) {
      const autoMsgChannel = client.channels.cache.get(
        client.conf.Automation.Auto_Messages.Channel
      );

      autoMsgChannel
        .send({
          embeds: [
            client.embedBuilder(
              client,
              message,
              "",
              `${
                client.conf.Automation.Auto_Messages.List[
                  Math.floor(
                    Math.random() *
                      client.conf.Automation.Auto_Messages.List.length
                  )
                ]
              }`
            ),
          ],
        })
        .then((msg) => msg.delete(), 300000);

      await db.set(`lastAutoMsg_${message.guild.id}`, Date.now());
    }
  }

  const autoResponse = client.conf.Automation.Auto_Response;
  if (autoResponse.Enabled == true) {
    if (autoResponse.Channels.includes(message.channel.id)) {
      if (
        Object.keys(autoResponse.List).some(
          (w) =>
            message.content.toLowerCase().includes(w.toLowerCase()) ||
            message.content.toLowerCase() == w.toLowerCase()
        )
      ) {
        let rWord = Object.keys(autoResponse.List).filter((w) =>
          Object.keys(autoResponse.List).some((a) =>
            message.content.toLowerCase().includes(w.toLowerCase())
          )
        );
        let respIndex = Object.keys(autoResponse.List).indexOf(rWord[0]);

        let resp = Object.values(autoResponse.List)[respIndex];
        message
          .reply({
            embeds: [client.embedBuilder(client, message, "", `${resp}`)],
          })
          .then((msg) =>
            setTimeout(() => {
              message.delete();
              msg.delete();
            }, 60 * 1000)
          );
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
