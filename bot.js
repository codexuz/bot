const {Telegraf, Markup} = require('telegraf')
const TelegrafWit = require('telegraf-wit')
const { AssemblyAI } = require("assemblyai")
const telegram = require('telegraf/telegram')


const bot = new Telegraf('6335580760:AAFgnyFscYrwjj12ax2gIcBIwqI2jdTC4jQ')
const wit = new TelegrafWit('R2BXYMGTD5BRLS6LUNQLDZHOXYZ5EN2E')
const client = new AssemblyAI({
  apiKey: '1aecfb5b28dd4a948f89ca470c69bcba'
})

const adminId = '1483919112'; 



bot.start((ctx)=>{
    ctx.replyWithChatAction('typing')
    setTimeout(()=>{
        ctx.reply(`Здравствуйте, ${ctx.message.chat.first_name}! Я админ по продажам Имзо Навои. Меня зовут Азиза. Какие вопросы у вас есть?`, {
            reply_markup: {
              keyboard: [
                ['Kanal']
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




bot.on('text', async (ctx) => {
  // Forward the message to the admin
  //bot.telegram.forwardMessage(adminId, ctx.message.chat.id, ctx.message.message_id);

    return wit.meaning(ctx.message.text)
      .then((result) => {
        // reply to user with wit result
        const intent =result.intents.map((intent) => intent.name)
        switch (intent[0]) {
            case 'req1':
                ctx.replyWithChatAction('typing')
               setTimeout(()=>{
                ctx.reply(`Понятно, какой цвет и профиль вам нужен`);
               }, 600) 
              break;
            case 'req2':
                ctx.replyWithChatAction('typing')
                setTimeout(()=>{
              ctx.reply('Существует 3 различных типа профилей. У нас есть профили серий 6000, серий 7000 и серий 8000.');
                }, 600)
              break;
              case 'req4':
                ctx.replyWithChatAction('typing')
                setTimeout(()=>{
              ctx.reply('Ладно, сейчас пришлю фотографии, показывающие различия');
                }, 600)
              break;
              case 'address':
                ctx.replyWithChatAction('typing')
                setTimeout(()=>{
              ctx.reply('📞 Контакт: +998977977776.\n\n📍Адрес: Garden house комплекс.\n📍Ориентир: стадион «Yoshlik».');
                }, 600)
              break;
            default:
              ctx.reply('Assalomu alaykum! Sizga qanday yordam berishim mumkin.');
              break;
          }
        

      })
  })


bot.on('voice', async (ctx)=>{
  // Forward the message to the admin
  //bot.telegram.forwardMessage(adminId, ctx.message.chat.id, ctx.message.message_id);

    ctx.replyWithChatAction('typing')
    setTimeout(()=>{
    ctx.reply("⏳ Пожалуйста, подождите...")
  },300)
    const voiceMessage = ctx.message.voice;
  // Get the file ID and download link
  const fileId = voiceMessage.file_id;
  const fileLink = await bot.telegram.getFileLink(fileId);

  // Using a remote URL
const transcript = await client.transcripts.create({
  audio_url: fileLink,
  language_code:'ru' ,
  punctuate:true,

})

const response = await client.transcripts.get(transcript.id)

return wit.meaning(response.text)
      .then((result) => {
        // reply to user with wit result
        const intent =result.intents.map((intent) => intent.name)
        switch (intent[0]) {
            case 'req1':
                ctx.replyWithChatAction('typing')
               setTimeout(()=>{
                ctx.reply(`Понятно, какой цвет и профиль вам нужен`);
               }, 600) 
              break;
            case 'req2':
                ctx.replyWithChatAction('typing')
                setTimeout(()=>{
              ctx.reply('Существует 3 различных типа профилей. У нас есть профили серий 6000, серий 7000 и серий 8000.');
                }, 600)
              break;
              case 'req4':
                ctx.replyWithChatAction('typing')
                setTimeout(()=>{
              ctx.reply('Ладно, сейчас пришлю фотографии, показывающие различия');
                }, 600)
              break;
              case 'address':
                ctx.replyWithChatAction('typing')
                setTimeout(()=>{
              ctx.reply('📞 Контакт: +998977977776.\n\n📍Адрес: Garden house комплекс.\n📍Ориентир: стадион «Yoshlik».');
                }, 600)
              break;
            default:
              ctx.reply('Assalomu alaykum! Sizga qanday yordam berishim mumkin.');
              break;
          }
        

      })


})


bot.launch()

