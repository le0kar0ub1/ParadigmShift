var contextlist;
var tagList;

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

function backend_request_tag(tagKey, type)
{
    return new Promise((resolve, reject) => {
        axios.post(API_CONTEXTGET_ENDPOINT, {
            data: {
                type: type,
                tagKey: tagKey
            }
        }).then(function (response) {
            return resolve (response.data.body);
        })
    });
}

function contextDescription()
{
    try {
        const select = document.getElementById("contextSelector");
        const data = contextlist[select.selectedIndex];
        var context = document.getElementById("desc-context-context");
        var desc = document.getElementById("desc-context-desc");
        var rulestart = document.getElementById("desc-context-rule-start");
        var rulestop = document.getElementById("desc-context-rule-stop");
        var issched = document.getElementById("desc-context-issched");
        context.textContent = data.contextID;
        desc.textContent = data.contextDesc;
        rulestart.textContent = data.schedulingRuleStart;
        rulestop.textContent = data.schedulingRuleStop;
        issched.textContent = data.isScheduled == true ? "True" : "False";
        setPowerState(data.powerState, "contextPowerState");
    } catch (err) {
        console.log("An unexpected error occured: " + err);
    }
}

function tagDescription()
{
    try {
        const select = document.getElementById("tagSelector");
        const data = tagList[select.selectedIndex];
        var tagkey = document.getElementById("desc-tag-key");
        var tagvalues = document.getElementById("desc-tag-values");
        var desc = document.getElementById("desc-tag-desc");
        var rulestart = document.getElementById("desc-tag-rule-start");
        var rulestop = document.getElementById("desc-tag-rule-stop");
        var issched = document.getElementById("desc-tag-issched");
        tagkey.textContent = data.tagKey;
        tagvalues.textContent = data.tagValues;
        desc.textContent = data.tagDesc;
        rulestart.textContent = data.schedulingRuleStart;
        rulestop.textContent = data.schedulingRuleStop;
        issched.textContent = data.isScheduled == true ? "True" : "False";
        setPowerState(data.powerState, "tagPowerState");
    } catch (err) {
        console.log("An unexpected error occured: " + err);
    }
}

function setPowerState(bool, id)
{
    var state = document.getElementById(id);

    if (bool == true)
        state.textContent = "State: RUNNING";
    else
        state.textContent = "State: STOPPED";
}

async function preload()
{
    return;
    const rawdatacontext = await backend_request_context("restricted-all", "context");
    const rawdatatag = await backend_request_tag("restricted-all", "tag");

    try {
        contextlist = JSON.parse(rawdatacontext);
        tagList = JSON.parse(rawdatatag);
    } catch (err) {
        console.log("Database access failed: " + err);
        return;
    }
    var contextSelect = document.getElementById("contextSelector");
    for(let i = 0; contextlist[i]; i++)
    {
        var elem = document.createElement("option");
        elem.textContent = contextlist[i].contextID;
        elem.value = i;
        contextSelect.appendChild(elem);
    }
    var tagSelect = document.getElementById("tagSelector");
    for(let i = 0; tagList[i]; i++)
    {
        var elem = document.createElement("option");
        elem.textContent = tagList[i].tagKey;
        elem.value = i;
        tagSelect.appendChild(elem);
    }
    // flushing now
    contextDescription();
    tagDescription();
}
