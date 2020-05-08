function readFile(file)
{
    return new Promise((resolve, reject) => {
        var reader = new FileReader();
        reader.onload = function fileReadCompleted() {
            console.log(reader.result);
            return resolve (reader.result);
        };
        reader.readAsText(file);
    }); 
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
        alert("Register failed: Bad resource JSON format");
        return;
    }
}