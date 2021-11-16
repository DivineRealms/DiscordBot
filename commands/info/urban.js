const fetch = require('node-fetch')
const urban = require(`relevant-urban`)

module.exports = {
    description: 'Lets you search whatever you want on urban dictionary.',
    aliases: ['ud'],
    usage: 'urban <search>'
}

module.exports.run = async(client, message, args) => {
    if (!args[0]) return message.channel.send(new client.embed().setDescription(`Please tell me what im looking up.`).setFooter(message.author.username, message.author.displayAvatarURL({ dynamic: true, size: 1024 })))

    let def = await urban(args[0]).catch(() => {}) //NUT NUT
    if (!def) return message.channel.send(new client.embed().setDescription(`Sorry! I couldnt find any results for **${args[0]}**`).setFooter(message.author.username, message.author.displayAvatarURL({ dynamic: true, size: 1024 })))

    const embed = new client.embed()
        .setTitle(`Click Me To View The Word Online!`)
        .setURL(def.urbanURL)
        .addField(`Definition`, `${def.definition}`.slice(0, 1000), false)
        .addField(`Definition In An Example`, `${def.example || 'none'}`.slice(0, 1000), false)
        .addField(`Author`, def.author, false)
        .setFooter(message.author.username, message.author.displayAvatarURL({ dynamic: true, size: 1024 }))
    message.channel.send(embed)

}