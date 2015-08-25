# bucket-collector

## Synopsis

Uses the Server-Eye [Bucket-API](https://api.server-eye.de/docs/1/#/customer/get_bucket_empty).

Reacts the received messages depending on the selected reactiontype.

## Installation

After forking the project, install the required node-modules via `npm install -d`.
Call `bower install -d` to download the required bower components.
Depending on the desired reation, additional configuration is required (see [Reactions](#Reactions)).

## Starting application

Start the appllication in development mode via `NODE_ENV='development' node app.js`.
In development-mode, debug-messages are enabled and the webinterface is by default started on port `8082`.

Start the appllication in production mode via `NODE_ENV='production' node app.js`.
In production-mode, debug-messages are disabled and the webinterface is by default started on port `8080`.

If no `NODE_ENV`-parameter is given, the application starts in production-mode.

### Configuration

After starting the application, use the webinterface to add the remaining settings. All changes made in the webinterface do not require a restart of the application.
Use a webbrowser to access the webinterface, for example in production-mode use `http://127.0.0.1:8080/`.

Use `/settings` to edit your current settings:

1. Use your OCC-Login to generate a API-Key for the bucket-collector. If the API-Key is successfully generated, the list with the available buckets will update.
2. Select your desired bucketaction from the dropdown-menu.
3. Edit the poll-interval to match your desired settings.
4. Select the buckets you want to use from the available buckets.
5. **Do not forget to apply your settings by clicking the `Save Settings`-Button**

After all settings are set, the webinterface can be used to view statistics for the active buckets.

## Reactions

A reaction describes the action taken for each received message.
All reactions are loaded from `./lib/reactiontypes/`. New reactions have to be added there.
By default this application only has a reaction for the tanss-ticket-system.

### Tanss-Reaction

This reaction tries to create/update a tanss-ticket with the given bucket-message.
To use the tanss-reaction, additional data is required.
Add your tanss-url as well as your customer-ids and api-keys to the `./data/tanss-settings.json`-file.
This file has to be conform to the [JSON-format](http://json.org/).
For changes to this file to take effect, a restart of the application is required.
