module.exports.run = (client, message, args) => {
  console.log('got here');
  if (!args) return client.error(message.channel, 'No role mentioned!', 'You need to mention the role!');
  const role = message.mentions.roles.first();
  if (role) client.success(message.channel, 'k', 'k give me a min');
  else client.error(message.channel, 'idk i broke', 'couldnt find that role');
  message.guild.members.fetch().then(fetchedMembers => {
    try {
      fetchedMembers.each((member) => {
        member.roles.add(role).catch((err) => {
          throw err
        })
      });

      client.success(message.channel, 'done', 'alright done');
    } catch (err) {
      client.handle(err, 'adding roles', message)
    }
  })
};


module.exports.conf = {
  guildOnly: true,
  aliases: [],
  permLevel: 'Mod'
};

module.exports.help = {
  name: 'massroles',
  category: 'moderation',
  description: 'Makes it so Leif listens to reactions to a message and assigns roles accordingly',
  usage: 'massroles <@role>',
  details: "",
};