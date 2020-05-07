function contextSelector()
{
    var select = document.getElementById("contextSelector");
    select.selectedIndex = 0;
}

function contextDescription()
{
    var context = document.getElementById("desc-context");
    var desc = document.getElementById("desc-desc");
    var rule = document.getElementById("desc-rule");
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
    for(let i = 0; slist[i]; i++) {
        var el = document.createElement("option");
        el.textContent = slist[i];
        el.value = i;
        select.appendChild(el);
    }
    select.selectedIndex = 0;
}
