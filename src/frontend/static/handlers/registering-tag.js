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
        axios.post(API_TagREGISTER_ENDPOINT, {
            data: transfer
        }).then(function (response) {
            return resolve (response.data.body);
        })
    });
}

async function transferResources(Tag, description, schedStart, schedStop, isScheduled, isRunning, datares)
{
    transfer = {
        TagID: Tag,
        TagDesc: description,
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

function isTagAlreadyExist(Tag)
{
    console.log(Taglist);
    for (i in Taglist)
    {
        if (Tag === Taglist[i].TagID)
        {
            return (false);
        }
    }
    return (true);
}

async function fireRegisteringTag()
{
    const form = document.getElementById("registerform");
    const key = form["form-tag-Key"].value;
    var values = form["form-tag-Values"].value;
    const description = form["form-tag-Description"].value;
    const schedStart = form["form-tag-Scheduling-start"].value;
    const schedStop = form["form-tag-Scheduling-stop"].value;
    const isScheduled = form["form-tag-isScheduled"].value == "yes" ? true : false;
    try {
        values = values.split(",");
    } catch {
        alert("Bad Tag values");
        return;
    }
    transferResources(Tag, description, schedStart, schedStop, isScheduled, isRunning, datares);
}