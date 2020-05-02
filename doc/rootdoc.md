# Root Project Documentation

ParadigmShift is a high level target scheduler.

This is little personnal project without any ambition.

## The Cloud

Working with a [cloud provider](https://fr.wikipedia.org/wiki/Cloud_computing) as [AWS](https://en.wikipedia.org/wiki/Amazon_Web_Services) change many things.

This is a universe where the automatation is taken to the extreme and the end user work is highly reduce.

The `As A Service` concept.

<img src="aas.jpg" width="800" height="400">

The Cloud can offer to the user an abstraction on the manipulated objects.

In this mindset and Working around `AWS` universe this project was born.

## A scheduler... for what ?

The central idea is that you can affect the differents ressources with your own rules using principaly low level target service scheduling and `lambda functions`.

The purpose of `ParadigmShift` is to raise the target scope level from `ressource` to `application`.

Then, you will be allowed to schedule entire applications with your own rules.

## About the documentation

As a well documented project, we will describe the [High Level Design](design/hld.md) and then the [Low Level Design](design/lld.md).

All the documentation is wroten in MarkDown so far but an other one will be provided later.

| Path                      | Reference                                                         |
|---------------------------|-------------------------------------------------------------------|
| `doc/design/hld`          | [High Level Design documentation](design/hld.md)                  |
| `doc/design/lld`          | [Low Level Design documentation](design/lld.md)                   |