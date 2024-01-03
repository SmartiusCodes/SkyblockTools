var items = [];
var bazaar = [];
getData();

//Example of getting prices:
//Cobblestone -> quick_status -> sellPrice is SELL INSTANTLY
//Cobblestone -> quick_status -> buyPrice is SELL ORDER

async function getData() {
    //item list
    var response = await fetch("https://api.hypixel.net/v2/resources/skyblock/items");

    items.push(await response.json());

    items = items[0].items;

    //console.log(items);

    //bazaar data
    var response = await fetch("https://api.hypixel.net/v2/skyblock/bazaar");

    bazaar.push(await response.json());

    bazaar = bazaar[0].products;

    //console.log(bazaar);

    match();
}

function match() {

    var SortBy = document.getElementById("Sort").value;

    for (var i = 0; i < items.length; i++) {
        for (var key in bazaar) {
            if ((bazaar.hasOwnProperty(key)) && (key == items[i].id)) {
                if (SortBy == "ALPHABETICAL") {
                    display(items[i].name, bazaar[key].quick_status.sellPrice, bazaar[key].quick_status.sellMovingWeek, bazaar[key].quick_status.buyPrice, bazaar[key].quick_status.buyMovingWeek);
                }
                else if (SortBy == "MARGIN") {

                } else if (SortBy == "LOWEST") {

                } else if (SortBy == "HIGHEST") {

                }
            }
        }
    }
}

function display(name, sellInstantly, sellVolumeWeek, buyInstantly, buyVolumeWeek) {

    var li = document.createElement("li");

    li.style = "white-space: pre;";

    const options = {
        style: 'decimal',
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    };

    var sellInstantlyFortmatted = sellInstantly.toLocaleString("en-us", options);
    var sellVolumeFortmatted = sellVolumeWeek.toLocaleString("en-us");
    var buyInstantlyFortmatted = buyInstantly.toLocaleString("en-us", options);
    var buyVolumeFormatted = buyVolumeWeek.toLocaleString("en-us");

    var nameDisplay = document.createTextNode(name);
    var sellInstantlyDisplay = document.createTextNode("Sell instantly for " + sellInstantlyFortmatted + " coins");
    var sellVolumeDisplay = document.createTextNode(name + " has been sold instantly " + sellVolumeFortmatted + " times in the past week");
    var buyInstantlyDisplay = document.createTextNode("Buy instantly for " + buyInstantlyFortmatted + " coins");
    var buyVolumeDisplay = document.createTextNode(name + " has been bought instantly " + buyVolumeFormatted + " times in the past week");

    li.appendChild(nameDisplay);
    li.appendChild(document.createElement('br'));
    li.appendChild(sellInstantlyDisplay);
    li.appendChild(document.createElement('br'));
    li.appendChild(sellVolumeDisplay);
    li.appendChild(document.createElement('br'));
    li.appendChild(buyInstantlyDisplay);
    li.appendChild(document.createElement('br'));
    li.appendChild(buyVolumeDisplay);
    li.appendChild(document.createElement('br'));

    document.getElementById("displayItems").appendChild(li);
}