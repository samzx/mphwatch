# MPHStats
Stats for miners mining on Mining Pool Hub. Clean and simple interface for monitoring mining activity.

Will always be free, open source and not store any information.

## Demo
Live demo [here](http://mphstats.solexstudios.com/). Login using api key.

Directly access your stats by adding api key after domain.
Example:
http://mph.samxie.net/0bfbef832c137478240043c7d430815a940e19ddb481928cf51b811fc02297cd

API Key can be found under https://miningpoolhub.com/?page=account&action=edit

## Prerequisites

* Install node.js from their [website](https://nodejs.org/en/).
* Once node is installed, use npm to install yarn
    ```
    npm install -g yarn
    ```

## Installing

Clone the project
```
git clone https://github.com/samzx/mphstats.git
```

Move into directory
```
cd mphstats
```

Install dependancies
```
yarn install
```

## Development build

To serve up local server, run in terminal:
```
yarn run dev-server
```
visit `localhost:8080` in browser to see it run

## Contributions
Contributions are welcome! Fork and send a pull request with enhancements.
