const {Telegraf, Markup} = require('telegraf')


const bot = new Telegraf('6334465442:AAELbJFzXhIE5QUV2hre1zXl1bRMX1uNa0c')




bot.start((ctx)=>{
    ctx.replyWithChatAction('typing')
    setTimeout(()=>{
        ctx.replyWithHTML(`Assalomu alaykum, sizga qanday yordam berishim mumkin`, {
            reply_markup: {
              inline_keyboard: [
                [{text:'Join in our Channel', url: 'https://t.me/edumo_uz'}]
              ]
            }
          });
    },1000)    
})

// Listen for new chat members
bot.on('new_chat_members', async (ctx) => {
  try {
    // Delete the "user joined" message
    await ctx.deleteMessage(ctx.message.message_id);
    
    // Send a welcome message to the new member
    ctx.reply(`Welcome to the group, ${ctx.message.new_chat_members[0].first_name}!`);
  } catch (error) {
    console.error('Error deleting message:', error);
  }
});

// Listen for left chat members
bot.on('left_chat_member', async (ctx) => {
  try {
    // Delete the "user left" message
    await ctx.deleteMessage(ctx.message.message_id);
    
    // You can also send a goodbye message or perform other actions here
    ctx.reply(`Goodbye, ${ctx.message.left_chat_member.first_name}!`);
  } catch (error) {
    console.error('Error deleting message:', error);
  }
});


// Middleware to check for links and mentions
bot.use(async (ctx, next) => {
  const message = ctx.message;
  if (message) {
    const text = message.text || message.caption || '';
    const user = message.from;

    // Check if the user is an admin or the owner of the chat
    const chatMember = await ctx.getChatMember(user.id);
    if (chatMember.status === 'administrator' || chatMember.status === 'creator') {
      // If the user is an admin or the owner, don't delete the message
      return next();
    }

    // Check for links
    if (text.match(/https?:\/\/\S+/)) {
      // Delete the message
      await ctx.deleteMessage();

      // Warn the user
      await ctx.reply(`@${user.username}, guruhga havola ulashmang!`);
      return;
    }

    // Check for mentions
    if (text.includes('@') && !message.entities) {
      // Delete the message
      await ctx.deleteMessage();

      // Warn the user
      await ctx.reply(`@${user.username}, guruhga havola ulashmang!`);
      return;
    }
  }

  // Continue to the next middleware
  next();
});

  






bot.launch()

