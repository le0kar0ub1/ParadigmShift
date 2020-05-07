#!/bin/sh

# Variables required : 
# region

printf $@

##
## Entry checkup
##

if [ $# -ne 1 ] || [ $1 == "--help" ]; then
    printf "$0 \$region"
    exit 0
fi

project="paradigmshift"
region=$1
bucket=$project-sambuild


##
## Set the script controlflow
##

function CLEANUP()
{
    rm -rf $BUILD
    rm -rf .aws-sam
}

function RAISE()
{
    CLEANUP
    printf "Process terminated, fatal error"
    exit 0
}

set -e

trap RAISE EXIT

##
## Environnement setup
##

BUILD="build"

mkdir -p $BUILD

##
## Start deploying
##

printf "-------- Update git submodule --------"

git submodule update --init --recursive

printf "-------- Install dependencies --------"

npm install ../src/backend --prefix ../src/backend

printf "-------- Create SAM bucket --------"

aws s3api create-bucket --bucket $bucket --region $region --create-bucket-configuration LocationConstraint=$region

printf "-------- Deploy resources --------"

sam build 

sam package \
    --s3-bucket $bucket \
    --output-template-file build/package.yml

sam deploy \
    --template-file build/package.yml \
    --stack-name $project \
    --capabilities CAPABILITY_NAMED_IAM \
    --region $region \
    --tags Project=$project \
    --parameter-overrides \
        Project=$project \

CLEANUP

printf "We are done !"

trap - EXIT