const nbt = require('prismarine-nbt')
const { Buffer } = require('buffer')

let usernameInput = document.getElementById("usernameInput");
let profilesDropdown = document.getElementById("profiles");

let coreTasks = document.getElementById("coreTasks");

//div swapping
let currentlyDisplayedDiv = coreTasks;

let profileData = [];
let uuidOfUsername;
let apiRequests = 0;
let apiLimit = 100;

function saveKey() {
    if (document.getElementById("apiKey").value == "") {
        alert("Input a API key first!");
    } else {
        localStorage.setItem("KEY", document.getElementById("apiKey").value);
        alert("Personal API Key set");
    }
}

setInterval(function () { apiRequests = 0 }, 300000);

//find profile
async function getProfiles() {

    let username = usernameInput.value;

    profileId = [];

    let uuid = await fetch(`https://api.ashcon.app/mojang/v2/user/${username}`);
    jsonData = await uuid.json();
    if (jsonData.uuid == undefined) {
        alert("Unknown name");
    } else if (apiRequests < apiLimit) {
        uuid = jsonData.uuid;
        let profiles = await fetch(`https://api.hypixel.net/v2/skyblock/profiles?key=${localStorage.getItem("KEY")}&uuid=${uuid}`);
        let profilesData = await profiles.json();
        if (!profilesData.success) {
            if (profilesData.cause == "Invalid API key") { alert("Inputted API key is invalid!\nGo to https://developer.hypixel.net and get a new one!"); }
            else { alert(profilesData.cause); }
        }
        apiRequests++;
        for (let i = 0; i < profilesData.profiles.length; i++) {
            if (profilesData.profiles[i].game_mode == "island") {
                if (apiRequests < apiLimit) {
                    let profileName = profilesData.profiles[i].cute_name;
                    let profileData = await fetch(`https://api.hypixel.net/v2/skyblock/profile?key=${localStorage.getItem("KEY")}&profile=${profilesData.profiles[i].profile_id}`);
                    apiRequests++;
                    jsonData = await profileData.json();
                    profileId.push(profileName);
                    profileId.push(jsonData);
                } else {
                    alert("API Limit Reached!");
                    break;
                }
            }
        }
        while (uuid.includes("-")) {
            uuid = uuid.replace("-", "");
        }
        uuidOfUsername = uuid;

        //Remove options from profile picker if any are there
        for (const option of document.querySelectorAll('#profiles > option')) {
            option.remove();
        }

        //Add profiles if they are stranded
        profileData = [];
        for (let i = 0; i < profileId?.length; i += 2) {
            let option = document.createElement("option");
            option.text = profileId[i];
            option.value = i / 2;
            profilesDropdown.add(option);
            profileData.push(profileId[i + 1]);
        }
    } else {
        alert("API Limit Reached!");
    }
    console.log("Currently [apiRequests] is at: " + apiRequests);
}

//Toggle between displayed tasks
let swappedTaskDisplayed = true;
function swapDivXPTasks(divName) {
    toggleAllDivsBeforeSwappingTaskDisplay();
    currentlyDisplayedDiv.style.display = "none";
    document.getElementById(divName).style.display = "block";
    currentlyDisplayedDiv = document.getElementById(divName);
    swappedTaskDisplayed = true;
}

//Toggle different xp methods within the main tasks
function toggleDiv(divId) {
    let x = document.getElementById(divId);
    if (x.style.display === "none") {
        x.style.display = "flex";
    } else {
        x.style.display = "none";
    }
}

//Toggle all divs in selected task display
//Variables
let coreTasksDivs = ["skillsDiv", "accessoryBagDiv", "petScoreDiv", "collectionDiv", "minionDiv", "bankDiv"];

let whatToToggle = coreTasksDivs;

function toggleAllDivs(selectedDisplay) {
    if (selectedDisplay == "coreTasks") { whatToToggle = coreTasksDivs; }

    if (swappedTaskDisplayed) {
        for (const element of whatToToggle) {
            document.getElementById(element).style.display = "flex";
        }
        swappedTaskDisplayed = false;
    } else {
        for (const element of whatToToggle) {
            document.getElementById(element).style.display = "none";
        }
        swappedTaskDisplayed = true;
    }
}
function toggleAllDivsBeforeSwappingTaskDisplay() {
    for (const element of whatToToggle) {
        document.getElementById(element).style.display = "none";
    }
}

function showData() {
    let data = profileData[profilesDropdown.value].profile;
    //Core Tasks
    getCoreTask(data, uuidOfUsername);
    //Event Tasks
    //getEventTask(data, uuidOfUsername);
}