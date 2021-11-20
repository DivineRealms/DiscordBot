module.exports = {
    description: 'Lets you speak as the bot and be a cool kid.',
    permissions: ["ADMINISTRATOR"],
    aliases: [`speak`],
    usage: 'say <Message>'
}

module.exports.run = async(client, message, args) => {
    let say = args.slice(0).join(" ")
    if (!say) return message.channel.send({ embeds: [client.embedBuilder(client, message, "Error", "You need to provide text to send.", "RED")] });
    message.delete()
    message.channel.send({ content: say })
}