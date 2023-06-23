const Discord = require("discord.js");
const { QuickDB } = require("quick.db");
const db = new QuickDB();
const axios = require("axios");

function formatTime(ms) {
  let roundNumber = ms > 0 ? Math.floor : Math.ceil;
  let days = roundNumber(ms / 86400000),
    hours = roundNumber(ms / 3600000) % 24,
    mins = roundNumber(ms / 60000) % 60,
    secs = roundNumber(ms / 1000) % 60;
  var time = days > 0 ? `${days}d ` : "";
  time += hours > 0 ? `${hours}h ` : "";
  time += mins > 0 ? `${mins}m ` : "";
  time += secs > 0 ? `${secs}s` : "0s";
  return time;
}

function commandsList(client, message, category) {
  let commands = client.commands.filter(
    (c) => c.category == category && c.category != "owner"
  );
  let content = "";

  commands.forEach(
    (c) =>
      (content += `<:ArrowRightGray:813815804768026705>\`${client.conf.Settings.Prefix}${c.name}\`︲${c.description}\n`)
  );

  return content;
}

async function lbContent(client, message, lbType) {
  let leaderboard = (await db.all())
    .filter((data) => data.id.startsWith(`${lbType}_${message.guild.id}`))
    .sort((a, b) => b.value - a.value);
  let content = "";

  for (let i = 0; i < leaderboard.length; i++) {
    if (i === 10) break;

    content += `\`${i + 1}.\` <@!${leaderboard[i].id.split("_")[2]}>︲${
      leaderboard[i].value
    }\n`
      .replace("1.", "🥇")
      .replace("2.", "🥈")
      .replace("3.", "🥉");
  }

  return content;
}

async function lbVotes(client, message) {
  let leaderboard = (await db.get(`votes_${message.guild.id}`)) || [];
  leaderboard = leaderboard.sort((a, b) => b.votes - a.votes);

  let content = "";

  for (let i = 0; i < leaderboard.length; i++) {
    if (i == 10) break;

    content += `\`${i + 1}.\` **${leaderboard[i].nickname}**︲${
      leaderboard[i].votes
    }\n`
      .replace("1.", "🥇")
      .replace("2.", "🥈")
      .replace("3.", "🥉");
  }

  return content;
}

async function lbMoney(client, message) {
  let leaderboard = (await db.all())
    .filter((data) => data.id.startsWith(`money_${message.guild.id}`))
    .sort((a, b) => b.value - a.value);
  let content = "";
  let data = [];

  for (let i = 0; i < leaderboard.length; i++) {
    let bank =
      (await db.get(
        `bank_${message.guild.id}_${leaderboard[i].id.split("_")[2]}`
      )) || 0;
    let total = leaderboard[i].value + bank;

    data.push({
      user: leaderboard[i].id.split("_")[2],
      money: total,
    });
  }

  data = data.sort((a, b) => b.money - a.money);
  data = data.slice(0, `-${data.length - 10}`);
  data = data.sort((a, b) => b.money - a.money);

  for (let i = 0; i < data.length; i++) {
    content += `\`${i + 1}.\` <@!${data[i].user}>︲$${data[i].money}\n`
      .replace("1.", "🥇")
      .replace("2.", "🥈")
      .replace("3.", "🥉");
  }

  return content;
}

function errorEmbed(client, message, err) {
  return client.embedBuilder(client, message, err, "", "#e24c4b").setAuthor({
    name: err,
    iconURL: `https://cdn.upload.systems/uploads/96HNGxzL.png`,
  });
}

const updateVotesLb = async (client, guild) => {
  await axios
    .get(
      `https://minecraft-mp.com/api/?object=servers&element=voters&key=${client.conf.Settings.Vote_Key}&month=current&format=json?limit=10`
    )
    .then(async (res) => {
      await db.set(`votes_${guild.id}`, res.data.voters);
      await db.set(`untilVote_${guild.id}`, Date.now());
    });
};

const getEmoji = (client, emoji) =>
  client.emojis.cache.find(
    (e) =>
      e.name.toLowerCase() == emoji.toLowerCase() ||
      e.name.toLowerCase().includes(emoji.toLowerCase())
  );

const findEmoji = (client, text) => {
  const splitEmoji = text.split("\n");
  return splitEmoji.map((spl) => {
    spl = spl.split(" ");
    return spl
      .map((str) => {
        if (str.match(/(?<=:)(.*)(?=:)/gm) && !str.startsWith("<t:")) {
          str = str
            .toLowerCase()
            .replaceAll(/(:)(.*)(:)/gm, (a) =>
              getEmoji(client, a.replaceAll(/:/gm, ""))
            );
          return str;
        } else if (
          new Date(str).getTime() &&
          new Date(str) != "Invalid Date" &&
          !str.startsWith("<t:")
        ) {
          str = timestampFormat(str);
          return str;
        } else return str;
      })
      .join(" ");
  });
};

const timestampFormat = (text) =>
  text.replaceAll(
    /(0[1-9]|[1-2][0-9]|3[0-1])\/(0[1-9]|1[0-2])\/[0-9]{4} (2[0-3]|[01][0-9]):[0-5][0-9]/gm,
    (d) =>
      `<t:${Math.floor(
        new Date(
          d.split(" ")[0].split("/").reverse().join("-") + " " + d.split(" ")[1]
        ).getTime() / 1000
      )}:f>`
  );

const timestampShortFormat = (text) =>
  text.replaceAll(
    /(0[1-9]|[1-2][0-9]|3[0-1])\/(0[1-9]|1[0-2])\/[0-9]{4} (2[0-3]|[01][0-9]):[0-5][0-9]/gm,
    (d) =>
      `<t:${Math.floor(
        new Date(
          d.split(" ")[0].split("/").reverse().join("-") + " " + d.split(" ")[1]
        ).getTime() / 1000
      )}:t>`
  );

module.exports = {
  formatTime,
  commandsList,
  lbContent,
  lbMoney,
  lbVotes,
  errorEmbed,
  updateVotesLb,
  timestampFormat,
  timestampShortFormat,
  getEmoji,
  findEmoji,
};
