const db = require("quick.db");
const ms = require("ms");

module.exports.automod = async (client, message) => {
  message.px = client.conf.Settings.Prefix;

  if (
    message.mentions.users.first() &&
    client.afk.has(message.mentions.users.first().id)
  ) {
    const user = message.mentions.users.first();

    const embedAfk = client.embedBuilder(
      client,
      "",
      `${user.username} is currently afk`,
      `**Reason:** ${client.afk.get(user.id).message}, went AFK ${ms(
        Date.now() - client.afk.get(user.id).time,
        { long: true }
      )} ago`
    );

    message.channel.send({ embeds: [embedAfk] });
  }

  if (client.conf.Counting.Enabled) {
    if (message.channel.id === client.conf.Counting.Channel) {
      const { current, last } = client.settings.get(
        message.guild.id,
        "counting"
      );

      if (message.content != current) {
        message.delete();
        if (current !== 1 && client.conf.Counting.Restart_On_Incorrect_Number)
          client.settings.set(message.guild.id, 1, "counting.current");
        return message.channel
          .send({
            embeds: [
              client.utils.errorEmbed(
                client,
                message,
                `Wrong number ${message.author.username}, The current number is ${current}!` +
                  "\n" +
                  (current !== 1 &&
                  client.conf.Counting.Restart_On_Incorrect_Number
                    ? "The countdown has been reset back to 1!"
                    : "")
              ),
            ],
          })
          .then((msg) => setTimeout(() => msg.delete(), 7000));
      }

      if (
        client.conf.Counting.One_At_A_Time &&
        last === message.author.id &&
        current !== 1
      ) {
        message.delete();
        if (current !== 1 && client.conf.Counting.Restart_On_Incorrect_Number)
          client.settings.set(message.guild.id, 1, "counting.current");
        return message.channel
          .send({
            embeds: [
              client.utils.errorEmbed(
                client,
                message,
                `Sorry ${message.author.username}, but you can only say a number one at a time!` +
                  "\n" +
                  (client.conf.Counting.Restart_On_Incorrect_Number &&
                  current !== 1
                    ? "The countdown has been reset back to 1!"
                    : ""),
                "ORANGE"
              ),
            ],
          })
          .then((msg) => setTimeout(() => msg.delete(), 7000));
      }

      if (client.conf.Counting.React.Enabled == true)
        message.react(client.conf.Counting.React.Reaction);
      client.settings.inc(message.guild.id, "counting.current");
      client.settings.set(message.guild.id, message.author.id, "counting.last");
    }
  }
};
