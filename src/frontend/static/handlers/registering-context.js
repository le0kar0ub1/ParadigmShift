function readFile(file)
{
    return new Promise((resolve, reject) => {
        var reader = new FileReader();
        reader.onload = function fileReadCompleted() {
            return resolve (reader.result);
        };
        reader.readAsText(file);
    }); 
}

function backend_write_resource(transfer)
{
    return new Promise((resolve, reject) => {
        axios.post(API_CONTEXTREGISTER_ENDPOINT, {
            data: transfer
        }).then(function (response) {
            return resolve (response.data.body);
        })
    });
}

async function transferResources(context, description, schedStart, schedStop, isScheduled, isRunning, datares)
{
    transfer = {
        contextID: context,
        contextDesc: description,
        schedulingRuleStart: schedStart,
        schedulingRuleStop: schedStop,
        isScheduled: isScheduled,
        powerState: isRunning,
        resources: JSON.stringify(datares)
    };
    let resolved = await backend_write_resource(transfer);
    if (resolved != "Success")
        alert("Registering failed: " + resolved);
}

function checkFileValidity(data)
{
    for (res in resourceref)
    {
        try { 
            var cur = data[resourceref[res]]; 
            if (cur === undefined)
                continue;
        } catch (err) {
            continue;
        }
        try {
            if (cur.id.length !== cur.attrib.length ||
            cur.id.length !== cur.isScheduled.length)
            {
                return (false)
            }
        } catch (err) { 
            return (false) 
        }
    }
    return (true);
}

function isContextAlreadyExist(context)
{
    console.log(contextlist);
    for (i in contextlist)
    {
        if (context === contextlist[i].contextID)
        {
            return (false);
        }
    }
    return (true);
}

async function fireRegisteringContext()
{
    const form = document.getElementById("registerFormContext");
    const context = form["form-context-Context"].value;
    const description = form["form-context-Description"].value;
    const schedStart = form["form-context-Scheduling-start"].value;
    const schedStop = form["form-context-Scheduling-stop"].value;
    const isScheduled = form["form-context-isScheduled"].value == "yes" ? true : false;
    const isRunning = form["form-context-isRunning"].value == "yes" ?  true : false;
    var datares = await readFile(form["form-context-file"].files[0]);
    try {
        datares = JSON.parse(datares);
    } catch {
        alert("Registering failed: Bad resource JSON format");
        return;
    }
    if (checkFileValidity(datares) == false)
    {
        alert("Registering failed: All resources array must match the same size");
        return;
    }
    transferResources(context, description, schedStart, schedStop, isScheduled, isRunning, datares);
}