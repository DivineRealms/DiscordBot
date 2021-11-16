const lodshortt = require('node-url-shortener');
module.exports = {
    description: 'Allows you to shortern a link.',
    aliases: ['shortlink', 'urlshort'],
    usage: 'urlshorter | <LINK>'
}

module.exports.run = async(client, message, args) => {
    const regex = /(ftp|http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?/;
    if (!args[0]) return message.channel.send(new client.embed().setDescription(`Please provide a URL you want to shorten!`).setFooter(message.author.username, message.author.displayAvatarURL({ dynamic: true, size: 1024 })))
    if (!regex.exec(args[0])) return message.channel.send(new client.embed().setDescription(`Please provide me a valid URL!`).setFooter(message.author.username, message.author.displayAvatarURL({ dynamic: true, size: 1024 })))
    lodshortt.short(args[0], function(err, url) {
        const embed = new client.embed()
            .setAuthor("URL Shortener", message.author.displayAvatarURL({ dynamic: true }))
            .addField("Big Boy URL", `[Click Here!](${args[0]})`)
            .addField("Tiny Boy URL", `[Im Cooler Click Here!](${url})`)
            .setFooter(message.author.username, message.author.displayAvatarURL({ dynamic: true, size: 1024 }));
        return message.channel.send(embed);
    })
}