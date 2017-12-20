const TelegramBot = require('node-telegram-bot-api');
const mp3monkey = require('mp3monkey');
const fs = require('fs');
const token = '481346371:AAFEaY_g8fj1NtYBKI908FMVxfrUO58UGPU';

const bot = new TelegramBot(token, {polling: true});

bot.onText(/\/m (.+)/, (msg, match) => {
  const chatId = msg.chat.id;
  const resp = match[1];
  mp3monkey(resp, function (err, tracks) {
    if (tracks.length === 0) { bot.sendMessage(chatId, 'Empty'); }
    if (!err && tracks.length) {
      for (let i = 0; i < 5; i += 1) {
        if (tracks[i].artist == '' && tracks[i].title == '') {
            console.log('undef');
        } else {
            bot.sendMessage(chatId, `DOWNLOADING... [${tracks[i].artist} - ${tracks[i].title}]`)
                .then((resolve) => {
                    const filename = Math.random().toString(36);
                    const filepath = './' + filename + '.mp3';
                    tracks[i].song
                        .pipe(fs.createWriteStream(filepath))
                        .on('finish', function () {
                            bot.sendAudio(chatId, fs.createReadStream(filepath), { title: `${tracks[i].artist} - ${tracks[i].title}` }).then(() => {
                                bot.deleteMessage(chatId, resolve.message_id);
                                fs.unlinkSync(filepath);
                            });
                        });
                });
        }
      }
    }
  });
});
