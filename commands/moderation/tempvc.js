module.exports = {
    description: 'Create a temp voice channel.',
    permissions: [],
    aliases: [`tvc`],
    usage: 'tempvc <name>'
}

module.exports.run = async(client, message, args) => {
    const vcSettings = client.conf.tempvc
    if (!message.member.permissions.has("ADMINISTRATOR"))
        return message.channel.send({ embeds: [new client.embed().setDescription(`You are missing permission \`ADMINISTRATOR\``).setFooter(message.author.username, message.author.displayAvatarURL({ dynamic: true, size: 1024 }))]});
    if (!vcSettings.Allowed_Roles.some(s => message.member.roles.cache.has(s))) return message.channel.send({ embeds: [new client.embed().setDescription('Sorry, but you cant create a temp vc!').setFooter(message.author.username, message.author.displayAvatarURL({ dynamic: true, size: 1024 }))]})
    if (!args[0]) return message.channel.send({ embeds: [new client.embed().setDescription('You need to enter what you want the name of the vc to be!').setFooter(message.author.username, message.author.displayAvatarURL({ dynamic: true, size: 1024 }))]})

    const vc = await message.guild.channels.create(args.join(' '), {
        type: 'voice',
        permissionOverwrites: [{ id: message.author, allow: ['CONNECT'] }, { id: message.guild.id, deny: ['CONNECT'] }]
    })
    const under = client.channels.cache.get(vcSettings.Create_VCS_Under)
    await vc.setParent(vcSettings.Temp_VC_Category)
    if (under && under.parentId === vc.Temp_VC_Category) await vc.setPosition(under.position + 1)

    client.settings.set(message.guild.id, { user: message.author.id }, `vc.${vc.id}`)
    await message.channel.send({ embeds: [new client.embed().setDescription(`Successfully created a temporary vc named ${args.join(' ')}`).setFooter(message.author.username, message.author.displayAvatarURL({ dynamic: true, size: 1024 }))]})
    message.channel.send((await vc.createInvite()).url)
}