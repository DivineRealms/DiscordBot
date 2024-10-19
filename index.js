const { Client, Partials, GatewayIntentBits, EmbedBuilder } = require("discord.js");
require("dotenv").config();
const { readdirSync } = require("fs");
const fs = require("fs");
const yaml = require("js-yaml");
const Enmap = require("enmap");
const express = require("express");
const playerRoutes = require("./routes/playerRoutes.js");
const leagueRoutes = require("./routes/leagueRoutes.js");
const { QuickDB } = require("quick.db");

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildModeration,
    GatewayIntentBits.GuildEmojisAndStickers,
    GatewayIntentBits.GuildVoiceStates,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.GuildMessageReactions,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.DirectMessages,
    GatewayIntentBits.DirectMessageReactions,
    GatewayIntentBits.GuildPresences,
    GatewayIntentBits.MessageContent,
  ],
  partials: [
    Partials.Message,
    Partials.Channel,
    Partials.Reaction,
    Partials.User,
    Partials.GuildMember,
  ],
});

client.db = new QuickDB();
client.conf = yaml.load(fs.readFileSync("./settings/config.yml", "utf8"));

client.commands = new Enmap();
client.slashCommands = new Enmap();
client.slashArray = [];
client.cmdCooldowns = [];
client.afk = new Enmap();
client.categories = new Enmap();
client.processes = new Enmap();
client.snipes = new Enmap();
client.voteBans = new Enmap();
client.talkedRecently = new Set();

client.embedBuilder = require("./utils/embedBuilder.js");
client.utils = require("./utils/utils.js");
client.paginateSelect = require("./utils/paginateSelect.js");

process.on("unhandledRejection", (error) => {
  if (client.isReady()) {
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
      .addFields({ name: "Error Occurred", value: `\`\`\`xl\n${error.stack}\n\`\`\``, inline: false })
      .setColor("#e24c4b")
      .setFooter({ text: `${error.name}` })
      .setTimestamp();

    let channel = client.channels.cache.get("512277268597309440");
    if (channel) channel.send({ embeds: [errEmbed] });
  }
  console.log(error.stack);
});

process.on("uncaughtException", (error) => {
  if (client.isReady()) {
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
      .addFields({ name: "Error Occurred", value: `\`\`\`xl\n${error.stack}\n\`\`\``, inline: false })
      .setColor("#e24c4b")
      .setFooter({ text: `${error.name}` })
      .setTimestamp();

    if (client.isReady) {
      let channel = client.channels.cache.get("512277268597309440");
      if (channel) channel.send({ embeds: [errEmbed] });
    }
  }
  console.log(error.stack);
});

// Commands //

for (const d of readdirSync("./commands/")) {
  client.categories.set(
    d,
    readdirSync(`./commands/${d}`).map((s) => s.split(".")[0])
  );
  for (const f of readdirSync(`./commands/${d}`)) {
    const commandData = require(`./commands/${d}/${f}`);
    if (commandData.slash == true) {
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

// Events //

for (const evt of readdirSync("./events"))
  client.on(
    evt.split(".")[0],
    require(`./events/${evt}`).bind(null, client)
  );

// Express Server //

if(client.conf.Settings.Server == true) {
  const app = express();
  app.use(express.json());

  app.use(async(req, res, next) => {
    res.client = client;
    next();
  });

  app.use("/players", playerRoutes);
  app.use("/leagues", leagueRoutes);

  app.listen(
    client.conf.Settings.Port || 7070,
    () =>
      `[SERVER] Server has started on port ${
        client.conf.Settings.port || 7070
      }.`
  );
}

client
  .login(process.env.TOKEN)
  .catch(() => console.log(`\x1b[0;37m[${date.toLocaleDateString()} ${date.toLocaleTimeString()}] \x1b[0;31m[Error] \x1b[0;37mInvalid token provided in Config`));