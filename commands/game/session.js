// TODO: high-priority command, but pretty complex
module.exports.run = (client, message, args) => {

  // Number between 2 and 8
  const size = Math.max(Math.min(8, parseInt(args[0], 10) || 8), 2);

  if (message.guild.channels.cache.size < 300) {
    const lastNum = client.voiceSessions.query(`SELECT MAX(identifier) AS num FROM voiceSessions`).rows[0].num + 1;
    message.guild.channels.create(`session-${lastNum}`, {
      type: 'voice',
      bitrate: 384000,
      userLimit: size,
      parent: client.config.sesCategory,
      position: lastNum,
      reason: '[Auto] Created by session command.',
    }).then((sessionChannel) => {
      // Create voiceSessions entry
      client.voiceSessions.set(sessionChannel.id, lastNum);
      // Notify the user
      client.success(message.channel, 'Session Created!', `A voice channel called **session-${lastNum}** was created with **${size}** available slots! If no one is in the voice channel after 1 minute, it will be deleted.`);
      // Start a timer for 1 minute to delete the channel if no one is in it
      setTimeout(() => {
        if (sessionChannel.members.size === 0 && !sessionChannel.deleted && sessionChannel.deletable) {
          sessionChannel.delete('[Auto] No one joined this session channel.');
          client.voiceSessions.delete(sessionChannel.id);
        }
      }, 60000);
    }).catch((error) => {
      client.error(message.channel, 'Failed to Create a Session!', `Nookbot failed to create a session for the following reason: ${error}`);
    });
  } else {
    // Too many channels in the server, Discord max is 500, I choose 300 since we do not need a ton of sessions clogging things up
    client.error(message.channel, 'Too Many Sessions!', 'There are too many active sessions to create another!');
  }
};

module.exports.conf = {
  guildOnly: true,
  aliases: ['sess', 'voicesession', 'voice'],
  permLevel: 'User',
  cooldown: 120, // 2 mins
};

module.exports.help = {
  name: 'session',
  category: 'game',
  description: 'Create a voice channel to play with other members',
  usage: 'session <number>',
  details: '<number> => The number of slots to allow in the voice channel.',
};
