//Things to keep in mind in the JSON file:
//Fishing minion have multiple drops with each their chances
//
//Iron, gold and cactus minions need a [auto smelter] or [dwarven super compacter]
//So make the calculator auto select [Auto Smelter] on "Iron minion", "Gold minion" and "Cactus minion" on first upgrade slot
//They can always change from auto smelter to dwarven super compacter, but then super compacter 3000 wont show up on second upgrade slot
//
//"Husbandry" minions can have Berberis Fuel Injector in them
//
//The [Tier] array under every minion is their time between actions
//
//In list of items from minion output, write compacter output first, then the super compacter items in order.
//Example: Glowstone -> Glowstone Dust -> Enchanted Glowstone Dust -> Enchanted Glowstone.
//Another: Packed Ice -> Ice -> Enchanted Ice -> Enchanted Packed Ice.
//
//Under [Enchanted] is the item that can be compacted and how much resoureces they take to be crafted. If one of the items under [enchanted] cant be found on bazaar, dont show it.
//This is to calculate when the minion fills up.
//
//Example of getting prices:
//Cobblestone -> quick_status -> sellPrice is SELL INSTANTLY
//Cobblestone -> quick_status -> buyPrice is SELL ORDER

//replace with bazaar prices

/* Use bazaar prices later when properly set up

var data = [];
getData();

async function getData() {
    var response = await fetch("https://api.hypixel.net/v2/resources/skyblock/items");

    data.push(await response.json());

    data = data[0].items;

    console.log(data);
}
*/
/* Use later when properly set up
$.getJSON("Minions.json", function(minions) {
    console.log(minions.Mining.Ice); // this will show the info it in firebug console
});
*/
let derpy = 1;
let fuelBuff = [];

let divNumber = 0;

function Add() {
    const node = document.getElementById(`minionCalculator${divNumber}`);
    divNumber++;
    clone = node.cloneNode(true);
    clone.getElementsByTagName('div')[1].id = `fuelDropdown${divNumber}`;
    clone.id = `minionCalculator${divNumber}`;
    document.body.appendChild(clone);
}

function Calculate() {
    let Minions = {};
    let alertMessage;
    for (let i = 0; i < document.getElementsByTagName('div').length / 3; i++) {
        let infusedBonus = 0;
        let minionOutput = document.getElementById(`minionCalculator${i}`).getElementsByTagName("input")[0].value;
        let drops = document.getElementById(`minionCalculator${i}`).getElementsByTagName("input")[1].value;
        let amount = document.getElementById(`minionCalculator${i}`).getElementsByTagName("input")[2].value;
        let speed = document.getElementById(`minionCalculator${i}`).getElementsByTagName("input")[3].value;
        let flycatcher = document.getElementById(`minionCalculator${i}`).getElementsByTagName("input")[4].value;
        let petBuff = document.getElementById(`minionCalculator${i}`).getElementsByTagName("input")[5].value;
        let mithrilInfused = document.getElementById(`minionCalculator${i}`).getElementsByTagName("input")[6].checked;

        if (minionOutput == "" || drops == "" || amount == "" || speed == "" || flycatcher == "" || petBuff == "") {
            alert("fill all fields!");
            return;
        }

        flycatcher *= 0.2;

        petBuff *= 0.1;

        if (fuelBuff[i] == undefined) {
            fuelBuff[i] = 0;
        }

        if (mithrilInfused) {
            infusedBonus = 0.1;
        }

        let result = (86400 / (speed / (1 + fuelBuff[i] + flycatcher + petBuff + infusedBonus)) * drops * amount) * derpy;


        if (Object.keys(Minions).some(function (k) { return ~k.indexOf(minionOutput) })) {
            result = Number(Minions[minionOutput]) + Number(result);
            Minions[minionOutput] = (Math.round(result * 100) / 100).toFixed(2);
        } else {
            result = (Math.round(result * 100) / 100).toFixed(2);
            Minions[minionOutput] = result;
        }
    }
    for (let i = 0; i < Object.keys(Minions).length; i++) {
        if (alertMessage == undefined) {
            let resource = Object.keys(Minions)[i];
            let amount = Minions[resource];
            alertMessage = resource.concat(": ", amount);
        } else {
            let resource = Object.keys(Minions)[i];
            let amount = Minions[resource];
            let temp = resource.concat(": ", amount);
            alertMessage = alertMessage.concat("\n", temp);
        }
    }
    alert("Per Day:\n" + alertMessage);
}

function isDerpy() {
    var checkBox = document.getElementById("derpy");

    // If the checkbox is checked, display the output text
    if (checkBox.checked == true) {
        derpy = 2;
    } else {
        derpy = 1;
    }
}

function myFunction(thisObj) {
    let divId = thisObj.parentNode.parentNode.id;
    let number = divId.slice(16, divId.length);
    document.getElementById(`fuelDropdown${number}`).classList.toggle("show");
}

// Close the dropdown if the user clicks outside of it
window.onclick = function (event) {
    if (!event.target.matches('.fuelbtn')) {
        var dropdowns = document.getElementsByClassName("fuel-content");
        var i;
        for (i = 0; i < dropdowns.length; i++) {
            var openDropdown = dropdowns[i];
            if (openDropdown.classList.contains('show')) {
                openDropdown.classList.remove('show');
            }
        }
    }
}

function selectFuel(thisObj, buff) {
    let divId = thisObj.parentNode.parentNode.parentNode.id;
    let number = divId.slice(16, divId.length);
    fuelBuff[number] = buff;
}