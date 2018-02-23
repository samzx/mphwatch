# MPH Watch
<p align="center">
  <img src="http://www.solexstudios.com/wp-content/uploads/2018/02/img.png" alt="webpreview"/>
</p>


Stats for miners mining on Mining Pool Hub. Clean and simple interface for monitoring mining activity.

Will always be free, open source and not store any information.

## Demo
Live demo [here](http://mphwatch.solexstudios.com/). Login using api key.

Directly access your stats by adding api key after domain.
Example:
http://mphwatch.solexstudios.com/0bfbef832c137478240043c7d430815a940e19ddb481928cf51b811fc02297cd

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
git clone https://github.com/samzx/mphwatch.git
```

Move into directory
```
cd mphwatch
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
