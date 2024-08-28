//////////////////////
//FIX IGNORE HELMETS//
//////////////////////
setInterval(getData, 600000);

function tips() {
    alert("Welcome to my website! I will give some tips on how the website works. \n First of all, you can not search the auctions while the website is loading them from Hypixel.");
    alert("Second of all, the [Lore] input box. Type whatever you want to find in the lore of the item and use [&] to look for multiple. \n Here is an example: Dominance & Vitality. You can also type doMinanCe & VitAliTY if you want to :)");
    alert("Also! If you want to search for [Magic Find] in the lore, but you find [✯ Magic Find] instead, a trick is to search: [Magic Find:]. This is for when you want to find Magic Find and Blazing Fortune attributes. \n The reason being Blazing Fortune and Bobbin' Time has [✯ Magic Find] in their desctription.");
    alert("Lastly, i want to explain the [Display Auctions] input box. It is a way for the website to not load 100 auctions if it finds that many depending on what you searched. \n That would be boring to go through, so i set the default to 25.");
    alert("Anyways, hopefully that explains some things. Thank you for using my website!");
}

var allAuctionPages = [];
var canSearch;

var cancelSearch = false;

async function getData() {

    canSearch = false;

    document.getElementById("searchBtn").disabled = true;

    allAuctionPages = [];

    var i = 0;

    var status = 200;

    while (status == 200) {
        var response = await fetch("https://api.hypixel.net/skyblock/auctions?page=" + i);
        status = response.status;
        if (status != 200) {
            break;
        }
        allAuctionPages.push(await response.json());
        i++;
        document.getElementById("pagesIn").innerHTML = "Pages Gone Through: " + i;
    }

    canSearch = true;

    document.getElementById("searchBtn").disabled = false;

}

async function search() {

    if (canSearch) {

        document.getElementById("searchBtn").disabled = true;

        var existingLi = document.getElementsByTagName("li");
        while (existingLi.length > 0) {
            existingLi[0].parentNode.removeChild(existingLi[0]);
        }

        var BIN;

        if (document.getElementById("BIN").value == "true") { BIN = "input[i].bin == true" };
        if (document.getElementById("BIN").value == "false") { BIN = "input[i].bin == false" };

        var itemName = document.getElementById("Name").value;

        if (document.getElementById("petLevel").value != "") {
            itemName = "[Lvl " + document.getElementById("petLevel").value + "]" + itemName;
        }

        var lore = [];
        var loreAmount;

        if (document.getElementById("Lore").value != "") {
            if (document.getElementById("Lore").value.includes(" & ")) {
                for (var i = 0; i < document.getElementById("Lore").value.split(" & ").length; i++) {
                    loreAmount = document.getElementById("Lore").value.split(" & ")
                    lore.push(loreAmount[i]);
                }
            }
            else {
                lore.push(document.getElementById("Lore").value);
            }
        } else {
            lore = [];
        }

        var output = [];

        for (var page = 0; page < allAuctionPages.length; page++) {

            var input = allAuctionPages[page].auctions;

            var inserted;

            var rarity = document.getElementById("Rarity").value;

            for (var i = 0, ii = input.length; i < ii; i++) {
                var indexOfMF = 0;
                inserted = false;
                var loreArray = lore;
                //search:
                if (itemName.includes("!")) {
                    var blockedWord = itemName.substring(itemName.indexOf("!") + 1);
                    itemName = itemName.substring(0, itemName.indexOf("!") - 1);
                }
                if (eval(BIN) && input[i].item_name.toLowerCase().includes(itemName.toLowerCase()) && !(input[i].item_name.toLowerCase().includes(blockedWord))) {
                    if (loreArray.length > 0) {
                        if (loreArray.every(item => input[i].item_lore.toLowerCase().includes(item.toLowerCase()))) {
                            Rarity(rarity, inserted, output, input, i);
                        }
                    } else {
                        Rarity(rarity, inserted, output, input, i);
                    }
                }
            }
        }

        var amountOfAuctions;

        document.getElementById("amountOfAuctions").innerHTML = "Amount Of Auctions: 0";

        var maxAuctionsDisplayed = 25;

        if (document.getElementById("auctionsDisplayed").value != "") {
            maxAuctionsDisplayed = document.getElementById("auctionsDisplayed").value;
        }

        for (i = 0; i < output.length; i++) {

            if (maxAuctionsDisplayed == i) {
                break;
            }

            var tempResult = {};

            var uuidData = [];
            var username;

            var response = await fetch("https://api.ashcon.app/mojang/v2/user/" + output[i].auctioneer);
            uuidData.push(await response.json());
            username = uuidData[0].username

            let fortmatedNumber = new Intl.NumberFormat().format(output[i].starting_bid);

            tempResult.item = output[i].item_name;
            tempResult.cost = fortmatedNumber;
            tempResult.auctioneer = username;

            var li = document.createElement("li");

            li.style = "white-space: pre;"

            var nameDisplay = document.createTextNode("Item: " + output[i].item_name);
            var costDisplay = document.createTextNode("Cost: " + fortmatedNumber);
            var auctioneerDisplay = document.createTextNode("Auctioneer: " + username);

            li.appendChild(nameDisplay);
            li.appendChild(document.createElement('br'));
            li.appendChild(costDisplay);
            li.appendChild(document.createElement('br'));
            li.appendChild(auctioneerDisplay);
            li.appendChild(document.createElement('br'));
            li.appendChild(document.createElement('br'));

            var lore = output[i].item_lore;

            li.appendChild(document.createTextNode(removeSymbols(lore)));

            document.getElementById("displayAuctions").appendChild(li);

            amountOfAuctions = i + 1;

            document.getElementById("amountOfAuctions").innerHTML = "Amount Of Auctions: " + amountOfAuctions;
        }

        document.getElementById("searchBtn").disabled = false;
    }
}

function Rarity(rarity, inserted, output, input, i) {
    if (rarity == "Any") {
        goThroughList(inserted, output, input, i);
    } else if (input[i].tier == rarity) {
        goThroughList(inserted, output, input, i);
    }
}

function goThroughList(inserted, output, input, i) {
    for (var j = 0, jj = output.length; j < jj; j++) {
        if (input[i].starting_bid < output[j].starting_bid) {
            inserted = true;
            output.splice(j, 0, input[i]);
            break;
        }
    }
    if (!inserted) {
        output.push(input[i]);
    }
}

function removeSymbols(lore) {
    lore = lore.replaceAll("§0", "");
    lore = lore.replaceAll("§1", "");
    lore = lore.replaceAll("§2", "");
    lore = lore.replaceAll("§3", "");
    lore = lore.replaceAll("§4", "");
    lore = lore.replaceAll("§5", "");
    lore = lore.replaceAll("§6", "");
    lore = lore.replaceAll("§7", "");
    lore = lore.replaceAll("§8", "");
    lore = lore.replaceAll("§9", "");
    lore = lore.replaceAll("§a", "");
    lore = lore.replaceAll("§b", "");
    lore = lore.replaceAll("§c", "");
    lore = lore.replaceAll("§d", "");
    lore = lore.replaceAll("§e", "");
    lore = lore.replaceAll("§f", "");
    lore = lore.replaceAll("§k", "");
    lore = lore.replaceAll("§l", "");
    lore = lore.replaceAll("§m", "");
    lore = lore.replaceAll("§n", "");
    lore = lore.replaceAll("§o", "");
    lore = lore.replaceAll("§r", "");

    return lore;
}