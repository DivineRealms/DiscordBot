module.exports = {
    description: 'Feeling stressed? Go ahead pop some bubblewrap.',
    aliases: ['bubbles', 'bw'],
    usage: 'bubblewrap'
}

module.exports.run = async(client, message, args) => message.channel.send(`Here is some of the finest bubblewrap, enjoy popping!\n\n${(`${'||pop||'.repeat(10)}\n`).repeat(15)}`)