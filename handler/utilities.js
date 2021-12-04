const db = require("quick.db");
const ms = require("ms");

module.exports.automod = async (client, message) => {
  message.px = client.conf.settings.prefix;

  const settings = client.conf.automod;

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

  if (message.channel.id === client.conf.counting.Counting_Channel) {
    const { current, last } = client.settings.get(message.guild.id, "counting");

    if (message.content != current) {
      message.delete();
      if (current !== 1 && client.conf.counting.Restart_On_Incorrect_Number)
        client.settings.set(message.guild.id, 1, "counting.current");
      return message.channel
        .send({
          embeds: [
            client.embedBuilder(
              client,
              message,
              "Error",
              client.conf.counting.Wrong_Number_Message.replace(
                "{username}",
                message.author.username
              ).replace("{number}", current) +
                "\n" +
                (current !== 1 &&
                client.conf.counting.Restart_On_Incorrect_Number
                  ? client.conf.counting.Restart_Message
                  : ""),
              error
            ),
          ],
        })
        .then((msg) => setTimeout(() => msg.delete(), 7000));
    }

    if (
      client.conf.counting.One_At_A_Time &&
      last === message.author.id &&
      current !== 1
    ) {
      message.delete();
      if (current !== 1 && client.conf.counting.Restart_On_Incorrect_Number)
        client.settings.set(message.guild.id, 1, "counting.current");
      return message.channel
        .send({
          embeds: [
            client.embedBuilder(
              client,
              message,
              "Warning",
              client.conf.counting.One_At_A_Time_Message.replace(
                "{username}",
                message.author.username
              ) +
                "\n" +
                (client.conf.counting.Restart_On_Incorrect_Number &&
                current !== 1
                  ? client.conf.counting.Restart_Message
                  : ""),
              "ORANGE"
            ),
          ],
        })
        .then((msg) => setTimeout(() => msg.delete(), 7000));
    }

    if (client.conf.counting.React_On_Message)
      message.react(client.conf.counting.Reaction);
    client.settings.inc(message.guild.id, "counting.current");
    client.settings.set(message.guild.id, message.author.id, "counting.last");
  }
};
