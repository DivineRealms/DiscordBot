//   ______         _  ______               _                                  _   
//  |  ___|        | | |  _  \             | |                                | |  
//  | |_ _   _  ___| | | | | |_____   _____| | ___  _ __  _ __ ___   ___ _ __ | |_ 
//  |  _| | | |/ _ \ | | | | / _ \ \ / / _ \ |/ _ \| '_ \| '_ ` _ \ / _ \ '_ \| __|
//  | | | |_| |  __/ | | |/ /  __/\ V /  __/ | (_) | |_) | | | | | |  __/ | | | |_ 
//  \_|  \__,_|\___|_| |___/ \___| \_/ \___|_|\___/| .__/|_| |_| |_|\___|_| |_|\__|
//                                                 | |                             
//                                                 |_|                             

module.exports.config = {
    settings: {
        token: 'DISCORD-DEV-TOKEN',
        prefix: '.',
        mentionPrefix: true, //Whether the bot has a mention prefix
        botActivity: {
            status: 'online',
            activity: {
                name: 'Whatever you want',
                type: 'WATCHING',
            }
        },
        changingActivity: { //An activity that automatically updates
            enabled: true,
            activities: ['The Mega Bot', '160+ Commands', 'Buy Me For $55'],
            types: ['PLAYING', 'WATCHING', 'LISTENING']
        },
        embedColor: 'BLUE',
        GuildID: 'GUILDID',
        BotOwnerDiscordID: 'USERID',
    },
    automod: {
        // - - - BANNED STUFF - - -
        Banned_Words: [`WORDHERE`, `WORDHERE`, `WORDHERE`, `WORDHERE`, `WORDHERE`, `WORDHERE`, `WORDHERE`],
        Banned_Links: ['discord.gg/'],
        Banned_Emojis: ['🔨'],
        Banned_Attachments: ['png', 'mp4'],
        Banned_Words_Message: '{member}, Please dont use that language here.',
        Banned_Links_Message: '{member}, Please dont post that link here.',
        Banned_Emojis_Message: '{member}, Please dont post that emoji here.',
        Banned_Attachments_Message: '{member}, Please dont post {attachment} attachments here.',

        // - - - BYPASS PERMISSIONS - - -
        Bypass_Links_Channels: ['CHANNELID'],
        Bypass_Attachments_Roles: ['ROLEID'],
        Bypass_Words_Roles: ['ROLEID'],
        Bypass_Emojis_Roles: ['ROLEID'],
        Bypass_Links_Roles: ['ROLEID'],
        Bypass_Spam_Channels: ['CHANNELID'],
        Allowed_Domains: ['google', 'tenor'],
        Bypass_Spam_Roles: ['ROLEID'],

        // - - - SPAM PREVENTION - - - 
        Enable_Spam: true,
        Spam_Message: '{username}, you have been muted for spamming!',

        // - - - CAPS SPAM - - -
        Caps_Limit: '50%', //percentage of caps that users can type (leave blank to disable)
        Caps_Minimum_Characters: '20', //how many characters in a message are needed to check for caps limit
        Max_Caps_Message: '{member}, your message contained too many caps!',
        Bypass_Caps_Roles: [`ROLEID`], //has to be a role ik im dumb

        // - - - MENTION SPAM - - -
        Max_Role_Pings: 0, //max amount of times a user can ping a role in a single message
        Max_User_Pings: 0, //set to 0 to disable
        Max_Channel_Pings: 5, //any pings greater than this number will delete the message
        Max_Total_Pings: 10, //max amount of any ping in a message allowed
        Bypass_Pings: []
    },
    moderation: {
        Moderators: [], //roles that can use any moderation command
        serverLock: true, //whether or not to enable the server lock command
        Mute_Role: 'ROLEID'
    },
    automation: {
        Roles_On_Join: ['ROLEID'],
        Member_Count_Channel: 'CHANNELID',
        Member_Count_Message: 'Members: {count}',
        Channel_Count_Channel: 'CHANNELID',
        Channel_Count_Message: 'Channels: {count}',
        VC_Roles: [
            { roleID: 'ROLEID', channelID: 'ROLEID' },
            { roleID: '', channelID: '' },
            { roleID: '', channelID: '' }
        ],
        Invite_Link: 'https://discord.gg/VstQPFP',
        Booster_Channel: 'CHANNELID',
        Booster_Title: '{member} just boosted the server!',
        Booster_Message: 'Thank you {member} for boosting the server! We now have {boosters} booster(s)!',
        Booster_Thumbnail: '{member}' //Select either a image url, or {member} for the booster avatar
    },
    counting: {
        Counting_Channel: 'CHANNELID', //leave blank for none
        Wrong_Number_Message: 'Wrong number {username}, The current number is {number}!',
        One_At_A_Time: false,
        One_At_A_Time_Message: 'Sorry {username}, but you can only say a number one at a time!',
        Restart_On_Incorrect_Number: false,
        Restart_Message: 'The countdown has been reset back to 1!',
        React_On_Message: true,
        Reaction: '✅'
    },
    verification: {
        enabled: true,
        verificationType: 'captcha', //select from these 2 options -> command or captcha!
        verifyChannel: 'CHANNELID', //leave blank for use in any channel
        verifyRole: 'ROLEID',
        roleToRemove: 'ROLEID',
        Max_Attempts: 3, //how many times theyre allowed to verify for captcha
        kick_On_Max_Attempts: false, //Kick them if they entered to many wrong attempts
    },
    user_dms: {
        enabled: false,
        DMCategory: 'CATEGORYID',
        Dm_Channel_Name: 'new-dm-{username}',
        View_DmChannel_roles: ['ROLEID', 'ROLEID']
    },
    leveling: {
        enabled: true,
        remove_XP_on_Leave: false,
        level_Up_Message: '{user} has just reached level {level}!',
        level_Up_Title: 'Level Up!',
        level_Up_Channel: '', //channel id, or write current for the current channel their in, leave blank for none
        level_Up_Roles: [ //roles to award when members reach a certain level
            { level: 1, role: '' },
            { level: 10, role: '' },
            { level: 15, role: '' },
            { level: 30, role: '' }
        ],
        rankCardImage: 'https://cdn.trendhunterstatic.com/thumbs/cool-backgrounds.jpeg',
        rankCardColor: 'cyan'
    },
    music: {
        Enable_DJ: true, //set to false to allow everyone to use all music commands
        DJrole: 'ROLEID', //By default djs can use all music commands
        user_DJs: [], //Users that can use dj commands (USER IDS ONLY)
        Disabled_DJ_Commands: ['volume'], //Commands DJS cant use
        Allowed_User_Commands: ['play', 'queue', 'nowplaying', 'join', 'leave'] //Commands anyone is allowed use
    },
    tempvc: {
        enabled: true,
        Temp_VC_Category: 'CATEGORYID', //where temp VCs are added to
        Create_VCS_Under: '', //THe channel to create temp vcs under
        Allow_All_Roles: false, //if all roles can create temp vcs
        Allowed_Roles: ['ROLEID'], //roles that can create temp vc's
        Delete_VCS_After: '5s' //how long until empty temp vcs get automatically deleted. Leave blank to disable
    },
    logging: {
        Report_Channel: 'CHANNELID',
        Ban_Channel_Logs: 'CHANNELID',
        Unban_Channel_Logs: 'CHANNELID',
        Kick_Channel_Logs: 'CHANNELID',
        Warn_Channel_Logs: 'CHANNELID',
        Mute_Channel_Logs: 'CHANNELID',
        Lock_Channel_Logs: 'CHANNELID',
        Ticket_Channel_Logs: 'CHANNELID',
        Moderation_Channel_Logs: 'CHANNELID',
        Suggestion_Channel_Logs: 'CHANNELID',
        Report_Channel_Logs: 'CHANNELID',
        Server_Updates: 'CHANNELID',
        Voice_Updates: 'CHANNELID',
        Role_Updates: 'CHANNELID',
        Channel_Updates: 'CHANNELID',
        Message_Updates: 'CHANNELID',
    },
    starBoard: {
        Enabled: true,
        StarBoard_Channel: 'CHANNELID',
        Minimum_Reactions: '1', //how many star reactions required to send to star board channel
        StarBoard_Emoji: '⭐'
    },
    FiveM: {
        Time_Sheets_Channel: 'CHANNELID',
    },
    business: {
        Review_Products: [{
                name: 'ProductName',
                channel: 'CHANNELID'
            },
            {
                name: 'ProductName',
                channel: 'CHANNELID'
            },
            {
                name: 'ProductName',
                channel: 'CHANNELID'
            },
        ]
    },
    purchaseSystem: {
        Paypal_Email: 'PaypalEmail'
    },
    ticketSystem: {
        Ticket_Category: 'CHANNELCATEGORY',
        Ticket_Name: 'ticket-{number}-{username}',
        Ticket_Title: 'Ticket Creation',
        Ticket_Message: 'Thank you for creating a ticket {username}, a staff member will be with you shortly.',
        Support_Team_Roles: ['ROLEID'],
        Panel_Emoji: '✉️',
        Panel_Title: 'Create a Ticket',
        Panel_Message: 'Please react with the emoji to create a ticket\nA staff member will be with you shortly.',
        Max_Tickets_For_Moderators: '5',
        Max_Tickets_For_Users: '3'
    },
    applicationSystem: {
        applications: [{
                enabled: true, //whether to enable or disable this application
                Application_Log: 'CHANNELID', //Where to send completed apps
                Application_Name: 'APPNAME', //application name (must be unique)
                Application_Channel: '', //The channel where people can apply in (leave blank for any)
                questions: ['Question', 'Question', 'Question'] //questions this application will ask
            },
            {
                enabled: true, //whether to enable or disable this application
                Application_Log: 'CHANNELID', //Where to send completed apps
                Application_Name: 'APPNAME', //application name (must be unique)
                Application_Channel: '', //The channel where people can apply in (leave blank for any)
                questions: ['Question', 'Question', 'Question'] //questions this application will ask
            },
            {
                enabled: true, //whether to enable or disable this application
                Application_Log: 'CHANNELID', //Where to send completed apps
                Application_Name: 'APPNAME', //application name (must be unique)
                Application_Channel: '', //The channel where people can apply in (leave blank for any)
                questions: ['Question', 'Question', 'Question'] //questions this application will ask
            },
            {
                enabled: true, //whether to enable or disable this application
                Application_Log: 'CHANNELID', //Where to send completed apps
                Application_Name: 'APPNAME', //application name (must be unique)
                Application_Channel: '', //The channel where people can apply in (leave blank for any)
                questions: ['Question', 'Question', 'Question'] //questions this application will ask
            },
            {
                enabled: true, //whether to enable or disable this application
                Application_Log: 'CHANNELID', //Where to send completed apps
                Application_Name: 'APPNAME', //application name (must be unique)
                Application_Channel: '', //The channel where people can apply in (leave blank for any)
                questions: ['Question', 'Question', 'Question'] //questions this application will ask
            }
        ],
    },
    welcomeSystem: {
        enabled: true,
        welcomeChannel: 'CHANNELID',
        welcomeType: 'card', //select from these 4 options -> message, embed, dm or card!
        welcomeCardBackGroundURL: 'BACKGROUNDURL',
        welcomeMessage: 'Welcome {member} to the server, You are our {joinPosition} member!',
        welcomeDM: 'Welcome {member} to the server! You are our {joinPosition} member!',
        welcomeEmbed: {
            title: '{username} has just joined the server!',
            description: 'Welcome {member} to the server, You are our {joinPosition} member!',
            color: 'RED'
        }
    },
    birthdaySystem: {
        enabled: true,
        birthdayChannel: 'CHANNELID',
        birthdayMessage: 'Happy birthday to the following member(s)! Make sure to wish them a happy birthday in general!'
    },
    economy: {
        enabled: false,
        dailyWaitTime: '10s', //how long until someone can claim their daily reward
        currencySymbol: '🪙', //the emoji for the type of currency (🪙 is a coin emoji)
        shopItemsFront: true, //whether to add the custom shop items to the front of the shop
        shopItems: [{
            type: 'role',
            roleID: 'ROLEID',
            name: 'ROLENAME',
            description: 'Get the {role} role that hoists you above members!',
            price: '100'
        }]
    },
    goodbyeSystem: {
        enabled: true,
        goodbyeChannel: 'CHANNELID',
        goodbyeType: 'card', //select from these 4 options -> message, embed, card!
        goodbyeCardBackGroundURL: 'BACKGROUNDURL',
        goodbyeMessage: '{member} just left the server, hope you enjoyed your stay!',
        goodbyeDM: '{member} were sad to see you go! We hope to see you soon.',
        goodbyeEmbed: {
            title: '{username} Left!!',
            description: '{member} just left the server, hope you enjoyed your stay!',
            color: 'RED'
        }
    }
}

/** ! Do Not Touch ! 
 *  This area is NOT to be edited,
 *  doing so may end up breaking the bot
 *  so dont touch! ty :) ~ Nut
 **/
module.exports.guildSettings = {
    prefix: this.config.settings.prefix,
    panels: [],
    tickets: {},
    sticky: {},
    stars: {},
    counting: { current: 1, last: null },
    dms: {},
    vc: {},
    commands: {},
    suggestions: {},
    products: {},
    replies: {},
    reacts: {},
    birthday: null,
    lockdown: false,
    cases: [],
    orders: {},
    processing: {},
    completed: []
}

module.exports.memberSettings = {
    warns: 0,
    warnings: [],
    punishments: [],
    bans: 0,
    kicks: 0,
    balance: {
        wallet: 0,
        bank: 0
    },
    inventory: {
        fish: 0,
        cheques: 0,
        meat: 0,
        items: []
    },
    xp: {
        xp: 0,
        level: 0,
        totalXP: 0
    },
    muted: {
        muted: false,
        mutedAt: null
    },
    married: null,
    clockinTime: 0,
    alreadymarried: null,
    clockedIn: null,
    clockedOut: null,
    department: null,
    birthday: null
}

module.exports.shop = [{
    name: '🎣 Fishing Rod',
    price: 200,
    description: 'A fishing rod that allows you to use the `fish` command!'
}, {
    name: ' 📱 Iphone 11',
    price: 400,
    description: 'This phone allows you to make a call to apply for jobs!'
}, {
    name: '🔧 Wrench',
    price: 100,
    description: 'Break into houses and rob others money!'
}, {
    name: '💍 Ring',
    price: 700,
    description: 'Using this ring you can get married!'
}, {
    name: '💳 Bank Card',
    price: 500,
    description: 'Use this to deposit money to prevent robbers!'
}, {
    name: '💻 Computer',
    price: 200,
    description: 'Use this to use the internet!'
}, {
    name: '🏹 Hunting Bow',
    price: 250,
    description: 'Use this to go hunting for food!'
}, {
    name: '🔫 Gun',
    price: 300,
    description: 'Use a gun to rob a bank!'
}]

/** ! Do Not Touch ! 
 *  This area is NOT to be edited,
 *  doing so may end up breaking the bot
 *  so dont touch! ty :) ~ Nut
 **/