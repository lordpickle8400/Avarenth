/* NPC maker data for the Dornish Isles. Race odds and work are set per district, so House Ignis's Emberwood
   turns up more draconic folk and the Greywall Holds mostly dwarves. Weights are relative: edit freely. */
(function () {
  var D = {
    west: { label: 'The Wildreach', races: { Human: 64, 'Half-Elf': 6, Halfling: 8, 'Half-Orc': 5, Gnome: 3, Goliath: 4, Mossborn: 3, Orc: 3, Dwarf: 2, Infernite: 1, Scalekin: 1 },
      jobs: ['farmer', 'shepherd', 'trapper', 'hunter', 'charcoal burner', 'hedge priest', 'knight\'s man-at-arms', 'reeve', 'miller', 'swineherd', 'herbalist', 'tavern keeper', 'pedlar', 'ex-soldier', 'beekeeper', 'well-digger'] },
    central: { label: 'The Emberwood', races: { Human: 40, Scalekin: 18, Kobold: 14, Lizardfolk: 8, 'Half-Elf': 5, Halfling: 5, Dwarf: 3, Gnome: 3, Infernite: 2, 'Half-Orc': 2 },
      jobs: ['timber cutter', 'sawyer', 'warden of House Ignis', 'river raftsman', 'charcoal burner', 'carpenter', 'tanner', 'forester', 'resin tapper', 'wagoner', 'tavern keeper', 'clerk of the timber yard', 'hunter', 'kennel keeper', 'smith', 'ferryman'] },
    capital: { label: 'The Crownlands', races: { Human: 62, 'Half-Elf': 7, Halfling: 7, Dwarf: 6, Gnome: 4, 'Half-Orc': 4, Infernite: 3, Orc: 3, Scalekin: 2, Elf: 1, Kobold: 1 },
      jobs: ['clerk', 'city guard', 'merchant', 'priest of Akoron', 'tailor', 'baker', 'lamplighter', 'scribe', 'courtier', 'bridge toll keeper', 'street vendor', 'chandler', 'herald', 'cutpurse', 'innkeeper', 'stablehand', 'apothecary', 'washerwoman', 'goldsmith', 'royal messenger'] },
    north: { label: 'The Greywall Holds', races: { Dwarf: 72, Human: 11, Gnome: 7, Halfling: 4, Goliath: 3, 'Half-Orc': 2, 'Deepgnome': 1 },
      jobs: ['miner', 'smith', 'brewer', 'mason', 'carter', 'Craghorn herder', 'terrace farmer', 'gem cutter', 'shieldbrow guard', 'hall cook', 'tunnel surveyor', 'mead-hall keeper', 'assayer', 'lamp-keeper', 'stone carver', 'clan record keeper'] },
    south: { label: 'The Golden Coast', races: { Human: 58, Halfling: 10, 'Half-Elf': 8, Gnome: 6, Dwarf: 6, Infernite: 4, Shellback: 3, Elf: 2, Scalekin: 2, 'Half-Orc': 1 },
      jobs: ['merchant', 'sailor', 'dockhand', 'scholar at the university', 'moneylender', 'vintner', 'shipwright', 'fishwife', 'customs officer', 'priest', 'student', 'galley oarsman', 'cartographer', 'spice trader', 'harbour pilot', 'Caspian soldier', 'fishmonger'] },
    mournfells: { label: 'The Strait March', races: { Human: 45, Orc: 24, 'Half-Orc': 15, Goliath: 4, Dwarf: 4, Halfling: 3, Infernite: 2, Hobgoblin: 2, 'Half-Elf': 1 },
      jobs: ['coast guard sailor', 'fort soldier', 'toll clerk', 'fisher', 'ferryman', 'shepherd', 'smith', 'signal-fire keeper', 'fog guide', 'scout', 'net mender', 'barracks cook', 'old war veteran', 'boatwright'] },
    sea: { label: 'At sea and the islands', races: { Human: 50, 'Sea Elf': 15, Shellback: 8, 'Half-Elf': 8, Halfling: 6, Orc: 5, Dwarf: 3, Infernite: 3, Lizardfolk: 2 },
      jobs: ['sailor', 'fisher', 'smuggler', 'ship\'s cook', 'pearl diver', 'navigator', 'deckhand', 'harbour master', 'net mender', 'lighthouse keeper', 'pirate (says they aren\'t)', 'island trader'] }
  };
  // Given names (male, female) and family names by race.
  var N = {
    Human: [['Aldous', 'Cedric', 'Osric', 'Wendel', 'Gideon', 'Edwin', 'Hal', 'Robb', 'Tobin', 'Wat', 'Godric', 'Piers', 'Alaric', 'Bertram', 'Simon', 'Jory'], ['Brenna', 'Mirela', 'Tamsin', 'Yara', 'Hester', 'Maud', 'Edith', 'Joan', 'Agnes', 'Isolde', 'Rosamund', 'Elspeth', 'Gwen', 'Alys', 'Beatrix', 'Nell'],
      ['Ashby', 'Thorne', 'Fletcher', 'Marsh', 'Wainwright', 'Holloway', 'Reed', 'Cotter', 'Hale', 'Bramley', 'Dunmore', 'Fenwick', 'Carver', 'Mercer', 'Rook', 'Tanner', 'Underhill', 'Wexley', 'Barlow', 'Kettle']],
    'Half-Elf': [['Ilvan', 'Tavian', 'Elric', 'Sorin', 'Varis', 'Quill'], ['Seren', 'Lirael', 'Ysolde', 'Maelis', 'Tirra', 'Corra'], ['Ashby', 'Reed', 'Silverbrook', 'Hale', 'Marsh', 'Vane']],
    Elf: [['Aelar', 'Theren', 'Galinndan', 'Riardon', 'Soveliss', 'Erevan'], ['Naivara', 'Shava', 'Sariel', 'Valanthe', 'Keyleth', 'Thia'], ['Amakiir', 'Galanodel', 'Liadon', 'Siannodel', 'Xiloscient']],
    'Sea Elf': [['Coralis', 'Thalan', 'Nerith', 'Pelagor', 'Undrin', 'Saltreth'], ['Maerwen', 'Nerissa', 'Thalassa', 'Coryth', 'Ondine', 'Perla'], ['of Coralyn', 'Deepcurrent', 'Wavecrest', 'Pearlhand', 'Tidesong']],
    Halfling: [['Bramble', 'Pip', 'Merry', 'Tobold', 'Fennick', 'Milo', 'Corrin', 'Roscoe'], ['Cora', 'Wren', 'Daisy', 'Lavinia', 'Poppy', 'Tansy', 'Marigold', 'Bree'], ['Goodbarrel', 'Tealeaf', 'Thorngage', 'Underbough', 'Brushgather', 'Hilltopple', 'Applewhistle']],
    Dwarf: [['Bofrin', 'Hargrim', 'Thrain', 'Orsik', 'Brottor', 'Dain', 'Rurik', 'Torvald', 'Kildrak', 'Gardain'], ['Dagny', 'Runa', 'Vistra', 'Helja', 'Hlin', 'Eldeth', 'Gunnloda', 'Torbera', 'Bardryn', 'Sannl'],
      ['Slagfist', 'Frostmantle', 'Deepdelve', 'Hearthmead', 'Brightvein', 'Granitehand', 'Ironwheel', 'Shieldbrow']],
    'Deepgnome': [['Brusk', 'Dorrb', 'Thurl', 'Krimp'], ['Nyx', 'Brena', 'Selbi', 'Ulnora'], ['Deepdelve', 'Grimstone', 'Stillwater']],
    Gnome: [['Bimble', 'Fizzwick', 'Orryn', 'Zook', 'Wizzle', 'Alston', 'Boddynock', 'Fonkin'], ['Nissa', 'Tink', 'Ellywick', 'Bimpnottin', 'Carlin', 'Lorilla'], ['Beren', 'Daergel', 'Garrick', 'Nackle', 'Murnig', 'Timbers']],
    Orc: [['Grosh', 'Thokk', 'Bazrak', 'Durth', 'Henk', 'Krusk', 'Shump'], ['Murga', 'Ushna', 'Volga', 'Baggi', 'Emen', 'Kansif', 'Ovak'], ['Stonefist', 'Bonecleaver', 'Ironhide', 'of the Strait', 'Blackbrook', 'Tuskward']],
    'Half-Orc': [['Dench', 'Krusk', 'Mhurren', 'Engong', 'Gell', 'Ront'], ['Sutha', 'Ovak', 'Yevelda', 'Neega', 'Shautha', 'Vola'], ['Thorne', 'Ashby', 'Ironhide', 'Marsh', 'Grimm']],
    Goliath: [['Aukan', 'Maveith', 'Gae-Al', 'Eglath', 'Keothi', 'Thotham'], ['Kuori', 'Thalai', 'Nalla', 'Orilo', 'Vaunea', 'Paavu'], ['Rockbreaker', 'Skywatcher', 'Longleaper', 'Threadtwister']],
    Mossborn: [['Moss', 'Oakhollow', 'Barrow', 'Alder'], ['Fern', 'Willow', 'Sedge', 'Briar'], ['of the Glen', 'Greenhand', 'Quietroot']],
    Infernite: [['Akmenos', 'Damakos', 'Mordai', 'Leucis', 'Ekemon', 'Skamos'], ['Bryseis', 'Criella', 'Orianna', 'Rieta', 'Kallista', 'Nemeia'], ['', 'Hope', 'Sorrow', 'Ashby', 'Vane', 'Mercer']],
    Scalekin: [['Arjhan', 'Kriv', 'Medrash', 'Balasar', 'Ghesh', 'Torinn', 'Rhogar'], ['Sora', 'Thava', 'Nala', 'Akra', 'Biri', 'Harann', 'Kava'], ['Ignis', 'Ashvane', 'Kerrhylon', 'Myastan', 'Daardendrian', 'Clethtinthiallor']],
    Kobold: [['Snarl', 'Kib', 'Tazzik', 'Meepo', 'Skivv', 'Krik'], ['Rikka', 'Tisk', 'Vexxa', 'Yip', 'Sskarra', 'Nib'], ['Ignis', 'of the Embers', 'Ashtail', 'Coalscale']],
    Lizardfolk: [['Garurt', 'Sesk', 'Thurk', 'Achuak', 'Vush', 'Ikalk'], ['Thessa', 'Ssirrka', 'Usha', 'Kessk', 'Aruk', 'Viss'], ['', 'Reedwalker', 'Mudscale', 'of Dragonsneck']],
    Shellback: [['Gar', 'Tibor', 'Wollo', 'Xelbuk', 'Ukuru'], ['Nulka', 'Quee', 'Lop', 'Damu', 'Ilmu'], ['', 'Shellback', 'Tidewalker', 'Sandbar']],
    Hobgoblin: [['Krag', 'Morv', 'Zhek', 'Durgash'], ['Vira', 'Ghenna', 'Sorka', 'Tull'], ['Ironline', 'of the Strait', 'Redbanner']]
  };
  var LOOK = {
    build: ['wiry', 'broad-shouldered', 'stooped', 'heavyset', 'lanky', 'compact and strong', 'thin as a rake', 'soft and round', 'tall and gaunt', 'short and solid'],
    feature: ['a badly set nose', 'a burn scar across one hand', 'ink-stained fingers', 'a missing front tooth', 'bright, darting eyes', 'a braided beard with iron rings', 'a weathered, wind-burnt face', 'one cloudy eye', 'calloused hands', 'a fine but threadbare coat', 'a heavy limp', 'freckles everywhere', 'an old brand on the neck', 'immaculate boots', 'a crooked smile', 'a shaved head', 'mud to the knees', 'a sailor\'s tattoo', 'silver hair pulled tight', 'a laugh you can hear across a room'],
    smell: ['pipe smoke', 'wet wool', 'fresh bread', 'tar', 'lavender', 'sawdust', 'fish', 'woodsmoke', 'cheap ale', 'horse', 'incense', 'iron']
  };
  var TRAIT = ['suspicious of strangers', 'endlessly cheerful', 'blunt to the point of rudeness', 'nervous and quick to apologize', 'proud of their work', 'a terrible gossip', 'deeply religious', 'greedy but honest about it', 'lazy but clever', 'kind to a fault', 'quick-tempered', 'bored and looking for trouble', 'superstitious', 'polite but cold', 'a born storyteller', 'stubborn as stone', 'easily flattered', 'grieving and distracted', 'ambitious', 'paranoid about thieves', 'loyal to their lord', 'cynical about nobles', 'shy until they\'ve had a drink', 'overly helpful', 'a schemer'];
  var VOICE = ['speaks slowly, weighing every word', 'talks fast and drops the ends of words', 'hums between sentences', 'calls everyone "friend"', 'never makes eye contact', 'whispers as if someone is listening', 'laughs at their own jokes', 'quotes scripture', 'swears creatively', 'answers questions with questions', 'speaks in a booming voice', 'clicks their tongue when thinking', 'uses big words, often wrongly', 'repeats the last thing you said', 'has a thick local accent'];
  var WANT = ['to pay off a debt before the next Nailsday', 'to get their child apprenticed somewhere good', 'to see the sea once before they die', 'revenge on a rival', 'a quiet life, which they are not getting', 'to be noticed by their lord', 'news of a missing brother', 'enough coin to leave the isles', 'to prove a rumour true', 'a cure for a sick parent', 'to win back a lost love', 'to find a buyer for something they shouldn\'t have', 'safe passage through dangerous country', 'to keep their trade from a newcomer'];
  var SECRET = ['owes money to the Black Hand', 'is a deserter', 'is informing for a noble house', 'once worked for the Brinewolves', 'hides a relic they found in a ruin', 'is not who they claim to be', 'is in love with someone above their station', 'secretly prays to one of the Hollow Court', 'witnessed a murder and said nothing', 'is skimming from their employer', 'has a child nobody knows about', 'is terrified of something in the woods', 'has a small knack for magic and hides it', 'knows a smuggler\'s route', 'is far older than they look'];
  window.AVARENTH_NPC = { districts: D, names: N, look: LOOK, traits: TRAIT, voices: VOICE, wants: WANT, secrets: SECRET };
})();
