const db = require("quick.db")
const spam = new(require('enmap'))()
const ms = require('ms')

module.exports.automod = async(client, message) => {
    client.members.ensure(message.guild.id, {})
    client.members.ensure(message.guild.id, client.memberSettings, message.author.id)

    message.px = client.settings.ensure(message.guild.id, client.defaultSettings).prefix
    message.coin = client.conf.economy.currencySymbol

    const settings = client.conf.automod
    const upper = message.content.match(/[A-Z]/g) || []
    const percent = ~~(upper.length / message.content.length * 100)
    const attch = settings.Banned_Attachments.find(a => (message.attachments.first() || { url: '' }).url.endsWith(a))
    const msgs = spam.ensure(message.author.id, 1)
    const totalPings = message.mentions.users.size + message.mentions.roles.size + message.mentions.channels.size
    const replies = client.settings.get(message.guild.id, 'replies')
    const reacts = client.settings.get(message.guild.id, 'reacts')
    spam.inc(message.author.id)

    if (message.mentions.users.first() && client.afk.has(message.mentions.users.first().id)) {
        const user = message.mentions.users.first()

        const embed5 = new client.embed()
            .setTitle(`${user.username} is currently afk`)
            .setDescription(`**Reason:** ${client.afk.get(user.id).message}, went AFK ${ms(Date.now() - client.afk.get(user.id).time, { long: true })} ago`)
            .setFooter(`${message.channel.guild.name} | Made By Fuel#2649`, message.channel.guild.iconURL({ dynamic: true }))

        message.channel.send({ embeds: [embed5] })
    }

    if (settings.Max_User_Pings && message.mentions.users.size > settings.Max_User_Pings) {
        await message.delete()
        return message.channel.send({ embeds: [new client.embed().setDescription(`Sorry but you cant ping more than ${settings.Max_User_Pings} users at once!`)]})
    } else if (settings.Max_Role_Pings && message.mentions.roles.size > settings.Max_Role_Pings) {
        await message.delete()
        return message.channel.send({ embeds: [new client.embed().setDescription(`Sorry but you cant ping more than ${settings.Max_Role_Pings} roles at once!`)]})
    } else if (settings.Max_Channel_Pings && message.mentions.channels.size > settings.Max_Channel_Pings) {
        await message.delete()
        return message.channel.send({ embeds: [new client.embed().setDescription(`Sorry but you cant ping more than ${settings.Max_Channel_Pings} channels at once!`)]})
    } else if (settings.Max_Total_Pings && totalPings > settings.Max_Total_Pings) {
        await message.delete()
        return message.channel.send({ embeds: [new client.embed().setDescription(`Sorry but you cant ping more than ${settings.Max_Total_Pings} times in 1 message!`)]})
    }

    const trigger = Object.keys(replies).find(r => message.content.toLowerCase().includes(r))
    if (trigger && !message.content.startsWith(message.px)) message.channel.send(replies[trigger].response)

    const trigger2 = Object.keys(reacts).find(r => message.content.toLowerCase().includes(r))
    if (trigger2 && !message.content.startsWith(message.px))
        for (var i of reacts[trigger2].emojis) await message.react(i)

    if (message.channel.id === client.conf.counting.Counting_Channel) {
        const { current, last } = client.settings.get(message.guild.id, 'counting')

        if (message.content != current) {
            message.delete()
            if (current !== 1 && client.conf.counting.Restart_On_Incorrect_Number) client.settings.set(message.guild.id, 1, 'counting.current')
            return message.channel.send({ embeds: [new client.embed().setDescription(
                client.conf.counting.Wrong_Number_Message.replace('{username}', message.author.username).replace('{number}', current) + '\n' + (current !== 1 && client.conf.counting.Restart_On_Incorrect_Number ? client.conf.counting.Restart_Message : '')
            )]}).then(msg => setTimeout(() => msg.delete(), 7000))
        }

        if (client.conf.counting.One_At_A_Time && last === message.author.id && current !== 1) {
            message.delete()
            if (current !== 1 && client.conf.counting.Restart_On_Incorrect_Number) client.settings.set(message.guild.id, 1, 'counting.current')
            return message.channel.send({ embeds: [new client.embed().setDescription(client.conf.counting.One_At_A_Time_Message.replace('{username}', message.author.username) + '\n' +
                (client.conf.counting.Restart_On_Incorrect_Number && current !== 1 ? client.conf.counting.Restart_Message : ''))]}).then(msg => setTimeout(() => msg.delete(), 7000))
        }

        if (client.conf.counting.React_On_Message) message.react(client.conf.counting.Reaction)
        client.settings.inc(message.guild.id, 'counting.current')
        client.settings.set(message.guild.id, message.author.id, 'counting.last')
    }

    if (msgs >= 8 && settings.Enable_Spam) {
        if (settings.Bypass_Spam_Channels.includes(message.channel.id)) return
        if (settings.Bypass_Spam_Roles.some(r => message.member.roles.cache.has(r))) return
        message.member.roles.add(client.conf.moderation.Mute_Role).then(() => {
            message.channel.send({ embeds: [new client.embed().setDescription(client.resolveMember(settings.Spam_Message, message.author))]})
            spam.delete(message.author.id)
        }).catch(() => {})
    } else if (msgs === 1) setTimeout(() => spam.delete(message.author.id), 7000);

    if (settings.Caps_Limit.match(/\d/g) && percent > settings.Caps_Limit.match(/\d+/g)[0] && message.content.length >= settings.Caps_Minimum_Characters) {
        if (settings.Bypass_Caps_Roles.some(r => message.member.roles.cache.has(r))) return
        message.delete().then(() => {
            message.channel.send({ embeds: [new client.embed().setDescription(settings.Max_Caps_Message.replace('{member}', message.author.toString()))]})
        }).catch(() => {})
    }

    if (attch && !settings.Bypass_Attachments_Roles.some(r => message.member.roles.cache.has(r))) {
        message.delete().then(() => {
            message.channel.send({ embeds: [new client.embed().setDescription(settings.Banned_Attachments_Message.replace('{member}', message.author.toString()).replace('{attachment}', attch))]})
        }).catch(() => {})
    }

    if (settings.Banned_Words.some(a => message.content.toLowerCase().includes(a))) {
        if (settings.Bypass_Words_Roles.some(r => message.member.roles.cache.has(r))) return
        message.delete().then(() => {
            message.channel.send({ embeds: [new client.embed().setDescription(settings.Banned_Words_Message.replace('{member}', message.author.toString()))]})
        }).catch(() => {})
    }

    if (settings.Banned_Emojis.some(a => message.content.toLowerCase().includes(a))) {
        if (settings.Bypass_Emojis_Roles.some(r => message.member.roles.cache.has(r))) return
        message.delete().then(() => {
            message.channel.send({ embeds: [new client.embed().setDescription(settings.Banned_Emojis_Message.replace('{member}', message.author.toString()))]})
        }).catch(() => {})
    }

    if (settings.Banned_Links.some((a, i) => message.content.toLowerCase().includes(a) && !message.content.includes(settings.Allowed_Domains[i]))) {
        if (settings.Bypass_Links_Roles.some(r => message.member.roles.cache.has(r))) return
        if (settings.Bypass_Links_Channels.includes(message.channel.id)) return
        message.delete().then(() => {
            message.channel.send({ embeds: [new client.embed().setDescription(settings.Banned_Links_Message.replace('{member}', message.author.toString()))]})
        }).catch(() => {})
    }
}