# Deployment side

`ParadigmShift` is deployed using the `AWS CLI` and `SAM CLI` (Serverless Application Model).

All the deployment is localy scripted and effective on the default AWS CLI account.

All the used resource will be centralized on a `cloudFormation` stack on the targeted environnement.

## Install dependencies

For the `AWS CLI` please follow the [AWS documentation](https://docs.aws.amazon.com/cli/latest/userguide/install-cliv2.html).

For the `SAM CLI` linux installation, don't follow the AWS documentation. Just install `aws-sam-cli` using `pip`.

`pip install --upgrade pip && pip install --user aws-sam-cli`

## how To Deploy

