/* Avarenth rules data for the character builder, level-up guide and sheet.
   Class and species basics follow the 5e core rules (summaries in our own words);
   magic follows the Avarenth Mana Guide: mana instead of spell slots. */
(function () {
  // [level, feature name, short summary, needs a mana ruling?]
  // "needsRuling" marks 5e features written around spell slots; the DM decides the mana version.
  var C = {};

  C.Barbarian = {
    hd: 12, primary: 'Strength', saves: ['str', 'con'],
    armor: 'Light and medium armor, shields', weapons: 'Simple and martial weapons', tools: '',
    skills: { n: 2, from: ['Animal Handling', 'Athletics', 'Intimidation', 'Nature', 'Perception', 'Survival'] },
    subclassLevel: 3, subclassLabel: 'Primal Path', asi: [4, 8, 12, 16, 19],
    subclasses: ['Path of the Berserker', 'Path of the Totem Warrior', 'Path of the Ancestral Guardian', 'Path of the Storm Herald', 'Path of the Zealot', 'Path of the Beast', 'Path of Wild Magic', 'Path of the Giant'],
    features: [
      [1, 'Rage', 'As a bonus action, rage for a minute: advantage on Strength checks and saves, extra melee damage, and resistance to bludgeoning, piercing and slashing damage. Limited uses per long rest.'],
      [1, 'Unarmored Defense', 'Without armor, your AC is 10 + Dexterity + Constitution. A shield still counts.'],
      [2, 'Reckless Attack', 'Attack with advantage on your first Strength melee attack of the turn; attacks against you have advantage until your next turn.'],
      [2, 'Danger Sense', 'Advantage on Dexterity saves against effects you can see, like traps and spells.'],
      [3, 'Primal Path', 'Choose the path your rage follows.'],
      [5, 'Extra Attack', 'Attack twice when you take the Attack action.'],
      [5, 'Fast Movement', 'Your speed rises by 10 feet while not wearing heavy armor.'],
      [7, 'Feral Instinct', 'Advantage on initiative, and you can act on a surprise round if you rage first.'],
      [9, 'Brutal Critical', 'Roll one extra weapon damage die on a melee critical hit (two at 13th, three at 17th).'],
      [11, 'Relentless Rage', 'While raging, a Constitution save can keep you at 1 hit point instead of 0.'],
      [15, 'Persistent Rage', 'Your rage only ends early if you fall unconscious or choose to end it.'],
      [18, 'Indomitable Might', 'A Strength check total lower than your Strength score uses the score instead.'],
      [20, 'Primal Champion', 'Strength and Constitution each rise by 4, to a maximum of 24.']
    ]
  };

  C.Bard = {
    hd: 8, primary: 'Charisma', saves: ['dex', 'cha'],
    armor: 'Light armor', weapons: 'Simple weapons, hand crossbows, longswords, rapiers, shortswords', tools: 'Three musical instruments',
    skills: { n: 3, from: 'any' },
    subclassLevel: 3, subclassLabel: 'Bard College', asi: [4, 8, 12, 16, 19],
    subclasses: ['College of Lore', 'College of Valor', 'College of Glamour', 'College of Swords', 'College of Whispers', 'College of Creation', 'College of Eloquence', 'College of Spirits'],
    features: [
      [1, 'Spellcasting', 'You cast with mana. Charisma is your spellcasting ability. See the Mana Guide.'],
      [1, 'Bardic Inspiration', 'As a bonus action, give a creature an inspiration die (d6, growing to d8 at 5th, d10 at 10th, d12 at 15th) to add to one roll. Uses equal your Charisma modifier per long rest.'],
      [2, 'Jack of All Trades', 'Add half your proficiency bonus to ability checks you aren\'t proficient in.'],
      [2, 'Song of Rest', 'Allies who spend hit dice during your short rest regain extra hit points.'],
      [3, 'Bard College', 'Choose your college.'],
      [3, 'Expertise', 'Double your proficiency bonus for two skills you\'re proficient in (two more at 10th).'],
      [5, 'Font of Inspiration', 'You regain Bardic Inspiration on a short rest as well.'],
      [6, 'Countercharm', 'Use an action to give nearby allies advantage on saves against being frightened or charmed.'],
      [10, 'Magical Secrets', 'Bards learn through songs and stories. Pick two spells from any class list: no tome needed, at half the learning cost. Two more at 14th and 18th level.'],
      [14, 'Magical Secrets', 'Two more spells from any class list, no tome needed, at half the learning cost.'],
      [18, 'Magical Secrets', 'Two more spells from any class list, no tome needed, at half the learning cost.'],
      [20, 'Superior Inspiration', 'When you roll initiative with no Bardic Inspiration left, you regain one.']
    ]
  };

  C.Cleric = {
    hd: 8, primary: 'Wisdom', saves: ['wis', 'cha'],
    armor: 'Light and medium armor, shields', weapons: 'Simple weapons', tools: '',
    skills: { n: 2, from: ['History', 'Insight', 'Medicine', 'Persuasion', 'Religion'] },
    subclassLevel: 1, subclassLabel: 'Divine Domain', asi: [4, 8, 12, 16, 19],
    subclasses: ['Knowledge Domain', 'Life Domain', 'Light Domain', 'Nature Domain', 'Tempest Domain', 'Trickery Domain', 'War Domain', 'Forge Domain', 'Grave Domain', 'Order Domain', 'Peace Domain', 'Twilight Domain', 'Arcana Domain', 'Death Domain'],
    features: [
      [1, 'Spellcasting', 'You cast with mana. Wisdom is your spellcasting ability. See the Mana Guide.'],
      [1, 'Divine Domain', 'Choose the domain of your god.'],
      [2, 'Channel Divinity', 'Channel divine power for effects like Turn Undead and your domain\'s ability. Once per short or long rest (twice at 6th, three times at 18th).'],
      [5, 'Destroy Undead', 'Undead that fail against your Turn Undead are destroyed outright if weak enough. The threshold rises as you level.'],
      [10, 'Divine Intervention', 'Call on your god for help. If you roll your cleric level or lower on a d100, they answer.'],
      [20, 'Divine Intervention Improvement', 'Your god always answers your call for intervention.']
    ]
  };

  C.Druid = {
    hd: 8, primary: 'Wisdom', saves: ['int', 'wis'],
    armor: 'Light and medium armor, shields (not made of metal)', weapons: 'Clubs, daggers, darts, javelins, maces, quarterstaffs, scimitars, sickles, slings, spears', tools: 'Herbalism kit',
    skills: { n: 2, from: ['Arcana', 'Animal Handling', 'Insight', 'Medicine', 'Nature', 'Perception', 'Religion', 'Survival'] },
    subclassLevel: 2, subclassLabel: 'Druid Circle', asi: [4, 8, 12, 16, 19],
    subclasses: ['Circle of the Land', 'Circle of the Moon', 'Circle of Dreams', 'Circle of the Shepherd', 'Circle of Spores', 'Circle of Stars', 'Circle of Wildfire'],
    features: [
      [1, 'Druidic', 'You know the secret language of druids.'],
      [1, 'Spellcasting', 'You cast with mana. Wisdom is your spellcasting ability. See the Mana Guide.'],
      [2, 'Wild Shape', 'Turn into a beast you have seen, twice per short or long rest. Stronger forms open up at 4th and 8th level.'],
      [2, 'Druid Circle', 'Choose your circle.'],
      [18, 'Timeless Body', 'You age ten times slower.'],
      [18, 'Beast Spells', 'You can cast many of your spells while in beast form.'],
      [20, 'Archdruid', 'Unlimited Wild Shape, and you can ignore minor components of druid spells.']
    ]
  };

  C.Fighter = {
    hd: 10, primary: 'Strength or Dexterity', saves: ['str', 'con'],
    armor: 'All armor, shields', weapons: 'Simple and martial weapons', tools: '',
    skills: { n: 2, from: ['Acrobatics', 'Animal Handling', 'Athletics', 'History', 'Insight', 'Intimidation', 'Perception', 'Survival'] },
    subclassLevel: 3, subclassLabel: 'Martial Archetype', asi: [4, 6, 8, 12, 14, 16, 19],
    subclasses: ['Champion', 'Battle Master', 'Eldritch Knight', 'Arcane Archer', 'Cavalier', 'Samurai', 'Echo Knight', 'Psi Warrior', 'Rune Knight'],
    features: [
      [1, 'Avarenth Magic', 'You have a small mana pool and a short martial spell list. Bigger magic comes from tomes. See the Mana Guide.'],
      [1, 'Fighting Style', 'Pick a fighting specialty, like Archery, Defense, Dueling or Great Weapon Fighting.'],
      [1, 'Second Wind', 'As a bonus action, regain 1d10 + your fighter level in hit points. Once per short or long rest.'],
      [2, 'Action Surge', 'Take one extra action on your turn. Once per short or long rest (twice at 17th).'],
      [3, 'Martial Archetype', 'Choose your archetype.'],
      [5, 'Extra Attack', 'Attack twice when you take the Attack action (three times at 11th, four at 20th).'],
      [9, 'Indomitable', 'Reroll a failed saving throw. Once per long rest (twice at 13th, three times at 17th).']
    ]
  };

  C.Monk = {
    hd: 8, primary: 'Dexterity and Wisdom', saves: ['str', 'dex'],
    armor: 'None', weapons: 'Simple weapons, shortswords', tools: 'One artisan\'s tool or musical instrument',
    skills: { n: 2, from: ['Acrobatics', 'Athletics', 'History', 'Insight', 'Religion', 'Stealth'] },
    subclassLevel: 3, subclassLabel: 'Monastic Tradition', asi: [4, 8, 12, 16, 19],
    subclasses: ['Way of the Open Hand', 'Way of Shadow', 'Way of the Four Elements', 'Way of the Long Death', 'Way of the Sun Soul', 'Way of the Drunken Master', 'Way of the Kensei', 'Way of the Astral Self', 'Way of Mercy'],
    features: [
      [1, 'Avarenth Magic', 'You have a mana pool and a spirit-magic spell list. Bigger magic comes from tomes. See the Mana Guide.'],
      [1, 'Unarmored Defense', 'Without armor or a shield, your AC is 10 + Dexterity + Wisdom.'],
      [1, 'Martial Arts', 'Use Dexterity for unarmed and monk weapon attacks, roll a martial arts die for damage, and make an unarmed strike as a bonus action.'],
      [2, 'Ki', 'A pool of ki points equal to your monk level fuels Flurry of Blows, Patient Defense and Step of the Wind. Refills on a short or long rest.'],
      [2, 'Unarmored Movement', 'Your speed rises while unarmored, more as you level.'],
      [3, 'Monastic Tradition', 'Choose your tradition.'],
      [3, 'Deflect Missiles', 'Use your reaction to reduce damage from a ranged weapon attack, and maybe throw it back.'],
      [4, 'Slow Fall', 'Use your reaction to reduce falling damage.'],
      [5, 'Extra Attack', 'Attack twice when you take the Attack action.'],
      [5, 'Stunning Strike', 'Spend 1 ki when you hit to try to stun the target.'],
      [6, 'Ki-Empowered Strikes', 'Your unarmed strikes count as magical.'],
      [7, 'Evasion', 'Take no damage on a successful Dexterity save against area effects, and half on a failure.'],
      [7, 'Stillness of Mind', 'Use an action to end being charmed or frightened.'],
      [10, 'Purity of Body', 'Immune to disease and poison.'],
      [13, 'Tongue of the Sun and Moon', 'You understand all spoken languages, and anyone who knows a language understands you.'],
      [14, 'Diamond Soul', 'Proficiency in all saving throws, and spend 1 ki to reroll a failed save.'],
      [15, 'Timeless Body', 'You no longer need food or water and don\'t suffer the frailty of old age.'],
      [18, 'Empty Body', 'Spend ki to turn invisible and resist most damage, or to project your spirit into the Astral Plane.'],
      [20, 'Perfect Self', 'If you start combat with no ki, you regain 4.']
    ]
  };

  C.Paladin = {
    hd: 10, primary: 'Strength and Charisma', saves: ['wis', 'cha'],
    armor: 'All armor, shields', weapons: 'Simple and martial weapons', tools: '',
    skills: { n: 2, from: ['Athletics', 'Insight', 'Intimidation', 'Medicine', 'Persuasion', 'Religion'] },
    subclassLevel: 3, subclassLabel: 'Sacred Oath', asi: [4, 8, 12, 16, 19],
    subclasses: ['Oath of Devotion', 'Oath of the Ancients', 'Oath of Vengeance', 'Oathbreaker', 'Oath of Conquest', 'Oath of Redemption', 'Oath of Glory', 'Oath of the Watchers'],
    features: [
      [1, 'Divine Sense', 'Sense celestials, fiends and undead nearby. Uses equal 1 + your Charisma modifier per long rest.'],
      [1, 'Lay on Hands', 'A pool of healing equal to five times your paladin level, refilled on a long rest.'],
      [2, 'Fighting Style', 'Pick a fighting specialty, like Defense, Dueling or Great Weapon Fighting.'],
      [2, 'Spellcasting', 'You cast with mana. Charisma is your spellcasting ability. See the Mana Guide.'],
      [2, 'Divine Smite', 'When you hit with a melee weapon, spend mana for extra radiant damage: 2d8 for 5 mana, 3d8 for 10, 4d8 for 18, or 5d8 for 28. Add 1d8 against undead and fiends.'],
      [3, 'Divine Health', 'Immune to disease.'],
      [3, 'Sacred Oath', 'Swear your oath.'],
      [5, 'Extra Attack', 'Attack twice when you take the Attack action.'],
      [6, 'Aura of Protection', 'You and nearby allies add your Charisma modifier to saving throws (wider aura at 18th).'],
      [10, 'Aura of Courage', 'You and nearby allies can\'t be frightened while you\'re conscious.'],
      [11, 'Improved Divine Smite', 'Your melee weapon hits deal an extra 1d8 radiant damage.'],
      [14, 'Cleansing Touch', 'End a spell on yourself or a willing creature you touch.']
    ]
  };

  C.Ranger = {
    hd: 10, primary: 'Dexterity and Wisdom', saves: ['str', 'dex'],
    armor: 'Light and medium armor, shields', weapons: 'Simple and martial weapons', tools: '',
    skills: { n: 3, from: ['Animal Handling', 'Athletics', 'Insight', 'Investigation', 'Nature', 'Perception', 'Stealth', 'Survival'] },
    subclassLevel: 3, subclassLabel: 'Ranger Archetype', asi: [4, 8, 12, 16, 19],
    subclasses: ['Hunter', 'Beast Master', 'Gloom Stalker', 'Horizon Walker', 'Monster Slayer', 'Fey Wanderer', 'Swarmkeeper', 'Drakewarden'],
    features: [
      [1, 'Favored Enemy', 'Choose a type of creature you know well: advantage on tracking and recalling lore about them.'],
      [1, 'Natural Explorer', 'Choose a favored terrain where you travel and forage with ease.'],
      [2, 'Fighting Style', 'Pick a fighting specialty, like Archery, Defense or Two-Weapon Fighting.'],
      [2, 'Spellcasting', 'You cast with mana. Wisdom is your spellcasting ability. See the Mana Guide.'],
      [3, 'Ranger Archetype', 'Choose your archetype.'],
      [3, 'Primeval Awareness', 'Spend 5 mana to sense nearby aberrations, celestials, dragons, elementals, fey, fiends and undead for one minute.'],
      [5, 'Extra Attack', 'Attack twice when you take the Attack action.'],
      [8, 'Land\'s Stride', 'Move through nonmagical difficult terrain and plants freely.'],
      [10, 'Hide in Plain Sight', 'Camouflage yourself to become very hard to spot while still.'],
      [14, 'Vanish', 'Hide as a bonus action, and you can\'t be tracked by nonmagical means.'],
      [18, 'Feral Senses', 'Sense invisible creatures nearby and fight them without disadvantage.'],
      [20, 'Foe Slayer', 'Once per turn, add your Wisdom modifier to an attack or damage roll against a favored enemy.']
    ]
  };

  C.Rogue = {
    hd: 8, primary: 'Dexterity', saves: ['dex', 'int'],
    armor: 'Light armor', weapons: 'Simple weapons, hand crossbows, longswords, rapiers, shortswords', tools: 'Thieves\' tools',
    skills: { n: 4, from: ['Acrobatics', 'Athletics', 'Deception', 'Insight', 'Intimidation', 'Investigation', 'Perception', 'Performance', 'Persuasion', 'Sleight of Hand', 'Stealth'] },
    subclassLevel: 3, subclassLabel: 'Roguish Archetype', asi: [4, 8, 10, 12, 16, 19],
    subclasses: ['Thief', 'Assassin', 'Arcane Trickster', 'Inquisitive', 'Mastermind', 'Scout', 'Swashbuckler', 'Phantom', 'Soulknife'],
    features: [
      [1, 'Avarenth Magic', 'You have a small mana pool and a shadow-magic spell list. Bigger magic comes from tomes. See the Mana Guide.'],
      [1, 'Expertise', 'Double your proficiency bonus for two skills, or one skill and thieves\' tools (two more at 6th).'],
      [1, 'Sneak Attack', 'Once per turn, deal extra damage when you have advantage or an ally is next to your target. Starts at 1d6 and grows every odd level.'],
      [1, 'Thieves\' Cant', 'The secret signs and slang of thieves.'],
      [2, 'Cunning Action', 'Dash, Disengage or Hide as a bonus action.'],
      [3, 'Roguish Archetype', 'Choose your archetype.'],
      [5, 'Uncanny Dodge', 'Use your reaction to halve damage from an attack you can see.'],
      [7, 'Evasion', 'Take no damage on a successful Dexterity save against area effects, and half on a failure.'],
      [11, 'Reliable Talent', 'Treat any d20 roll of 9 or lower as a 10 on skills you\'re proficient in.'],
      [14, 'Blindsense', 'Sense hidden or invisible creatures within 10 feet.'],
      [15, 'Slippery Mind', 'Proficiency in Wisdom saving throws.'],
      [18, 'Elusive', 'No attack roll has advantage against you while you aren\'t incapacitated.'],
      [20, 'Stroke of Luck', 'Turn a miss into a hit or a failed check into a 20. Once per short or long rest.']
    ]
  };

  C.Sorcerer = {
    hd: 6, primary: 'Charisma', saves: ['con', 'cha'],
    armor: 'None', weapons: 'Daggers, darts, slings, quarterstaffs, light crossbows', tools: '',
    skills: { n: 2, from: ['Arcana', 'Deception', 'Insight', 'Intimidation', 'Persuasion', 'Religion'] },
    subclassLevel: 1, subclassLabel: 'Sorcerous Origin', asi: [4, 8, 12, 16, 19],
    subclasses: ['Draconic Bloodline', 'Wild Magic', 'Divine Soul', 'Shadow Magic', 'Storm Sorcery', 'Aberrant Mind', 'Clockwork Soul'],
    features: [
      [1, 'Spellcasting', 'You cast with mana. Charisma is your spellcasting ability. See the Mana Guide.'],
      [1, 'Sorcerous Origin', 'Choose where your magic comes from.'],
      [2, 'Font of Magic', 'Sorcery points equal to your sorcerer level fuel Metamagic. As a bonus action, trade 1 point for 5 mana or 5 mana for 1 point. You can\'t go over your max.'],
      [3, 'Metamagic', 'Twist your spells with sorcery points: farther, faster, twinned, quieter. Two options at 3rd, more at 10th and 17th.'],
      [20, 'Sorcerous Restoration', 'Regain 4 sorcery points on a short rest.']
    ]
  };

  C.Warlock = {
    hd: 8, primary: 'Charisma', saves: ['wis', 'cha'],
    armor: 'Light armor', weapons: 'Simple weapons', tools: '',
    skills: { n: 2, from: ['Arcana', 'Deception', 'History', 'Intimidation', 'Investigation', 'Nature', 'Religion'] },
    subclassLevel: 1, subclassLabel: 'Otherworldly Patron', asi: [4, 8, 12, 16, 19],
    subclasses: ['The Archfey', 'The Fiend', 'The Great Old One', 'The Celestial', 'The Hexblade', 'The Fathomless', 'The Genie', 'The Undead'],
    features: [
      [1, 'Otherworldly Patron', 'Choose the being you made your pact with.'],
      [1, 'Pact Magic', 'You cast with mana. Charisma is your spellcasting ability. See the Mana Guide.'],
      [2, 'Eldritch Invocations', 'Learn invocations, small permanent magical gifts from your patron. More as you level.'],
      [3, 'Pact Boon', 'Choose a gift: a pact weapon, a familiar, a book of shadows or a talisman.'],
      [11, 'Mystic Arcanum', 'Your patron is your tome: you learn one 6th-level spell without finding it (a 7th at 13th, an 8th at 15th, a 9th at 17th). You still need a High Magic Charge or Reality Channel to cast it. Every gift is a debt your patron will call in, and leaves a mark on you that grows with each one.'],
      [13, 'Mystic Arcanum', 'Your patron grants a 7th-level spell. Another debt, and the mark grows.'],
      [15, 'Mystic Arcanum', 'Your patron grants an 8th-level spell. Another debt, and the mark grows.'],
      [17, 'Mystic Arcanum', 'Your patron grants a 9th-level spell. Another debt, and by now people can tell what you are.'],
      [20, 'Eldritch Master', 'Once per long rest, spend a minute pleading with your patron to regain half your max mana.']
    ]
  };

  C.Wizard = {
    hd: 6, primary: 'Intelligence', saves: ['int', 'wis'],
    armor: 'None', weapons: 'Daggers, darts, slings, quarterstaffs, light crossbows', tools: '',
    skills: { n: 2, from: ['Arcana', 'History', 'Insight', 'Investigation', 'Medicine', 'Religion'] },
    subclassLevel: 2, subclassLabel: 'Arcane Tradition', asi: [4, 8, 12, 16, 19],
    subclasses: ['School of Abjuration', 'School of Conjuration', 'School of Divination', 'School of Enchantment', 'School of Evocation', 'School of Illusion', 'School of Necromancy', 'School of Transmutation', 'Bladesinging', 'War Magic', 'Chronurgy Magic', 'Graviturgy Magic', 'Order of Scribes'],
    features: [
      [1, 'Spellcasting', 'You cast with mana. Intelligence is your spellcasting ability. You can copy compatible spells from tomes into your spellbook. See the Mana Guide.'],
      [1, 'Arcane Recovery', 'Once per day after a short rest, regain mana equal to 5 × your wizard level.'],
      [2, 'Arcane Tradition', 'Choose your school.'],
      [18, 'Spell Mastery', 'Pick one 1st-level and one 2nd-level spell you know. They cost you no mana.'],
      [20, 'Signature Spells', 'Pick two 3rd-level spells you know. Each can be cast once per short rest without spending mana.']
    ]
  };

  // Subclass feature levels (the features themselves depend on the subclass).
  var SUB_LEVELS = { Barbarian: [3, 6, 10, 14], Bard: [3, 6, 14], Cleric: [1, 2, 6, 8, 17], Druid: [2, 6, 10, 14], Fighter: [3, 7, 10, 15, 18],
    Monk: [3, 6, 11, 17], Paladin: [3, 7, 15, 20], Ranger: [3, 7, 11, 15], Rogue: [3, 9, 13, 17], Sorcerer: [1, 6, 14, 18], Warlock: [1, 6, 10, 14], Wizard: [2, 6, 10, 14] };

  // Avarenth magic, from the Mana Guide.
  var MAGIC = {
    manaCost: [0, 5, 10, 18, 28, 40, 60, 85, 110, 150],
    mana: { Wizard: [25, 15], Sorcerer: [35, 17], Cleric: [25, 14], Druid: [25, 14], Bard: [30, 13], Warlock: [30, 12], Paladin: [20, 9], Ranger: [20, 9], Monk: [20, 8], Fighter: [15, 7], Rogue: [15, 6], Barbarian: [10, 6] },
    // Levels at which each High Magic Charge is gained, and when the Reality Channel arrives (0 = never).
    charges: { Wizard: [[11, 13, 15, 17, 19], 17], Sorcerer: [[11, 13, 15, 17, 19], 17], Cleric: [[11, 13, 15, 19], 17], Druid: [[11, 13, 15, 19], 17],
      Bard: [[11, 15, 19], 19], Warlock: [[11, 15, 19], 19], Paladin: [[15, 19], 0], Ranger: [[15, 19], 0], Monk: [[17], 0], Fighter: [[19], 0], Rogue: [[19], 0], Barbarian: [[], 0] },
    fullCasters: ['Wizard', 'Sorcerer', 'Cleric', 'Druid', 'Bard', 'Warlock'],
    learnLevel: [1, 1, 3, 5, 7, 9, 11, 13, 15, 17],          // character level needed for each spell level
    learnCost: [5, 10, 25, 50, 100, 200, 400, 750, 1250, 2500], // gp
    studyHours: [0.5, 1, 2, 3, 4, 5, 6, 7, 8, 9],
    spellAbility: { Wizard: 'int', Sorcerer: 'cha', Cleric: 'wis', Druid: 'wis', Bard: 'cha', Warlock: 'cha', Paladin: 'cha', Ranger: 'wis', Monk: 'wis', Fighter: 'int', Rogue: 'int', Barbarian: 'wis' },
    // Starting spell picks from the class list, and free picks gained at later levels.
    // A DM-tunable default: Avarenth's class spells are learned at levels 1, 3 and 5+.
    startPicks: { full: [3, 2], half: [2, 2], martial: [1, 1] },
    freePickLevels: [3, 5, 7, 9, 11, 13, 15, 17, 19],
    arcanum: { 11: 6, 13: 7, 15: 8, 17: 9 },   // warlock level -> spell level the patron grants
    secrets: { 10: 2, 14: 2, 18: 2 }          // bard level -> Magical Secrets picks
  };

  var SPECIES = {
    'Human': { speed: 30, size: 'Medium', traits: [['Versatile', 'Humans make up most of the empire. Gain an extra skill proficiency of your choice.']], extraSkill: 1 },
    'Dwarf': { speed: 25, size: 'Medium', dark: 60, traits: [['Dwarven Resilience', 'Advantage on saves against poison, and resistance to poison damage.'], ['Stonecunning', 'Expert eye for stonework and its history.'], ['Heavy Armor Stride', 'Heavy armor doesn\'t slow you down.']] },
    'Elf': { speed: 30, size: 'Medium', dark: 60, traits: [['Keen Senses', 'Proficiency in Perception.'], ['Fey Ancestry', 'Advantage against being charmed; magic can\'t put you to sleep.'], ['Trance', 'You meditate for 4 hours instead of sleeping.']], skill: 'Perception' },
    'Halfling': { speed: 25, size: 'Small', traits: [['Lucky', 'Reroll a natural 1 on an attack, check or save.'], ['Brave', 'Advantage on saves against being frightened.'], ['Nimble', 'Move through the space of larger creatures.']] },
    'Dragonborn': { speed: 30, size: 'Medium', traits: [['Draconic Ancestry', 'Pick a dragon color; it sets your breath weapon and damage resistance.'], ['Breath Weapon', 'Exhale destructive energy in a cone or line. Recharges on a short or long rest.'], ['Damage Resistance', 'Resistance to your ancestry\'s damage type.']] },
    'Kobold': { speed: 30, size: 'Small', dark: 60, traits: [['Draconic Cry', 'As a bonus action, give allies advantage against nearby enemies until your next turn.'], ['Kobold Legacy', 'A small draconic gift: a skill, a cantrip or a resistance.']] },
    'Lizardfolk': { speed: 30, size: 'Medium', traits: [['Bite', 'Your bite is a natural weapon.'], ['Hold Breath', 'Hold your breath for 15 minutes.'], ['Natural Armor', 'Without armor, your AC is 13 + Dexterity.'], ['Hungry Jaws', 'Bite to gain temporary hit points. Once per short or long rest.']] },
    'Gnome': { speed: 25, size: 'Small', dark: 60, traits: [['Gnome Cunning', 'Advantage on Intelligence, Wisdom and Charisma saves against magic.']] },
    'Half-Elf': { speed: 30, size: 'Medium', dark: 60, traits: [['Fey Ancestry', 'Advantage against being charmed; magic can\'t put you to sleep.'], ['Skill Versatility', 'Proficiency in two skills of your choice.']], extraSkill: 2 },
    'Half-Orc': { speed: 30, size: 'Medium', dark: 60, traits: [['Relentless Endurance', 'Drop to 1 hit point instead of 0, once per long rest.'], ['Savage Attacks', 'Roll one extra weapon die on melee critical hits.']], skill: 'Intimidation' },
    'Orc': { speed: 30, size: 'Medium', dark: 60, traits: [['Adrenaline Rush', 'Dash as a bonus action and gain temporary hit points.'], ['Powerful Build', 'Count as one size larger for carrying and pushing.'], ['Relentless Endurance', 'Drop to 1 hit point instead of 0, once per long rest.']] },
    'Goliath': { speed: 30, size: 'Medium', traits: [['Stone\'s Endurance', 'Use your reaction to reduce damage you take. Once per short or long rest.'], ['Powerful Build', 'Count as one size larger for carrying and pushing.'], ['Mountain Born', 'Resistance to cold damage, and at home at high altitude.']], skill: 'Athletics' },
    'Tiefling': { speed: 30, size: 'Medium', dark: 60, traits: [['Hellish Resistance', 'Resistance to fire damage.'], ['Infernal Legacy', 'A few spells from your fiendish blood.']] }
  };

  var BACKGROUNDS = {
    'Acolyte': ['Insight', 'Religion'], 'Charlatan': ['Deception', 'Sleight of Hand'], 'Criminal': ['Deception', 'Stealth'],
    'Entertainer': ['Acrobatics', 'Performance'], 'Folk Hero': ['Animal Handling', 'Survival'], 'Guild Artisan': ['Insight', 'Persuasion'],
    'Hermit': ['Medicine', 'Religion'], 'Noble': ['History', 'Persuasion'], 'Outlander': ['Athletics', 'Survival'],
    'Sage': ['Arcana', 'History'], 'Sailor': ['Athletics', 'Perception'], 'Soldier': ['Athletics', 'Intimidation'], 'Urchin': ['Sleight of Hand', 'Stealth']
  };

  window.AVARENTH_RULES = { classes: C, subLevels: SUB_LEVELS, magic: MAGIC, species: SPECIES, backgrounds: BACKGROUNDS,
    standardArray: [15, 14, 13, 12, 10, 8], pointBuyCost: { 8: 0, 9: 1, 10: 2, 11: 3, 12: 4, 13: 5, 14: 7, 15: 9 }, pointBuyBudget: 27,
    coins: { cp: 'Copper Foxes', sp: 'Silver Stags', gp: 'Golden Eagles' } };
})();
