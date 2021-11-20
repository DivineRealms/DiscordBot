module.exports = {
    name: 'setstatus',
    description: 'Allows you to set the bots status.',
    permissions: ["ADMINISTRATOR"],
    cooldown: 0,
    aliases: [],
    usage: 'setstatus <TEXT>'
}
module.exports.run = async(client, message, args) => {
    const status = args.join(' ');
    if (!status) return message.channel.send({ embeds: [client.embedBuilder(client, message, "Error", `You need to provide Custom Status.`, "RED")] });

    const embed = new client.embed()
        .setDescription(`Bot Custom Status have been changed to \`${status}\``)
        .setFooter(`Divine Realms`, client.user.displayAvatarURL({ size: 1024 }))

    message.channel.send({ embeds: [embed] });

    client.user.setActivity(status);
}