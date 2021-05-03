# BTES
Monorepo for Blockchain Technology Education Software project.

# Getting Started

## Install

ℹ Perform all of the steps if this is the first-time install. After the first install, you only need to perform the steps marked with **(Repeat)**.

1. If you already have MongoDB 4.4.5 installed, skip this step. Otherwise;
    1. Install MongoDB 4.4.5: https://www.mongodb.com/try/download/community
    1. Add the directory that contains the `mongod` executable file to your system's PATH parameters (`C:\Program Files\MongoDB\Server\4.4\bin` on Windows if you did not change the install directory).
1. If you already have `nvm` (Node Version Manager) installed, skip this step. Otherwise install `nvm`:
    * On Windows: https://github.com/coreybutler/nvm-windows
    * On Linux: https://github.com/nvm-sh/nvm
1. Run `nvm install 12.0.0`.
1. **(Repeat)** Run `nvm use 12.0.0`.
1. If you already have `yarn` installed, skip this step. Otherwise, run `npm i -g yarn`.
1. Clone the repo and navigate to its root.
1. Create a `.env` file in `/frontend` folder. Take a look at `/frontend/.env.example` file for an example.
1. Create a `.env` file in `/backend` folder. Take a look at `/backend/.env.example` file for an example.
    1. `DB_PATH` field: create a folder somewhere on your computer that will hold the MongoDB database files. Then edit the `DB_PATH` field of your `/backend/.env` file to point to that folder.
1. **(Repeat)** Run `yarn`.

## Launch

1. Run `yarn db:start`.
1. Run `yarn start` on a seperate terminal.

## Shutdown

1. You can simply terminate the `yarn start` process (press `CTRL+C` two times on Windows).
2. Run `yarn db:stop` on a seperate terminal to safely terminate `yarn db:start`.

# Commands
⚠ Any command that is not listed in this section is not intended for manual use.

|Safe?|Command|Description|
|:-:|-|-|
|✅|`start`|Launches the development servers.|
|✅|`build`|Builds the project in production config.|
|✅|`db:start`|Starts the MongoDB server.|
|⚠|`db:stop`|Stops the MongoDB server.|
|✅|`lint:check`|Lints the project and outputs the result, but doesn't fix anything.|
|⚠|`lint:fix`|Lints the project and tries to automatically the fix errors.|
|⚠|`kill`|Kills processes that currently occupy the ports defined in `.env` files of the packages.|
|✅|`test`|Runs unit tests.|
|✅|`test:coverage`|Runs unit tests and collects coverage.|
|⛔|`sync-lock`|Syncs versions from `yarn.lock` to `package.json` files.|
|⛔|`upgrade-minor`|Upgrades all dependencies with [caret range](https://stackoverflow.com/a/22345808/6301627). Overwrites both `package.json` and `yarn.lock`.|

# Packages
|Name|Path|Description|
|:-|-|-|
|`frontend`|`/frontend`|Frontend of the BTES project.|
|`backend`|`/backend`|Backend of the BTES project.|
|`common`|`/common`|Shared code between other packages of the BTES project.|

# License
Copyright (c) 2020. All rights reserved. Refer to the [LICENSE](/LICENSE) file.
