module.exports.run = async (client, message, args) => {
  const channel = client.channels.cache.get(client.config.staffChat);
  if (!client.config.todoList) {
    await channel.send({
      embed: {
        title: 'To-Do List',
        description: 'Nothing to see here...',
        color: 'AQUA'
      }
    }).then((sent) => {
      client.config.todoList = sent.id;
      client.configDB.insert('todoList', [sent.id, 'text'], ['config_value', 'config_type']);
    })
  }
  channel.messages.fetch(client.config.todoList).then((pin) => {
    const newPin = pin;
    let string;
    if (args[0] === 'done') {
      newPin.embeds[0].fields.splice(parseInt(args[1]) - 1, 1);
      string = 'Item marked as complete! Congratulations!'
    } else if (args[0] === 'edit' || args[0] === 'e') {
      newPin.embeds[0].fields[parseInt(args[1]) - 1].value = args.slice(2).join(' ');
      string = 'Item edited!';
    } else {
      newPin.embeds[0].addField(newPin.embeds[0].fields.length + 1, args.slice(1).join(' '));
      string = 'Item added to the list!';
    }
    pin.edit(newPin);
    return message.channel.send(string);
  })
};

module.exports.conf = {
  guildOnly: true,
  aliases: [],
  permLevel: 'Mod'
};

module.exports.help = {
  name: 'todo',
  category: 'moderation',
  description: 'Adds, edits, or removes an item from the To-Do List',
  usage: 'todo <done|edit (leave blank for new)> <number (when editing or removing)> <item description (when adding or editing)>',
};
