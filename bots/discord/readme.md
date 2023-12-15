# Welcome

Welcome to the codebase for the Evaluate Discord bot, which essentially is a Discord version of the Evaluate website, albeit with a couple missing features.

## Structure

The bot's code is structured as follows:

- `src/builders`: Contains functions that build the different kinds of application commands and interactions, relating to Discord.

- `src/interactions`: This is pretty much where all the bot's feature code is, containing all the code that handles the bot's interactions.

  - `src/interactions/{feature}`: Contains the code for a specific feature of the bot, where `{feature}` is the name of the feature. Important files like the actual interaction definitions are stored in here.

    - `src/interactions/{feature}/_`: This directory basically just contains builders and handlers for the feature.

- `src/utilities`: Contains utility functions and helpers that are used throughout the bot's codebase.