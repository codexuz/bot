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
    const messageInfo = await ctx.telegram.getMessage(
      ctx.chat.id, // The chat ID where the message is
      ctx.message.message_id // The message ID
    );

    if (messageInfo) {
      // Delete the "user joined" message
      await ctx.deleteMessage(messageInfo.message_id);
      
      // Send a welcome message to the new member
      ctx.reply(`👋 ${ctx.message.new_chat_members[0].first_name} guruhga xush kelibsiz!`);
    } else {
      console.error('Message not found.');
    }
  } catch (error) {
    console.error('Error:', error);
  }
});

// Listen for left chat members
bot.on('left_chat_member', async (ctx) => {
  try {
    const messageInfo = await ctx.telegram.getMessage(
      ctx.chat.id, // The chat ID where the message is
      ctx.message.message_id // The message ID
    );

    if (messageInfo) {
      // Delete the "user left" message
      await ctx.deleteMessage(messageInfo.message_id);
      
      // You can also send a goodbye message or perform other actions here
      ctx.reply(`🤚 Xayr, ${ctx.message.left_chat_member.first_name}!`);
    } else {
      console.error('Message not found.');
    }
  } catch (error) {
    console.error('Error:', error);
  }
});


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
      try {
        // Delete the message
        await ctx.deleteMessage(message.message_id);

        // Warn the user
        await ctx.reply(`⚠️ @${user.username}, guruhda havola ulashmang!`);
      } catch (error) {
        console.error('Error deleting message:', error);
      }
      return;
    }

    // Check for mentions
    if (text.includes('@') && !message.entities) {
      try {
        // Delete the message
        await ctx.deleteMessage(message.message_id);

        // Warn the user
        await ctx.reply(`@${user.username}, please refrain from mentioning others in the group!`);
      } catch (error) {
        console.error('Error deleting message:', error);
      }
      return;
    }
  }

  // Continue to the next middleware
  next();
});




bot.launch()

