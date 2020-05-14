# Backend documentation

The backend is composed only of `lambda functions` for computing.

The are principlay 3 parts, like follow.

## Frontend Request

This is the part wich managing frontend/user requests.

Absolute involved path: `src/backend/requests`.

The lambda handlers are triggered by `Amazon API gateway` (rest api).

Global requests.

| Requests                         | Criticality    | State         |
|----------------------------------|----------------|---------------|
| Global scheduler start/stop      | _Must_         |               |

Context requests.

| Requests                         | Criticality    | State         |
|----------------------------------|----------------|---------------|
| Context scheduler start/stop     | _Must_         |               |
| Context power state on/off       | _Should_       |               |
| Register a context               | _Must_         | Handled       |
| Unregister a context             | _Must_         | Handled       |
| Get context attrib               | _Must_         | Handled       |
| Get context resources            | _Must_         | Handled       |
| Add a resource to a context      | _Should_       |               |
| Sub a resource to a context      | _Should_       |               |

Tag requests.

| Requests                         | Criticality    | State         |
|----------------------------------|----------------|---------------|
| Tag scheduler start/stop         | _Must_         |               |
| Tag power state on/off           | _Should_       |               |
| Register a tag                   | _Must_         | Handled       |
| Unregister a tag                 | _Must_         | Handled       |
| Get tag attrib                   | _Must_         | Handled       |
| Add a value to a tag             | _Should_       |               |
| Sub a value to a tag             | _Should_       |               |


## Scheduler core

Our purposed scheduler which will be called by `Amazon CloudWatch` event.

Absolute involved path: `src/backend/scheduler`.

The periodicity of the event is targeted during de deployment and currently can't be amended. This feature is in the scope.

## Scheduler handler

Linked with the scheduler core, composed of the sub-module [Thunderbolt](https://github.com/le0kar0ub1/Thunderbolt) which contain all the handlers for the target resources.

Absolute involved path: `src/backend/scheduler/target`.

The repository [Thunderbolt](https://github.com/le0kar0ub1/Thunderbolt) host all our resource handlers and is too open source, deployable, usable. Here we are using it as a part of the project.