var result;

async function search() {

    result = "";

    var BIN;

    if (document.getElementById("BIN").value == "true") { BIN = "input[i].bin == true" };
    if (document.getElementById("BIN").value == "false") { BIN = "input[i].bin == false" };

    console.log(document.getElementById("BIN").value);

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

    console.log(lore);

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
        console.log(i);
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

    console.log(output);

    for (i = 0; i < output.length; i++) {
        let fortmatedNumber = new Intl.NumberFormat().format(output[i].starting_bid);
        result += i + ": Item: " + output[i].item_name + ", Cost: " + fortmatedNumber + "<br>";
    }

    document.getElementById("Result").innerHTML = result;
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