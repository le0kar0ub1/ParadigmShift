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

function backend_write_resource(contextid)
{
    return new Promise((resolve, reject) => {
        axios.post(API_CONTEXTREGISTER_ENDPOINT, {
            data: {
                type: type,
                contextID: contextid
            }
        }).then(function (response) {
            return resolve (response.data.body);
        })
    });
}

async function prepareTransfer(data)
{
    try {
        var ec2 = data["ec2::instance"];
        if (ec2.id.length === ec2.attribut.length && 
        ec2.id.length === ec2.isScheduled.length)
        {

        }
    } catch (err) {}
    alert("stopped");
}

async function fireRegistering()
{
    const form = document.getElementById("registerform");
    const Context = form["form-Context"].value;
    const Description = form["form-Description"].value;
    const Scheduling = form["form-Scheduling"].value;
    const isScheduled = form["form-isScheduled"].value == "yes" ? true : false;
    const isRunning = form["form-isRunning"].value == "yes" ?  true : false;
    var datares = await readFile(form["form-file"].files[0]);
    try {
        datares = JSON.parse(datares);
    } catch {
        alert("Registering failed: Bad resource JSON format");
        return;
    }
    prepareTransfer(datares);
}