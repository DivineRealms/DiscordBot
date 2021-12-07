module.exports = {
  name: "report",
  category: "utility",
  description: "Lets you submit a report.",
  permissions: [],
  cooldown: 0,
  aliases: [`rep`],
  usage: "report <Report>",
};

module.exports.run = async (client, message, args) => {
  let logChannel = client.channels.cache.get(
    client.conf.logging.Report_Channel_Logs
  );

  if (!logChannel)
    return message.channel.send({
      embeds: [
        client.utils.errorEmbed(
          client,
          message,
          "A report channel hasn't been setup for this server!"
        ),
      ],
    });

  if (!args[0])
    return message.channel.send({
      embeds: [
        client.utils.errorEmbed(client, message, "Please provide a report."),
      ],
    });

  setTimeout(() => message.delete(), 3000);
  message.channel.send({
    embeds: [
      client.embedBuilder(
        client,
        message,
        `Your report for \`${args.join(" ")}\` was submitted!`,
        "",
        "GREEN"
      ),
    ],
  });

  logChannel.send({
    embeds: [
      client
        .embedBuilder(client, message, "New Report", "")
        .addField("Submitter:", message.author, false)
        .addField("Report:", args.join(" "), false)
        .addField("Time:", `<t:${Math.round(Date.now() / 1000)}:R>`),
    ],
  });
};
