let accessoryBagDisplay = document.getElementById("accessoryBagDetails");
let petsDisplay = document.getElementById("petsDetails");
let minionsDisplay = document.getElementById("minionsDetails");

function getCoreTasksDetails(task, whatToShow) {
    //Accessories
    if (task == "accessories") {
        let accessoryBagDisplayString = "";
        for (let key in constants.max_magical_power[whatToShow]) {
            accessoryBagDisplayString += constants.max_magical_power[whatToShow][key] + "<br />";
        }
        accessoryBagDisplay.innerHTML = accessoryBagDisplayString;
    }
    //Pets
    if (task == "pets") {
        let petsDisplayString = "";
        for (let key in constants.max_pet_score[whatToShow]) {
            petsDisplayString += constants.max_pet_score[whatToShow][key] + "<br />";
        }
        petsDisplay.innerHTML = petsDisplayString;
    }
    if (task == "minions") {
        let minionsDisplayString = "";
        for (let minion in constants.max_minions[whatToShow]) {
            minionsDisplayString += minion + ": " + constants.max_minions[whatToShow][minion] + "<br />";
        }
        minionsDisplay.innerHTML = minionsDisplayString;
    }
}