# bucket-collector

## Synopsis

The bucket-collector uses the Server-Eye [Bucket-API](https://api.server-eye.de/docs/1/#/customer/get_bucket_empty) to get notification-messages from Server-Eye and reacts the received messages depending on the selected reactiontype.

## Installation

Go to the [realeases](https://github.com/Server-Eye/bucket-collector/releases) and download the correct version for your system. 
Unpack the archive in the folder you want the bucket-collector to run in and start the application. Follow the instructions on screen to configure your bucket-collector.

## Updating

To update your installation of the bucket-collector follow these steps:

1. Stop the bucket-collector if it is currently running.
2. Copy the `bucket-data`- and the `reaction-data`-directory from your current installation to a new directory.
3. Delete your current installation and [download](https://github.com/Server-Eye/bucket-collector/releases) and install the new version.
4. Copy the directories from step 2 back into the installation-directory
5. Start the new version of the bucket-collector. 


**Check out our [wiki](https://github.com/Server-Eye/bucket-collector/wiki) for additional informations.**