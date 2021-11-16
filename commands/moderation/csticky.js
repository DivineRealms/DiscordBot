module.exports = {
    description: 'Creates a sticky message!',
    aliases: ['createsticky', 'stickyadd'],
    usage: 'csticky <title> | <message>'
}

module.exports.run = async(client, message, args) => {
    if (!message.member.hasPermission('MANAGE_CHANNELS')) return message.channel.send(new client.embed().setDescription('You are missing the permission `Manage Channels`'))
    let [title, desc] = args.join(' ').split('|')
    if (!desc) return message.channel.send(`You're missing info on your sticky message!\nExample: \`${message.px}csticky Important Message | Please head to #general for conversations!\``)

    message.delete()
    const msg = await message.channel.send(new client.embed().setTitle(title.trim()).setDescription(desc.trim()))
    const content = [title, desc]
    client.settings.set(message.guild.id, { id: msg.id, content: content }, `sticky.${message.channel.id}`)
}