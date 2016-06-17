# dhis2-unaids-eppspectrum

HIV Pop Data - DHIS2 Plugin App to load UNAIDS Spectrum/Estimation and Projection Package (EPP) model outputs


# Development Setup
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

Build and deploy the app to a DHIS Instance

    gulp clean deploy --url=http://localhost:8080 --username=admin --password=district

To create a zip of the app application

    gulp pack

The zip file should then be available in the folder target.

You can find pre-built releases to DOWNLOAD HERE:

    https://github.com/entuura/dhis2-unaids-eppspectrum/releases/


