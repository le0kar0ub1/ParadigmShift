# Backend documentation

The backend is composed only of `lambda functions` for computing.

The are principlay 3 parts, like follow.

## Frontend Request

This is the part wich managing frontend/user requests.

Absolute involved paths:
  * `src/backend/data-get`
  * `src/backend/data-set`

The lambda handlers are triggered by `Amazon API gateway` (rest api).

| Requests                         | Criticality    | State         |
|----------------------------------|----------------|---------------|
| Global scheduler start/stop      | _Must_         |               |
| Context scheduler start/stop     | _Must_         |               |
| Context power state on/off       | _Must_         |               |
| Register a context               | _Must_         | Handled       |
| Unregister a context             | _Must_         | Handled       |
| Get a context                    | _Must_         | Handled       |
| Get a resource context           | _Must_         | Handled       |
| Add a resource to a context      | _Should_       |               |
| Sub a resource to a context      | _Should_       |               |

## Scheduler core

Our purposed scheduler which will be called by `Amazon CloudWatch` event.

Absolute involved path:
  * `src/backend/scheduler`

## Scheduler handler

Linked with the scheduler core, composed of the sub-module `Thunderbolt` which contain all the handlers for the target resources.

Absolute involved path:
  * `src/backend/scheduler/target`