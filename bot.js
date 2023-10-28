const {Telegraf, Markup} = require('telegraf')


const bot = new Telegraf('6334465442:AAH2lAaym8wKcODXPwz9_nHLxKWtOJX7pHQ')




bot.start((ctx)=>{
    ctx.replyWithChatAction('typing')
    setTimeout(()=>{
        ctx.replyWithHTML(`Assalomu alaykum, <b>${ctx.message.chat.first_name}</b>! Sizga qanday yordam berishim mumkin`, {
            reply_markup: {
              inline_keyboard: [
                [{text:'Join in our Channel', url: 'https://t.me/edumo_uz'}]
              ]
            }
          });
    },1000)    
})


bot.on('new_chat_members', async (ctx) => {
  // Delete the "user joined" message
  await ctx.deleteMessage(ctx.message.message_id);
});

bot.on('left_chat_member', async (ctx) => {
  // Delete the "user left" message
  await ctx.deleteMessage(ctx.message.message_id);
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
      await ctx.reply(`@${user.username}, please do not send links in this chat.`);
      return;
    }

    // Check for mentions
    if (text.includes('@') && !message.entities) {
      // Delete the message
      await ctx.deleteMessage();

      // Warn the user
      await ctx.reply(`@${user.username}, please do not mention other users in this chat.`);
      return;
    }
  }

  // Continue to the next middleware
  next();
});







bot.launch()

