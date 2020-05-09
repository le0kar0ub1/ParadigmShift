var contextlist;

function backend_request_context(contextid, type)
{
    return new Promise((resolve, reject) => {
        axios.post(API_CONTEXTGET_ENDPOINT, {
            data: {
                type: type,
                contextID: contextid
            }
        }).then(function (response) {
            return resolve (response.data.body);
        })
    });
}

function contextDescription()
{
    const select = document.getElementById("contextSelector");
    const data = contextlist[select.selectedIndex]

    try {
        var context = document.getElementById("desc-context");
        var desc = document.getElementById("desc-desc");
        var rule = document.getElementById("desc-rule");
        var issched = document.getElementById("desc-issched");
        context.textContent = data.contextID;
        desc.textContent = data.contextDesc;
        rule.textContent = data.schedulingRule
        issched.textContent = data.isScheduled == true ? "True" : "False";
        setPowerState(data.powerState);
    } catch (err) {
        console.log("An unexpected error occured: " + err);
    }
}

function setPowerState(bool)
{
    var state = document.getElementById("powerState");

    if (bool == true)
        state.textContent = "State: RUNNING";
    else
        state.textContent = "State: STOPPED";
}

async function preload()
{
    const rawdata = await backend_request_context("restricted-all", "context");

    console.log(rawdata);
    try {
        contextlist = JSON.parse(rawdata);
    } catch (err) {
        console.log("Database access failed: " + err);
        return;
    }
    var select = document.getElementById("contextSelector");
    for(let i = 0; contextlist[i]; i++)
    {
        var elem = document.createElement("option");
        elem.textContent = contextlist[i].contextID;
        elem.value = i;
        select.appendChild(elem);
    }
    contextDescription();
}