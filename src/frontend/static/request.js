const API_CONTEXTGET_ENDPOINT="https://gli41icizd.execute-api.eu-west-1.amazonaws.com/dev/tkt"

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

async function contextDescription()
{
    // const contextid = document.getElementById("contextSelector").textContent;
    const contextid = "myfirstcontext";
    const data = await backend_request_context(contextid, "context");

    console.log(data);
    if (data.contextID && data.contextDesc && data.schedulingRule
&& data.powerState && data.isScheduled)
    {
        var context = document.getElementById("desc-context");
        var desc = document.getElementById("desc-desc");
        var rule = document.getElementById("desc-rule");
        var issched = document.getElementById("desc-issched");
        context.textContent = data.contextID;
        desc.textContent = data.contextDesc;
        rule.textContent = data.schedulingRule
        issched.textContent = data.isScheduled == true ? "True" : "False";
        setPowerState(data.powerState);
    }
}

function setPowerState(bool)
{
    var state = document.getElementById("powerState");
    if (bool == true)
        state.textContent = "State: ruuning";
    else
        state.textContent = "State: stopped";
}

function dynamize()
{
    slist = ["bla", "blo", "blu"];

    var select = document.getElementById("contextSelector");
    for(let i = 0; slist[i]; i++)
    {
        var el = document.createElement("option");
        el.textContent = slist[i];
        el.value = i;
        select.appendChild(el);
    }
}
