const { chunk } = require("lodash");

module.exports = {
  name: "applications",
  category: "utility",
  description: "View the available applications in the channel.",
  permissions: [],
  cooldown: 0,
  aliases: [],
  usage: "applications",
  slash: true
};

module.exports.run = async (client, message, args) => {
  const applications = client.conf.Application_System.Applications.filter(
    (s) => !s.Channel || s.Channel === message.channel.id
  );

  if (!client.conf.Application_System.Enabled)
    return message.channel.send({
      embeds: [
        client.utils.errorEmbed(
          client,
          message,
          "Application System is not enabled."
        ),
      ],
    });

  const apps = chunk(
    applications.map((app, i) => `**Application ${i + 1}:** ${app.Name}`),
    5
  );

  const embed = client.embedBuilder(
    client,
    message,
    "Application Menu",
    `Please select what application you would like to apply for.\n\nUse the reactions to flip through the applications on the server.\n\n${apps[0].join(
      "\n"
    )}\n\u200b`
  );

  if (!applications.length)
    return message.channel.send({
      embeds: [
        client.utils.errorEmbed(
          client,
          message,
          "I couldn't find any applications available in this channel!"
        ),
      ],
    });

  message.channel.send({ embeds: [embed] }).then(async (emb) => {
    if (!apps[1]) return;
    ["⏮️", "◀️", "▶️", "⏭️", "⏹️"].forEach(async (m) => await emb.react(m));

    const filter = (_, u) => u.id === message.author.id;
    const collector = emb.createReactionCollector({ filter, time: 300000 });
    let page = 1;
    collector.on("collect", async (r, user) => {
      let current = page;
      emb.reactions.cache.get(r.emoji.name).users.remove(user.id);
      if (r.emoji.name === "◀️" && page !== 1) page--;
      else if (r.emoji.name === "▶️" && page !== apps.length) page++;
      else if (r.emoji.name === "⏮️") page = 1;
      else if (r.emoji.name === "⏭️") page = apps.length;
      else if (r.emoji.name === "⏹️") return collector.stop();

      embed.setDescription(
        `Please select which application you would like to apply to.\nUse the reactions to flip pages\n\n${apps[
          page - 1
        ].join("\n")}\n\u200b`
      );
      if (current !== page)
        emb.edit({
          embeds: [
            embed.setFooter({
              text: `Pages ${page}/${apps.length} - This only contains applications allowed in this channel.`,
            }),
          ],
        });
    });
  });
};

module.exports.slashRun = async (client, interaction) => {
  const applications = client.conf.Application_System.Applications.filter(
    (s) => !s.Channel || s.Channel === interaction.channel.id
  );

  if (!client.conf.Application_System.Enabled)
    return interaction.reply({
      embeds: [
        client.utils.errorEmbed(
          client,
          interaction,
          "Application System is not enabled."
        ),
      ],
    });

  const apps = chunk(
    applications.map((app, i) => `**Application ${i + 1}:** ${app.Name}`),
    5
  );

  const embed = client.embedBuilder(
    client,
    interaction,
    "Application Menu",
    `Please select what application you would like to apply for.\n\nUse the reactions to flip through the applications on the server.\n\n${apps[0].join(
      "\n"
    )}\n\u200b`
  );

  if (!applications.length)
    return interaction.reply({
      embeds: [
        client.utils.errorEmbed(
          client,
          interaction,
          "I couldn't find any applications available in this channel!"
        ),
      ],
    });

  interaction.reply({ embeds: [embed] }).then(async (emb) => {
    if (!apps[1]) return;
    ["⏮️", "◀️", "▶️", "⏭️", "⏹️"].forEach(async (m) => await emb.react(m));

    const filter = (_, u) => u.id === interaction.user.id;
    const collector = emb.createReactionCollector({ filter, time: 300000 });
    let page = 1;
    collector.on("collect", async (r, user) => {
      let current = page;
      emb.reactions.cache.get(r.emoji.name).users.remove(user.id);
      if (r.emoji.name === "◀️" && page !== 1) page--;
      else if (r.emoji.name === "▶️" && page !== apps.length) page++;
      else if (r.emoji.name === "⏮️") page = 1;
      else if (r.emoji.name === "⏭️") page = apps.length;
      else if (r.emoji.name === "⏹️") return collector.stop();

      embed.setDescription(
        `Please select which application you would like to apply to.\nUse the reactions to flip pages\n\n${apps[
          page - 1
        ].join("\n")}\n\u200b`
      );
      if (current !== page)
        emb.edit({
          embeds: [
            embed.setFooter({
              text: `Pages ${page}/${apps.length} - This only contains applications allowed in this channel.`,
            }),
          ],
        });
    });
  });
};
