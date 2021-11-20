module.exports = {
    description: 'Deletes all the member data for the bot (PERMANENT)'
}

module.exports.run = (client, message, args) => {
    if (message.author.id !== client.conf.settings.BotOwnerDiscordID) return message.channel.send({ embeds: [client.embedBuilder(client, message, "Error", `You're not Owner`, "RED")] });
    client.members.deleteAll()
}