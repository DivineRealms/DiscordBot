module.exports = {
    name: 'warn',
    category: 'moderation',
    description: 'Lets you issue a warning to a member.',
    permissions: ["MUTE_MEMBERS"],
    cooldown: 0,
    aliases: [],
    usage: 'warn <@User> <Reason>'
}

module.exports.run = async(client, message, args) => {
    const reason = args.slice(1).join(' ') || 'No Reason Specified'
    const member = message.mentions.members.first() || message.guild.members.cache.get(args[0])

    if (!member) return message.channel.send({ embeds: [client.embedBuilder(client, message, "Error", "You need to mention user.", "RED")] });
    if (member.id === message.author.id) return message.channel.send({ embeds: [client.embedBuilder(client, message, "Error", "You can't warn yourself.", "RED")] });
    if (member.user.bot) return message.channel.send({ embeds: [client.embedBuilder(client, message, "Error", "You can't warn bot.", "RED")] });
    let casenum = db.fetch(`cases_${message.guild.id}`) + 1;
    let warnings = db.fetch(`warnings_${message.guild.id}_${member.id}`)

    let embed = client.embedBuilder(client, message, "User Warned", `${member.user} have been warned by ${message.author} for ${reason}`, "YELLOW");

    client.utils.logs(client, message.guild, "User Warned", [{
        name: "Case ID",
        desc: `${casenum}`
      },{
        name: "User",
        desc: member.user
      },{
        name: "Staff",
        desc: message.author
      },{
        name: "Reason",
        desc: reason
      },{
        name: "Duration",
        desc: "Permanent"
      },{
        name: "Total Warnings",
        desc: `${warnings + 1}`
      }], member.user);

    message.channel.send({ embeds: [embed] })

    client.members.push(message.guild.id, embed, `${member.id}.warnings`)
    client.members.push(message.guild.id, embed, `${member.id}.punishments`)
    db.add(`cases_${message.guild.id}`);
}