# Datamodel Description

The project work around the registering of applications and their sub-resources, we need a well done database model.

As explained, the model will be reworked when necessary.

## Model

The model is composed of three tables.

For the scheduling by context, the first one which contain the basics informations on the context and the second all the registered resources.
The choice to use two database is driven by the fact that we will often request one of them, then it allow us to lower the weight of data during requests.

The third database is used for scheduling by resources tags.

At top level we register a `context` of resources. The name context is given for a future scalability over the target specific resource, where we will allow to register one by one as a context.

### Database: context

The array below represent a context description.

| Field                    | DB Type             | Format (string relevant only)    | Description                                                     |
|--------------------------|---------------------|----------------------------------|-----------------------------------------------------------------|
| `contextID`              | _String_            | None                             | The name of the context (must be uniqu)                          |
| `contextDesc`            | _String_            | None                             | The description of the context                                  |
| `powerState`             | _Boolean_           | None                             | The current power state of the context                          |
| `isScheduled`            | _Boolean_           | None                             | Is the context currently scheduled                              |
| `schedulingRuleStart`    | _String_            | crontab expression               | The scheduling rule applied to the context to start             |
| `schedulingRuleStop`     | _String_            | crontab expression               | The scheduling rule applied to the context to stop              |
| `lastScheduling`         | _Number_            | None                             | Last scheduling in seconds from  01/01/1970 00:00:00 UTC        |

The JSON below is a sample entry.

```javascript
{
    contextID: "myapp",
    contextDesc: "just an example",
    isScheduled: true,
    lastScheduling: 1589012783441,
    powerState: false,
    schedulingRuleStart: "0 8 * * ? *",
    schedulingRuleStop: "0 18 * * ? *"
}
```

### Database: resources

The entry below represent an entry which reference resources in one context above.

| Field                    | DB Type             | Format (string relevant only)    | Description                                                  |
|--------------------------|---------------------|----------------------------------|--------------------------------------------------------------|
| `contextID`              | _String_            | None                             | The name of the context (must match the one above)           |
| `service::resource`      | _String_            | JSON stringifed                  | A list of resources with the same type in the context        |
| `appstream::fleet`       | _String_            | JSON stringifed                  | List of appstream fleet in the context                       |
| `...::...`               | _String_            | JSON stringifed                  | List of ............... in the context                       |

`service::resource` is a template for the registering of a particular `resource`.

Each `service::resource` entry has the following JSON format.

```javascript
{
    id: ["firstid", "secondid", ...],
    isScheduled: [true, false, ...],
    attrib: ["", "", ...]
}
```

  * `id` : the resources id list
  * `isScheduled` : is the specific resource scheduled ?
  * `attrib` : specific usage still undefined

Obviously all the members *MUST* match the same size.

The list of schedulable resources is provided [here](../resources.md).

The JSON below is a sample entry. In reality, the JSON objects are stringifyied.

```javascript
{
  contextID: "myapp",
  ec2::instance: {
      id: ["ec2id1","ec2id2"],
      isScheduled: [true, false],
      attrib:["",""]
  },
  rds::instance: {
      id: ["rdsid1", "rdsid2", "rdsid3"],
      isScheduled: [true, false, true],
      attrib: ["", "", ""]
  }
}
```

### Database: tags

| Field                    | DB Type             | Format (string relevant only)    | Description                                                  |
|--------------------------|---------------------|----------------------------------|--------------------------------------------------------------|
| `tagKey`                 | _String_            | None                             | The key of the targeted tag                                  |
| `tagValue`               | _String_            | None                             | The value of the targeted tag                                |
| `schedulingRuleStart`    | _String_            | crontab expression               | The scheduling rule applied to the context to start          |
| `schedulingRuleStop`     | _String_            | crontab expression               | The scheduling rule applied to the context to stop           |
| `isScheduled`            | _Boolean_           | None                             | Is the current tag scheduled                                 |

The JSON below is a sample entry.

```javascript
{
    tagKey: "Project",
    tagValue: "paradigmshift",
    schedulingRuleStart: "0 8 * * ? *",
    schedulingRuleStop: "0 18 * * ? *"
}
```

## Implementation

Ok got the model, but how is it implemented on the AWS environment ?

The database currently used is the AWS [DynamodDB](https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/Introduction.html).

DynamoDB is a scalable [noSQL](https://en.wikipedia.org/wiki/NoSQL) database.

### Implementation 'problems'

In the processus we will have to `query` on the `isScheduled` entries.
The problem is that *DynamoDB* does not allow us to create a *secondary index* with boolean type.

So, we will be forced to `scan` the database instead of `query`.

This is not an error, but in a clarity mindset the choice has been to NOT used `sparse` method.

For a little explaination, we would have been able to set `isScheduled` as a _String_ and mark it with a *"X"* when the scheduling is active and nothing if not.

This method works very well but involves a loss of coherence and understanding.

The choice made is very probably questionable, ready to discuss :)