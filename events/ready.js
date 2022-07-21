const { ActionRowBuilder, ButtonBuilder, ButtonStyle, ActivityType } = require("discord.js");
const cron = require("cron");
const { QuickDB } = require("quick.db");
const db = new QuickDB();
const bumpReminder = require("../utils/bumpRemind.js");
const axios = require("axios");

module.exports = async (client) => {
  let date = new Date();
  console.log(
    `\x1b[0;37m[${date.toLocaleDateString()} ${date.toLocaleTimeString()}] \x1b[1;36m[INFO] \x1b[0;0mBot has started and is online now.`
  );

  const settings = client.conf.Settings.Bot_Activity;

  await client.application.commands.set(client.slashArray);

  let rand = Math.floor(Math.random() * settings.Activities.length);
  client.user.setActivity(
    settings.Activities[rand].replace("{count}", client.users.cache.size),
    {
      type: ActivityType[settings.Types[rand]],
    }
  );

  setInterval(() => {
    let index = Math.floor(Math.random() * settings.Activities.length);
    client.user.setActivity(
      settings.Activities[index].replace("{count}", client.users.cache.size),
      { type: ActivityType[settings.Types[rand]] }
    );
  }, 180000);

  const guild = client.guilds.cache.get(client.conf.Settings.Guild_ID);
  client.settings.ensure(guild.id, client.defaultSettings);

  function counter() {
    const settings = client.conf.Automation;

    const memberCount = client.channels.cache.get(
      settings.Member_Count.Channel
    );

    const channelCount = client.channels.cache.get(
      settings.Channel_Count.Channel
    );

    if (settings.Member_Count.Enabled)
      memberCount.setName(
        settings.Member_Count.Message.replace("{count}", guild.memberCount)
      );

    if (settings.Channel_Count.Enabled)
      channelCount.setName(
        settings.Channel_Count.Message.replace(
          "{count}",
          guild.channels.cache.size
        )
      );
  }

  async function birthday() {
    const isToday = (d) =>
      d
        ? new Date().getDate() === new Date(d).getDate() &&
          new Date().getMonth() === new Date(d).getMonth()
        : false;
    const settings = client.conf.Birthday_System;
    const channel = client.channels.cache.get(settings.Channel);
    const today = new Date().getMonth() + " " + new Date().getDate();
    if (
      !settings.Enabled ||
      client.settings.get(guild.id, "birthday") === today
    )
      return;

    let birthdays = (await db.all())
      .filter((i) => i.ID.startsWith(`birthday_${guild.id}_`))
      .sort((a, b) => b.data - a.data);

    let birthEmbed = birthdays
      .filter((b) => isToday(b.data))
      .map((s) => {
        let bUser = client.users.cache.get(s.ID.split("_")[2]) || "N/A";
        return `${bUser}\n`;
      });

    const embed = client
      .embedBuilder(
        client,
        null,
        "",
        `<:ArrowRightGray:813815804768026705>**Happy Birthday** to the following member(s)!\n\n${birthEmbed}`
      )
      .setAuthor({
        name: "It's someone's birthday!",
        iconURL: `https://i.imgur.com/aFVnmaL.png`,
      })
      .setThumbnail(`https://i.imgur.com/dmu7XSb.png`);

    const reminder = client
      .embedBuilder(client, null, "", "", "#2f3136")
      .setAuthor({
        name: 'Psst, use ".addbirthday Month Day Year" to set your birthday.',
      });

    if (channel && birthEmbed.length > 0)
      channel.send({ embeds: [embed, reminder] });
  }

  let bdayCron = new cron.CronJob("59 59 11 * * *", () => birthday(), {
    timezone: "Europe/Belgrade",
  });

  bdayCron.start();

  bumpReminder.bump(client);

  let voteCron = new cron.CronJob(
    "0 0 13,21 * * *",
    () => {
      let generalCh = client.channels.cache.get("512274978754920463");
      const voteRow = new ActionRowBuilder().addComponents(
        [
          new ButtonBuilder()
            .setURL(`https://minecraft-mp.com/server/295045/vote/`)
            .setLabel("Vote for Divine Realms")
            .setStyle(ButtonStyle.Link),
        ],
        [
          new ButtonBuilder()
            .setURL(`https://minecraft-mp.com/server/296478/vote/`)
            .setLabel("Support HogRealms")
            .setStyle(ButtonStyle.Link),
        ]
      );
      if (generalCh)
        generalCh.send({
          embeds: [
            client.embedBuilder(client, "", "", "", "#8ee26b").setAuthor({
              name: "Click the buttons below to vote and help us climb the leaderboard.",
              iconURL: `https://cdn.upload.systems/uploads/U5K71mCE.png`,
            }),
          ],
          components: [voteRow],
        });
    },
    { timezone: "Europe/Belgrade" }
  );

  voteCron.start();

  let voteLeaderboardCron = new cron.CronJob(
    "0 0 */2 * * *",
    () => {
      axios
        .get(
          `https://minecraft-mp.com/api/?object=servers&element=voters&key=${client.conf.Settings.Vote_Key}&month=current&format=json?limit=10`
        )
        .then(async(res) => {
          await db.set(`votes_${guild.id}`, res.data.voters);
          await db.set(`untilVote_${guild.id}`, Date.now());
        });
    },
    { timezone: "Europe/Belgrade" }
  );

  voteLeaderboardCron.start();

  while (guild) {
    counter();
    await new Promise((r) => setTimeout(r, 310000));
  }
};
