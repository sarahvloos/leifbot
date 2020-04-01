// eslint-disable-next-line no-unused-vars
module.exports.run = (client, message, args, level) => {
  // Attempt to find a member using the arguments provided
  const member = message.mentions.members.first() || message.guild.members.cache.get(args[0]) || client.searchMember(args.join(' '));

  if (!member) {
    return client.error(message.channel, 'Invalid Member!', 'Please mention a valid member to upvote!');
  }

  if (member === message.member) {
    return client.error(message.channel, 'No Upvoting Yourself!', 'You cannot upvote yourself!');
  }

  const { positiveRep } = client.userDB.get(member.user.id);
  const { negativeRep } = client.userDB.get(member.user.id);

  if (!positiveRep || !negativeRep) {
    client.userDB.set(member.user.id, 0, 'positiveRep');
    client.userDB.set(member.user.id, 0, 'negativeRep');
  }

  client.userDB.math(member.user.id, '+', 1, 'positiveRep');
  return client.success(message.channel, 'Upvoted!', `Successfully upvoted **${member.user.tag}**!`);
};

module.exports.conf = {
  guildOnly: true,
  aliases: ['repup', 'up'],
  permLevel: 'Verified',
  cooldown: 1800,
};

module.exports.help = {
  name: 'upvote',
  category: 'game',
  description: 'Upvotes the mentioned member',
  usage: 'upvote <@member>',
  details: '<@member> => The member you wish to upvote',
};