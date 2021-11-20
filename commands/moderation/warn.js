module.exports = {
    description: 'Lets you issue a warning to a member.',
    permissions: ["MUTE_MEMBERS"],
    aliases: [],
    usage: 'warn <@User> <Reason>'
}

module.exports.run = async(client, message, args) => {
    const reason = args.slice(1).join(' ') || 'No Reason Specified'
    const member = message.mentions.members.first() || message.guild.member(args[0])

    if (!message.member.permissions.has('MUTE_MEMBERS')) return message.channel.send({ embeds: [new client.embed().setDescription(`Sorry you are missing the permission \`MUTE_MEMBERS\`!`).setFooter(message.author.username, message.author.displayAvatarURL({ dynamic: true, size: 1024 }))]})
    if (!message.member.permissions.has('MANAGE_MESSAGES')) return message.channel.send({ embeds: [new client.embed().setDescription(`Sorry, you are missing permissions to execute this command!`).setFooter(message.author.username, message.author.displayAvatarURL({ dynamic: true, size: 1024 }))]})
    if (!member) return message.channel.send({ embeds: [client.embedBuilder(client, message, "Error", "You need to mention user.", "RED")] });
    if (member.id === message.author.id) return message.channel.send({ embeds: [client.embedBuilder(client, message, "Error", "You can't warn yourself.", "RED")] });
    if (member.user.bot) return message.channel.send({ embeds: [client.embedBuilder(client, message, "Error", "You can't warn bot.", "RED")] });
    let casenum = db.fetch(`cases_${message.guild.id}`) + 1;
    let warnings = db.fetch(`warnings_${message.guild.id}_${member.id}`)

    let embed = client.embedBuilder(client, message, "User Warned", `${member.user} have been warned by ${message.author} for ${reason}`, "YELLOW");

    client.utils.logs(this.client, message.guild, "User Warned", [{
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