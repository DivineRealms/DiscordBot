module.exports = (client) => {
  if (!client.conf.Settings.Token)
    throw new Error("Please enter a bot token in the config");
  if (!client.conf.Settings.Embed_Color)
    throw new Error("Please enter a embed color in the config");
  if (!client.conf.Settings.Guild_ID)
    throw new Error(
      "Please enter the server id that this bot will be in, in the config."
    );
  if (!client.conf.Settings.Prefix)
    throw new Error("Please enter the bot prefix in the config");
  if (client.conf.Settings.Owner_Discord_ID.length == 0)
    throw new Error(
      "Please enter you discord id in the BotOwnerDiscordID section in the config"
    );
};
