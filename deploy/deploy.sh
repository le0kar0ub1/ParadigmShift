#!/bin/sh

# Variables required : 
# region
# matchuniq for bucket
# aws profile

echo $@

##
## Entry checkup
##

if [ $# -ne 3 ] || [ $1 == "--help" ]; then
    echo "$0 \$region \$matchuniq \$awsprofile"
    exit 0
fi

project="paradigmshift"
region=$1
matchuniq=$2
awsprofile=$3
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

aws s3api create-bucket --bucket $bucket --region $region --create-bucket-configuration LocationConstraint=$region --profile $awsprofile

echo "-------- Deploy resources --------"

sam build --profile $awsprofile

sam package \
    --s3-bucket $bucket \
    --output-template-file build/package.yml \
    --profile $awsprofile

sam deploy \
    --template-file build/package.yml \
    --stack-name $project \
    --capabilities CAPABILITY_NAMED_IAM \
    --region $region \
    --tags Project=$project \
    --profile $awsprofile
    --parameter-overrides \
        Project=$project \
        Region=$region \
        matchuniq=$matchuniq \

echo "-------- Build config --------"

apiendpoint=$(getValueFromKey APIendpoint $project $awsprofile)

. config.sh

echo "-------- Deploy frontend --------"

s3path=$(getValueFromKey BucketName $project $awsprofile)

aws s3 cp --recursive ../src/frontend/static "s3://$s3path" --profile $awsprofile

CLEANUP

echo "We are done !"

CFendpoint=$(getValueFromKey CloudfrontEndpoint $project $awsprofile)

echo "\nEndpoint Access: $CFendpoint"

trap - EXIT