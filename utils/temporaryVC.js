const db = require("quick.db");
const temporaryVCMap = new Map();

module.exports = function (client) {
  const description = {
    name: "temporaryVC",
    filename: "temporaryVC.js",
    version: "1.0"
  }

  client.on("voiceStateUpdate", (oldState, newState) => {
    if(client.conf.tempvc.enabled == false) return;
    let mkChannel = client.conf.tempvc.Join_Channel
    if (!oldState.channelId && newState.channelId) {
      if(newState.channelId !== mkChannel) return;
      createTemporaryVC(newState);
    }
    if (oldState.channelId && !newState.channelId) {
      if (temporaryVCMap.get(`temporaryChannel_${oldState.guild.id}_${oldState.channelId}`)) {
      var vc = oldState.guild.channels.cache.get(temporaryVCMap.get(`temporaryChannel_${oldState.guild.id}_${oldState.channelId}`));
      if (vc.members.size < 1) { 
        temporaryVCMap.delete(`temporaryChannel_${oldState.guild.id}_${oldState.channelId}`); 
        return vc.delete(); 
      } else {
        }
      }
    }
    if (oldState.channelId && newState.channelId) {
    
      if (oldState.channelId !== newState.channelId) {
        if(newState.channelId === mkChannel) 
        createTemporaryVC(oldState);  
        if (temporaryVCMap.get(`temporaryChannel_${oldState.guild.id}_${oldState.channelId}`)) {
          var vc = oldState.guild.channels.cache.get(temporaryVCMap.get(`temporaryChannel_${oldState.guild.id}_${oldState.channelId}`));
          if (vc.members.size < 1) { 
            temporaryVCMap.delete(`temporaryChannel_${oldState.guild.id}_${oldState.channelId}`); 
            return vc.delete(); 
        } else {
          }
        }
      }
    }
  });
  
  async function createTemporaryVC(user) {
    let createCategory = client.conf.tempvc.Create_VCS_Under;
    if(!user.guild.channels.cache.get(createCategory) || !createCategory) return;
    await user.guild.channels.create(`${client.conf.tempvc.Channel_Prefix}${user.member.user.username}`, {
      type: 'GUILD_VOICE',
      parent: createCategory,
      userLimit: 5,
    }).then(async vc => {
      user.setChannel(vc);
      temporaryVCMap.set(`temporaryChannel_${vc.guild.id}_${vc.id}`, vc.id);
      await vc.permissionOverwrites.set([
        {
          id: user.id,
          allow: ['MANAGE_CHANNELS'],
        },
        {
          id: user.guild.id,
          allow: ['SPEAK', 'CONNECT'],
        },
      ]);
    })
  }
}