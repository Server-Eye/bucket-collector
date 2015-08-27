# bucket-collector

## Synopsis

Uses the Server-Eye [Bucket-API](https://api.server-eye.de/docs/1/#/customer/get_bucket_empty).

Reacts the received messages depending on the selected reactiontype.

## Installation

To run this application [NodeJS](https://nodejs.org/) is required.

After installing NodeJS, use the command `npm install bucket-collector` to download the current version of the bucket-collector and its depending modules.

Depending on the desired reaction, additional configuration is required (see [Reactions](#reactions)).

## Starting application

Run the command `node node_modules/bucket-collector` to start the bucket-collector in production-mode. In production-mode the webinterface runs by default on port `8080`.

### Command-line options

The following command-line options are available:

* `-h, --help`: outputs the usage information
* `-V, --version`:  outputs the version number of the currently installed version
* `-d, --development`: starts the application in development-mode, which enables additional logging. In development mode, the webinterface defaults to port `8082`.
* `-c, --clean`: Removes all settings and saved bucket data. The bucket collector has to be configured again using the webinterface (see [Configuration](#configuration)).
* `-P, --port <n>`: Overrides the default-port of the webinterface with the given port.
* `-R, --reactionDir [path]`: Overrides the path from which all reactions are loaded. Absolute pathing is recommended.
* `-D, --dataDir [path]`: Overrides the path where all runtime-data is saved. Absolute pathing is recommended.
* `-L, --logDir [path]`: Overrides the path where the logFile is created. Absolute pathing is recommended.

### Configuration

After starting the application, use the webinterface to add the remaining settings. All changes made in the webinterface do not require a restart of the application.
Use a webbrowser to access the webinterface, for example in production-mode use `http://127.0.0.1:8080/`.

Use `/settings` to edit your current settings:

1. Use your OCC-Login to generate a API-Key for the bucket-collector. If the API-Key is successfully generated, the list with the available buckets will update.
2. Select your desired bucketaction from the dropdown-menu.
3. Edit the poll-interval to match your desired settings.
4. Select the buckets you want to use from the available buckets.
  * Buckets can be created/updated/deleted using the occ. Currently buckets are only implemented in the [beta-occ](https://beta.server-eye.de/#/settings/distributor/buckets)
5. **Do not forget to apply your settings by clicking the `Save Settings`-Button**

After all settings are set, the webinterface can be used to view statistics for the active buckets.

## Reactions

A reaction describes the action taken for each received message.
All reactions are by default loaded from `./node_modules/bucket-collector/lib/reactiontypes/`. New reactions have to be added there.
By default this application only has a reaction for the tanss-ticket-system.

### Tanss-Reaction

This reaction tries to create or update a tanss-ticket with the given bucket-message.
To use the tanss-reaction, additional data is required.
Add your tanss-url as well as your customer-ids and api-keys to the `./node_modules/bucket-collector/data/tanss-settings.json`-file.
This file has to be conform to the [JSON-format](http://json.org/).
For changes to this file to take effect, a restart of the application is required.
