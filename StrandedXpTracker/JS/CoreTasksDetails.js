let accessoryBagDisplay = document.getElementById("accessoryBagDetails");

function getCoreTasksDetails(task, whatToShow) {
    if (task == "accessories") {
        if (whatToShow == "COMMON") {
            let accessoryBagDisplayString = "";
            for (let key in constants.max_magical_power[whatToShow]) {
                    accessoryBagDisplayString += constants.max_magical_power[whatToShow][key] + "<br />";
            }
            accessoryBagDisplay.innerHTML = accessoryBagDisplayString;
        }
        if (whatToShow == "UNCOMMON") {
            let accessoryBagDisplayString = "";
            for (let key in constants.max_magical_power[whatToShow]) {
                    accessoryBagDisplayString += constants.max_magical_power[whatToShow][key] + "<br />";
            }
            accessoryBagDisplay.innerHTML = accessoryBagDisplayString;
        }
        if (whatToShow == "RARE") {
            let accessoryBagDisplayString = "";
            for (let key in constants.max_magical_power[whatToShow]) {
                    accessoryBagDisplayString += constants.max_magical_power[whatToShow][key] + "<br />";
            }
            accessoryBagDisplay.innerHTML = accessoryBagDisplayString;
        }
        if (whatToShow == "EPIC") {
            let accessoryBagDisplayString = "";
            for (let key in constants.max_magical_power[whatToShow]) {
                    accessoryBagDisplayString += constants.max_magical_power[whatToShow][key] + "<br />";
            }
            accessoryBagDisplay.innerHTML = accessoryBagDisplayString;
        }
        if (whatToShow == "LEGENDARY") {
            let accessoryBagDisplayString = "";
            for (let key in constants.max_magical_power[whatToShow]) {
                    accessoryBagDisplayString += constants.max_magical_power[whatToShow][key] + "<br />";
            }
            accessoryBagDisplay.innerHTML = accessoryBagDisplayString;
        }
        if (whatToShow == "SPECIAL") {
            let accessoryBagDisplayString = "";
            for (let key in constants.max_magical_power[whatToShow]) {
                    accessoryBagDisplayString += constants.max_magical_power[whatToShow][key] + "<br />";
            }
            accessoryBagDisplay.innerHTML = accessoryBagDisplayString;
        }
    }
}