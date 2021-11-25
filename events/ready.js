const muteChecks = require("../utils/muteChecks.js");
const { MessageActionRow, MessageButton } = require('discord.js')
const cron = require('cron');
const db = require('quick.db')
const bumpReminder = require("../utils/bumpRemind.js")

module.exports = async client => {
  console.log(" ")
  console.log(" ____  _       _            ____            _               ")
  console.log("|  _ \\(_)_   _(_)_ __   ___|  _ \\ ___  __ _| |_ __ ___  ___ ");
  console.log("| | | | \\ \\ / / | '_ \\ / _ \\ |_) / _ \\/ _` | | '_ ` _ \\/ __|");
  console.log("| |_| | |\\ V /| | | | |  __/  _ <  __/ (_| | | | | | | \\__ \\");
  console.log("|____/|_| \\_/ |_|_| |_|\\___|_| \\_\\___|\\__,_|_|_| |_| |_|___/");
  console.log(" ")
  console.log("             Bot has started and is online now");
  console.log(" ");

  if (!client.conf.settings.changingActivity.enabled) {
    const settings = client.conf.settings.botActivity
    client.user.setActivity(settings.activity.name, { type: settings.activity.type })
  } else {
    const settings = client.conf.settings.changingActivity
    let rand = Math.floor(Math.random() * (settings.activities.length - 1) + 1)
    client.user.setActivity(settings.activities[rand], { type: settings.types[rand] })
    let interval = setInterval(() => {
      if (!settings.enabled) return clearInterval(interval)
      let index = Math.floor(Math.random() * (settings.activities.length - 1) + 1);
      client.user.setActivity(settings.activities[index], { type: settings.types[index] })
    }, 180000);
  }

  const guild = client.guilds.cache.get(client.conf.settings.GuildID)
    client.members.ensure(guild.id, {})
    client.settings.ensure(guild.id, client.defaultSettings)

  await muteChecks.checkMute(client, guild);

  function counter() {
    const memberCount = client.channels.cache.get(client.conf.automation.Member_Count_Channel)
    const channelCount = client.channels.cache.get(client.conf.automation.Channel_Count_Channel)

    if (memberCount) memberCount.setName(client.conf.automation.Member_Count_Message.replace('{count}', guild.memberCount))
    if (channelCount) channelCount.setName(client.conf.automation.Channel_Count_Message.replace('{count}', guild.channels.cache.size))
  }

  function birthday() {
    const isToday = d => d ? new Date().getDate() === new Date(d).getDate() && new Date().getMonth() === new Date(d).getMonth() : false
    const settings = client.conf.birthdaySystem
    const channel = client.channels.cache.get(settings.birthdayChannel)
    const today = new Date().getMonth() + ' ' + new Date().getDate()
    if (!settings.enabled || client.settings.get(guild.id, 'birthday') === today) return

    let birthdays = db.all().filter(i => i.ID.startsWith(`birthday_${guild.id}_`)).sort((a, b) => b.data - a.data);

    let birthEmbed = birthdays.filter((b) => isToday(b.data)).map(s => {
      let bUser = client.users.cache.get(s.ID.split("_")[2]) || "N/A";
      return `> ${bUser}\n`;
    })

    const embed = new client.embedBuilder(client, "", "Todays Birthdays!", `${settings.birthdayMessage}\n${birthEmbed}`)

    if (channel && birthEmbed.length > 0) channel.send({ embeds: [embed] })
  }

  let bdayCron = new cron.CronJob('59 59 23 * * *', () => {
    birthday();
  }, {
  	  timezone: "Europe/Belgrade"
  });
  
  bdayCron.start();
  
  bumpReminder.bump(client);
  
  let voteCron = new cron.CronJob('0 0 1,7,11,20 * * *', () => {
    let generalCh = client.channels.cache.get("512274978754920463");
    const voteRow = new MessageActionRow()
      .addComponents(
        new MessageButton()
        .setURL(`https://minecraft-mp.com/server/295045/vote/`)
        .setLabel("Vote")
        .setStyle('LINK')
      );
    if(generalCh) generalCh.send({ embeds: [client.embedBuilder(client, "", "Minecraft-MP", "Click the button below to vote for our server and help us climb the leaderboard.")], components: [voteRow] });
  }, {
  	  timezone: "Europe/Belgrade"
  });
  
  voteCron.start(); 

  while (guild) {
    counter()
    await new Promise(r => setTimeout(r, 310000))
  }
}
