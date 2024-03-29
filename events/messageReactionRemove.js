const { QuickDB } = require("quick.db");
const db = new QuickDB();
const Discord = require("discord.js");

module.exports = async (client, reaction, user) => {
  if (reaction.message.partial) await reaction.message.fetch();
  if (user.bot || !reaction.message.guild) return;

  const starboard = client.conf.Starboard;
  const schannel = client.channels.cache.get(starboard.Channel);

  if (starboard.Enabled && reaction.message) {
    if (
      schannel &&
      starboard.Enabled &&
      reaction.emoji.name == starboard.Emoji
    ) {
      const stars = await db.get(
        `stars_${reaction.message.guild.id}_${reaction.message.id}`
      );
      if (stars) {
        const board = await schannel.messages.fetch(stars).catch(() => {});
        if (!board)
          return await db.delete(
            `stars_${reaction.message.guild.id}_${reaction.message.id}`
          );
        let star = /([0-9]{1,3})/.exec(board.content);
        board.content = `\`${starboard.Emoji}\` ${parseInt(star[1]) - 1}︲<#${
          reaction.message.channel.id
        }>`;
        board.edit({ content: `${board}` });
        if (parseInt(star[1]) - 1 <= 0) return board.delete();
      }
    }
  }
};
