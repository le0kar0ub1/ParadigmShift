# Deployment side

`ParadigmShift` is deployed using the `AWS CLI` and `SAM CLI` (Serverless Application Model).

All the deployment is localy scripted and effective on the default AWS CLI account.

All the used resource will be centralized on a `cloudFormation` stack on the targeted environnement.

## Install dependencies

For the `AWS CLI` please follow the [AWS documentation](https://docs.aws.amazon.com/cli/latest/userguide/install-cliv2.html).

For the `SAM CLI` linux installation, don't follow the AWS documentation. Just install `aws-sam-cli` using `pip`.

`pip install --upgrade pip && pip install --user aws-sam-cli`

## About

All the created resource will match the following template name: "paradigmshift-${SUB-UTILITY}". Where ${SUB-UTILITY} is the sub-resource or the use-case in the project.

## How To Deploy

Run the script `deploy.sh` to deploy the project.

`./deploy.sh $AWS-REGION`

Where:
  * `$AWS-REGION` : is deployment region

example: `./deploy.sh eu-west-1`