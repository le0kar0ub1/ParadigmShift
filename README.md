# ParadigmShift

The purpose of this project is the global AWS scheduling.

This is a missing point in the cloud universe.

The target scheduling will be higher as possible.

# Project Tree Reference

| Path           | Description                                             |
|----------------|---------------------------------------------------------|
| `doc`          | [Root documentation directory](doc/rootdoc.md)          |
| `src`          | Root directory sources                                  |
| `src/backend`  | [Backend sources](src/backend/README.md)                |
| `src/frontend` | [Frontend sources](src/frontend/README.md)              |
| `deploy`       | [Deployment env directory](deploy/README.md)            |


## Dependencies

  - `AWS account` configured
  - `AWS CLI`
  - `SAM CLI`

## Install

For `AWS CLI` please follow the [AWS documentation](https://docs.aws.amazon.com/cli/latest/userguide/install-cliv2.html).

For `SAM CLI` linux installation, don't follow the AWS documentation. Just install `aws-sam-cli` using `pip`.

`pip install --upgrade pip && pip install --user aws-sam-cli`