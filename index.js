const TelegramApi = require('node-telegram-bot-api')

const token = "5838375697:AAE-cdz96wIkOrlUuUrd1r4ySMlS_OThuwE";
const {gameOptions, againOptions} = require('./options')
const bot = new TelegramApi(token, {polling: true})

const chats = {}



const startGame = async (chatId) => {
    await bot.sendMessage(chatId, 'Давай сыграем в игру я загадаю число от 0 до 9 а ты должен ее угадать')
    const randomNumber = Math.floor(Math.random() * 10);
    chats[chatId] = randomNumber;
    console.log(chats[chatId])
    await bot.sendMessage(chatId, 'теперь отгадывай)',gameOptions)
}


const start = () => {
    bot.setMyCommands([
        {command: '/start', description: 'начальное приветсвие'},
        {command: '/info', description: 'получить информацию о пользавателе'},
        {command: '/game', description: 'игра угадай цифру'}
    ])

    bot.on('message',async msg => {
        const text = msg.text;
        const chatId = msg.chat.id;

        if (text === '/start') {
            await bot.sendAnimation(chatId, 'https://telegramix.ru/cdn/sticker/video/vp8/160/asdf_stickers-1.webm')
            return bot.sendMessage(chatId ,'Добро пожаловать на мой бот mgodm ')
        }
        if (text === '/info') {
            return bot.sendMessage(chatId, `Тебя зовут ${msg.from.first_name} ${msg.from.last_name}`);
        }
        if (text === '/game') {
            return startGame(chatId);
        }
        return bot.sendMessage(chatId,'я вас не понял');
    })

    bot.on('callback_query', async msg => {
        const data = msg.data;
        const chatId = msg.message.chat.id;
        
        if( data === '/again') {
            return startGame(chatId);
        }
        if( data == chats[chatId]) {
            return bot.sendMessage(chatId, `поздравляем ты отгадал ${chats[chatId]}`, againOptions)
        } else {
            return bot.sendMessage(chatId, `Ты не угадал число, бот загадал ${chats[chatId]}`, againOptions) 
        }

    })  
}

start()