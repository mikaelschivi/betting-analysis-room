# Betting Analysis Room

A Telegram bot for signaling bets in Blackjack, connected to Blaze Double Roulette via websocket, and integrated with a Martingale strategy to achieve a 92% win rate over 24 hours.

## Features

- Telegram Bot integration using `node-telegram-bot-api`
- Real-time data reading from Blaze Double Roulette via `ws` library
- Signal generation at random time events
- Martingale betting strategy integration
- 92% win rate in 24 hours

### Prerequisites

- Node.js
- Telegram Bot API token
- Blaze Double Roulette websocket URL

### Installation

1. Clone the repository:
    ```sh
    git clone https://github.com/mikaelschivi/betting-analysis-room.git
    cd betting-analysis-room
    ```

2. Install dependencies:
    ```sh
    npm install
    ```

3. Create a `.env` file with your configuration:
    ```sh
    CHATID=TELEGRAM_GROUP_CHATID
    TOKEN=TELEGRAM_BOT_TOKEN
    API_ENDPOINT=WEBSOCKET_URL
    PRODUCTION=_ OR 1
    ```

## Usage

Start the bot:
```sh
npm run init
```

The bot reads data from the websocket, generates signals, and sends them to your Telegram group.