# Datamodel Description

The project work around the registering of applications and their sub-resources, we need a well done database model.

As explained, the model will be reworked when necessary.

## Model

At top level we register a `context` of resources. The name context is given for a future scalability over the target specific resource, where we will allow to register only one.

The array below represent a total context description.

| Entry                    | DB Type             | Format (string relevant only)    | Description                                                  |
|--------------------------|---------------------|----------------------------------|--------------------------------------------------------------|
| `contextName`            | _String_            | None                             | The name of the context                                      |
| `contextDescription`     | _String_            | None                             | The description of the context                               |
| `powerState`             | _Boolean_           | None                             | The current power state of the context                       |
| `isScheluderActive`      | _Boolean_           | None                             | Is the context currently scheduled                           |
| `schedulingRule`         | _String_            | UNDEFINED  (cron?)               | The scheduling rule applied to the context                   |
| `service::resource`      | _String_            | JSON stringifed                  | A list of resource with the same type                        |

`service::resource` is a template for the registering of a particular `resource`.

The entry below represent an example of utilization.

| Entry                    | DB Type             | Format (string relevant only)    | Description                                                  |
|--------------------------|---------------------|----------------------------------|--------------------------------------------------------------|
| `appstream::fleet`       | _String_            | JSON stringifed                  | List of appsteam fleet in the context                        |

Each service::resource JSON has the following format.

```javascript
{
    ids: ["firstid", "secondid", ...],
    isScheduled: [true, false, ...]
}
```