const paginateContent = require("../../utils/paginateContent.js")

module.exports = {
    name: 'commands',
    description: 'A list of all the commands.',
    permissions: [],
    cooldown: 0,
    aliases: [],
    usage: 'commands'
}

module.exports.run = async(client, message, args) => {

    if (!args[0]) {
        let commands = client.commands.map((x, i) => `\`${x.usage}\` - ${x.description}`);
        console.log(commands)

        paginateContent(client, commands, 17, 1, message, "Commands List", "YELLOW")
    } else {
        const category = client.categories.get(args[0])

        const command = client.commands.find((c, n) => n === args[0].toLowerCase() || (c.aliases && c.aliases.includes(args[0].toLowerCase())))
        if (!command) return message.channel.send({ embeds: [new client.embed().setDescription(`I couldnt find a command named \`${args[0]}\``)]})
    
        const embed = new client.embed()
            .setTitle(`Command Help`)
            .addField('Command Name', args[0].toLowerCase())
            .addField('Aliases', command.aliases.map(s => `\`${s}\``).join(', ') || 'none')
            .addField('Usage', `\`${message.px}${command.usage}\``)
    
        message.channel.send({ embeds: [embed] })
    }
}