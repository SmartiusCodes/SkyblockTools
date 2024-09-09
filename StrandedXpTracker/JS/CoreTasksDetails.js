let accessoryBagCommon = document.getElementById("accessoryBagCommon");
let accessoryBagUncommon = document.getElementById("accessoryBagUncommon");
let accessoryBagRare = document.getElementById("accessoryBagRare");
let accessoryBagEpic = document.getElementById("accessoryBagEpic");
let accessoryBagLegendary = document.getElementById("accessoryBagLegendary");
let accessoryBagSpecial = document.getElementById("accessoryBagSpecial");

let petsDisplay = document.getElementById("petsDetails");
let minionsDisplay = document.getElementById("minionsDetails");

function getCoreTasksDetails(task, data, uuidOfUsername) {
    //Accessories
    if (task == "accessories") {

        document.getElementById("accessoriesBtn").innerHTML = "Show Owned";
        document.getElementById("accessoriesBtn").onclick = function () { runAccessories(data, uuidOfUsername) }

        accessoryBagCommon.innerHTML = "COMMON ACCESSORIES<br />";
        accessoryBagUncommon.innerHTML = "UNCOMMON ACCESSORIES<br />";
        accessoryBagRare.innerHTML = "RARE ACCESSORIES<br />";
        accessoryBagEpic.innerHTML = "EPIC ACCESSORIES<br />";
        accessoryBagLegendary.innerHTML = "LEGENDARY ACCESSORIES<br />";
        accessoryBagSpecial.innerHTML = "SPECIAL ACCESSORIES<br />";

        let accessoryBagData = Buffer.from(data.members[uuidOfUsername].inventory.bag_contents.talisman_bag.data, 'base64');
        nbt.parse(accessoryBagData, (error, json) => {
            if (error) {
                logger.error(error);
            }
            let arrayName = [];
            let array = json.value.i.value.value;
            for (let key in array) {
                if (array[key].tag != undefined) {
                    let name = array[key].tag.value.display.value.Name.value;

                    arrayName.push(removeSymbols(name));

                }
            }
            for (let rarity in constants.max_magical_power) {
                for (let accessory in constants.max_magical_power[rarity]) {

                    if (rarity == "COMMON" && !arrayName.some(str => str.includes(constants.max_magical_power[rarity][accessory]))) {
                        accessoryBagCommon.innerHTML += constants.max_magical_power[rarity][accessory] + "<br />";
                    }
                    if (rarity == "UNCOMMON" && !arrayName.some(str => str.includes(constants.max_magical_power[rarity][accessory]))) {
                        accessoryBagUncommon.innerHTML += constants.max_magical_power[rarity][accessory] + "<br />"
                    }
                    if (rarity == "RARE" && !arrayName.some(str => str.includes(constants.max_magical_power[rarity][accessory]))) {
                        accessoryBagRare.innerHTML += constants.max_magical_power[rarity][accessory] + "<br />"
                    }
                    if (rarity == "EPIC" && !arrayName.some(str => str.includes(constants.max_magical_power[rarity][accessory]))) {
                        accessoryBagEpic.innerHTML += constants.max_magical_power[rarity][accessory] + "<br />"
                    }
                    if (rarity == "LEGENDARY" && !arrayName.some(str => str.includes(constants.max_magical_power[rarity][accessory]))) {
                        accessoryBagLegendary.innerHTML += constants.max_magical_power[rarity][accessory] + "<br />"
                    }
                    if (rarity == "SPECIAL" && !arrayName.some(str => str.includes(constants.max_magical_power[rarity][accessory]))) {
                        accessoryBagSpecial.innerHTML += constants.max_magical_power[rarity][accessory] + "<br />"
                    }
                }
            }
        });
    }

    function runAccessories(data, uuidOfUsername) {
        accessoryBagCommon.innerHTML = "COMMON ACCESSORIES<br />";
        accessoryBagUncommon.innerHTML = "UNCOMMON ACCESSORIES<br />";
        accessoryBagRare.innerHTML = "RARE ACCESSORIES<br />";
        accessoryBagEpic.innerHTML = "EPIC ACCESSORIES<br />";
        accessoryBagLegendary.innerHTML = "LEGENDARY ACCESSORIES<br />";
        accessoryBagSpecial.innerHTML = "SPECIAL ACCESSORIES<br />";

        let accessoryBagData = Buffer.from(data.members[uuidOfUsername].inventory.bag_contents.talisman_bag.data, 'base64');
        nbt.parse(accessoryBagData, (error, json) => {
            if (error) {
                logger.error(error);
            }
            //Get name of every accessory in bag
            let array = json.value.i.value.value;
            for (let key in array) {
                let rarity;
                let name;
                if (array[key].tag != undefined) {

                    rarity = array[key].tag.value.display.value.Lore.value.value[array[key].tag.value.display.value.Lore.value.value.length - 1];
                    name = array[key].tag.value.display.value.Name.value;

                    rarity = removeSymbols(rarity)
                    name = removeSymbols(name);

                    if (rarity == "COMMON ACCESSORY") {
                        accessoryBagCommon.innerHTML += name + "<br />";
                    }
                    if (rarity == "UNCOMMON ACCESSORY") {
                        accessoryBagUncommon.innerHTML += name + "<br />";
                    }
                    if (rarity == "RARE ACCESSORY") {
                        accessoryBagRare.innerHTML += name + "<br />";
                    }
                    if (rarity == "EPIC ACCESSORY") {
                        accessoryBagEpic.innerHTML += name + "<br />";
                    }
                    if (rarity == "LEGENDARY ACCESSORY") {
                        accessoryBagLegendary.innerHTML += name + "<br />";
                    }
                    if (rarity == "SPECIAL HATCESSORY") {
                        accessoryBagSpecial.innerHTML += name + "<br />";
                    }
                }
            }
        });
        document.getElementById("accessoriesBtn").innerHTML = "Show Missing";
        document.getElementById("accessoriesBtn").onclick = function () { getCoreTasksDetails("accessories", profileData[profilesDropdown.value].profile, uuidOfUsername) };
    }

    //Pets
    if (task == "pets") {
        document.getElementById("petsBtn").innerHTML = "Show Owned";
        document.getElementById("petsBtn").onclick = function () { runPets(data, uuidOfUsername) }

        petCommon.innerHTML = "COMMON PETS<br />";
        petUncommon.innerHTML = "UNCOMMON PETS<br />";
        petRare.innerHTML = "RARE PETS<br />";
        petEpic.innerHTML = "EPIC PETS<br />";
        petLegendary.innerHTML = "LEGENDARY PETS<br />";
        petMythic.innerHTML = "MYTHIC PETS<br />";

        let petsDataPath = data.members[uuidOfUsername].pets_data.pets;
        let nameAndRarity = {
            "EPIC": [],
            LEGENDARY: [],
            MYTHIC: []
        };

        for (let pets in petsDataPath) {
            let petName = removeSymbols(petsDataPath[pets].type);
            petName = petName.replaceAll("_", " ");
            petName = petName.toLowerCase();
            if (petName.indexOf(" ") == -1) {
                petName = petName.charAt(0).toUpperCase() + petName.slice(1);
            } else {
                //First word
                petName = petName.charAt(0).toUpperCase() + petName.slice(1, petName.indexOf(" ")) +
                    //Second word
                    " " + petName.charAt(petName.indexOf(" ") + 1).toUpperCase() + petName.slice(petName.indexOf(" ") + 2);
            }
            let rarity = petsDataPath[pets].tier;
            if (rarity != "COMMON" && rarity != "UNCOMMON" && rarity != "RARE") {
                nameAndRarity[petsDataPath[pets].tier].push(petName);
            }
        }

        for (let rarity in constants.max_pet_score) {
            for (let pet in constants.max_pet_score[rarity]) {
                if (rarity == "EPIC" && !nameAndRarity.EPIC.some(str => str.includes(constants.max_pet_score[rarity][pet]))) {
                    petEpic.innerHTML += constants.max_pet_score[rarity][pet] + "<br />";
                }
                if (rarity == "LEGENDARY" && !nameAndRarity.LEGENDARY.some(str => str.includes(constants.max_pet_score[rarity][pet]))) {
                    petLegendary.innerHTML += constants.max_pet_score[rarity][pet] + "<br />";
                }
                if (rarity == "MYTHIC" && !nameAndRarity.MYTHIC.some(str => str.includes(constants.max_pet_score[rarity][pet]))) {
                    petMythic.innerHTML += constants.max_pet_score[rarity][pet] + "<br />";
                }
            }
        }
    }

    function runPets(data, uuidOfUsername) {
        petCommon.innerHTML = "COMMON PETS<br />";
        petUncommon.innerHTML = "UNCOMMON PETS<br />";
        petRare.innerHTML = "RARE PETS<br />";
        petEpic.innerHTML = "EPIC PETS<br />";
        petLegendary.innerHTML = "LEGENDARY PETS<br />";
        petMythic.innerHTML = "MYTHIC PETS<br />";

        let petsDataPath = data.members[uuidOfUsername].pets_data.pets;

        for (let pets in petsDataPath) {
            let petName = removeSymbols(petsDataPath[pets].type);
            petName = petName.replaceAll("_", " ");
            petName = petName.toLowerCase();
            if (petName.indexOf(" ") == -1) {
                petName = petName.charAt(0).toUpperCase() + petName.slice(1);
            } else {
                //First word
                petName = petName.charAt(0).toUpperCase() + petName.slice(1, petName.indexOf(" ")) +
                    //Second word
                    " " + petName.charAt(petName.indexOf(" ") + 1).toUpperCase() + petName.slice(petName.indexOf(" ") + 2);
            }
            if (petsDataPath[pets].tier == "COMMON") {
                petCommon.innerHTML += petName + "<br />";
            }
            if (petsDataPath[pets].tier == "UNCOMMON") {
                petUncommon.innerHTML += petName + "<br />";
            }
            if (petsDataPath[pets].tier == "RARE") {
                petRare.innerHTML += petName + "<br />";
            }
            if (petsDataPath[pets].tier == "EPIC") {
                petEpic.innerHTML += petName + "<br />";
            }
            if (petsDataPath[pets].tier == "LEGENDARY") {
                petLegendary.innerHTML += petName + "<br />";
            }
            if (petsDataPath[pets].tier == "MYTHIC") {
                petMythic.innerHTML += petName + "<br />";
            }
        }
        document.getElementById("petsBtn").innerHTML = "Show Missing";
        document.getElementById("petsBtn").onclick = function () { getCoreTasksDetails("pets", profileData[profilesDropdown.value].profile, uuidOfUsername) };
    }

    //Minions
    if (task == "minions") {
        let minionsDisplayString = "";
        for (let minion in constants.max_minions[whatToShow]) {
            minionsDisplayString += minion + ": " + constants.max_minions[whatToShow][minion] + "<br />";
        }
        minionsDisplay.innerHTML = minionsDisplayString;
    }
}

function removeSymbols(MOTD) {
    MOTD = MOTD.replaceAll("§0", "");
    MOTD = MOTD.replaceAll("§1", "");
    MOTD = MOTD.replaceAll("§2", "");
    MOTD = MOTD.replaceAll("§3", "");
    MOTD = MOTD.replaceAll("§4", "");
    MOTD = MOTD.replaceAll("§5", "");
    MOTD = MOTD.replaceAll("§6", "");
    MOTD = MOTD.replaceAll("§7", "");
    MOTD = MOTD.replaceAll("§8", "");
    MOTD = MOTD.replaceAll("§9", "");
    MOTD = MOTD.replaceAll("§a", "");
    MOTD = MOTD.replaceAll("§b", "");
    MOTD = MOTD.replaceAll("§c", "");
    MOTD = MOTD.replaceAll("§d", "");
    MOTD = MOTD.replaceAll("§e", "");
    MOTD = MOTD.replaceAll("§f", "");
    MOTD = MOTD.replaceAll("§k", "");
    MOTD = MOTD.replaceAll("§l", "");
    MOTD = MOTD.replaceAll("§m", "");
    MOTD = MOTD.replaceAll("§n", "");
    MOTD = MOTD.replaceAll("§o", "");
    MOTD = MOTD.replaceAll("§r", "");

    return MOTD;
}