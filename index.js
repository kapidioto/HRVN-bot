
const {Telegraf, Markup} = require('telegraf')
const {message} = require('telegraf/filters')
// const {SETTINGS} = require('settings')
require('dotenv').config()
const fs = require('fs')

console.log(process.env.TOKEN)

const token = process.env.TOKEN

const bot = new Telegraf(token)

const wlk_txt = 'Вітаємо вас у спільноті HRVN! 🤖✨\nМи раді бачити вас серед наших користувачів. HRVN створений для того, щоб зробити державне управління прозорішим та ефективнішим завдяки блокчейн-технологіям. Ваша участь допомагає нам досягати нових висот і впроваджувати інновації у сфері державного управління. 🚀🌍\nЯкщо у вас виникнуть запитання або пропозиції, не соромтеся звертатися до нас. Ми завжди готові допомогти вам! 😊💬\nЗ найкращими побажаннями, Ваш бот-помічник HRVN 🤖💡'

const channelId = '@HRVNOfficial';

let adminIds = [];
bot.telegram.getChatAdministrators(channelId)
  .then((admins) => {
    adminIds = admins.map(admin => admin.user.id.toString());
    console.log('Адміністратори каналу:', adminIds);
  })
  .catch((err) => {
    console.error('Помилка отримання адміністраторів:', err);
  });

bot.on('message', (ctx) => {
    if (adminIds.includes(ctx.from.id.toString())) {
      // Перевіряємо, чи повідомлення містить зображення
      if (ctx.message.photo) {
        const fileId = ctx.message.photo[ctx.message.photo.length - 1].file_id;
        const caption = ctx.message.caption || 'Нове повідомлення від HRVN';
  
        ctx.telegram.sendPhoto(channelId, fileId, { caption: caption })
          .then(() => {
            ctx.reply('Повідомлення успішно відправлено в канал.');
          })
          .catch((err) => {
            ctx.reply('Помилка відправки повідомлення: ' + err.message);
          });
      } else {
        // Відправка текстового повідомлення в канал
        const message = ctx.message.text || 'Нове повідомлення від HRVN';
        ctx.telegram.sendMessage(channelId, message)
          .then(() => {
            ctx.reply('Повідомлення успішно відправлено в канал.');
          })
          .catch((err) => {
            ctx.reply('Помилка відправки повідомлення: ' + err.message);
          });
      }
    }
  });

bot.start((ctx) => {
    ctx.sendPhoto(
      { source: fs.createReadStream('../results/HRVNlogo.png') },
      { caption: wlk_txt,
        ...Markup.inlineKeyboard([
          Markup.button.url('HRVN/Official🔈', 'https://t.me/HRVNOfficial')
        ]) }
    );
  });
  
  // Запуск бота
  bot.launch()
    .then(() => {
      console.log('Бот запущено');
    })
    .catch((err) => {
      console.error('Помилка запуску бота:', err);
    });
  
  // Обробка процесу завершення роботи
  process.once('SIGINT', () => bot.stop('SIGINT'));
  process.once('SIGTERM', () => bot.stop('SIGTERM'));
