const { QuickDB } = require("quick.db");
const db = new QuickDB();
const { InteractionType } = require("discord.js");

module.exports = async (client, interaction) => {
  const message = interaction.message;
  const user = interaction.user;
  if (user.bot) return;

  interaction.px = client.conf.Settings.Prefix;

  if (
    interaction.type == InteractionType.ApplicationCommand &&
    interaction.guild
  ) {
    const cmd = client.slashCommands.get(interaction.commandName);
    if (!cmd)
      return interaction.reply({
        content: "> That slash command doesn't exist, contact bot developer.",
        ephemeral: true,
      });

    interaction.member = interaction.guild.members.cache.get(
      interaction.user.id
    );

    let userPerms = [];
    cmd.permissions.forEach((perm) => {
      if (!interaction.channel.permissionsFor(interaction.member).has(perm)) {
        userPerms.push(perm);
      }
    });
    if (userPerms.length > 0)
      return interaction.reply({
        embeds: [
          client.utils.errorEmbed(
            client,
            interaction,
            `Insufficient permission.`
          ),
        ],
        ephemeral: true,
      });
    
    let findCooldown = client.cmdCooldowns.find(
      (c) => c.name == cmd.name && c.id == interaction.user.id
    );

    if (
      !client.conf.Automod.Bypass_Cooldown.some((r) =>
        interaction.member.roles.cache.has(r)
      )
    ) {
      if (findCooldown) {
        let time = client.utils.formatTime(findCooldown.expiring - Date.now());
        return interaction.reply({
          embeds: [
            client.utils.errorEmbed(
              client,
              interaction,
              `You can use that command again in ${time}.`
            ),
          ], ephemeral: true
        });
      } else if (!findCooldown && cmd.cooldown > 0) {
        console.log('kdksksks')
        let cooldown = {
          id: interaction.user.id,
          name: cmd.name,
          expiring: Date.now() + cmd.cooldown * 1000,
        };

        client.cmdCooldowns.push(cooldown);

        setTimeout(() => {
          client.cmdCooldowns.splice(client.cmdCooldowns.indexOf(cooldown), 1);
        }, cmd.cooldown * 1000);
      }
    }

    cmd.slashRun(client, interaction);
  }
};
