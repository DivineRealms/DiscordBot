const { EmbedBuilder } = require("discord.js");
const { readdirSync } = require("fs");
const fs = require("fs");
const yaml = require("js-yaml");
const Enmap = require("enmap");
const express = require("express");
const playerRoutes = require("../routes/playerRoutes.js");
const leagueRoutes = require("../routes/leagueRoutes.js");

module.exports = async (client) => {
  client.conf = yaml.load(fs.readFileSync("./settings/config.yml", "utf8"));

  client.resolveMember = (str, user, title) =>
    str.replace(/\{(.+)\}/, (...e) =>
      e[1] === "mention" && title ? user.toString() : user[e[1]]
    );
  client.talkedRecently = new Set();
  client.categories = new Enmap();
  client.processes = new Enmap();
  client.commands = new Enmap();
  client.slashCommands = new Enmap();
  client.snipes = new Enmap();
  client.afk = new Enmap();
  client.slashArray = [];
  client.embed = class Embed extends EmbedBuilder {
    color = client.conf.Settings.Embed_Color;
  };
  const settings = { fetchAll: true, autoFetch: true, cloneLevel: "deep" };
  client.defaultSettings = client.conf.Guild_Settings;
  client.settings = new Enmap({
    name: "settings",
    ...settings,
  });

  const temporaryVC = require("../utils/temporaryVC.js");
  temporaryVC(client);

  client.db = require("quick.db");

  client.embedBuilder = require("../utils/embedBuilder.js");
  client.utils = require("../utils/utils.js");
  client.paginateSelect = require("../utils/paginateSelect.js");

  /* process.on("unhandledRejection", (error) => {
    if(client.isReady()) {
      let ignoreErrors = [
        `DiscordAPIError: Unknown Message`,
        `DiscordAPIError: Missing Permissions`,
        `DiscordAPIError: Missing Access`,
        `DiscordAPIError: Unknown Channel`,
        `DiscordAPIError: Cannot send messages to this user`,
        "DiscordAPIError: Cannot execute action on a DM channel",
      ];
      let list = [];
      for (const ignore of ignoreErrors) {
        if (error.stack.includes(ignore)) list.push(true);
      }
      if (list.length !== 0) return null;
      let errEmbed = new EmbedBuilder()
        .setAuthor({
          name: "Error Occurred",
          iconURL: `https://cdn.upload.systems/uploads/96HNGxzL.png`,
        })
        .setDescription(`\`\`\`xl\n${error.stack}\n\`\`\``)
        .setColor("#e24c4b")
        .setFooter({ text: `${error.name}` })
        .setTimestamp();
  
      let channel = client.channels.cache.get("512277268597309440");
      console.log(error.stack)


      if(channel) channel.send({ embeds: [errEmbed] });
    }
  });

  process.on("uncaughtException", (error) => {
    if(client.isReady()) {
      let ignoreErrors = [
        `DiscordAPIError: Unknown Message`,
        `DiscordAPIError: Missing Permissions`,
        `DiscordAPIError: Missing Access`,
        `DiscordAPIError: Unknown Channel`,
        `DiscordAPIError: Cannot send messages to this user`,
        "DiscordAPIError: Cannot execute action on a DM channel",
      ];
      let list = [];
      for (const ignore of ignoreErrors) {
        if (error.stack.includes(ignore)) list.push(true);
      }
      if (list.length !== 0) return null;
      let errEmbed = new EmbedBuilder()
        .setAuthor({
          name: "Error Occurred",
          iconURL: `https://cdn.upload.systems/uploads/96HNGxzL.png`,
        })
        .setDescription(`\`\`\`xl\n${error.stack}\n\`\`\``)
        .setColor("#e24c4b")
        .setFooter({ text: `${error.name}` })
        .setTimestamp();

      console.log(error.stack)
  
      let channel = client.channels.cache.get("512277268597309440");
      if(channel) channel.send({ embeds: [errEmbed] });
    }
  }); */

  for (const d of readdirSync("./commands/")) {
    client.categories.set(
      d,
      readdirSync(`./commands/${d}`).map((s) => s.split(".")[0])
    );
    for (const f of readdirSync(`./commands/${d}`)) {
      const commandData = require(`../commands/${d}/${f}`);
      if(commandData.slash == true) {
        client.slashCommands.set(commandData.name, {
          ...commandData,
          category: d,
        });
        client.slashArray.push(commandData);
      }
      client.commands.set(commandData.name, {
        ...commandData,
        category: d,
      });
    }
  }

  for (const evt of readdirSync("./events"))
    client.on(
      evt.split(".")[0],
      require(`../events/${evt}`).bind(null, client)
    );

  // Express Server //

  const app = express();
  app.use(express.json());
  app.use("/players", playerRoutes);
  app.use("/leagues", leagueRoutes);
  
  app.listen(client.conf.Settings.Port || 7070, () => `[SERVER] Server has started on port ${client.conf.Settings.port || 7070}.`);

  client
    .login(client.conf.Settings.Token)
    .catch(() => console.log("[Error] Invalid token provided in config"));
};
