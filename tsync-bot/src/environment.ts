export const environment = {
    httpPort: 3000,
    telegram: {
        botApiKey: process.env.TELEGRAM_API_KEY ? process.env.TELEGRAM_API_KEY : ':',
        chatID: process.env.TELEGRAM_CHAT_ID ? process.env.TELEGRAM_CHAT_ID : '-',
    },
    irc: {
        server: 'irc.hirana.net',
        botName: process.env.IRC_BOT_NAME ? process.env.IRC_BOT_NAME : 'Echita',
        password: '',
        channels: [
            '#underc0de',
            '#main',
            '#lataberna'
        ],
        ignore: [
            'virgilio-alpine'
        ]
    }
};