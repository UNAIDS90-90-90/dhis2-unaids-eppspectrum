# dhis2-unaids-eppspectrum

HIV Pop Data - DHIS2 Plugin App to load UNAIDS Spectrum/Estimation and Projection Package (EPP) model outputs

For detailed documentation on this app, please see the related repository at:

https://github.com/UNAIDS/dhis2-unaids-eppspectrum-resources

This repository is focused on the application source code


You can find pre-built releases to DOWNLOAD HERE:

https://github.com/UNAIDS/dhis2-unaids-eppspectrum/releases/



###
## To build this DHIS2 App from scratch see instructions below
###

App can be built on OSX (with appropriate homebrew or macports setup) or on Unix
host (Linux and FreeBSD have been tested).

If you are trying to build this application and have problems, please post on the
bug/discuss list associated with this GitHub project.


# Software Development Setup
From the root of the project.

Install the npm packages

    npm install

Make sure you have bower installed globally

    npm install -g bower

Install the bower packages

    bower install

Make sure you have gulp installed globally

    npm install -g gulp

Make sure everything is setup correctly

    gulp test

Build and deploy the app to a DHIS Instance (DHIS2HOSTNAME and e.g. TCP Port 8080)

    gulp clean deploy --url=http://DHIS2HOSTNAME:8080 --username=admin --password=district

To create a zip of the app application

    gulp pack

The zip file should then be available in the folder target.
