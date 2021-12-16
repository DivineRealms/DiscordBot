const db = require("quick.db");
const Discord = require("discord.js");

module.exports = async (client, reaction, user) => {
  if (reaction.message.partial) await reaction.message.fetch();
  if (user.bot || !reaction.message.guild) return;
  const starboard = client.conf.starBoard;
  const schannel = client.channels.cache.get(starboard.StarBoard_Channel);

  if (starboard.Enabled && reaction.message) {
    if (
      schannel &&
      starboard.Enabled &&
      reaction.emoji.name == starboard.StarBoard_Emoji
    ) {
      const stars = db.fetch(
        `stars_${reaction.message.guild.id}_${reaction.message.id}`
      );
      if (stars) {
        const board = await schannel.messages.fetch(stars).catch(() => {});
        if (!board)
          return db.delete(
            `stars_${reaction.message.guild.id}_${reaction.message.id}`
          );
        let star = /([0-9]{1,3})/.exec(board.content);
        board.content = `\`${starboard.StarBoard_Emoji}\` ${
          parseInt(star[1]) - 1
        }︲<#${reaction.message.channel.id}>`;
        board.edit({ content: `${board}` });
        if (parseInt(star[1]) - 1 <= 0) return board.delete();
      }
    }
  }
};
