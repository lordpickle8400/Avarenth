/* Avarenth item catalog for shops. One line per item: name | kind | price in gp | smallest place that sells it | tags.
   Place sizes: 0 hamlet, 1 village, 2 town, 3 city, 4 capital.
   Kinds: sw simple weapon, mw martial weapon, rw ranged weapon, am ammo, la/ma/ha light/medium/heavy armor, sh shield,
   g gear, c clothing, f food and drink, s service, t artisan's tools, k kit, gm game, i instrument, p potion or alchemy,
   fo spellcasting focus, h holy, m mount or animal, tk tack, v vehicle, b boat, x contraband.
   Tags: metal, mining, nautical, survival, farm, luxury, holy, river, sea, shady, lodging, magic. */
(function () {
  var RAW = [
    // Simple weapons
    'Club|sw|0.1|0|farm', 'Dagger|sw|2|0|metal', 'Greatclub|sw|0.2|0|', 'Handaxe|sw|5|0|metal,survival', 'Javelin|sw|0.5|0|',
    'Light hammer|sw|2|0|metal,mining', 'Mace|sw|5|1|metal', 'Quarterstaff|sw|0.2|0|survival', 'Sickle|sw|1|0|metal,farm', 'Spear|sw|1|0|metal',
    'Light crossbow|rw|25|1|', 'Dart|rw|0.05|0|', 'Shortbow|rw|25|0|survival', 'Sling|rw|0.1|0|farm',
    // Martial weapons
    'Battleaxe|mw|10|1|metal', 'Flail|mw|10|1|metal', 'Glaive|mw|20|2|metal', 'Greataxe|mw|30|2|metal', 'Greatsword|mw|50|2|metal',
    'Halberd|mw|20|2|metal', 'Lance|mw|10|2|metal', 'Longsword|mw|15|1|metal', 'Maul|mw|10|1|metal', 'Morningstar|mw|15|1|metal',
    'Pike|mw|5|2|metal', 'Rapier|mw|25|2|metal,luxury', 'Scimitar|mw|25|2|metal', 'Shortsword|mw|10|1|metal', 'Trident|mw|5|1|metal,nautical',
    'War pick|mw|5|1|metal,mining', 'Warhammer|mw|15|1|metal', 'Whip|mw|2|1|',
    'Blowgun|rw|10|2|shady', 'Hand crossbow|rw|75|3|luxury', 'Heavy crossbow|rw|50|2|', 'Longbow|rw|50|1|survival', 'Net|rw|1|0|nautical',
    // Ammunition
    'Arrows (20)|am|1|0|survival', 'Blowgun needles (50)|am|1|2|shady', 'Crossbow bolts (20)|am|1|1|', 'Sling bullets (20)|am|0.04|0|',
    // Armor
    'Padded armor|la|5|0|', 'Leather armor|la|10|0|', 'Studded leather armor|la|45|1|', 'Hide armor|ma|10|0|survival',
    'Chain shirt|ma|50|1|metal', 'Scale mail|ma|50|1|metal', 'Breastplate|ma|400|2|metal', 'Half plate|ma|750|3|metal',
    'Ring mail|ha|30|1|metal', 'Chain mail|ha|75|1|metal', 'Splint armor|ha|200|3|metal', 'Plate armor|ha|1500|3|metal,luxury', 'Shield|sh|10|0|metal',
    // Adventuring gear
    'Abacus|g|2|1|', 'Backpack|g|2|0|survival', 'Ball bearings (1,000)|g|1|1|metal', 'Barrel|g|2|0|farm,nautical', 'Basket|g|0.4|0|farm',
    'Bedroll|g|1|0|survival', 'Bell|g|1|0|metal', 'Blanket|g|0.5|0|survival', 'Block and tackle|g|1|1|mining,nautical', 'Book|g|25|2|luxury',
    'Glass bottle|g|2|1|', 'Bucket|g|0.05|0|farm,mining', 'Caltrops (20)|g|1|1|metal', 'Candle|g|0.01|0|mining', 'Map or scroll case|g|1|1|',
    'Chain (10 feet)|g|5|1|metal,mining', 'Chalk|g|0.01|0|mining', 'Chest|g|5|0|', 'Climber\'s kit|g|25|1|survival,mining', 'Crowbar|g|2|0|metal,mining',
    'Fishing tackle|g|1|0|survival,nautical', 'Flask or tankard|g|0.02|0|', 'Grappling hook|g|2|1|metal,nautical', 'Hammer|g|1|0|metal,mining',
    'Sledgehammer|g|2|0|metal,mining', 'Healer\'s kit|g|5|0|survival', 'Hourglass|g|25|2|luxury', 'Hunting trap|g|5|0|survival,metal,farm',
    'Ink (1 ounce bottle)|g|10|1|', 'Ink pen|g|0.02|1|', 'Jug or pitcher|g|0.02|0|', 'Ladder (10 feet)|g|0.1|0|farm', 'Lamp|g|0.5|0|mining',
    'Bullseye lantern|g|10|1|mining', 'Hooded lantern|g|5|0|mining', 'Lock|g|10|1|metal', 'Magnifying glass|g|100|3|luxury', 'Manacles|g|2|1|metal',
    'Mess kit|g|0.2|0|survival', 'Steel mirror|g|5|1|metal', 'Oil (flask)|g|0.1|0|mining', 'Paper (one sheet)|g|0.2|1|', 'Parchment (one sheet)|g|0.1|0|',
    'Perfume (vial)|g|5|2|luxury', 'Miner\'s pick|g|2|0|metal,mining', 'Piton|g|0.05|0|metal,mining', 'Pole (10 feet)|g|0.05|0|', 'Iron pot|g|2|0|metal',
    'Pouch|g|0.5|0|', 'Quiver|g|1|0|survival', 'Portable ram|g|4|1|', 'Hempen rope (50 feet)|g|1|0|mining,nautical,survival', 'Silk rope (50 feet)|g|10|2|luxury,nautical',
    'Sack|g|0.01|0|farm,mining', 'Merchant\'s scale|g|5|1|', 'Sealing wax|g|0.5|1|', 'Shovel|g|2|0|metal,mining,farm', 'Signal whistle|g|0.05|0|nautical',
    'Signet ring|g|5|2|luxury', 'Soap|g|0.02|0|', 'Spellbook (blank)|fo|50|2|magic', 'Iron spikes (10)|g|1|0|metal,mining', 'Spyglass|g|1000|3|luxury,nautical',
    'Two-person tent|g|2|0|survival', 'Tinderbox|g|0.5|0|survival,mining', 'Torch|g|0.01|0|mining,survival', 'Vial|g|1|1|', 'Waterskin|g|0.2|0|survival', 'Whetstone|g|0.01|0|metal',
    // Clothing
    'Common clothes|c|0.5|0|', 'Traveler\'s clothes|c|2|0|survival', 'Costume|c|5|1|', 'Robes|c|1|0|holy', 'Fine clothes|c|15|2|luxury', 'Cold-weather clothes|c|5|0|survival,mining',
    // Spellcasting focuses and components
    'Component pouch|fo|25|2|magic', 'Arcane focus: crystal|fo|10|2|magic', 'Arcane focus: orb|fo|20|2|magic', 'Arcane focus: rod|fo|10|2|magic',
    'Arcane focus: staff|fo|5|2|magic', 'Arcane focus: wand|fo|10|2|magic', 'Druidic focus: sprig of mistletoe|fo|1|1|magic', 'Druidic focus: yew wand|fo|10|1|magic',
    // Holy
    'Holy symbol: amulet|h|5|0|holy', 'Holy symbol: emblem|h|5|0|holy', 'Holy symbol: reliquary|h|5|1|holy', 'Holy water (flask)|h|25|1|holy', 'Prayer beads|h|1|0|holy',
    // Alchemy and potions
    'Acid (vial)|p|25|2|', 'Alchemist\'s fire (flask)|p|50|2|', 'Antitoxin (vial)|p|50|1|survival', 'Potion of healing|p|50|1|',
    'Potion of greater healing|p|150|2|magic', 'Potion of superior healing|p|450|3|magic', 'Potion of supreme healing|p|1350|4|magic',
    'Potion of climbing|p|75|2|magic', 'Potion of water breathing|p|180|3|magic,nautical', 'Potion of animal friendship|p|100|2|magic',
    'Potion of resistance|p|300|3|magic', 'Potion of heroism|p|180|3|magic', 'Potion of fire breath|p|150|3|magic', 'Potion of growth|p|270|3|magic',
    'Potion of mind reading|p|300|4|magic', 'Potion of invisibility|p|2500|4|magic',
    // Artisan's tools
    'Alchemist\'s supplies|t|50|2|', 'Brewer\'s supplies|t|20|1|farm', 'Calligrapher\'s supplies|t|10|2|', 'Carpenter\'s tools|t|8|0|',
    'Cartographer\'s tools|t|15|2|nautical', 'Cobbler\'s tools|t|5|0|', 'Cook\'s utensils|t|1|0|', 'Glassblower\'s tools|t|30|2|',
    'Jeweler\'s tools|t|25|2|luxury,mining', 'Leatherworker\'s tools|t|5|0|', 'Mason\'s tools|t|10|0|mining', 'Painter\'s supplies|t|10|2|',
    'Potter\'s tools|t|10|0|', 'Smith\'s tools|t|20|0|metal,mining', 'Tinker\'s tools|t|50|2|', 'Weaver\'s tools|t|1|0|farm', 'Woodcarver\'s tools|t|1|0|',
    // Kits and games
    'Disguise kit|k|25|2|', 'Herbalism kit|k|5|0|survival', 'Navigator\'s tools|k|25|1|nautical', 'Thieves\' tools|k|25|3|shady',
    'Dice set|gm|0.1|0|', 'Playing card set|gm|0.5|0|', 'Dragonchess set|gm|1|2|luxury',
    // Instruments
    'Bagpipes|i|30|2|luxury', 'Drum|i|6|0|', 'Dulcimer|i|25|2|luxury', 'Flute|i|2|0|', 'Lute|i|35|1|', 'Lyre|i|30|2|luxury',
    'Horn|i|3|0|', 'Pan flute|i|12|1|', 'Shawm|i|2|1|', 'Viol|i|30|2|luxury',
    // Contraband
    'Basic poison (vial)|x|100|1|shady', 'Poisoner\'s kit|x|50|1|shady', 'Forgery kit|x|15|1|shady', 'Assassin\'s blood (poison)|x|150|2|shady',
    'Drow poison|x|200|3|shady', 'Serpent venom|x|200|2|shady', 'Torpor (poison)|x|600|3|shady', 'Midnight tears (poison)|x|1500|4|shady',
    // Mounts and animals
    'Donkey or mule|m|8|0|farm', 'Draft horse|m|50|0|farm', 'Riding horse|m|75|1|', 'Pony|m|30|0|farm', 'Mastiff|m|25|0|farm', 'Warhorse|m|400|3|',
    // Tack and vehicles
    'Bit and bridle|tk|2|0|', 'Feed (per day)|tk|0.05|0|farm', 'Riding saddle|tk|10|0|', 'Military saddle|tk|20|2|', 'Pack saddle|tk|5|0|farm',
    'Saddlebags|tk|4|0|', 'Stabling (per day)|s|0.5|0|lodging', 'Cart|v|15|0|farm', 'Wagon|v|35|0|farm', 'Sled|v|20|1|', 'Carriage|v|100|3|luxury', 'Chariot|v|250|4|luxury',
    // Boats
    'Rowboat|b|50|0|river,nautical', 'Keelboat|b|3000|2|river,nautical', 'Longship|b|10000|3|sea,nautical', 'Sailing ship|b|10000|3|sea,nautical',
    'Galley|b|30000|4|sea,nautical', 'Warship|b|25000|4|sea,nautical',
    // Food, drink and lodging
    'Ale (mug)|f|0.04|0|', 'Ale (gallon)|f|0.2|0|farm', 'Bread (loaf)|f|0.02|0|farm', 'Cheese (hunk)|f|0.1|0|farm', 'Meat (chunk)|f|0.3|0|farm',
    'Common wine (pitcher)|f|0.2|0|', 'Fine wine (bottle)|f|10|2|luxury', 'Rations (1 day)|f|0.5|0|survival',
    'Meal (squalid)|s|0.03|0|lodging', 'Meal (modest)|s|0.3|0|lodging', 'Meal (comfortable)|s|0.5|1|lodging', 'Meal (wealthy)|s|0.8|2|lodging,luxury',
    'Room for the night (squalid)|s|0.07|0|lodging', 'Room for the night (modest)|s|0.5|0|lodging', 'Room for the night (comfortable)|s|0.8|1|lodging', 'Room for the night (wealthy)|s|2|2|lodging,luxury',
    // Temple services
    'Healing (Cure Wounds)|s|10|0|holy', 'Lesser Restoration|s|40|1|holy', 'Remove Curse|s|90|2|holy', 'Greater Restoration|s|450|3|holy', 'Raise Dead|s|1250|4|holy'
  ];

  // Weight in pounds, carried. Potions weigh half a pound; mounts, vehicles, boats and services aren't carried.
  var WEIGHT = {"Club": 2, "Dagger": 1, "Greatclub": 10, "Handaxe": 2, "Javelin": 2, "Light hammer": 2, "Mace": 4, "Quarterstaff": 4, "Sickle": 2, "Spear": 3, "Light crossbow": 5, "Dart": 0.25, "Shortbow": 2, "Sling": 0, "Battleaxe": 4, "Flail": 2, "Glaive": 6, "Greataxe": 7, "Greatsword": 6, "Halberd": 6, "Lance": 6, "Longsword": 3, "Maul": 10, "Morningstar": 4, "Pike": 18, "Rapier": 2, "Scimitar": 3, "Shortsword": 2, "Trident": 4, "War pick": 2, "Warhammer": 2, "Whip": 3, "Blowgun": 1, "Hand crossbow": 3, "Heavy crossbow": 18, "Longbow": 2, "Net": 3, "Arrows (20)": 1, "Blowgun needles (50)": 1, "Crossbow bolts (20)": 1.5, "Sling bullets (20)": 1.5, "Padded armor": 8, "Leather armor": 10, "Studded leather armor": 13, "Hide armor": 12, "Chain shirt": 20, "Scale mail": 45, "Breastplate": 20, "Half plate": 40, "Ring mail": 40, "Chain mail": 55, "Splint armor": 60, "Plate armor": 65, "Shield": 6, "Abacus": 2, "Backpack": 5, "Ball bearings (1,000)": 2, "Barrel": 70, "Basket": 2, "Bedroll": 7, "Bell": 0, "Blanket": 3, "Block and tackle": 5, "Book": 5, "Glass bottle": 2, "Bucket": 2, "Caltrops (20)": 2, "Candle": 0, "Map or scroll case": 1, "Chain (10 feet)": 10, "Chalk": 0, "Chest": 25, "Climber's kit": 12, "Crowbar": 5, "Fishing tackle": 4, "Flask or tankard": 1, "Grappling hook": 4, "Hammer": 3, "Sledgehammer": 10, "Healer's kit": 3, "Hourglass": 1, "Hunting trap": 25, "Ink (1 ounce bottle)": 0, "Ink pen": 0, "Jug or pitcher": 4, "Ladder (10 feet)": 25, "Lamp": 1, "Bullseye lantern": 2, "Hooded lantern": 2, "Lock": 1, "Magnifying glass": 0, "Manacles": 6, "Mess kit": 1, "Steel mirror": 0.5, "Oil (flask)": 1, "Paper (one sheet)": 0, "Parchment (one sheet)": 0, "Perfume (vial)": 0, "Miner's pick": 10, "Piton": 0.25, "Pole (10 feet)": 7, "Iron pot": 10, "Pouch": 1, "Quiver": 1, "Portable ram": 35, "Hempen rope (50 feet)": 10, "Silk rope (50 feet)": 5, "Sack": 0.5, "Merchant's scale": 3, "Sealing wax": 0, "Shovel": 5, "Signal whistle": 0, "Signet ring": 0, "Soap": 0, "Spellbook (blank)": 3, "Iron spikes (10)": 5, "Spyglass": 1, "Two-person tent": 20, "Tinderbox": 1, "Torch": 1, "Vial": 0, "Waterskin": 5, "Whetstone": 1, "Common clothes": 3, "Traveler's clothes": 4, "Costume": 4, "Robes": 4, "Fine clothes": 6, "Cold-weather clothes": 5, "Component pouch": 2, "Arcane focus: crystal": 1, "Arcane focus: orb": 3, "Arcane focus: rod": 2, "Arcane focus: staff": 4, "Arcane focus: wand": 1, "Druidic focus: sprig of mistletoe": 0, "Druidic focus: yew wand": 1, "Holy symbol: amulet": 1, "Holy symbol: emblem": 0, "Holy symbol: reliquary": 2, "Holy water (flask)": 1, "Prayer beads": 0, "Acid (vial)": 1, "Alchemist's fire (flask)": 1, "Antitoxin (vial)": 0, "Alchemist's supplies": 8, "Brewer's supplies": 9, "Calligrapher's supplies": 5, "Carpenter's tools": 6, "Cartographer's tools": 6, "Cobbler's tools": 5, "Cook's utensils": 8, "Glassblower's tools": 5, "Jeweler's tools": 2, "Leatherworker's tools": 5, "Mason's tools": 8, "Painter's supplies": 5, "Potter's tools": 3, "Smith's tools": 8, "Tinker's tools": 10, "Weaver's tools": 5, "Woodcarver's tools": 5, "Disguise kit": 3, "Herbalism kit": 3, "Navigator's tools": 2, "Thieves' tools": 1, "Dice set": 0, "Playing card set": 0, "Dragonchess set": 0.5, "Bagpipes": 6, "Drum": 3, "Dulcimer": 10, "Flute": 1, "Lute": 2, "Lyre": 2, "Horn": 2, "Pan flute": 2, "Shawm": 1, "Viol": 1, "Poisoner's kit": 2, "Forgery kit": 5, "Bit and bridle": 1, "Feed (per day)": 10, "Riding saddle": 25, "Military saddle": 30, "Pack saddle": 15, "Saddlebags": 8, "Ale (gallon)": 8, "Bread (loaf)": 0.5, "Cheese (hunk)": 0.5, "Meat (chunk)": 1, "Common wine (pitcher)": 4, "Fine wine (bottle)": 1.5, "Rations (1 day)": 2};
  var ITEMS = RAW.map(function (line) {
    var p = line.split('|');
    var w = WEIGHT[p[0]]; if (w === undefined) w = p[1] === 'p' ? 0.5 : (['m', 'v', 'b', 's'].indexOf(p[1]) >= 0 ? null : 0);
    return { name: p[0], kind: p[1], price: parseFloat(p[2]), size: parseInt(p[3], 10), tags: p[4] ? p[4].split(',') : [], weight: w };
  });

  // What each kind of shop can carry. "Kinds" takes whole kinds; "tags" pulls in gear with those tags too.
  var SHOP_KINDS = {
    'General store': { kinds: ['g', 'c', 'f', 'gm'], skipTags: ['luxury', 'magic'], about: 'Everyday gear, food and clothes.' },
    'Blacksmith': { kinds: ['sw', 'mw'], tags: ['metal'], extra: ['Smith\'s tools'], skipKinds: ['la', 'ma', 'ha', 'sh', 'rw', 'am'], about: 'Blades, axes, hammers and ironwork.' },
    'Armorer': { kinds: ['la', 'ma', 'ha', 'sh'], about: 'Armor and shields.' },
    'Bowyer & fletcher': { kinds: ['rw', 'am'], extra: ['Quiver'], about: 'Bows, crossbows and ammunition.' },
    'Alchemist': { kinds: ['p'], skipTags: ['magic'], extra: ['Alchemist\'s supplies', 'Herbalism kit', 'Healer\'s kit', 'Vial', 'Glass bottle', 'Oil (flask)'], magicFrom: 3, about: 'Acids, fires, cures and potions.' },
    'Tailor & outfitter': { kinds: ['c'], extra: ['Backpack', 'Pouch', 'Sack', 'Bedroll', 'Blanket', 'Two-person tent', 'Saddlebags', 'Weaver\'s tools', 'Leatherworker\'s tools', 'Cobbler\'s tools'], about: 'Clothes, packs and camping cloth.' },
    'Stables': { kinds: ['m', 'tk', 'v'], about: 'Mounts, tack, carts and wagons.' },
    'Shipwright & chandler': { kinds: ['b'], tags: ['nautical'], about: 'Boats and ship\'s supplies.' },
    'Tavern & inn': { kinds: ['f'], tags: ['lodging'], skipKinds: ['p'], about: 'Food, drink and a bed.' },
    'Temple': { kinds: ['h'], tags: ['holy'], extra: ['Potion of healing', 'Healer\'s kit', 'Candle'], skipKinds: ['c'], about: 'Holy goods, healing and rites.' },
    'Magic shop': { kinds: ['fo'], tags: ['magic'], extra: ['Ink (1 ounce bottle)', 'Ink pen', 'Parchment (one sheet)', 'Book'], about: 'Foci, components and potions.' },
    'Tinker & toolmaker': { kinds: ['t', 'k', 'gm', 'i'], extra: ['Lock', 'Abacus', 'Hourglass', 'Magnifying glass', 'Merchant\'s scale'], about: 'Tools, kits, locks and instruments.' },
    'Fence': { kinds: ['x', 'k', 'sw', 'mw', 'rw', 'g', 'p', 'la'], fence: true, about: 'Stolen goods and things the law won\'t sell. Never asks your name.' }
  };

  // What a place's tags do to its shops.
  var PLACE_TAGS = {
    trade: { about: 'Trade hub: more variety, better prices.' },
    port: { about: 'Sea port: ships, nautical gear, imports.' },
    river: { about: 'River town: rowboats and keelboats.' },
    mining: { about: 'Mining town: picks, rope and lamps, almost no weapons or armor.' },
    forge: { about: 'Forge town: weapons and armor even here, and cheaper.' },
    farming: { about: 'Farm country: cheap food and animals, few luxuries.' },
    frontier: { about: 'Frontier: survival gear, few luxuries, higher prices.' },
    holy: { about: 'Holy site: more holy goods and rites.' },
    military: { about: 'Garrison: plenty of weapons and armor.' },
    remote: { about: 'Remote: everything costs more.' }
  };

  window.AVARENTH_ITEMS = { items: ITEMS, shopKinds: SHOP_KINDS, placeTags: PLACE_TAGS, sizes: ['Hamlet', 'Village', 'Town', 'City', 'Capital'] };
})();
