# Deployment side

`ParadigmShift` is deployed using the `AWS CLI` and `SAM CLI` (Serverless Application Model).

All the used resource will be centralized on a `cloudFormation` stack on the targeted environnement.

`ParadigmShift` have to be as generic as possible, the security is handled by the deployer, you MUST add the security you want on the app.

## Install dependencies

For the `AWS CLI` please follow the [AWS documentation](https://docs.aws.amazon.com/cli/latest/userguide/install-cliv2.html).

For the `SAM CLI` linux installation, don't follow the AWS documentation. Just install `aws-sam-cli` using `pip`.

`pip install --upgrade pip && pip install --user aws-sam-cli`

The repository depend of personnal git submodule(s). The deployment script update them at each run.

## About

All the created resource will match the following template name: "paradigmshift-${SUB-UTILITY}". Where ${SUB-UTILITY} is the sub-resource or the use-case in the project.

## How To Deploy

Run the script `deploy.sh` to deploy the project.

`cd deploy && ./deploy.sh $AWS-REGION $MATCH-UNIQ $AWS-PROFILE`

Where:
  * `$AWS-REGION` : is deployment region
  * `$MATCH-UNIQ` : is a uniq id for bucket naming -> 'paradigmshift-${MATH-UNIQ}-XXX'
  * `AWS-PROFILE` : is the aws profile which will be used while deploying

example: `./deploy.sh eu-west-1 mysociety default`