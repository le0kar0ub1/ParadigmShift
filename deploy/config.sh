#!/bin/sh

#
# Create the frontend `config.js` file
#

TARGET="../src/frontend/static/config.js"

rm -f $TARGET

##
## Set the script controlflow
##

function CLEANUP()
{
    rm -f $TARGET
}

function RAISE()
{
    CLEANUP
    printf "Process terminated, fatal error"
    exit 0
}

set -e

trap RAISE EXIT

# First we need the APIs endpoints 


trap - EXIT