const { sample } = require('lodash')

module.exports = {
    description: 'Hack a user [NOT REAL]',
    aliases: [],
    usage: 'hack <@User>'
}

module.exports.run = async(client, message, args, ) => {
    message.channel.bulkDelete(1)
    const somedude = message.mentions.users.first()
    if (!somedude) return message.channel.send('You need to mention the person you\'re trying to hack!')

    const msg = await message.channel.send(`ANONYMOUS#0000 is hacking ${somedude}    :eyes:`)
    await sleep(2500)

    const emails = [`likesmen@gmail.com`, `likesmymom@hotmail.com`, `@mydadleftme.net`, `@agirlkissedme.com`, `@ihaveacrushonmommy.com`, `isfat@yahoo.com`, `@CEOofSIMP.net`, `@hasacrushonfuel.com`, `@poopman.net`, `likesdogs@gmail.com`, `likescars@gmail.com`, `justfarted@gmail.com`]

    msg.edit(`Hacking into their email address ${somedude.username}${sample(emails)}`)
    await sleep(2500)
    const ips = [
        [0, 0, 0, 0].map(s => ~~(Math.random() * 255) + 1).join('.')
    ]
    msg.edit(`IP Located: ${sample(ips)}`)
    await sleep(2500)

    msg.channel.send(new client.embed().setDescription(`Hacked by ||ANONYMOUS||\nHacked Member: ${somedude}\nEmail: ${somedude.username}${sample(emails)}\nIP: ${sample(ips)}`).setFooter(`NOTE: This is a completely fake command! NOT A REAL HACK COMMAND!`))
    await sleep(2500)
}

const sleep = async(t) => await new Promise(r => setTimeout(r, t))