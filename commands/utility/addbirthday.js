const { parse } = require('date-and-time')

module.exports = {
    description: 'Add your birthday to the system.',
    aliases: [`addbday`],
    usage: 'addbirthday'
}

module.exports.run = async(client, message, args) => {
    const embed = new client.embed()
        .setFooter(message.author.username, message.author.displayAvatarURL({ dynamic: true, size: 1024 }))

    if (client.members.get(message.guild.id, message.author.id).birthday) return message.channel.send(new client.embed().setDescription(`Sorry but you can only set your birthday once!\nContact a staff member and they will change your bithday using \`${message.px}setbirthday\``))
    const birthd = args.join(' ').toLowerCase().charAt(0).toUpperCase() + args.join(' ').slice(1).toLowerCase()
    const date = parse(birthd, 'MMM D YYYY')
    if (!date.getDay()) return message.channel.send(embed.setDescription(`You need to enter the date of your birthday!\nExample: \`${message.px}addbirthday Sep 4 2004\``))

    const age = getAge(args.join(' '))
    if (age <= 12) return message.channel.send(embed.setDescription(`You can\'t enter a year greater than ${new Date().getFullYear() - 12}!`))

    message.channel.send(embed
        .setTitle(':partying_face: Successfully set your birthday! :partying_face:')
        .setDescription(`I have set your birthday to ${args.join(' ')}!\n\nYou will be ${age + 1}`)
        .setTimestamp())

    client.members.set(message.guild.id, args.join(' '), `${message.author.id}.birthday`)
}

const getAge = b => {
    let age = new Date().getFullYear() - new Date(b).getFullYear()
    const m = new Date().getMonth() - new Date(b).getMonth()
    if (m < 0 || (m === 0 && new Date().getDate() < new Date(b).getDate()))
        age--;

    return age
}