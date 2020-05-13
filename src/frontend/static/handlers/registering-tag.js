function backend_write_tag(transfer)
{
    return new Promise((resolve, reject) => {
        axios.post(API_TAGREGISTER_ENDPOINT, {
            data: transfer
        }).then(function (response) {
            return resolve (response.data.body);
        })
    });
}

async function transferResources(key, values, description, schedStart, schedStop, isScheduled, isRunning)
{
    transfer = {
        tagKey: key,
        tagValues: values,
        tagDesc: description,
        schedulingRuleStart: schedStart,
        schedulingRuleStop: schedStop,
        isScheduled: isScheduled,
        isRunning: isRunning
    };
    let resolved = await backend_write_tag(transfer);
    if (resolved != "Success")
        alert("Registering failed: " + resolved);
}

function fireRegisteringTag()
{
    const form = document.getElementById("registerFormTag");
    const key = form["form-tag-Key"].value;
    var values = form["form-tag-Values"].value;
    const description = form["form-tag-Description"].value;
    const schedStart = form["form-tag-Scheduling-start"].value;
    const schedStop = form["form-tag-Scheduling-stop"].value;
    const isScheduled = form["form-tag-isScheduled"].value == "yes" ? true : false;
    const isRunning = form["form-tag-isRunning"].value == "yes" ?  true : false;
    try {
        values = values.split(",");
    } catch {
        alert("Bad Tag values");
        return;
    }
    transferResources(key, values, description, schedStart, schedStop, isScheduled, isRunning);
}