const {Telegraf, Markup} = require('telegraf')


const bot = new Telegraf('5808022604:AAFTIpq1w1riSXpFtLDIdzRD23dQ0O0bu64')



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

bot.on('new_chat_members', async (ctx) => {
  // Delete the "user joined" message
  await ctx.deleteMessage(ctx.message.message_id);
     // Send a welcome message to the new member
      ctx.reply(`👋 ${ctx.message.new_chat_members[0].first_name} guruhga xush kelibsiz! Multilevel haqida batafsil ma'lumot va qo'llanmalar uchun quyidagi botimizga o'ting 👉 @examonlinedatabaseBot`);
});

bot.on('left_chat_member', async (ctx) => {
  // Delete the "user left" message
  await ctx.deleteMessage(ctx.message.message_id);
       // You can also send a goodbye message or perform other actions here
      ctx.reply(`🤚 Xayr, ${ctx.message.left_chat_member.first_name}!`);
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

