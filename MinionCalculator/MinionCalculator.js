var data = [];
getData();

//Things to keep in mind in the JSON file:
//Fishing minion have multiple drops with each their chances
//
//Iron and gold minions need a [auto smelter] or [dwarven super compacter]
//So make the calculator auto select [Auto Smelter] on "Iron minion", "Gold minion" and "Cactus minion" on first upgrade slot
//They can always change from auto smelter to dwarven super compacter, but then super compacter 3000 wont show up on second upgrade slot
//
//"Husbandry" minions can have Berberis Fuel Injector in them
//
//The [Tier] array under every minion is their time between actions
//
//Under [Enchanted] is the item that can be compacted and how much resoureces they take to be crafted. If one of the items under [enchanted] cant be found on bazaar, dont show it.
//This is to calculate when the minion fills up.
//
//Example of getting prices:
//Cobblestone -> quick_status -> sellPrice is SELL INSTANTLY
//Cobblestone -> quick_status -> buyPrice is SELL ORDER

//replace with bazaar prices
async function getData() {
    var response = await fetch("https://api.hypixel.net/v2/resources/skyblock/items");

    data.push(await response.json());

    data = data[0].items;

    console.log(data);
}

$.getJSON("Minions.json", function(minions) {
    console.log(minions.Fishing.Fishing.Drops[0].Enchanted); // this will show the info it in firebug console
});