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

You need to 1st make sure that 'git' and 'npm' which is part of nodejs is installed on your system. You can use
the 'which' command to test whether an executable is present on the system:

    which npm

Download e.g. the current latest app tree from GitHub via the command:

    git clone https://github.com/unaids/dhis2-unaids-eppspectrum.git

Change directories into the root of the project (the /dhis2-unaids-eppspectrum directory).
From the root of the project:

Set the node npm root to this directory.  This command will create a folder ./node_modules  

    npm root

Install the required npm packages in order to build the app:

    npm install

Make sure you have bower installed

    npm install bower

At this point you need to make sure that binaries we are installing are properly in your path.
npm will, by default, create symlink to binaries in the folder ./node_modules/.bin, so the following
command will include this into your path. Not of course that this will only work from the root of the
project directory:

    export PATH="./node_modules/.bin:$PATH"

Install the bower packages

    bower install

Make sure you have gulp installed

    npm install gulp

Make sure everything is setup correctly

    gulp test

Build and deploy the app to a DHIS Instance (DHIS2HOSTNAME and e.g. TCP Port 8080)

    gulp clean deploy --url=http://DHIS2HOSTNAME:8080 --username=admin --password=district

To create a zip of the app application

    gulp pack

The zip file should then be available in the folder target.
