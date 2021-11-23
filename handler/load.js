const { MessageEmbed } = require('discord.js')
const { readdirSync } = require('fs')
const moment = require('moment-timezone')
const Enmap = require('enmap')

module.exports = async client => {
  Object.defineProperty(client, 'conf', { get: () => { delete require.cache[require.resolve('../settings/config')]; return require('../settings/config').config } })
  client.resolveMember = (str, user, title) => str.replace(/\{(.+)\}/, (...e) => e[1] === 'mention' && title ? user.toString() : user[e[1]])
  client.talkedRecently = new Set();
  client.categories = new Enmap()
  client.processes = new Enmap()
  client.commands = new Enmap()
  client.snipes = new Enmap()
  client.afk = new Enmap()
  client.embed = class Embed extends MessageEmbed { color = client.conf.settings.embedColor }
  const settings = { fetchAll: true, autoFetch: true, cloneLevel: 'deep' }
  client.defaultSettings = require('../settings/config').guildSettings
  client.settings = new Enmap({
    name: 'settings',
    ...settings
  })

  client.members = new Enmap({
    name: 'members',
    ...settings
  })
  
  const temporaryVC = require("../utils/temporaryVC.js");
  temporaryVC(client);
  
  client.db = require("quick.db")

  client.embedBuilder = require("../utils/embedBuilder.js");
  client.utils = require("../utils/utils.js");
  client.paginateSelect = require("../utils/paginateSelect.js");
  
  var date = new Date();
  
  process.on('unhandledRejection', error => {
    let ignoreErrors = [
    `DiscordAPIError: Unknown Message`,
    `DiscordAPIError: Missing Permissions`,
    `DiscordAPIError: Missing Access`,
    `DiscordAPIError: Unknown Channel`,
    `DiscordAPIError: Cannot send messages to this user`,
    "DiscordAPIError: Cannot execute action on a DM channel"
    ];
    let list = [];
    for (const ignore of ignoreErrors) {
    if (error.stack.includes(ignore)) list.push(true);
    };
    if (list.length !== 0) return null;
    let errEmbed = new MessageEmbed()
      .setAuthor(client.user.username, client.user.displayAvatarURL())
      .setDescription(`Error Occurred \`(${error.name})\`
\`(${moment.utc().tz('Europe/Belgrade').format('HH:mm:ss, DD/MM/YYYY.')})\`
  
\`\`\`xl\n${error.stack}\n\`\`\``)
      .setColor("RED");
    
    let log = client.channels.cache.get(client.conf.logging.Bot_Errors)
    
    if(log) log.send({ embeds: [errEmbed] })
  });
  
  process.on('uncaughtException', error => {
    let ignoreErrors = [
    `DiscordAPIError: Unknown Message`,
    `DiscordAPIError: Missing Permissions`,
    `DiscordAPIError: Missing Access`,
    `DiscordAPIError: Unknown Channel`,
    `DiscordAPIError: Cannot send messages to this user`,
    "DiscordAPIError: Cannot execute action on a DM channel"
    ];
    let list = [];
    for (const ignore of ignoreErrors) {
    if (error.stack.includes(ignore)) list.push(true);
    };
    if (list.length !== 0) return null;
    let errEmbed = new MessageEmbed()
      .setAuthor(client.user.username, client.user.displayAvatarURL())
      .setDescription(`Error Occurred \`(${error.name})\`
\`(${moment.utc().tz('Europe/Belgrade').format('HH:mm:ss, DD/MM/YYYY.')})\`
  
\`\`\`xl\n${error.stack}\n\`\`\``)
      .setColor("RED");
    
    let log = client.channels.cache.get(client.conf.logging.Bot_Errors)
    
    if(log) log.send({ embeds: [errEmbed] })
  });

  for (const d of readdirSync('./commands/')) {
    client.categories.set(d, readdirSync(`./commands/${d}`).map(s => s.split('.')[0]))
    for (const f of readdirSync(`./commands/${d}`))
      client.commands.set(f.split('.')[0], {...require(`../commands/${d}/${f}`), category: d })
  }

  for (const evt of readdirSync('./events'))
    client.on(evt.split('.')[0], require(`../events/${evt}`).bind(null, client))

  client.login(client.conf.settings.token).catch(() =>
    console.log('[Error] Invalid token provided in config')
  )
}
