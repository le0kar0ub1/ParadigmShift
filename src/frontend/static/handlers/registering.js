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

async function transferResources(context, description, scheduling, isScheduled, isRunning, datares)
{
    transfer = {
        contextID: context,
        contextDesc: description,
        schedulingRule: scheduling,
        isScheduled: isScheduled,
        powerState: isRunning,
        resources: JSON.stringify(datares)
    };
    var resolved = await backend_write_resource(transfer);
    console.log(resolved);
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
            if (cur.id.length !== cur.attribut.length ||
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

async function fireRegistering()
{
    const form = document.getElementById("registerform");
    const context = form["form-Context"].value;
    const description = form["form-Description"].value;
    const scheduling = form["form-Scheduling"].value;
    const isScheduled = form["form-isScheduled"].value == "yes" ? true : false;
    const isRunning = form["form-isRunning"].value == "yes" ?  true : false;
    var datares = await readFile(form["form-file"].files[0]);
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
    transferResources(context, description, scheduling, isScheduled, isRunning, datares);
}