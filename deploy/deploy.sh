#!/bin/sh

# Variables required : 
# region
# matchuniq for bucket

echo $@

##
## Entry checkup
##

if [ $# -ne 2 ] || [ $1 == "--help" ]; then
    echo "$0 \$region" "\$matchuniq"
    exit 0
fi

project="paradigmshift"
region=$1
matchuniq=$2
bucket=$project-matchuniq-sambuild

##
## Environnement setup
##

BUILD="build"

mkdir -p $BUILD

. deploy-helpers

##
## Set the script controlflow
##

function CLEANUP()
{
    rm -rf $BUILD
    rm -rf .aws-sam
    rm -rf $(find ../ -name node_modules)
    rm -f  $(find ../ -name package-lock.json)
}

function RAISE()
{
    CLEANUP
    echo "Process terminated, fatal error"
    exit 0
}

set -e

trap RAISE EXIT

##
## Start deploying
##

echo "-------- Update git submodule --------"

git submodule update --init --recursive

echo "-------- Install dependencies --------"

npm install ../src/backend --prefix ../src/backend

echo "-------- Create SAM bucket --------"

aws s3api create-bucket --bucket $bucket --region $region --create-bucket-configuration LocationConstraint=$region

echo "-------- Deploy resources --------"

sam build 

sam package \
    --s3-bucket $bucket \
    --output-template-file build/package.yml \
    --debug

sam deploy \
    --template-file build/package.yml \
    --stack-name $project \
    --capabilities CAPABILITY_NAMED_IAM \
    --region $region \
    --tags Project=$project \
    --parameter-overrides \
        Project=$project \
        Region=$region \
        matchuniq=$matchuniq \

echo "-------- Build config --------"

apiendpoint=$(getValueFromKey APIendpoint paradigmshift)

. config.sh

echo "-------- Deploy frontend --------"

s3path=$(getValueFromKey BucketName paradigmshift)

aws s3 cp --recursive ../src/frontend/static "s3://$s3path"

CLEANUP

echo "We are done !"

trap - EXIT