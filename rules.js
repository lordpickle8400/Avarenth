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

  // The two classes from outside the Player's Handbook (summaries in our own words). Their mana numbers are DM's calls.
  C.Artificer = {
    hd: 8, primary: 'Intelligence', saves: ['con', 'int'], book: 'Tasha\'s Cauldron of Everything',
    armor: 'Light and medium armor, shields', weapons: 'Simple weapons', tools: 'Thieves\' tools, tinker\'s tools, one artisan\'s tool',
    skills: { n: 2, from: ['Arcana', 'History', 'Investigation', 'Medicine', 'Nature', 'Perception', 'Sleight of Hand'] },
    subclassLevel: 3, subclassLabel: 'Artificer Specialist', asi: [4, 8, 12, 16, 19],
    subclasses: ['Alchemist', 'Armorer', 'Artillerist', 'Battle Smith'],
    about: 'Inventors who channel magic through tools and objects.',
    features: [
      [1, 'Magical Tinkering', 'Put a small magical property into a tiny object: light, a recorded message, a smell or sound, or a moving image. A number at once equal to your Intelligence modifier.'],
      [1, 'Spellcasting', 'You cast with mana, through tools: you must hold thieves\' tools, an artisan\'s tool or an infused item as your focus. Intelligence is your spellcasting ability. See the Mana Guide.'],
      [2, 'Infuse Item', 'After a long rest, turn ordinary objects into magic items with infusions (for example a +1 weapon, armor that boosts your AC, a bag of holding, goggles of night). You know four infusions at 2nd level and can keep two active, more as you level.'],
      [3, 'Artificer Specialist', 'Choose your specialty.'],
      [3, 'The Right Tool for the Job', 'Spend an hour to make one set of artisan\'s tools out of nothing.'],
      [6, 'Tool Expertise', 'Double your proficiency bonus with any tool you\'re proficient with.'],
      [7, 'Flash of Genius', 'As a reaction, add your Intelligence modifier to an ability check or save made by you or a creature you can see within 30 feet. Uses equal to your Intelligence modifier per long rest.'],
      [10, 'Magic Item Adept', 'Attune to up to four magic items, and craft common or uncommon magic items in a quarter of the time for half the gold.'],
      [11, 'Spell-Storing Item', 'After a long rest, store a 1st or 2nd-level spell you know in a weapon or focus. Anyone holding it can cast the stored spell a number of times equal to twice your Intelligence modifier, using your spellcasting modifier, without spending mana.'],
      [14, 'Magic Item Savant', 'Attune to up to five magic items, and ignore all class, species, spell and level requirements for using them.'],
      [18, 'Magic Item Master', 'Attune to up to six magic items.'],
      [20, 'Soul of Artifice', '+1 to all saving throws for each magic item you\'re attuned to. When you drop to 0 hit points, you can end one of your infusions to drop to 1 hit point instead.']
    ]
  };

  C['Blood Hunter'] = {
    hd: 10, primary: 'Strength or Dexterity, and Intelligence', saves: ['dex', 'int'], book: 'Blood Hunter (Matthew Mercer, 2020)',
    armor: 'Light and medium armor, shields', weapons: 'Simple and martial weapons', tools: 'Alchemist\'s supplies',
    skills: { n: 3, from: ['Acrobatics', 'Arcana', 'Athletics', 'History', 'Insight', 'Investigation', 'Religion', 'Survival'] },
    subclassLevel: 3, subclassLabel: 'Blood Hunter Order', asi: [4, 8, 12, 16, 19],
    subclasses: ['Order of the Ghostslayer', 'Order of the Lycan', 'Order of the Mutant', 'Order of the Profane Soul'],
    about: 'Hunters who use forbidden blood magic (hemocraft), paying in their own health to fight monsters.',
    features: [
      [1, 'Hunter\'s Bane', 'Advantage on Wisdom (Survival) checks to track fey, fiends or undead, and on Intelligence checks to recall lore about them.'],
      [1, 'Blood Maledict', 'Learn a blood curse and use it as a bonus action or reaction. You can amplify it by taking damage equal to one roll of your hemocraft die. One use per short or long rest (two at 6th, three at 13th, four at 17th). More curses as you level.'],
      [1, 'Hemocraft Die', 'Your blood magic rolls a d4, growing to d6 at 5th, d8 at 11th and d10 at 17th. Your hemocraft ability is Intelligence or Wisdom (your choice).'],
      [2, 'Fighting Style', 'Pick a fighting specialty: Archery, Dueling, Great Weapon Fighting or Two-Weapon Fighting.'],
      [2, 'Crimson Rite', 'As a bonus action, take damage equal to one roll of your hemocraft die to coat your weapon in an elemental rite (flame, frozen or storm; more at higher levels). Until your next rest your hits with it deal an extra hemocraft die of that damage.'],
      [3, 'Blood Hunter Order', 'Choose your order.'],
      [5, 'Extra Attack', 'Attack twice when you take the Attack action.'],
      [6, 'Brand of Castigation', 'When you hit with a Crimson Rite weapon, you can brand the creature: you always know where it is, and it takes psychic damage when it damages you.'],
      [9, 'Grim Psychometry', 'Advantage on Intelligence (History) checks about the dark past of an object or place you touch.'],
      [10, 'Dark Augmentation', 'Your speed rises by 5 feet, and you add your hemocraft modifier to Strength, Dexterity and Constitution saves.'],
      [13, 'Brand of Tethering', 'A branded creature takes psychic damage if it tries to flee you, and can\'t teleport or leave the plane.'],
      [14, 'Hardened Soul', 'Advantage on saves against being charmed or frightened.'],
      [20, 'Sanguine Mastery', 'Once per turn, reroll a hemocraft die and use either roll. When you score a critical hit with a Crimson Rite weapon, you regain one use of Blood Maledict.']
    ]
  };

  // Subclass feature levels (the features themselves depend on the subclass).
  var SUB_LEVELS = { Artificer: [3, 5, 9, 15], 'Blood Hunter': [3, 7, 11, 15, 18], Barbarian: [3, 6, 10, 14], Bard: [3, 6, 14], Cleric: [1, 2, 6, 8, 17], Druid: [2, 6, 10, 14], Fighter: [3, 7, 10, 15, 18],
    Monk: [3, 6, 11, 17], Paladin: [3, 7, 15, 20], Ranger: [3, 7, 11, 15], Rogue: [3, 9, 13, 17], Sorcerer: [1, 6, 14, 18], Warlock: [1, 6, 10, 14], Wizard: [2, 6, 10, 14] };

  // Avarenth magic, from the Mana Guide.
  var MAGIC = {
    manaCost: [0, 5, 10, 18, 28, 40, 60, 85, 110, 150],
    mana: { Wizard: [25, 15], Sorcerer: [35, 17], Cleric: [25, 14], Druid: [25, 14], Bard: [30, 13], Warlock: [30, 12], Paladin: [20, 9], Ranger: [20, 9], Monk: [20, 8], Fighter: [15, 7], Rogue: [15, 6], Barbarian: [10, 6], Artificer: [20, 9], 'Blood Hunter': [15, 7] },
    // Levels at which each High Magic Charge is gained, and when the Reality Channel arrives (0 = never).
    charges: { Wizard: [[11, 13, 15, 17, 19], 17], Sorcerer: [[11, 13, 15, 17, 19], 17], Cleric: [[11, 13, 15, 19], 17], Druid: [[11, 13, 15, 19], 17],
      Bard: [[11, 15, 19], 19], Warlock: [[11, 15, 19], 19], Paladin: [[15, 19], 0], Ranger: [[15, 19], 0], Monk: [[17], 0], Fighter: [[19], 0], Rogue: [[19], 0], Barbarian: [[], 0], Artificer: [[15, 19], 0], 'Blood Hunter': [[19], 0] },
    fullCasters: ['Wizard', 'Sorcerer', 'Cleric', 'Druid', 'Bard', 'Warlock'],
    learnLevel: [1, 1, 3, 5, 7, 9, 11, 13, 15, 17],          // character level needed for each spell level
    learnCost: [5, 10, 25, 50, 100, 200, 400, 750, 1250, 2500], // gp
    studyHours: [0.5, 1, 2, 3, 4, 5, 6, 7, 8, 9],
    spellAbility: { Wizard: 'int', Sorcerer: 'cha', Cleric: 'wis', Druid: 'wis', Bard: 'cha', Warlock: 'cha', Paladin: 'cha', Ranger: 'wis', Monk: 'wis', Fighter: 'int', Rogue: 'int', Barbarian: 'wis', Artificer: 'int', 'Blood Hunter': 'int' },
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
    'Tiefling': { speed: 30, size: 'Medium', dark: 60, traits: [['Hellish Resistance', 'Resistance to fire damage.'], ['Infernal Legacy', 'A few spells from your fiendish blood.']] },

    // More peoples (summaries in our own words, after the later 5e books). group: 'isles' lives in Avarenth, 'rare' is seldom
    // seen, 'far' comes from beyond the empire. Ask the DM before playing a 'far' one. Innate spells cast without mana.
    'Sea Elf': { group: 'isles', speed: 30, swim: 30, size: 'Medium', dark: 60, skill: 'Perception', note: 'Most sea elves in the isles come from the city-state of Coralyn, and many keep faith with Thorum.', traits: [['Child of the Sea', 'Swim speed 30 ft, and you breathe air and water.'], ['Friend of the Sea', 'Speak simple ideas with sea beasts.'], ['Keen Senses', 'Proficiency in Perception.'], ['Fey Ancestry', 'Advantage against being charmed; magic can\'t put you to sleep.'], ['Trance', 'You meditate for 4 hours instead of sleeping.']] },
    'Drow': { group: 'isles', speed: 30, size: 'Medium', dark: 120, skill: 'Perception', note: 'The dark elves of the deep places. Surface folk distrust them on sight.', traits: [['Superior Darkvision', 'See 120 ft in darkness.'], ['Drow Magic', 'Dancing Lights at will; Faerie Fire at 3rd level and Darkness at 5th, each once per long rest without mana.'], ['Keen Senses', 'Proficiency in Perception.'], ['Fey Ancestry', 'Advantage against being charmed; magic can\'t put you to sleep.'], ['Trance', 'You meditate for 4 hours instead of sleeping.']] },
    'Tortle': { group: 'isles', speed: 30, size: 'Medium', note: 'Tortles trade and keep shop along the Golden Coast.', traits: [['Natural Armor', 'Your shell gives AC 17. You can\'t wear armor, but a shield still adds.'], ['Shell Defense', 'Withdraw into your shell for +4 AC and advantage on Str and Con saves, but you\'re prone and can\'t move or act much until you come out.'], ['Claws', 'Natural weapon dealing 1d6 slashing.'], ['Hold Breath', 'Hold your breath for an hour.'], ['Nature\'s Intuition', 'Proficiency in one of Animal Handling, Medicine, Nature, Perception, Stealth or Survival.']], extraSkill: 1 },
    'Troglodyte': { group: 'isles', speed: 30, size: 'Medium', dark: 60, note: 'Avarenth\'s own: a draconic people from the deep enclaves of the Greywalls. Many work the dwarves\' mines. The DM may tune these traits.', traits: [['Stone Skin', 'Without armor, your AC is 12 + Dexterity.'], ['Chameleon Skin', 'Advantage on Stealth checks to hide in rocky terrain.'], ['Stench', 'Bonus action: creatures of your choice within 5 ft make a Con save or have disadvantage on attacks until your next turn. Once per short or long rest.'], ['Bite and Claws', 'Natural weapons dealing 1d6 piercing.'], ['Sunlight Sensitivity', 'Disadvantage on sight-based Perception and on attacks in direct sunlight.']] },
    'Aasimar': { group: 'rare', speed: 30, size: 'Medium', dark: 60, note: 'Folk touched by the light of the gods. In the isles they are often taken for saints.', traits: [['Celestial Resistance', 'Resistance to necrotic and radiant damage.'], ['Healing Hands', 'Touch a creature to heal it by a d4 per proficiency bonus. Once per long rest.'], ['Light Bearer', 'You know the Light cantrip.'], ['Celestial Revelation', 'From 3rd level, transform for a minute once per long rest: radiant wings to fly, a searing aura, or a frightening shroud, each adding radiant or necrotic damage.']] },
    'Firbolg': { group: 'rare', speed: 30, size: 'Medium', note: 'Gentle forest giants-kin who keep to the deep woods.', traits: [['Firbolg Magic', 'Detect Magic and Disguise Self once each per long rest without mana.'], ['Hidden Step', 'Bonus action: turn invisible until your next turn. Uses equal to proficiency bonus per long rest.'], ['Powerful Build', 'Count as one size larger for carrying and pushing.'], ['Speech of Beast and Leaf', 'Beasts and plants understand the gist of what you say.']] },
    'Goblin': { group: 'rare', speed: 30, size: 'Small', dark: 60, traits: [['Fury of the Small', 'Once per turn, add your proficiency bonus to damage against a creature larger than you. Uses equal to proficiency bonus per long rest.'], ['Nimble Escape', 'Disengage or Hide as a bonus action.'], ['Fey Ancestry', 'Advantage against being charmed.']] },
    'Hobgoblin': { group: 'rare', speed: 30, size: 'Medium', dark: 60, traits: [['Fortune from the Many', 'When you miss or fail, add a bonus equal to the number of allies you can see (up to 3). Uses equal to proficiency bonus per long rest.'], ['Fey Gift', 'Help as a bonus action, and the help comes with a small boon. Uses equal to proficiency bonus per long rest.'], ['Fey Ancestry', 'Advantage against being charmed.']] },
    'Bugbear': { group: 'rare', speed: 30, size: 'Medium', dark: 60, skill: 'Stealth', traits: [['Long-Limbed', 'Your melee reach is 5 ft longer on your turn.'], ['Surprise Attack', 'Hitting a creature that hasn\'t acted yet in combat deals an extra 2d6.'], ['Powerful Build', 'Count as one size larger for carrying and pushing; squeeze through Small spaces.'], ['Sneaky', 'Proficiency in Stealth.'], ['Fey Ancestry', 'Advantage against being charmed.']] },
    'Kenku': { group: 'rare', speed: 30, size: 'Medium', traits: [['Expert Duplication', 'Advantage when copying writing or craftwork.'], ['Kenku Recall', 'Proficiency in two skills, and advantage on a check with a skill you know, a few times per long rest.'], ['Mimicry', 'Imitate sounds and voices you\'ve heard.']], extraSkill: 2 },
    'Tabaxi': { group: 'far', speed: 30, climb: 30, size: 'Medium', dark: 60, traits: [['Cat\'s Claws', 'Climb speed equal to your walking speed, and claws deal 1d6 slashing.'], ['Cat\'s Talent', 'Proficiency in Perception and Stealth.'], ['Feline Agility', 'Double your speed for a turn; it recharges when you don\'t move for a turn.']], skill: 'Perception', extraSkill: 1 },
    'Triton': { group: 'rare', speed: 30, swim: 30, size: 'Medium', dark: 60, note: 'Guardians of the deep water. Sailors swear they have seen them off the Quilted Sea.', traits: [['Amphibious', 'Breathe air and water; swim speed 30 ft.'], ['Control Air and Water', 'Fog Cloud; Gust of Wind at 3rd; Water Walk at 5th, each once per long rest without mana.'], ['Emissary of the Sea', 'Speak simple ideas with water-breathing creatures.'], ['Guardian of the Depths', 'Resistance to cold damage, and no penalty from deep water.']] },
    'Air Genasi': { group: 'far', speed: 35, size: 'Medium', dark: 60, traits: [['Unending Breath', 'Hold your breath as long as you like.'], ['Lightning Resistance', 'Resistance to lightning damage.'], ['Mingle with the Wind', 'Shocking Grasp; Feather Fall at 3rd; Levitate at 5th, each once per long rest without mana.']] },
    'Earth Genasi': { group: 'far', speed: 30, size: 'Medium', dark: 60, traits: [['Earth Walk', 'Difficult terrain of earth or stone doesn\'t slow you.'], ['Merge with Stone', 'Blade Ward as a bonus action a few times per long rest; Pass without Trace at 5th, once per long rest without mana.']] },
    'Fire Genasi': { group: 'far', speed: 30, size: 'Medium', dark: 60, traits: [['Fire Resistance', 'Resistance to fire damage.'], ['Reach to the Blaze', 'Produce Flame; Burning Hands at 3rd; Flame Blade at 5th, each once per long rest without mana.']] },
    'Water Genasi': { group: 'far', speed: 30, swim: 30, size: 'Medium', dark: 60, traits: [['Acid Resistance', 'Resistance to acid damage.'], ['Amphibious', 'Breathe air and water; swim speed 30 ft.'], ['Call to the Wave', 'Acid Splash; Create or Destroy Water at 3rd; Water Walk at 5th, each once per long rest without mana.']] },
    'Changeling': { group: 'rare', speed: 30, size: 'Medium', traits: [['Shapechanger', 'Change your appearance and voice at will.'], ['Changeling Instincts', 'Proficiency in two of Deception, Insight, Intimidation, Performance or Persuasion.']], extraSkill: 2 },
    'Shifter': { group: 'rare', speed: 30, size: 'Medium', dark: 60, traits: [['Bestial Instincts', 'Proficiency in one of Acrobatics, Athletics, Intimidation or Survival.'], ['Shifting', 'Bonus action: take on a bestial aspect for a minute with temporary HP and a gift by type (beasthide, longtooth, swiftstride or wildhunt). Uses equal to proficiency bonus per long rest.']], extraSkill: 1 },
    'Satyr': { group: 'far', speed: 35, size: 'Medium', traits: [['Fey', 'Your creature type is fey.'], ['Ram', 'Headbutt for 1d6 bludgeoning.'], ['Magic Resistance', 'Advantage on saves against spells.'], ['Mirthful Leaps', 'Add a d8 to long and high jumps.'], ['Reveler', 'Proficiency in Performance and Persuasion, and one instrument.']], skill: 'Performance', extraSkill: 1 },
    'Fairy': { group: 'far', speed: 30, fly: 30, size: 'Small', traits: [['Fey', 'Your creature type is fey.'], ['Flight', 'Fly at your walking speed, but not in medium or heavy armor.'], ['Fairy Magic', 'Druidcraft; Faerie Fire at 3rd; Enlarge/Reduce at 5th, each once per long rest without mana.']] },
    'Harengon': { group: 'far', speed: 30, size: 'Medium', skill: 'Perception', traits: [['Hare-Trigger', 'Add your proficiency bonus to initiative.'], ['Leporine Senses', 'Proficiency in Perception.'], ['Lucky Footwork', 'Reaction: add a d4 to a failed Dex save.'], ['Rabbit Hop', 'Bonus action: jump a few squares without provoking. Uses equal to proficiency bonus per long rest.']] },
    'Owlin': { group: 'far', speed: 30, fly: 30, size: 'Medium', dark: 120, skill: 'Stealth', traits: [['Flight', 'Fly at your walking speed, but not in medium or heavy armor.'], ['Silent Feathers', 'Proficiency in Stealth.'], ['Darkvision', 'See 120 ft in darkness.']] },
    'Centaur': { group: 'far', speed: 40, size: 'Medium', traits: [['Fey', 'Your creature type is fey.'], ['Charge', 'After moving 30 ft straight, a melee hit lets you add a hoof attack.'], ['Equine Build', 'Count as one size larger for carrying; climbing is harder.'], ['Hooves', 'Natural weapon dealing 1d6 bludgeoning.'], ['Natural Affinity', 'Proficiency in one of Animal Handling, Medicine, Nature or Survival.']], extraSkill: 1 },
    'Minotaur': { group: 'far', speed: 30, size: 'Medium', traits: [['Horns', 'Natural weapon dealing 1d6 piercing.'], ['Goring Rush', 'After you Dash and move 20 ft, gore as a bonus action.'], ['Hammering Horns', 'After you hit, shove with your horns as a bonus action.'], ['Labyrinthine Recall', 'You always know north, and advantage on Survival to navigate or track.']] },
    'Loxodon': { group: 'far', speed: 30, size: 'Medium', traits: [['Loxodon Serenity', 'Advantage on saves against being charmed or frightened.'], ['Natural Armor', 'Without armor, your AC is 12 + Constitution.'], ['Trunk', 'A trunk that grasps, lifts and snorkels.'], ['Keen Smell', 'Advantage on Perception, Investigation and Survival that use smell.'], ['Powerful Build', 'Count as one size larger for carrying and pushing.']] },
    'Leonin': { group: 'far', speed: 35, size: 'Medium', dark: 60, traits: [['Claws', 'Natural weapon dealing 1d4 slashing.'], ['Hunter\'s Instincts', 'Proficiency in one of Athletics, Intimidation, Perception or Survival.'], ['Daunting Roar', 'Bonus action: frighten nearby creatures (Wis save). Once per short or long rest.']], extraSkill: 1 },
    'Vedalken': { group: 'far', speed: 30, size: 'Medium', traits: [['Vedalken Dispassion', 'Advantage on Int, Wis and Cha saves.'], ['Tireless Precision', 'Proficiency in one tool and one skill, plus a d4 to checks with them.'], ['Partially Amphibious', 'Breathe underwater for an hour, once per long rest.']], extraSkill: 1 },
    'Aarakocra': { group: 'far', speed: 30, fly: 30, size: 'Medium', traits: [['Flight', 'Fly at your walking speed, but not in medium or heavy armor.'], ['Talons', 'Natural weapon dealing 1d6 slashing.'], ['Wind Caller', 'Gust of Wind once per long rest at 3rd level, without mana.']] },
    'Githyanki': { group: 'far', speed: 30, size: 'Medium', traits: [['Astral Knowledge', 'After a long rest, gain proficiency in one skill and one weapon or tool until the next.'], ['Githyanki Psionics', 'Mage Hand (invisible); Jump at 3rd; Misty Step at 5th, each once per long rest without mana.'], ['Psychic Resilience', 'Resistance to psychic damage.']] },
    'Githzerai': { group: 'far', speed: 30, size: 'Medium', traits: [['Githzerai Psionics', 'Mage Hand (invisible); Shield at 3rd; Detect Thoughts at 5th, each once per long rest without mana.'], ['Mental Discipline', 'Advantage on saves against being charmed or frightened.'], ['Psychic Resilience', 'Resistance to psychic damage.']] },
    'Duergar': { group: 'isles', speed: 30, size: 'Medium', dark: 120, note: 'Grey dwarves of the deep, cousins the Anvilborn would rather not talk about.', traits: [['Duergar Magic', 'Enlarge/Reduce (enlarge only) at 3rd and Invisibility at 5th, each once per long rest without mana.'], ['Dwarven Resilience', 'Advantage on saves against poison, and resistance to poison damage.'], ['Psionic Fortitude', 'Advantage on saves against being charmed or stunned.'], ['Superior Darkvision', 'See 120 ft in darkness.']] },
    'Deep Gnome': { group: 'isles', speed: 30, size: 'Small', dark: 120, traits: [['Gift of the Svirfneblin', 'Disguise Self at 3rd and Nondetection at 5th, each once per long rest without mana.'], ['Gnomish Magic Resistance', 'Advantage on Int, Wis and Cha saves against spells.'], ['Svirfneblin Camouflage', 'Advantage on Stealth checks a few times per long rest.'], ['Superior Darkvision', 'See 120 ft in darkness.']] },
    'Shadar-kai': { group: 'rare', speed: 30, size: 'Medium', dark: 60, skill: 'Perception', traits: [['Blessing of the Raven Queen', 'Teleport 30 ft as a bonus action, gaining resistance to all damage until your next turn from 3rd level. Uses equal to proficiency bonus per long rest.'], ['Necrotic Resistance', 'Resistance to necrotic damage.'], ['Keen Senses', 'Proficiency in Perception.'], ['Fey Ancestry', 'Advantage against being charmed; magic can\'t put you to sleep.'], ['Trance', 'You meditate for 4 hours instead of sleeping.']] },
    'Eladrin': { group: 'rare', speed: 30, size: 'Medium', dark: 60, skill: 'Perception', traits: [['Fey Step', 'Teleport 30 ft as a bonus action, with a seasonal extra effect from 3rd level. Uses equal to proficiency bonus per long rest.'], ['Keen Senses', 'Proficiency in Perception.'], ['Fey Ancestry', 'Advantage against being charmed; magic can\'t put you to sleep.'], ['Trance', 'You meditate for 4 hours instead of sleeping.']] },
    'Yuan-ti': { group: 'far', speed: 30, size: 'Medium', dark: 60, traits: [['Magic Resistance', 'Advantage on saves against spells.'], ['Poison Resilience', 'Advantage against being poisoned, and resistance to poison damage.'], ['Serpentine Spellcasting', 'Poison Spray and Animal Friendship (snakes) at will; Suggestion at 3rd, once per long rest without mana.']] },
    'Kalashtar': { group: 'far', speed: 30, size: 'Medium', traits: [['Dual Mind', 'Advantage on Wisdom saves.'], ['Mental Discipline', 'Resistance to psychic damage.'], ['Mind Link', 'Speak telepathically to a creature you can see.'], ['Severed from Dreams', 'Immune to magic that needs you to dream.']] },
    'Warforged': { group: 'rare', speed: 30, size: 'Medium', note: 'Clockwork people built for the Draconic Wars, each running on a persona core made in the Draconic Imperium. A player warforged is always one of these war-era warforged. Nobody has settled whether a warforged is a person or property.', traits: [['War-era Persona Core', 'Your mind runs on a persona core made in the Draconic Imperium, with years of experience behind it. You get flashbacks of the Draconic Wars; the DM decides when they come and what they show. Advantage on Intelligence (History) checks about the Draconic Imperium and the Draconic Wars.'], ['Clockwork', 'In Avarenth you count as clockwork, but with deeper, mystical magic than any helper or commissioned warrior.'], ['Constructed Resilience', 'Advantage on saves against being poisoned and resistance to poison damage. You can\'t catch diseases, you don\'t need to eat, drink or breathe, and magic can\'t put you to sleep.'], ['Sentry\'s Rest', 'Your long rest is six hours standing still and quiet. You can\'t act during it, but you stay fully aware of what\'s around you.'], ['Integrated Protection', 'Armour plates are part of your body: +1 AC (the sheet adds it). Armour you\'re proficient with fits onto your body, takes an hour to put on or off, and can\'t be pulled off you against your will while you live.'], ['Specialized Design', 'You were built for a job: proficiency in one skill and one tool of your choice.']], extraSkill: 1 },
    'Dhampir': { group: 'rare', speed: 35, climb: 35, size: 'Medium', dark: 60, note: 'Half-living, touched by vampirism. Hide it in Doresmere.', traits: [['Ancestral Legacy', 'Keep two skills of another species, or gain two of your choice.'], ['Deathless Nature', 'You don\'t need to breathe.'], ['Spider Climb', 'Climb walls, and ceilings from 3rd level.'], ['Vampiric Bite', 'A bite that heals you or boosts your next roll when it hits. Uses equal to proficiency bonus per long rest.']], extraSkill: 2 },
    'Hexblood': { group: 'rare', speed: 30, size: 'Medium', dark: 60, traits: [['Fey', 'Your creature type is fey.'], ['Eerie Token', 'Pull a lock of hair or nail to make a token you can see and hear through.'], ['Hex Magic', 'Disguise Self and Hex once each per long rest without mana.']] },
    'Reborn': { group: 'rare', speed: 30, size: 'Medium', dark: 60, traits: [['Deathless Nature', 'No need to eat, drink or breathe; advantage on death saves and against disease and poison; resistance to poison.'], ['Knowledge from a Past Life', 'Add a d6 to a skill check. Uses equal to proficiency bonus per long rest.']] },
    'Grung': { group: 'far', speed: 25, climb: 25, size: 'Small', traits: [['Arboreal Alertness', 'Proficiency in Perception, and a climb speed.'], ['Poisonous Skin', 'Creatures that grapple or touch you are poisoned (Con save).'], ['Standing Leap', 'Long jump 25 ft and high jump 15 ft.'], ['Water Dependency', 'Soak in water for an hour each day or suffer exhaustion.']], skill: 'Perception' },
    'Locathah': { group: 'rare', speed: 30, swim: 30, size: 'Medium', traits: [['Natural Armor', 'Without armor, your AC is 12 + Dexterity.'], ['Observant and Athletic', 'Proficiency in Athletics and Perception.'], ['Leviathan Will', 'Advantage on saves against being charmed, frightened, paralyzed, poisoned, stunned or put to sleep.'], ['Limited Amphibiousness', 'Breathe air and water, but you must soak in water every 4 hours.']], skill: 'Athletics', extraSkill: 1 },
    'Verdan': { group: 'far', speed: 30, size: 'Small', traits: [['Black Blood Healing', 'Reroll 1s and 2s on hit dice spent to heal.'], ['Limited Telepathy', 'Speak telepathically to a creature within 30 ft.'], ['Persuasive', 'Proficiency in Persuasion.'], ['Telepathic Insight', 'Advantage on Wisdom and Charisma saves.']], skill: 'Persuasion' },
    'Astral Elf': { group: 'far', speed: 30, size: 'Medium', dark: 60, traits: [['Astral Fire', 'Learn Dancing Lights, Light or Sacred Flame.'], ['Starlight Step', 'Teleport 30 ft as a bonus action. Uses equal to proficiency bonus per long rest.'], ['Astral Trance', 'Meditate 4 hours and gain a skill and weapon or tool proficiency until your next rest.'], ['Fey Ancestry', 'Advantage against being charmed.']] },
    'Plasmoid': { group: 'far', speed: 30, size: 'Medium', dark: 60, traits: [['Amorphous', 'Squeeze through 1-inch gaps, and advantage to escape grapples.'], ['Hold Breath', 'Hold your breath for an hour.'], ['Natural Resilience', 'Resistance to acid and poison damage.'], ['Shape Self', 'Reshape your body, and form pseudopods to handle things.']] },
    'Thri-kreen': { group: 'far', speed: 30, size: 'Medium', dark: 60, traits: [['Chameleon Carapace', 'AC 13 + Dexterity without armor, and blend in for advantage on Stealth.'], ['Secondary Arms', 'Two small arms that can hold light items.'], ['Sleepless', 'You don\'t sleep; you stay alert while resting.'], ['Thri-kreen Telepathy', 'Speak telepathically to creatures that share a language with you.']] },
    'Hadozee': { group: 'far', speed: 30, climb: 30, size: 'Medium', traits: [['Dexterous Feet', 'Use an object as a bonus action.'], ['Glide', 'Glide 5 ft for every 1 ft you fall, taking no falling damage.'], ['Hadozee Dodge', 'Reaction: reduce damage by a d6 + proficiency. Uses equal to proficiency bonus per long rest.']] },
    'Giff': { group: 'far', speed: 30, swim: 30, size: 'Medium', traits: [['Astral Spark', 'Once per turn, add proficiency bonus to damage with simple or martial weapons. Uses equal to proficiency bonus per long rest.'], ['Firearms Mastery', 'Proficiency with firearms, with no loading penalties.'], ['Hippo Build', 'Advantage on Strength checks and saves; count as larger for carrying.']] },
    'Autognome': { group: 'far', speed: 30, size: 'Small', traits: [['Armored Casing', 'AC 13 + Dexterity without armor.'], ['Built for Success', 'Add a d4 to an attack, check or save. Uses equal to proficiency bonus per long rest.'], ['Mechanical Nature', 'Resistance to poison, and you don\'t need to eat, drink or breathe.'], ['Specialized Design', 'Proficiency with two tools.']] }
  };

  var BACKGROUNDS = {
    'Acolyte': ['Insight', 'Religion'], 'Charlatan': ['Deception', 'Sleight of Hand'], 'Criminal': ['Deception', 'Stealth'],
    'Entertainer': ['Acrobatics', 'Performance'], 'Folk Hero': ['Animal Handling', 'Survival'], 'Guild Artisan': ['Insight', 'Persuasion'],
    'Hermit': ['Medicine', 'Religion'], 'Noble': ['History', 'Persuasion'], 'Outlander': ['Athletics', 'Survival'],
    'Sage': ['Arcana', 'History'], 'Sailor': ['Athletics', 'Perception'], 'Soldier': ['Athletics', 'Intimidation'], 'Urchin': ['Sleight of Hand', 'Stealth']
  };

  window.AVARENTH_RULES = { classes: C, subLevels: SUB_LEVELS, magic: MAGIC, species: SPECIES, backgrounds: BACKGROUNDS,
    standardArray: [15, 14, 13, 12, 10, 8], pointBuyCost: { 8: 0, 9: 1, 10: 2, 11: 3, 12: 4, 13: 5, 14: 7, 15: 9 }, pointBuyBudget: 27,
    coins: { cp: 'Copper Foxes', sp: 'Silver Stags', gp: 'Golden Eagles' },
    // Who a character serves. Gods of Akorianism, and the lords of the Hollow Court (only those players can read about are offered).
    devotion: { Cleric: 'Deity', Paladin: 'Deity', Warlock: 'Patron', Druid: 'Deity', Ranger: 'Deity', Monk: 'Deity' },
    devotionRequired: ['Cleric', 'Paladin', 'Warlock'],
    // Paladins can only swear to demons with a cause (paladin: true); clerics and warlocks can serve any.   // Paladins may swear to their oath alone instead of a god
    natureOnly: ['Druid', 'Ranger'],   // nature gods, and the demons that are nature's shadow
    gods: [
      { name: 'Akoron', good: true, about: 'God of life and leader of the gods', domains: 'Life, Light', article: 'Akoron' },
      { name: 'Roselle', good: true, about: 'Goddess of nature', domains: 'Nature, Life', article: 'Roselle', nature: true },
      { name: 'Azrul', about: 'God of death and judgment', domains: 'Death, Grave', article: 'Azrul' },
      { name: 'Korinth', good: true, about: 'God of knowledge', domains: 'Knowledge, Arcana', article: 'Korinth' },
      { name: 'Thorum', good: true, about: 'God of storms and the ocean', domains: 'Tempest', article: 'Thorum', nature: true },
      { name: 'Florin', about: 'God of trickery', domains: 'Trickery', article: 'Florin' },
      { name: 'Rook', about: 'God of war', domains: 'War, Order', article: 'Rook' }
    ],
    demons: [
      { name: 'The Hungering Head', about: 'Ruler of the Hollow Court, eater of the sun', article: 'The Hungering Head', paladin: true },
      { name: 'Kharneth', about: 'Demon of debts', article: 'Kharneth, the Debt-Keeper', paladin: true },
      { name: 'Drakhar', about: 'Demon of tyranny, the Last Emperor', article: 'Drakhar, the Last Emperor', paladin: true },
      { name: 'The Pyre-Saint', about: 'Demon of zealotry', article: 'The Pyre-Saint', paladin: true },
      { name: 'Sytha', about: 'Demon of spiders and betrayal', article: 'Sytha, the Broodmother', nature: true },
      { name: 'The Nine Below', about: 'Demons of undeath', article: 'The Nine Below', paladin: true },
      { name: 'The Mask', about: 'Demon of lies', article: 'The Mask' },
      { name: 'Veyl', about: 'Demon of forbidden knowledge', article: 'Veyl' },
      { name: 'Vaunt and Ruin', about: 'Demons of war', article: 'Vaunt and Ruin', paladin: true },
      { name: 'Lull', about: 'Demon of the dead calm', article: 'Lull', nature: true },
      { name: 'Marrow', about: 'Demon of plague', article: 'Marrow' },
      { name: 'Velvet', about: 'Demon of temptation', article: 'Velvet' }
    ],
    // Where each faction starts with a new character, in steps from Neutral (+1 Friendly, +2 Allied, -1 Cold, -2 Hostile).
    // base applies to everyone; then class, species, background and faith add up. A named god or demon beats the
    // 'good' and 'demon' groups. Starting standing is capped at Allied and Hostile; the DM moves it from there.
    // Crown and noble factions only care about blood: no class or faith pulls them off Neutral.
    // Every faction is wary of the draconic races (one step lower) unless it is draconic itself.
    draconic: ['Dragonborn', 'Kobold', 'Lizardfolk', 'Troglodyte'],
    draconicFactions: ['the-red-scales', 'house-ignis'],
    // Which subclasses each patron offers. Classes not listed for a patron (and Druids, Rangers, Monks) can take any.
    // Paladins sworn to their oath alone can take any oath. The DM's custom subclasses say for themselves which patrons grant them.
    patronSubclasses: {
      'Akoron': { Cleric: ['Life Domain', 'Light Domain', 'Peace Domain'], Warlock: ['The Celestial'], Paladin: ['Oath of Devotion', 'Oath of Redemption'] },
      'Roselle': { Cleric: ['Nature Domain', 'Life Domain'], Warlock: ['The Celestial'], Paladin: ['Oath of the Ancients', 'Oath of Redemption'] },
      'Azrul': { Cleric: ['Death Domain', 'Grave Domain', 'Twilight Domain'], Warlock: ['The Celestial'], Paladin: ['Oath of the Watchers', 'Oath of Devotion'] },
      'Korinth': { Cleric: ['Knowledge Domain', 'Arcana Domain'], Warlock: ['The Celestial'], Paladin: ['Oath of the Watchers', 'Oath of Devotion'] },
      'Thorum': { Cleric: ['Tempest Domain'], Warlock: ['The Celestial', 'The Fathomless'], Paladin: ['Oath of Vengeance', 'Oath of Glory'] },
      'Florin': { Cleric: ['Trickery Domain'], Warlock: ['The Celestial'], Paladin: ['Oath of Glory', 'Oath of Redemption'] },
      'Rook': { Cleric: ['War Domain', 'Order Domain', 'Forge Domain'], Warlock: ['The Celestial'], Paladin: ['Oath of Devotion', 'Oath of Conquest', 'Oath of Glory'] },
      'The Hungering Head': { Cleric: ['Death Domain', 'Twilight Domain'], Warlock: ['The Great Old One'], Paladin: ['Oathbreaker', 'Oath of Conquest'] },
      'Kharneth': { Cleric: ['Order Domain', 'Knowledge Domain'], Warlock: ['The Fiend'], Paladin: ['Oath of Conquest', 'Oath of Vengeance'] },
      'Drakhar': { Cleric: ['War Domain', 'Order Domain'], Warlock: ['The Hexblade', 'The Fiend'], Paladin: ['Oath of Conquest'] },
      'The Pyre-Saint': { Cleric: ['Light Domain', 'War Domain'], Warlock: ['The Celestial', 'The Fiend'], Paladin: ['Oath of Vengeance', 'Oath of Conquest'] },
      'Marrow': { Cleric: ['Death Domain', 'Nature Domain'], Warlock: ['The Undead', 'The Great Old One'] },
      'Velvet': { Cleric: ['Trickery Domain', 'Twilight Domain'], Warlock: ['The Archfey'] },
      'Sytha': { Cleric: ['Trickery Domain', 'Nature Domain'], Warlock: ['The Archfey', 'The Great Old One'] },
      'The Nine Below': { Cleric: ['Death Domain', 'Grave Domain'], Warlock: ['The Undead'], Paladin: ['Oathbreaker', 'Oath of Vengeance'] },
      'The Mask': { Cleric: ['Trickery Domain'], Warlock: ['The Archfey', 'The Great Old One'] },
      'Veyl': { Cleric: ['Knowledge Domain', 'Arcana Domain'], Warlock: ['The Great Old One'] },
      'Vaunt and Ruin': { Cleric: ['War Domain'], Warlock: ['The Hexblade', 'The Fiend'], Paladin: ['Oath of Glory', 'Oath of Conquest', 'Oathbreaker'] },
      'Lull': { Cleric: ['Tempest Domain', 'Death Domain'], Warlock: ['The Fathomless'] }
    },
    factionStart: {
      'the-black-hand': { cls: { Rogue: 1, Paladin: -1 }, bg: { Criminal: 1, Charlatan: 1, Urchin: 1 }, faith: { Florin: 1 } },
      'the-red-scales': { base: -2, species: { Dragonborn: 3, Kobold: 2, Lizardfolk: 1 } },
      'spider-cult': { base: -2, faith: { Sytha: 4 } },
      'the-blooming-isle': { cls: { Monk: 1, Druid: 1 }, bg: { Acolyte: 1 }, faith: { Roselle: 2, good: 1, demon: -2 } },
      'the-thornwardens': { cls: { Paladin: 1 }, faith: { Roselle: 2, good: 1, demon: -2 } },
      'the-city-state-of-coralyn': { species: { Elf: 1 }, faith: { Thorum: 1 } },
      'the-tribe-of-orock': { species: { Goliath: 1 }, cls: { Barbarian: 1 } },
      'clan-anvilborn': { species: { Dwarf: 1, Troglodyte: 2 } }, // trogs work Stonehelm's mines: +2 cancels the draconic −1, so they start one above neutral
      'house-ignis': { species: { Dragonborn: 1, Kobold: 1 } },
      'the-last-watch': { species: { Dragonborn: -2, Kobold: -2, Lizardfolk: -1 } },
      'the-nine-below': { faith: { 'The Nine Below': 2, Azrul: -1 } }
    } };
})();
