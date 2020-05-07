# Datamodel Description

The project work around the registering of applications and their sub-resources, we need a well done database model.

As explained, the model will be reworked when necessary.

## Model

The model is composed of two databases, the first one which contain the basics informations on the context and the second all the registered resources.

The choice to use 2 database is driven by the fact that we will often request one of them, then it allow us to lower the weight of data during requests.

At top level we register a `context` of resources. The name context is given for a future scalability over the target specific resource, where we will allow to register one by one as a context.

### Database: basic context

The array below represent a context description.

| Field                    | DB Type             | Format (string relevant only)    | Description                                                     |
|--------------------------|---------------------|----------------------------------|-----------------------------------------------------------------|
| `contextID`              | _String_            | None                             | The name of the context (must be uniq)                          |
| `contextDesc`            | _String_            | None                             | The description of the context                                  |
| `powerState`             | _Boolean_           | None                             | The current power state of the context                          |
| `isScheduled`            | _Boolean_           | None                             | Is the context currently scheduled                              |
| `schedulingRule`         | _String_            | UNDEFINED  (cron ?)              | The scheduling rule applied to the context                      |
| `lastScheduling`         | _Number_            | None                             | Last scheduling in seconds from  01/01/1970 00:00:00 UTC        |


### Database: resources

The entry below represent an entry which reference resources in one context above.

| Field                    | DB Type             | Format (string relevant only)    | Description                                                  |
|--------------------------|---------------------|----------------------------------|--------------------------------------------------------------|
| `contextID`              | _String_            | None                             | The name of the context (must match the one above)           |
| `service::resource`      | _String_            | JSON stringifed                  | A list of resources with the same type in the context        |
| `appstream::fleet`       | _String_            | JSON stringifed                  | List of appsteeam fleet in the context                       |
| `...::...`               | _String_            | JSON stringifed                  | List of ............... in the context                       |

`service::resource` is a template for the registering of a particular `resource`.

Each `service::resource` entry has the following JSON format.

```javascript
{
    ids: ["firstid", "secondid", ...],
    isScheduled: [true, false, ...],
    attribut: ["", "", ...]
}
```

  * `ids` : the resources ids list
  * `isScheduled` : is the specific resource scheduled ?
  * `attribut` : specific usage still undefined

Obviously all the members *MUST* match the same size.

The list of schedulable resources is provided [here](../resources.md).

## Implementation

Ok got the model, but how is it implemented on the AWS environment ?

The database CURRENTLY used is the AWS [DynamodDB](https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/Introduction.html).

DynamoDB is a scalable [noSQL](https://en.wikipedia.org/wiki/NoSQL) database.

## Sample

The JSON below represent a context entry in the database.