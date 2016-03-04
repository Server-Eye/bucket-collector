# bucket-collector

## Synopsis

Uses the Server-Eye [Bucket-API](https://api.server-eye.de/docs/1/#/customer/get_bucket_empty) to get notification-messages from Server-Eye.

Reacts the received messages depending on the selected reactiontype.

## Installation

To install and run this application [Git](https://git-scm.com/) and [NodeJS](https://nodejs.org/) are required.

After installing Git and NodeJS, use the command `npm install bucket-collector` to download the current version of the bucket-collector and its depending modules.

Depending on the desired reaction, additional configuration is required (see [Reactions](#reactions)).

## Starting application

Run the command `node node_modules/bucket-collector` to start the bucket-collector in production-mode. In production-mode the web interface runs by default on port `8080`.

### Command-line options

The following command-line options are available:

* `-h, --help`: outputs the usage information
* `-V, --version`:  outputs the version number of the currently installed version
* `-d, --development`: starts the application in development-mode, which enables additional logging. In development mode, the web interface defaults to port `8082`.
* `-c, --clean`: Removes all settings and saved bucket data. The bucket collector has to be configured again using the web interface (see [Configuration](#configuration)).
* `-P, --port <n>`: Overrides the default-port of the web interface with the given port.
* `-R, --reactionDir [path]`: Overrides the path from which all reactions are loaded. Absolute pathing is recommended.
* `-D, --dataDir [path]`: Overrides the path where all runtime-data is saved. Absolute pathing is recommended.
* `-L, --logDir [path]`: Overrides the path where the logFile is created. Absolute pathing is recommended.

### Configuration

After starting the application, use the web interface to add the remaining settings. All changes made in the web interface do not require a restart of the application.
Use a webbrowser to access the web interface, for example in production-mode use `http://127.0.0.1:8080/`.

Use `/settings` to edit your current settings:

1. Use your OCC-Login to generate an API-Key for the bucket-collector. If the API-Key is successfully generated, the list with the available buckets will update.
2. Select your desired bucketaction from the dropdown-menu.
3. Edit the poll-interval to match your desired settings.
4. Select the buckets you want to use from the available buckets.
  * Buckets can be created/updated/deleted using the [occ](https://occ.server-eye.de/).
5. **Do not forget to apply your settings by clicking the `Save Settings`-Button**

After all settings are set, the web interface can be used to view statistics for the active buckets.

## Reactions

A reaction describes the action taken for each received message.
All reactions are by default loaded from `./node_modules/bucket-collector/lib/reactiontypes/`. New reactions have to be added there.
By default this application has a reaction for the tanss-ticket-system as well as the autotask-ticket-system.


### Tanss-Reaction

This reaction tries to create or update a tanss-ticket with the given bucket-message.
Additional data is required to use the tanss-reaction.

#### 1. config-template

Open the `./node_modules/bucket-collector/data/tanss-data-template.json`-file.
This file has to be conform to the [JSON-format](http://json.org/) and looks like this by default:
```
{
    "tanssUrl": "INSERT YOUR TANSS-URL HERE",
    "apiKeys": {
        "SERVER-EYE-CUSTOMER-ID HERE": "SERVER-EYE-API-KEY HERE",
        "NEXT-SE-CUSTOMER-ID": "NEXT-SE-API-KEY",
        "NEXT-SE-CUSTOMER-ID": "NEXT-SE-API-KEY"
    }
}
```

#### 2. tanss-url

Insert the url you use to access your tanss into the corresponding placeholder. Your URL should look something like this: `https://tanss.something.de`.

#### 3. server-eye-customer-ids

Insert the server-eye-customer-ids of your customers into the corresponding placeholder fields. The customer-ids can be found by using the occ. To do so, follow these steps:

1. Select your customer in the occ.
2. In the right sidebar, click on the info-icon right of the customername.
3. The now displayed cId is the server-eye-customer-id you are looking for.

A server-eye-customer-id is a 32 character string consisting of letters and numbers. 

#### 4. server-eye-api-key

The server-eye-api-key to your customer-ids have to be created using tanss. Follow [these](https://s3-eu-west-1.amazonaws.com/uploads-eu.hipchat.com/43388/291062/5T7O0lo4NYPMK5J/FAQ_Tanssanbindung_neues_OCC.pdf) instructions to do so.
After creation, insert your api-keys into the corresponding placeholders.

#### 5. apply changes

If you are done inserting the data, save the file as `tanss-data.json` and restart the bucket-collector to make the changes take effect.


### Autotask-Reaction

This reaction tries to create or update a autotask-ticket with the given bucket-message.
Additional configuration is required to use the autotask-reaction.

#### 1. ServerEyeStateID user-defined-field

First login into autotask and add a user-defined-field called `ServerEyeStateID` with the type `Text (single line)` to the ticket-entity. You can follow [these](https://support.netserve365.com/help/Content/AdminSetup/SiteSetup/UDFadd.htm) instructions to do so. This field is used by the bucket-collector to identify the corrsponding server-eye agent/container-state with the autotask ticket.

#### 2. config-template

Open the `./node_modules/bucket-collector/data/autotask-data-template.json`-file. 
This file has to be conform to the [JSON-format](http://json.org/) and looks like this by default:
```
{
    "username": "AUTOTASK-USERNAME",
    "password": "AUTOTASK-PASSWORD",
    "defaultID": "DEFAULT-AUTOTASK-ACCOUNT-ID",
    "customerIDs": {
        "SE-CUSTOMER-ID" : "AUTOTASK-ACCOUNT-ID",
        "SE-CUSTOMER-ID2" : "AUTOTASK-ACCOUNT-ID"
    }
}
```

#### 3. autotask-user/password

Insert the username and password of the autotask-user you want the bucket-collector to use to create and update tickets into the corresponding fields.
It is recommended that you create a specific user for the bucket-collector, named `Server-Eye` for example. This user needs the right to create and update tickets.

#### 4. defaultID

Insert the autotask-account-id of the customer you want the bucket-collector to default to as the `defaultID`.
In autotask, the autotask-account-id of a customer can be found as `id` in the customers details-page.
All tickets, whose server-eye-customer-id does not correspond to a autotask-account-id will be created for this customer. It is recommended to create a specific customer for this purpose (called Server-Eye-Tickets for example).

#### 5. customerIDs

Insert the server-eye-customer-ids of your customers into the corresponding placeholder fields. The customer-ids can be found by using the occ. To do so, follow these steps:

1. Select your customer in the occ.
2. In the right sidebar, click on the info-icon right of the customername.
3. The now displayed cId is the server-eye-customer-id you are looking for.

A server-eye-customer-id is a 32 character string consisting of letters and numbers.

Use autotask to get the autotask-account-id to the corresponding Server-Eye customers.
In autotask, the autotask-account-id of a customer can be found as `id` in the customers details-page.

If you want the bucket-collector to only create tickets for the default-customer you can leave the `customerIDs`-field empty like this `"customerIDs": {}`.

#### 6. apply changes

Your final `autotask-data-template.json`-file could look like this:
```
{
    "username": "server-eye-bucket-collector@yourcompany.com",
    "password": "superS3cr3t",
    "defaultID": 111111111,
    "customerIDs": {
        "1234somecoolsecustomerid11111111" : 11111111,
        "1234somecoolsecustomerid22222222" : 22222222,
        "1234somecoolsecustomerid33333333" : 33333333,
    }
}
```

If you are done inserting the data, save the file as `autotask-data.json` and restart the bucket-collector to make the changes take effect.