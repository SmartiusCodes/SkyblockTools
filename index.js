async function search() {

    var existingLi = document.getElementsByTagName("li");
    while(existingLi.length > 0){
        existingLi[0].parentNode.removeChild(existingLi[0]);
    }

    document.getElementById("searchBtn").disabled = true;

    var BIN;

    if (document.getElementById("BIN").value == "true") { BIN = "input[i].bin == true" };
    if (document.getElementById("BIN").value == "false") { BIN = "input[i].bin == false" };

    var itemName;

    if (document.getElementById("Name").value != "") {
        itemName = document.getElementById("Name").value;
    } else {
        itemName = "";
    }

    var lore = [];
    var loreAmount;

    if (document.getElementById("Lore").value != "") {
        if (document.getElementById("Lore").value.includes(" & ")) {
            for (var i = 0; i < document.getElementById("Lore").value.split(" & ").length; i++) {
                loreAmount = document.getElementById("Lore").value.split(" & ")
                lore.push(loreAmount[i]);
            }
        } else {
            lore.push(document.getElementById("Lore").value);
        }
    } else {
        lore = [];
    }

    var allAuctionPages = [];
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
    var output = [];

    for (var page = 0; page < allAuctionPages.length; page++) {

        var input = allAuctionPages[page].auctions;

        var inserted;

        for (var i = 0, ii = input.length; i < ii; i++) {
            inserted = false;
            var loreArray = lore;
            //search:
            if (eval(BIN) && input[i].item_name.toLowerCase().includes(itemName.toLowerCase())) {
                if (loreArray.length > 0) {
                    if (loreArray.every(item => input[i].item_lore.toLowerCase().includes(item.toLowerCase()))) {
                        goThroughList(inserted, output, input, i);
                    }
                } else {
                    goThroughList(inserted, output, input, i);
                }
            }
        }
    }

    var amountOfAuctions;

    for (i = 0; i < output.length; i++) {

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

        var nameDisplay = document.createTextNode("Item: " + output[i].item_name);
        var costDisplay = document.createTextNode("Cost: "  + fortmatedNumber);
        var auctioneerDisplay = document.createTextNode("Auctioneer: " + username);

        li.appendChild(nameDisplay);
        li.appendChild(document.createElement('br'));
        li.appendChild(costDisplay);
        li.appendChild(document.createElement('br'));
        li.appendChild(auctioneerDisplay);

        document.getElementById("displayAuctions").appendChild(li);

        amountOfAuctions = i;
    }

    amountOfAuctions++;

    document.getElementById("amountOfAuctions").innerHTML = "Amount Of Auctions: " + amountOfAuctions;

    document.getElementById("searchBtn").disabled = false;

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