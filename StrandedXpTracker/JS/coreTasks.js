function getCoreTask(data, uuidOfUsername) {

    //Core Tasks Displays
    let coreTasksDisplay = document.getElementById("coreTasksPercentage");

    //Core task variables
    let maxCoreTasksXp = 0;

    let maxXpFromSkills = 0;
    let maxXpFromAccessories = 0;
    let maxXpFromPetScore = 0;
    let maxXpFromCollections = 0;
    let maxXpFromMinions = 0;
    let maxXpFromBankUpgrades = 0;

    //Max xp from skills
    for (let key in constants.skills_cap) {
        for (let i = 1; i <= constants.skills_cap[key]; i++) {
            if (i <= 10) { maxXpFromSkills += 5 }
            else if (i <= 25) { maxXpFromSkills += 10 }
            else if (i <= 50) { maxXpFromSkills += 20 }
            else if (i <= 60) { maxXpFromSkills += 30 }
        }
    }

    maxCoreTasksXp += maxXpFromSkills;

    //Max xp from accessories
    for (let key in constants.max_magical_power) {
        if (key == "COMMON" || key == "SPECIAL") {
            maxXpFromAccessories += constants.max_magical_power[key].length * 3;
        }
        else if (key == "UNCOMMON") {
            maxXpFromAccessories += constants.max_magical_power[key].length * 5;
        }
        else if (key == "RARE") {
            maxXpFromAccessories += constants.max_magical_power[key].length * 8;
        }
        else if (key == "EPIC") {
            maxXpFromAccessories += constants.max_magical_power[key].length * 12
        }
        else if (key == "LEGENDARY") {
            maxXpFromAccessories += constants.max_magical_power[key].length * 16
        }
    }
    maxCoreTasksXp += maxXpFromAccessories;

    //Max xp from pets
    for (let key in constants.max_pet_score) {
        if (key == "MYTHIC") {
            maxXpFromPetScore += constants.max_pet_score[key].length * 6 + constants.max_pet_score[key].length;
        }
        else if (key == "LEGENDARY") {
            maxXpFromPetScore += constants.max_pet_score[key].length * 5 + constants.max_pet_score[key].length;
        }
        else if (key == "EPIC") {
            maxXpFromPetScore += constants.max_pet_score[key].length * 4 + constants.max_pet_score[key].length;
        }
    }
    maxCoreTasksXp += maxXpFromPetScore * 3;

    //Max xp from collections
    for (let key in constants.max_collections) {
        maxXpFromCollections += constants.max_collections[key].length * 4;
    }
    maxCoreTasksXp += maxXpFromCollections;

    //Max xp from minions
    for (let type in constants.max_minions) {
        for (let minion in constants.max_minions[type]) {
            for (let i = 1; i <= constants.max_minions[type][minion]; i++) {
                if (minion != "Cobblestone") {
                    if (i < 7) { maxXpFromMinions += 1; }
                } else if (i != 1) {
                    if (i < 7) { maxXpFromMinions += 1; }
                }
                if (i == 7) { maxXpFromMinions += 2; }
                if (i == 8) { maxXpFromMinions += 3; }
                if (i == 9) { maxXpFromMinions += 4; }
                if (i == 10) { maxXpFromMinions += 6; }
                if (i == 11) { maxXpFromMinions += 12; }
                if (i == 12) { maxXpFromMinions += 24; }
            }
        }
    }
    maxCoreTasksXp += maxXpFromMinions;

    /////////////////////////////////////////
    /////////////////////////////////////////
    /////////////////////////////////////////

    for (let bankUpgrades in constants.bank_upgrades) {
        maxXpFromBankUpgrades += constants.bank_upgrades[bankUpgrades];
    }

    let currentCoreTasksXp = 0;

    fields = [];

    //Xp from skills
    let experience = data.members[uuidOfUsername].player_data.experience;

    //Prevent taming for being displayed as 60 if you have enough xp
    let sacrificedPetsAmount = data.members[uuidOfUsername].pets_data;
    if ("pet_care" in sacrificedPetsAmount) {
        sacrificedPetsAmount = sacrificedPetsAmount.pet_care.pet_types_sacrificed.length;

        //skillsXp += sacrificedPetsAmount * 10;
    } else {
        sacrificedPetsAmount = 0;
    }

    let skill;
    let currentXp;
    let maxLevel;
    let skillLevel;
    let skillsXp = 0;
    let skillsString = "";

    for (let key in experience) {
        if (Object.keys(constants.skills_cap).includes(key.slice(key.indexOf("_") + 1).toLowerCase())) {
            skill = key.slice(key.indexOf("_") + 1).toLowerCase();
            currentXp = experience[key];
            maxLevel = constants.skills_cap;
            skillLevel = 0;

            for (let key in constants.leveling_xp) {
                if (constants.leveling_xp[key] <= currentXp && skillLevel < maxLevel[skill]) {
                    if (skill == "taming" && key > 50 + sacrificedPetsAmount) {
                        break;
                    }
                    currentXp -= constants.leveling_xp[key];

                    if (key <= 10) { skillsXp += 5 }
                    else if (key <= 25) { skillsXp += 10 }
                    else if (key <= 50) { skillsXp += 20 }
                    else if (key <= 60) { skillsXp += 30 }

                    skillLevel++;
                }
            }
            if (skill == "taming" && skillLevel > 50) {
                skillLevel = 50 + sacrificedPetsAmount;
                skillsString += (skill.charAt(0).toUpperCase() + skill.slice(1)) + ": " + skillLevel + "/" + maxLevel[skill] + "<br />";
            } else {
                skillsString += (skill.charAt(0).toUpperCase() + skill.slice(1)) + ": " + skillLevel + "/" + maxLevel[skill] + "<br />";
            }
        }
    }

    currentCoreTasksXp += skillsXp;

    skillsString += "<br />You have " + skillsXp + " XP in Skills out of " + maxXpFromSkills + " available!";

    skills.innerHTML = skillsString;

    //Accessory Bag
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

    let magicalPower = data.members[uuidOfUsername].accessory_bag_storage.highest_magical_power;

    currentCoreTasksXp += magicalPower;

    accessoryBagDisplay.innerHTML = "You have " + magicalPower + " out of " + maxXpFromAccessories + " Magical Power!<br /><br />Each Magical Power gives 1 Skyblock XP!";

    document.getElementById("accessoriesBtn").disabled = false;
    document.getElementById("accessoriesBtn").innerHTML = "Show Missing";
    document.getElementById("accessoriesBtn").onclick = function () { getCoreTasksDetails("accessories", profileData[profilesDropdown.value].profile, uuidOfUsername) };

    //Pet Score
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

    let petScore = data.members[uuidOfUsername].leveling.highest_pet_score;

    currentCoreTasksXp += petScore * 3;

    petScoreDisplay.innerHTML = "You have " + petScore + " out of " + maxXpFromPetScore + " Pet Score!<br /><br />Each Pet Score gives 3 Skyblock XP!";

    document.getElementById("petsBtn").disabled = false;
    document.getElementById("petsBtn").innerHTML = "Show Missing";
    document.getElementById("petsBtn").onclick = function () { getCoreTasksDetails("pets", profileData[profilesDropdown.value].profile, uuidOfUsername) };

    //Collections
    collectionFarming.innerHTML = "FARMING COLLECTIONS<br />";
    collectionMining.innerHTML = "MINING COLLECTIONS<br />";
    collectionCombat.innerHTML = "COMBAT COLLECTIONS<br />";
    collectionForaging.innerHTML = "FORAGING COLLECTIONS<br />";
    collectionFishing.innerHTML = "FISHING COLLECTIONS<br />";

    let collections;
    let collectionObject = {};
    for (let uuid in data.members) {
        collections = data.members[uuid].collection;
        for (let key in collections) {
            if (collectionObject.hasOwnProperty(key)) {
                collectionObject[key] += collections[key];
            } else {
                collectionObject[key] = collections[key];
            }
        }
    }

    console.log(collectionObject);

    let amountOfCollections = 0;
    for (let maxCollections in constants.max_collections) {
        for (let i = 0; collectionObject[maxCollections] >= constants.max_collections[maxCollections][i] && constants.max_collections[maxCollections][i] != undefined; i++) {
            amountOfCollections++;
        }
    }

    currentCoreTasksXp += amountOfCollections * 4;

    collectionDisplay.innerHTML = "You have " + amountOfCollections + " out of " + maxXpFromCollections / 4 + " Collections done!<br /><br />Each Collection gives 4 Skyblock XP!";

    document.getElementById("collectionBtn").disabled = false;
    document.getElementById("collectionBtn").innerHTML = "Show Missing";
    document.getElementById("collectionBtn").onclick = function () { getCoreTasksDetails("collection", profileData[profilesDropdown.value].profile, uuidOfUsername) };

    //Minions
    let minions;
    let minionsArray = [];
    let minionXp = 0;
    for (let uuid in data.members) {
        minions = data.members[uuid].player_data.crafted_generators;
        for (let key in minions) {
            if (!minionsArray.includes(minions[key]) && minions[key] != "COBBLESTONE_1") {
                minionsArray.push(minions[key]);
                if (minions[key].slice(minions[key].lastIndexOf("_") + 1) < 7) {
                    minionXp += 1;
                }
                if (minions[key].slice(minions[key].lastIndexOf("_") + 1) == 7) {
                    minionXp += 2;
                }
                if (minions[key].slice(minions[key].lastIndexOf("_") + 1) == 8) {
                    minionXp += 3;
                }
                if (minions[key].slice(minions[key].lastIndexOf("_") + 1) == 9) {
                    minionXp += 4;
                }
                if (minions[key].slice(minions[key].lastIndexOf("_") + 1) == 10) {
                    minionXp += 6;
                }
                if (minions[key].slice(minions[key].lastIndexOf("_") + 1) == 11) {
                    minionXp += 12;
                }
                if (minions[key].slice(minions[key].lastIndexOf("_") + 1) == 12) {
                    minionXp += 24;
                }
            }
        }
    }

    currentCoreTasksXp += minionXp;

    minionDisplay.innerHTML = "You have " + minionXp + " XP in Minions out of " + maxXpFromMinions + " available!";

    //Bank Upgrade
    let bankUpgradesXp = 0;
    for (let completed_tasks in data.members[uuidOfUsername].leveling.completed_tasks) {
        if (data.members[uuidOfUsername].leveling.completed_tasks[completed_tasks] == "BANK_UPGRADE_GOLD") { bankUpgradesXp += 20; }
    }

    currentCoreTasksXp += bankUpgradesXp;

    bankUpgradesDisplay.innerHTML = "You have " + bankUpgradesXp + " XP in Bank Upgrades out of " + maxXpFromBankUpgrades + " available!";

    //CurrentXp out of TotalXp for Core Tasks
    //let coreTasksString = "You have " + currentCoreTasksXp + " XP in Core Tasks out of " + maxCoreTasksXp + " available!";

    coreTasksDisplay.innerHTML = "Core Tasks (" + (currentCoreTasksXp / maxCoreTasksXp * 100).toFixed(2) + "% Done)";
}

function removeSymbols(inputString) {
    inputString = inputString.replaceAll("§0", "");
    inputString = inputString.replaceAll("§1", "");
    inputString = inputString.replaceAll("§2", "");
    inputString = inputString.replaceAll("§3", "");
    inputString = inputString.replaceAll("§4", "");
    inputString = inputString.replaceAll("§5", "");
    inputString = inputString.replaceAll("§6", "");
    inputString = inputString.replaceAll("§7", "");
    inputString = inputString.replaceAll("§8", "");
    inputString = inputString.replaceAll("§9", "");
    inputString = inputString.replaceAll("§a", "");
    inputString = inputString.replaceAll("§b", "");
    inputString = inputString.replaceAll("§c", "");
    inputString = inputString.replaceAll("§d", "");
    inputString = inputString.replaceAll("§e", "");
    inputString = inputString.replaceAll("§f", "");
    inputString = inputString.replaceAll("§k", "");
    inputString = inputString.replaceAll("§l", "");
    inputString = inputString.replaceAll("§m", "");
    inputString = inputString.replaceAll("§n", "");
    inputString = inputString.replaceAll("§o", "");
    inputString = inputString.replaceAll("§r", "");

    return inputString;
}