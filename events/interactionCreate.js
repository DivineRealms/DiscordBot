const escapeRegex = (str) => str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
const utils = require("../handler/utilities");
const leveling = require("../utils/leveling.js");
const { QuickDB } = require("quick.db");
const db = new QuickDB();
const { MessageType, ChannelType, InteractionType } = require("discord.js");

const cooldownList = [];

module.exports = async (client, interaction) => {
  const message = interaction.message;
  const user = interaction.user;
  if(user.bot) return;

  if(interaction.type == InteractionType.ApplicationCommand) {
    const cmd = client.slashCommands.get(interaction.commandName);
    if (!cmd) return interaction.reply({ content: "> That slash command doesn't exist, contact bot developer.", ephemeral: true });

    interaction.member = interaction.guild.members.cache.get(interaction.user.id);
    
    let userPerms = [];
    cmd.permissions.forEach((perm) => {
      if(!interaction.channel.permissionsFor(interaction.member).has(perm)) {
        userPerms.push(perm);
      }
    });
    if(userPerms.length > 0) return interaction.reply({
      embeds: [
        client.utils.errorEmbed(
          client,
          interaction,
          `Insufficient permission.`
        ),
      ], ephemeral: true,
    });

    cmd.slashRun(client, interaction);
  }
};
