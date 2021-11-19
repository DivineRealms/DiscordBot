const randomPuppy = require('random-puppy');
module.exports = {
    description: 'Lets you see the last deleted message.',
    permissions: [],
    aliases: ['snip3'],
    usage: 'snipe'
}

module.exports.run = async(client, message, args) => {
    let embed3 = new client.embed()
        .setDescription(`Theres nothing to snipe :/`)
        .setFooter(message.author.username, message.author.displayAvatarURL({ dynamic: true, size: 1024 }))

    let snipe = client.snipes.get(message.channel.id)
    if (!snipe || !snipe.content) return message.channel.send({ embeds: [embed3] })
    let user = await client.users.fetch(snipe.user)
    const embed = new client.embed()
        .setAuthor(user.username, user.displayAvatarURL({ dynamic: true, format: 'png' }))
        .setTimestamp()
        .setTitle(`I have sniped ${user.tag}\'s message!`)
        .setDescription(`The last deleted message said: \`\`\`${snipe.content}\`\`\``)
        .setFooter(message.author.username, message.author.displayAvatarURL({ dynamic: true, size: 1024 }))

    message.channel.send(`I have sniped this users message!`)
    message.channel.send({ embeds: [embed] });

}