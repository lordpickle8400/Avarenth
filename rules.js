/* Avarenth rules data for the character builder, level-up guide and sheet.
   Class and species basics follow the 5e core rules (summaries in our own words);
   magic follows the Avarenth Mana Guide: mana instead of spell slots. */
(function () {
  // [level, feature name, short summary, needs a mana ruling?]
  // "needsRuling" marks 5e features written around spell slots; the DM decides the mana version.
  var C = {};

  C.Barbarian = {
    about: 'Fierce warriors who fight in a trance of rage, drawing strength from the wild and from the fury in their blood.',
    hd: 12, primary: 'Strength', saves: ['str', 'con'],
    armor: 'Light and medium armor, shields', weapons: 'Simple and martial weapons', tools: '',
    skills: { n: 2, from: ['Animal Handling', 'Athletics', 'Intimidation', 'Nature', 'Perception', 'Survival'] },
    subclassLevel: 3, subclassLabel: 'Primal Path', asi: [4, 8, 12, 16, 19],
    subclasses: ['Path of the Berserker', 'Path of the Animal Spirit', 'Path of the Kinwarden', 'Path of the Stormcaller', 'Path of the Fervent', 'Path of the Feral Shape', 'Path of the Wildborn', 'Path of the Titan'],
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
    about: 'Performers whose songs and spells are one craft, inspiring allies and unsettling enemies alike.',
    hd: 8, primary: 'Charisma', saves: ['dex', 'cha'],
    armor: 'Light armor', weapons: 'Simple weapons, hand crossbows, longswords, rapiers, shortswords', tools: 'Three musical instruments',
    skills: { n: 3, from: 'any' },
    subclassLevel: 3, subclassLabel: 'Bard College', asi: [4, 8, 12, 16, 19],
    subclasses: ['College of Lore', 'College of Courage', 'College of Veils', 'College of Blades', 'College of Secrets', 'College of Making', 'College of Oratory', 'College of Ghosts'],
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
    about: 'Priests who channel the power of their gods, healing the wounded and turning back the dead.',
    hd: 8, primary: 'Wisdom', saves: ['wis', 'cha'],
    armor: 'Light and medium armor, shields', weapons: 'Simple weapons', tools: '',
    skills: { n: 2, from: ['History', 'Insight', 'Medicine', 'Persuasion', 'Religion'] },
    subclassLevel: 1, subclassLabel: 'Divine Domain', asi: [4, 8, 12, 16, 19],
    subclasses: ['Lore Domain', 'Life Domain', 'Dawn Domain', 'Wildwood Domain', 'Thunder Domain', 'Mischief Domain', 'Battle Domain', 'Anvil Domain', 'Tomb Domain', 'Law Domain', 'Harmony Domain', 'Dusk Domain', 'Sigil Domain', 'Grim Domain'],
    features: [
      [1, 'Spellcasting', 'Your faith is the wellspring of your mana, and your prayers shape each spell. You cast with mana drawn from your faith. Wisdom is your spellcasting ability. See the Mana Guide.'],
      [1, 'Divine Domain', 'Your domain is the part of your god that you carry into the world. Your god\'s nature shapes your magic. Choose the domain your god rules and the powers that come with it.'],
      [2, 'Channel Divinity', 'Your god\'s power flows through you in bursts you can call on when the moment demands it. You channel divine power into effects like Turn Undead and your domain\'s ability. Once per short or long rest (twice at 6th, three times at 18th).'],
      [5, 'Destroy Undead', 'The dead recoil from your faith, and the weakest of them crumble at a word. Undead that fail against your Turn Undead are destroyed outright if they are weak enough. The threshold rises as you level.'],
      [10, 'Divine Intervention', 'In a desperate hour, you can plead with your god directly. You call on your god for help in a dire moment. Roll a d100; if the result is your cleric level or lower, your god answers.'],
      [20, 'Divine Intervention Improvement', 'Your god\'s answer comes without fail once you have earned it. Your god always answers your call for intervention.']
    ]
  };

  C.Druid = {
    about: 'Keepers of the old ways who draw their magic from the land, and who can take the shape of beasts.',
    hd: 8, primary: 'Wisdom', saves: ['int', 'wis'],
    armor: 'Light and medium armor, shields (not made of metal)', weapons: 'Clubs, daggers, darts, javelins, maces, quarterstaffs, scimitars, sickles, slings, spears', tools: 'Herbalism kit',
    skills: { n: 2, from: ['Arcana', 'Animal Handling', 'Insight', 'Medicine', 'Nature', 'Perception', 'Religion', 'Survival'] },
    subclassLevel: 2, subclassLabel: 'Druid Circle', asi: [4, 8, 12, 16, 19],
    subclasses: ['Circle of the Land', 'Circle of Lunar Forms', 'Circle of Slumber', 'Circle of the Herder', 'Circle of Mycelia', 'Circle of the Heavens', 'Circle of Emberfire'],
    features: [
      [1, 'Druidic', 'The old tongue of the groves lets you speak with the land and its keepers. You know the secret language of druids, and you can leave messages that only other druids can read.'],
      [1, 'Spellcasting', 'The wild gives you power, and you draw on it with every spell. You cast with mana. Wisdom is your spellcasting ability. See the Mana Guide.'],
      [2, 'Wild Shape', 'You take on the form of a beast and move with its strength for a while. You turn into a beast you have seen, twice per short or long rest. Stronger forms open up at 4th and 8th level.'],
      [2, 'Druid Circle', 'Your circle is the community that taught you the ways of the land. Choose the circle you learn your magic from, which shapes the spells and features you gain.'],
      [18, 'Timeless Body', 'The seasons pass over you without leaving much mark. You age ten times slower than ordinary folk, and the years pass lightly on you.'],
      [18, 'Beast Spells', 'Your beast form does not silence your magic. You can cast many of your spells while in beast form, even without the words and gestures you would normally use.'],
      [20, 'Archdruid', 'You have mastered the wild, and its rules bend to your will. Unlimited Wild Shape, and you can ignore minor components of druid spells, the small gestures and materials that others need.']
    ]
  };

  C.Fighter = {
    about: 'Trained soldiers who master every weapon and armor, and who are at home on any battlefield.',
    hd: 10, primary: 'Strength or Dexterity', saves: ['str', 'con'],
    armor: 'All armor, shields', weapons: 'Simple and martial weapons', tools: '',
    skills: { n: 2, from: ['Acrobatics', 'Animal Handling', 'Athletics', 'History', 'Insight', 'Intimidation', 'Perception', 'Survival'] },
    subclassLevel: 3, subclassLabel: 'Martial Archetype', asi: [4, 6, 8, 12, 14, 16, 19],
    subclasses: ['Champion', 'Battle Tactician', 'Spellblade', 'Arcane Bowman', 'Rider Knight', 'Honor Blade', 'Mirrorguard', 'Mindforged', 'Runebound'],
    features: [
      [1, 'Avarenth Magic', 'Your magic is small and practical, the kind a soldier picks up on campaign. You have a small mana pool and a short martial spell list. Bigger magic comes from tomes. See the Mana Guide.'],
      [1, 'Fighting Style', 'Every fighter develops a way of fighting that is unmistakably their own. Pick a fighting specialty that defines how you fight, like Archery, Defense, Dueling or Great Weapon Fighting.'],
      [1, 'Second Wind', 'You dig deep and find a second breath when the fight wears you down. As a bonus action, you catch your breath and regain 1d10 + your fighter level in hit points. Once per short or long rest.'],
      [2, 'Action Surge', 'You push your body past its limits for a moment of furious action. For a moment you push past your limits and take one extra action on your turn. Once per short or long rest (twice at 17th).'],
      [3, 'Martial Archetype', 'Your archetype is the path you take to master the craft of war. Choose the archetype that shapes how you master your craft.'],
      [5, 'Extra Attack', 'Your blows come faster as your skill grows. You strike with a practiced hand. Attack twice when you take the Attack action (three times at 11th, four at 20th).'],
      [9, 'Indomitable', 'You refuse to give in to fear or magic, and your will holds firm. You refuse to be beaten by magic or fear. Reroll a failed saving throw. Once per long rest (twice at 13th, three times at 17th).']
    ]
  };

  C.Monk = {
    about: 'Disciplined fighters who shape ki into blows, speed and endurance, and who train their bodies to be weapons.',
    hd: 8, primary: 'Dexterity and Wisdom', saves: ['str', 'dex'],
    armor: 'None', weapons: 'Simple weapons, shortswords', tools: 'One artisan\'s tool or musical instrument',
    skills: { n: 2, from: ['Acrobatics', 'Athletics', 'History', 'Insight', 'Religion', 'Stealth'] },
    subclassLevel: 3, subclassLabel: 'Monastic Tradition', asi: [4, 8, 12, 16, 19],
    subclasses: ['Way of the Open Hand', 'Way of Shade', 'Way of the Four Winds', 'Way of the Last Breath', 'Way of the Sunlit Spirit', 'Way of the Tipsy Fist', 'Way of the Swordmaster', 'Way of the Spiritbound', 'Way of Compassion'],
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
    about: 'Holy warriors bound by an oath, who guard the innocent and smite the wicked with divine might.',
    hd: 10, primary: 'Strength and Charisma', saves: ['wis', 'cha'],
    armor: 'All armor, shields', weapons: 'Simple and martial weapons', tools: '',
    skills: { n: 2, from: ['Athletics', 'Insight', 'Intimidation', 'Medicine', 'Persuasion', 'Religion'] },
    subclassLevel: 3, subclassLabel: 'Sacred Oath', asi: [4, 8, 12, 16, 19],
    subclasses: ['Oath of Devotion', 'Oath of the Elders', 'Oath of Reckoning', 'Oathbroken', 'Oath of Dominion', 'Oath of Mercy', 'Oath of Renown', 'Oath of the Nightwatch'],
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
    about: 'Wilderness hunters and trackers who fight with blade and bow, and who walk the edges of the settled lands.',
    hd: 10, primary: 'Dexterity and Wisdom', saves: ['str', 'dex'],
    armor: 'Light and medium armor, shields', weapons: 'Simple and martial weapons', tools: '',
    skills: { n: 3, from: ['Animal Handling', 'Athletics', 'Insight', 'Investigation', 'Nature', 'Perception', 'Stealth', 'Survival'] },
    subclassLevel: 3, subclassLabel: 'Ranger Archetype', asi: [4, 8, 12, 16, 19],
    subclasses: ['Hunter', 'Beast Warden', 'Shadow Hunter', 'Planewalker', 'Monster Bane', 'Feywalker', 'Swarm Warden', 'Wyrmrider'],
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
    about: 'Stealthy opportunists who strike from the shadows, pick locks and find the weak point in any defense.',
    hd: 8, primary: 'Dexterity', saves: ['dex', 'int'],
    armor: 'Light armor', weapons: 'Simple weapons, hand crossbows, longswords, rapiers, shortswords', tools: 'Thieves\' tools',
    skills: { n: 4, from: ['Acrobatics', 'Athletics', 'Deception', 'Insight', 'Intimidation', 'Investigation', 'Perception', 'Performance', 'Persuasion', 'Sleight of Hand', 'Stealth'] },
    subclassLevel: 3, subclassLabel: 'Roguish Archetype', asi: [4, 8, 10, 12, 16, 19],
    subclasses: ['Thief', 'Night Killer', 'Arcane Rogue', 'Seeker', 'Schemer', 'Pathfinder', 'Duelist', 'Deadwhisper', 'Thoughtblade'],
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
    about: 'Gifted casters whose magic is innate and wild, flowing out of a single source in their blood.',
    hd: 6, primary: 'Charisma', saves: ['con', 'cha'],
    armor: 'None', weapons: 'Daggers, darts, slings, quarterstaffs, light crossbows', tools: '',
    skills: { n: 2, from: ['Arcana', 'Deception', 'Insight', 'Intimidation', 'Persuasion', 'Religion'] },
    subclassLevel: 1, subclassLabel: 'Sorcerous Origin', asi: [4, 8, 12, 16, 19],
    subclasses: ['Draconic Bloodline', 'Chaotic Origin', 'Heavenly Origin', 'Umbral Origin', 'Tempest Origin', 'Aberrant Origin', 'Clockwork Origin'],
    features: [
      [1, 'Spellcasting', 'The magic in your blood answers you without the long study that others need. You cast with mana, and your magic is part of who you are. Charisma is your spellcasting ability. See the Mana Guide.'],
      [1, 'Sorcerous Origin', 'Your magic came from somewhere, and that origin shapes every spell you cast. Choose where your magic comes from, whether a bloodline, a wild surge or a spark of the divine.'],
      [2, 'Font of Magic', 'A well of sorcery runs through you, and you can draw on it at will. Your sorcery points come from within and fuel Metamagic. You have sorcery points equal to your sorcerer level. As a bonus action, trade 1 point for 5 mana or 5 mana for 1 point. You can\'t go over your max.'],
      [3, 'Metamagic', 'You bend your spells to your will, changing their shape as they leave your hands. Twist your spells with sorcery points: make them farther, faster, twinned or quieter. Two options at 3rd, more at 10th and 17th.'],
      [20, 'Sorcerous Restoration', 'Your magic renews itself quickly when you rest. You draw the power back into yourself. Regain 4 sorcery points on a short rest.']
    ]
  };

  C.Warlock = {
    about: 'Spellcasters who strike a bargain with a powerful patron and channel its gifts into their magic.',
    hd: 8, primary: 'Charisma', saves: ['wis', 'cha'],
    armor: 'Light armor', weapons: 'Simple weapons', tools: '',
    skills: { n: 2, from: ['Arcana', 'Deception', 'History', 'Intimidation', 'Investigation', 'Nature', 'Religion'] },
    subclassLevel: 1, subclassLabel: 'Otherworldly Patron', asi: [4, 8, 12, 16, 19],
    subclasses: ['The Fey Court', 'The Fiend', 'The Outer Horror', 'The Radiant Patron', 'The Bladebound', 'The Deep Patron', 'The Djinn Patron', 'The Deathless'],
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
    about: 'Scholars of arcane lore who learn spells from their books and shape the world through careful study.',
    hd: 6, primary: 'Intelligence', saves: ['int', 'wis'],
    armor: 'None', weapons: 'Daggers, darts, slings, quarterstaffs, light crossbows', tools: '',
    skills: { n: 2, from: ['Arcana', 'History', 'Insight', 'Investigation', 'Medicine', 'Religion'] },
    subclassLevel: 2, subclassLabel: 'Arcane Tradition', asi: [4, 8, 12, 16, 19],
    subclasses: ['School of Warding', 'School of Summoning', 'School of Foresight', 'School of Charm', 'School of Evocation', 'School of Phantasms', 'School of Death', 'School of Alchemy', 'Bladechant', 'School of Battle Magic', 'Timecraft', 'Weightcraft', 'Order of the Inkwright'],
    features: [
      [1, 'Spellcasting', 'You study magic the way others study law or medicine, and you master it through careful work. You cast with mana and study magic as a discipline. Intelligence is your spellcasting ability. You can copy compatible spells from tomes into your spellbook. See the Mana Guide.'],
      [1, 'Arcane Recovery', 'You can gather your scattered focus after a short rest and draw some mana back into yourself. Once per day after a short rest, regain mana equal to 5 × your wizard level.'],
      [2, 'Arcane Tradition', 'Your school of magic is your life\'s study, and it shapes the magic you learn. Choose the school you specialize in, which shapes the spells and features you gain.'],
      [18, 'Spell Mastery', 'Some spells are so familiar to you that they cost almost nothing to cast. You have mastered two spells so well that they hardly tax you. Pick one 1st-level and one 2nd-level spell you know. They cost you no mana.'],
      [20, 'Signature Spells', 'A few spells are yours alone, and you can cast them whenever you need them. Your signature spells are the ones you have made your own. Pick two 3rd-level spells you know. Each can be cast once per short rest without spending mana.']
    ]
  };

  // The two classes from outside the Player's Handbook (summaries in our own words). Their mana numbers are DM's calls.
  C.Cogwright = {
    hd: 8, primary: 'Intelligence', saves: ['con', 'int'], book: 'Avarenth',
    armor: 'Light and medium armor, shields', weapons: 'Simple weapons', tools: 'Tinker\'s tools, smith\'s tools, one other artisan\'s tool',
    skills: { n: 2, from: ['Arcana', 'History', 'Investigation', 'Medicine', 'Nature', 'Perception', 'Sleight of Hand'] },
    subclassLevel: 3, subclassLabel: 'Guild Trade', asi: [4, 8, 12, 16, 19],
    subclasses: ['Automaton-Wright', 'Ironclad', 'Siege-Wright', 'Tonic-Wright'],
    about: 'Makers who wind magic into springs, gears and brass. The Cogwrights\' Guild takes anyone who passes its trials, but its masters are nearly all dwarves, its great halls are in [[Stonehelm]], and its marks are on the best clockwork in the isles.',
    features: [
      [1, 'Clockwork Knack', 'You can build a tiny clockwork trinket in a few minutes: a wind-up bird that sings, a brass mouse that carries a note, a spinning lamp, a music box that plays a message you hum into it. You can keep a number of them running equal to your Intelligence modifier; they wind down after a long rest.'],
      [1, 'Spellcasting', 'Your spells run through a device in your hand: tinker\'s tools, a winding key, or an item carrying one of your Tinkerings. You cast with mana. Intelligence is your spellcasting ability. See the Mana Guide.'],
      [2, 'Tinkerings', 'After a long rest you can fit clockwork upgrades to ordinary gear, turning it into a magic item: a self-loading crossbow, a shield that springs open, plating that hums against blows. You know four Tinkerings at 2nd level and can keep two fitted at once, more as you level.'],
      [3, 'Guild Trade', 'Choose the trade the Guild trained you in.'],
      [3, 'Pocket Workshop', 'Spend an hour with scrap and spare parts to put together one set of artisan\'s tools. It lasts until you build another.'],
      [6, 'Master\'s Hand', 'Double your proficiency bonus with any tool you\'re proficient with.'],
      [7, 'Spring-Loaded Wits', 'As a reaction, add your Intelligence modifier to an ability check or saving throw made by you or a creature you can see within 30 feet. You can do this a number of times equal to your Intelligence modifier per long rest.'],
      [10, 'Brass Attunement', 'You can attune to up to four magic items, and you craft common and uncommon magic items and clockwork in a quarter of the time for half the gold.'],
      [11, 'Wound Charge', 'After a long rest, wind a 1st or 2nd-level spell you know into a weapon or device. Whoever holds it can release the spell a number of times equal to twice your Intelligence modifier, using your spellcasting modifier and spending no mana.'],
      [14, 'Grand Tinker', 'You can attune to up to five magic items, and you ignore every class, species, spell and level requirement for using one.'],
      [18, 'Guildmaster\'s Mark', 'You can attune to up to six magic items.'],
      [20, 'Heart of Brass', 'You gain +1 to all saving throws for each magic item you\'re attuned to. When you drop to 0 hit points, you can shut down one of your Tinkerings to drop to 1 hit point instead.']
    ]
  };

  // Subclass feature levels (the features themselves depend on the subclass).
  var SUB_LEVELS = { Cogwright: [3, 5, 9, 15], Barbarian: [3, 6, 10, 14], Bard: [3, 6, 14], Cleric: [1, 2, 6, 8, 17], Druid: [2, 6, 10, 14], Fighter: [3, 7, 10, 15, 18],
    Monk: [3, 6, 11, 17], Paladin: [3, 7, 15, 20], Ranger: [3, 7, 11, 15], Rogue: [3, 9, 13, 17], Sorcerer: [1, 6, 14, 18], Warlock: [1, 6, 10, 14], Wizard: [2, 6, 10, 14] };

  // Avarenth magic, from the Mana Guide.
  var MAGIC = {
    manaCost: [0, 5, 10, 18, 28, 40, 60, 85, 110, 150],
    mana: { Wizard: [25, 15], Sorcerer: [35, 17], Cleric: [25, 14], Druid: [25, 14], Bard: [30, 13], Warlock: [30, 12], Paladin: [20, 9], Ranger: [20, 9], Monk: [20, 8], Fighter: [15, 7], Rogue: [15, 6], Barbarian: [10, 6], Cogwright: [20, 9] },
    // Levels at which each High Magic Charge is gained, and when the Reality Channel arrives (0 = never).
    charges: { Wizard: [[11, 13, 15, 17, 19], 17], Sorcerer: [[11, 13, 15, 17, 19], 17], Cleric: [[11, 13, 15, 19], 17], Druid: [[11, 13, 15, 19], 17],
      Bard: [[11, 15, 19], 19], Warlock: [[11, 15, 19], 19], Paladin: [[15, 19], 0], Ranger: [[15, 19], 0], Monk: [[17], 0], Fighter: [[19], 0], Rogue: [[19], 0], Barbarian: [[], 0], Cogwright: [[15, 19], 0] },
    fullCasters: ['Wizard', 'Sorcerer', 'Cleric', 'Druid', 'Bard', 'Warlock'],
    learnLevel: [1, 1, 3, 5, 7, 9, 11, 13, 15, 17],          // character level needed for each spell level
    learnCost: [5, 10, 25, 50, 100, 200, 400, 750, 1250, 2500], // gp
    studyHours: [0.5, 1, 2, 3, 4, 5, 6, 7, 8, 9],
    spellAbility: { Wizard: 'int', Sorcerer: 'cha', Cleric: 'wis', Druid: 'wis', Bard: 'cha', Warlock: 'cha', Paladin: 'cha', Ranger: 'wis', Monk: 'wis', Fighter: 'int', Rogue: 'int', Barbarian: 'wis', Cogwright: 'int' },
    // Starting spell picks from the class list, and free picks gained at later levels.
    // A DM-tunable default: Avarenth's class spells are learned at levels 1, 3 and 5+.
    startPicks: { full: [3, 2], half: [2, 2], martial: [1, 1] },
    freePickLevels: [3, 5, 7, 9, 11, 13, 15, 17, 19],
    arcanum: { 11: 6, 13: 7, 15: 8, 17: 9 },   // warlock level -> spell level the patron grants
    secrets: { 10: 2, 14: 2, 18: 2 }          // bard level -> Magical Secrets picks
  };

  var SPECIES = {
    "Human": {"speed":30,"size":"Medium","extraSkill":1,"note":"The most widespread people in the world, found in every biome from river plains to frozen coast. When the dragons turned on each other in the Draconic Wars, human lands were pillaged for food, coin and lives, and when the dragons weakened, humans rose in numbers no other people could match. Short-lived and numerous, they can lose a generation and still fill the field again. Afterward they spread into the emptied lands and built the empires that followed, and most of the world’s coin and tolls carry their stamp. Every empire is mostly human, but no two humans share a homeland, a custom or a look, and a stranger at the gate is rarely guessed right. A player Human can come from anywhere: a river farm, a frozen coast town, an empire's capital, or a caravan between them.","traits":[["Versatile","Humans are quick to learn and quick to adapt. Gain one extra skill proficiency of your choice."]]},
    "Dwarf": {"speed":25,"size":"Medium","dark":60,"note":"Stone-hewers who live inside the great mountain ranges and under high hills, in cities carved into the rock with terraced farms on the heights above. In the Draconic Wars the dwarves took the fight to the dragons' own deep halls, and they walked out holding the best mines and forges in the world. They breed Craghorns, goats hardy enough to carry a rider, and brew a mead from a cave fungus that grows nowhere else. Other peoples find it hits like a drug, which makes dwarf halls loud, long and full of kegs. They take foreign coin but keep their own laws, they remember every debt, and a hold guards its runes: none leave unless already worked into an item. A player Dwarf can be a deep-hold crafter, a highland terrace farmer, or a dwarf on the road who owes somebody.","traits":[["Dwarven Resilience","You have advantage on saves against poison, and resistance to poison damage."],["Stonecunning","You know stonework, its history and how old a wall is just by looking at it. Advantage on History checks about stonework."],["Heavy Armor Stride","Heavy armor doesn’t slow your speed down."]]},
    "Elf": {"speed":30,"size":"Medium","dark":60,"skill":"Perception","note":"Long-lived and slow to trust, the elves of the isles are mostly gone. The few who remain keep to quiet corners and remember when the forests were theirs.","traits":[["Keen Senses","Proficiency in Perception."],["Fey Ancestry","You have advantage against being charmed, and magic can’t put you to sleep."],["Trance","You meditate for 4 hours instead of sleeping, and come out of it rested."]],"lineages":{"High":{"note":"Elves of the old stone cities and high meadows, keepers of long memory and longer libraries.","skill":"Arcana","traits":[["Old Lore","Proficiency in Arcana. Once you roll an Intelligence check, you can add 1d4 to the result. Uses equal to your proficiency bonus per long rest."]],"uses":[{"key":"oldlore","name":"Old Lore","max":"prof","rest":"long"}]},"Wood":{"note":"Elves of the forests and river groves, quiet-footed and hard to find.","speed":35,"traits":[["Fleet of Foot","Your walking speed is 35 ft."],["Mask of the Wild","You can try to hide when you are only lightly obscured by foliage, mist or falling snow."]]},"Dark":{"note":"Elves of the deep places. Surface folk distrust them on sight, and they remember being driven out of the light.","dark":120,"traits":[["Gloom-Walker","Advantage on Stealth checks in dim light or darkness."],["Veil of Gloom","Bonus action: snuff all nonmagical light within 20 ft. Once per short or long rest."]],"uses":[{"key":"veil","name":"Veil of Gloom","max":1,"rest":"short"}]},"Sea":{"note":"Elves of the coast and tide, at home in salt water and old harbors.","swim":30,"traits":[["Sea-Born","You have a swim speed of 30 ft."],["Tide Sense","You always know the tide and the way to the nearest shore, current or storm."],["Riptide Step","Bonus action: while in water, move up to your swim speed without provoking opportunity attacks. Uses equal to your proficiency bonus per long rest."]],"uses":[{"key":"riptide","name":"Riptide Step","max":"prof","rest":"long"}]},"Snow":{"note":"Elves of the frozen coasts and tundra, patient and hard to rattle.","traits":[["Frost-Hardened","You have resistance to cold damage."],["Snow-Walker","Ice and snow are never difficult terrain for you."],["Cold Snap","Reaction when a creature hits you with a melee attack: its speed is halved until the end of its next turn. Once per short or long rest."]],"uses":[{"key":"coldsnap","name":"Cold Snap","max":1,"rest":"short"}]},"Sand":{"note":"Elves of the dry lands and dunes, who read the wind and carry every drop.","skill":"Survival","traits":[["Desert-Bred","Proficiency in Survival. Advantage on Constitution saves against heat exhaustion, and you need only half the water."],["Sand-Step","Sand and loose ground are never difficult terrain for you."],["Dust Veil","Bonus action: a 10 ft cloud lightly obscures the area around you until the start of your next turn. Once per short or long rest."]],"uses":[{"key":"dustveil","name":"Dust Veil","max":1,"rest":"short"}]},"Ash":{"note":"Elves of volcanic and badlands country, living on ground other peoples call cursed.","traits":[["Fire-Hardened","You have resistance to fire damage."],["Heat-Hardened","Extreme heat never harms you, and you can shed dim light in 10 ft at will."],["Ember Strike","When you hit with an attack, add 1d4 fire damage. Uses equal to your proficiency bonus per long rest."]],"uses":[{"key":"ember","name":"Ember Strike","max":"prof","rest":"long"}]},"Marsh":{"note":"Elves of the fens and mires, who walk where others sink.","traits":[["Venom-Hardened","You have resistance to poison damage."],["Fen-Walker","Mud, bog and shallow water are never difficult terrain for you, and you have advantage on saves against disease."],["Mire Snare","Bonus action: a creature within 30 ft makes a Strength save or its speed drops to 0 until the end of its next turn. Once per short or long rest."]],"uses":[{"key":"mire","name":"Mire Snare","max":1,"rest":"short"}]},"Mountain":{"note":"Elves of the crags and high passes, who climb where others turn back.","climb":20,"traits":[["Thin-Air Lungs","Advantage on Constitution saves against altitude and exhaustion."],["Crag Leap","Bonus action: double your jump distance this turn and take no damage from falling during it. Uses equal to your proficiency bonus per long rest."]],"uses":[{"key":"crag","name":"Crag Leap","max":"prof","rest":"long"}]}}},
    "Halfling": {"speed":25,"size":"Small","note":"Small, cheerful folk who settled the marshes and lakes around the capital because nobody else wanted them. Halfling towns are built on stilts, with a boat tied up at every door.","traits":[["Lucky","When you roll a natural 1 on an attack, check or save, you can reroll it and must use the new roll."],["Brave","Advantage on saves against being frightened."],["Nimble","You can move through the space of any creature larger than you."]]},
    "Dragonborn": {"speed":30,"size":"Medium","note":"Born of the draconic blood of the Draconic Wars, the dragonborn are proud, honest and bound by their word. Many serve House Ignis and the lords of [[Dragonsneck]], and few forget a debt or an insult.","traits":[["Draconic Ancestry","Pick a dragon colour when you make your character. It sets your breath weapon and damage resistance."],["Breath Weapon","Exhale destructive energy in a cone or a line, dealing damage that matches your ancestry. Uses equal to your proficiency bonus per long rest."],["Damage Resistance","Resistance to the damage type of your ancestry."]],"uses":[{"key":"breath","name":"Breath Weapon","max":"prof","rest":"long"}]},
    "Kobold": {"speed":30,"size":"Small","dark":60,"note":"Small scaled folk who claim the same draconic ancestor as the dragonborn, and serve the house with quick hands. Kobolds are scouts, traders and go-betweens, and most of the councillors of [[House Ignis]] are kobolds.","traits":[["Draconic Blood","Pick acid, cold, fire, lightning or poison when you make your character: you have resistance to that damage."],["Trapsmith","Advantage on Investigation and Perception checks to find traps, and setting or disarming one takes a bonus action."],["Cornered","Bonus action while below half your hit points: advantage on your next attack roll and +1 AC until the end of your next turn. Once per short or long rest."]],"uses":[{"key":"cornered","name":"Cornered","max":1,"rest":"short"}]},
    "Lizardfolk": {"speed":30,"swim":30,"size":"Medium","skill":"Stealth","note":"Cold-blooded hunters of the swamps and the warm coastal marshes. They are patient, practical and unbothered by most things that rattle other folk.","traits":[["Marsh-Born","You have a swim speed of 30 ft and ignore difficult terrain from mud and shallow water."],["Still as Stone","Proficiency in Stealth, and advantage on Stealth checks if you did not move on your turn."],["Snapping Bite","Reaction: when a melee attack misses you, bite the attacker for 1d4 plus your Strength modifier piercing damage. Uses equal to your proficiency bonus per long rest."]],"uses":[{"key":"snap","name":"Snapping Bite","max":"prof","rest":"long"}]},
    "Gnome": {"speed":25,"size":"Small","dark":60,"note":"Inventive tinkerers and tricksters who love a puzzle more than a fight. Gnomes make the best clockmakers and mapmakers in the isles, and they know a spell when they see one.","traits":[["Gnome Cunning","Advantage on Intelligence, Wisdom and Charisma saves against magic."]]},
    "Half-Elf": {"speed":30,"size":"Medium","dark":60,"extraSkill":2,"note":"Born of two peoples and at home in neither, half-elves are charming, adaptable and easy to underestimate. They are common in the port towns and in the courts of the great houses.","traits":[["Fey Ancestry","You have advantage against being charmed, and magic can’t put you to sleep."],["Skill Versatility","Proficiency in two skills of your choice."]]},
    "Half-Orc": {"speed":30,"size":"Medium","dark":60,"skill":"Intimidation","note":"Children of humans and orcs, raised on both sides of the prejudice. Half-orcs are strong, stubborn and often the first into a fight.","traits":[["Relentless Endurance","When you drop to 0 hit points but not outright, you drop to 1 hit point instead. Once per long rest."],["Savage Attacks","When you score a critical hit with a melee weapon, roll one extra damage die."]],"uses":[{"key":"relent","name":"Relentless Endurance","max":1,"rest":"long"}]},
    "Orc": {"speed":30,"size":"Medium","dark":120,"note":"The orcs of the isles came with the Landing as shock troops and were given the west when nobody else would have them. Most live in [[Marloo]], the herding country and the watch.","traits":[["Adrenaline Rush","As a bonus action, take the Dash action and gain temporary hit points equal to your proficiency bonus. Uses equal to your proficiency bonus per short or long rest."],["Relentless Endurance","When you drop to 0 hit points but not outright, you drop to 1 hit point instead. Once per long rest."]],"uses":[{"key":"rush","name":"Adrenaline Rush","max":"prof","rest":"short"},{"key":"relent","name":"Relentless Endurance","max":1,"rest":"long"}]},
    "Goliath": {"speed":35,"size":"Medium","skill":"Athletics","big":true,"note":"Mountain folk who test themselves against stone and weather. Goliaths in the isles work the quarries and the high roads, and they measure a life by its challenges.","traits":[["Giant Ancestry","Pick one when you make your character; use it a number of times equal to your proficiency bonus per long rest. Cloud’s Jaunt: bonus action, teleport 30 ft. Fire’s Burn: +1d10 fire damage on a hit. Frost’s Chill: +1d6 cold damage on a hit and −10 ft speed until your next turn. Hill’s Tumble: knock a Large or smaller target prone on a hit. Stone’s Endurance: reaction, reduce damage taken by 1d12 + Constitution. Storm’s Thunder: reaction, 1d8 thunder damage to a creature within 60 ft that hurt you."],["Large Form","From 5th level, bonus action: become Large for 10 minutes if there is room. Advantage on Strength checks and +10 ft speed while you are."],["Powerful Build","You count as one size larger for carrying and pushing."]],"uses":[{"key":"ancestry","name":"Giant Ancestry","max":"prof","rest":"long"}]},
    "Infernite": {"speed":30,"size":"Medium","dark":60,"note":"Folk with fiendish blood who are often judged by their horns before anything else. Infernites in the isles are scholars, bards and schemers, and some of them have made a good name for themselves.","traits":[["Infernal Ward","Resistance to fire damage."],["Hellbound Gift","You know Thaumaturgy. From 3rd level, you can cast Hellish Rebuke once per long rest. From 5th level, you can cast Darkness once per long rest. Both without mana."]]},
    "Shellback": {"group":"isles","speed":25,"size":"Medium","ac":{"base":15},"note":"Shellbacks are slow-moving, patient folk who carry their homes on their backs. They trade and keep shop along the [[The Golden Coast]], and they are known for keeping their word.","traits":[["Shell Plate","Your shell gives you AC 15. You can’t wear armour, but a shield still adds its bonus."],["Long Haul","Advantage on Constitution saves against exhaustion, and you need only half rations when travelling."],["Shell Brace","Reaction: when you take damage, reduce it by 1d8 plus your proficiency bonus. Once per short or long rest."]],"uses":[{"key":"brace","name":"Shell Brace","max":1,"rest":"short"}]},
    "Troglodyte": {"group":"isles","speed":30,"size":"Medium","dark":60,"ac":{"base":12,"stat":"dex"},"note":"Avarenth’s own: a draconic people from the deep enclaves of the Greywalls. Many work the dwarves’ mines and the charcoal pits, and they like warm caves more than open sky.","traits":[["Rock Hide","Without armour, your AC is 12 + Dexterity."],["Rockblend","Advantage on Stealth checks to hide in rocky terrain."],["Foul Musk","As a bonus action, creatures of your choice within 5 ft make a Constitution save or have disadvantage on attacks until your next turn. Once per short or long rest."],["Fang and Claw","Your bite and claws are natural weapons that deal 1d6 piercing and slashing damage."],["Sun Weakness","Disadvantage on sight-based Perception checks and on attacks in direct sunlight."]],"uses":[{"key":"musk","name":"Foul Musk","max":1,"rest":"short"}]},
    "Celestite": {"group":"rare","speed":30,"size":"Medium","note":"Folk touched by the light of the gods, with a faint glow in their eyes when they are moved. In the isles they are often taken for saints, and some of the church’s bishops would like them kept close.","traits":[["Halo-Marked","Resistance to radiant damage, and you shed dim light 10 ft at will."],["Truthlight","Advantage on Insight checks."],["Last Light","Reaction: when an ally within 30 ft drops to 0 hit points, they drop to 1 hit point instead. Once per long rest."]],"uses":[{"key":"light","name":"Last Light","max":1,"rest":"long"}]},
    "Goblin": {"group":"rare","speed":30,"size":"Small","dark":60,"skill":"Sleight of Hand","note":"Quick, clever and always half a step ahead of the bigger folk. Goblins make good scouts and worse neighbours, and they have a long memory for every slight.","traits":[["Light Fingers","Proficiency in Sleight of Hand."],["Underfoot","Advantage on attacks against a creature if one of your allies is within 5 ft of it."],["Slip Away","Reaction: when a melee attack misses you, move 10 ft without provoking opportunity attacks. Uses equal to your proficiency bonus per long rest."]],"uses":[{"key":"slip","name":"Slip Away","max":"prof","rest":"long"}]},
    "Hobgoblin": {"group":"rare","speed":30,"size":"Medium","note":"Disciplined soldiers who value order and a good plan. Hobgoblins keep their word and expect others to keep theirs, and their armies are feared for their discipline.","traits":[["Barracks Trained","Proficiency with one martial weapon of your choice and with light armour."],["Shield Wall","+1 AC while an ally is within 5 ft of you."],["Marshal’s Order","Reaction: an ally within 30 ft adds your proficiency bonus to an attack roll or save. Uses equal to your proficiency bonus per long rest."]],"uses":[{"key":"order","name":"Marshal’s Order","max":"prof","rest":"long"}]},
    "Corvin": {"group":"rare","speed":30,"size":"Medium","note":"Crow-folk who cannot make their own voices and so copy every sound they hear. They are clever, observant and very good at forgery.","traits":[["Sharp Memory","Advantage on checks to recall something you have seen or heard."],["Magpie Eye","Advantage on Investigation checks to spot valuables, hidden compartments and forgeries."],["Warning Caw","Reaction: allies within 30 ft who can hear you can’t be surprised this turn. Once per long rest."]],"uses":[{"key":"caw","name":"Warning Caw","max":1,"rest":"long"}]},
    "Felinari": {"group":"far","speed":30,"size":"Medium","dark":60,"skill":"Stealth","note":"Cat-folk who love to explore, collect and steal a little from everyone. They are curious, quick and often out of sight before anyone notices them.","traits":[["Cat’s Fall","Reaction: when you fall, reduce the fall damage by 3 × your level and land on your feet."],["Quiet Step","Proficiency in Stealth, and advantage on Stealth checks while moving at half speed or less."],["Night Prowler","Darkvision 60 ft, and advantage on sight-based Perception checks in dim light."]]},
    "Air Elementite": {"group":"far","speed":35,"size":"Medium","note":"Folk of the storm and the open sky, born where the air is thick with magic. They are restless, free and rarely kept in one place.","traits":[["Storm Ward","Resistance to lightning damage."],["Airborne","Your jumps are doubled, and thin air or altitude never hurts you."],["Gale Shove","Bonus action: push a Medium or smaller creature within 5 ft 10 ft away (Strength save). Uses equal to your proficiency bonus per long rest."]],"uses":[{"key":"gale","name":"Gale Shove","max":"prof","rest":"long"}]},
    "Earth Elementite": {"group":"far","speed":30,"size":"Medium","note":"Folk of stone and deep ground, steady and slow to anger. They can feel the earth move before anyone else does.","traits":[["Tremor Sense","While standing on earth or stone you sense creatures touching the ground within 15 ft, even unseen."],["Stonebound","Advantage on saves against being pushed, pulled or knocked prone."],["Rooted","Bonus action: until the start of your next turn your speed is 0, you can’t be moved, and you have advantage on Strength and Constitution saves. Once per short or long rest."]],"uses":[{"key":"rooted","name":"Rooted","max":1,"rest":"short"}]},
    "Fire Elementite": {"group":"far","speed":30,"size":"Medium","dark":60,"note":"Folk of flame and ember, warm-hearted and quick-tempered. A fire elementite is rarely cold, and rarely quiet.","traits":[["Flame Ward","Resistance to fire damage."],["Hearth-Born","You can light or snuff small flames within 10 ft, you shed dim light 10 ft at will, and cold exposure never hurts you."],["Ember Burst","Reaction: when a creature hits you in melee, it takes fire damage equal to your proficiency bonus. Once per short or long rest."]],"uses":[{"key":"ember","name":"Ember Burst","max":1,"rest":"short"}]},
    "Water Elementite": {"group":"far","speed":30,"swim":30,"size":"Medium","note":"Folk of rain, tide and fog. They are calm, patient and most at home near the water, where they can hear the sea talk.","traits":[["Acid Ward","Resistance to acid damage."],["Tidal Lungs","You breathe air and water, and you have a swim speed of 30 ft."],["Rolling Wave","When you hit with a melee attack, push the target 5 ft (Strength save). Once per short or long rest."]],"uses":[{"key":"wave","name":"Rolling Wave","max":1,"rest":"short"}]},
    "Centaur": {"group":"far","speed":40,"size":"Medium","skill":"Survival","big":true,"note":"Half-horse, half-person, and proud of both. Centaurs are free-roaming herders and archers who keep to the plains and the high grasslands.","traits":[["Fey","Your creature type is fey."],["Four-Legged","Your walking speed is 40 feet, and you count as one size larger for carrying and pushing."],["Plains-Wise","Proficiency in Survival."],["Trample","When you move at least 20 ft straight at a creature and hit it with a melee attack, it makes a Strength save or is knocked prone. Once per short or long rest."]],"uses":[{"key":"trample","name":"Trample","max":1,"rest":"short"}]},
    "Minotaur": {"group":"far","speed":30,"size":"Medium","skill":"Athletics","note":"Bull-headed folk of the labyrinths and deep mazes. They have a sure sense of direction and a strong sense of duty.","traits":[["Never Lost","You perfectly recall any path you have walked, and you have advantage on Survival checks to navigate or track."],["Bullish","Proficiency in Athletics."],["Skull Slam","Bonus action after a melee hit: headbutt an adjacent creature for 1d6 plus your Strength modifier bludgeoning damage. It can’t take reactions until the start of its next turn. Uses equal to your proficiency bonus per long rest."]],"uses":[{"key":"slam","name":"Skull Slam","max":"prof","rest":"long"}]},
    "Elephantra": {"group":"far","speed":30,"size":"Medium","ac":{"base":11,"stat":"con"},"big":true,"note":"Elephant-folk who are calm, long-memoried and very hard to frighten. They are known as peacemakers and keep the records of their villages.","traits":[["Heavy Frame","You count as one size larger for carrying and pushing. Without armour, your AC is 11 + Constitution."],["Keen Smell","Advantage on Perception, Investigation and Survival checks that rely on smell."],["Trunk Hold","After a melee hit, bonus action: grapple the target with your trunk. Once per short or long rest."]],"uses":[{"key":"trunk","name":"Trunk Hold","max":1,"rest":"short"}]},
    "Leonari": {"group":"far","speed":35,"size":"Medium","skill":"Intimidation","note":"Lion-folk who hunt in pride and are loyal to their own. Leonari are bold, proud and quick to defend the people they call family.","traits":[["Lion’s Challenge","Bonus action: pick a creature within 30 ft that can hear you. It makes a Wisdom save or has disadvantage on attacks against anyone but you until the start of your next turn. Once per short or long rest."],["Pride Voice","Proficiency in Intimidation."],["Long Stride","Your walking speed is 35 feet."]],"uses":[{"key":"challenge","name":"Lion’s Challenge","max":1,"rest":"short"}]},
    "Airyn": {"group":"far","speed":30,"size":"Medium","note":"Bird-folk of a far country of high cliffs, where there are more mountains than anything else. The Airyn build their towns on the mountaintops and fly from cliff to cliff, and the ground is a place they visit, not where they live. In the isles they are quick, curious and never quite at ease with a roof over their heads.","traits":[["Short Wings","Once per turn, fly up to 20 feet as part of your move, ending on solid ground. Not in heavy armour. Uses equal to your proficiency bonus per long rest."],["Hollow Bones","Your jumps are doubled and you take half damage from falling."],["Eagle Eyes","Advantage on sight-based Perception checks outdoors, and you see detail at double the normal distance."]],"uses":[{"key":"wings","name":"Short Wings","max":"prof","rest":"long"}]},
    "Satyr": {"group":"far","speed":35,"size":"Medium","skill":"Performance","note":"Revellers of the glades and the festivals. Satyrs are music, mischief and mirth, and they can make a party out of a funeral.","traits":[["Fey","Your creature type is fey."],["Goat-Footed","Your walking speed is 35 feet, and you ignore difficult terrain from rubble and steep slopes."],["Reveler","Proficiency in Performance and with one musical instrument."],["Merry Mischief","Choose a creature within 30 ft that can hear you. It makes a Wisdom save or its speed is halved until the start of your next turn. Uses equal to your proficiency bonus per long rest."]],"uses":[{"key":"mischief","name":"Merry Mischief","max":"prof","rest":"long"}]},
    "Fairy": {"group":"far","speed":30,"fly":20,"size":"Small","note":"Small folk of the fey woods, bright and quick to take offence. Fairies can be kind or cruel, and they are almost never boring.","traits":[["Fey","Your creature type is fey."],["Gossamer Wings","You have a fly speed of 20 feet, but you must end each turn on a surface and can’t fly in medium or heavy armour."],["Fey Sense","You sense fey creatures and fey magic within 30 ft, and you shed dim light 5 ft at will."],["Glimmer","Bonus action: a creature within 30 ft sparkles. It can’t hide, and the next attack against it has advantage. Once per short or long rest."]],"uses":[{"key":"glimmer","name":"Glimmer","max":1,"rest":"short"}]},
    "Serpenoid": {"group":"far","speed":30,"size":"Medium","dark":60,"skill":"Deception","note":"Snake-blooded folk who hide their nature and carry old serpent magic. Many are scholars of poison and secrets, and they do not like being looked at too closely.","traits":[["Hidden Scales","Proficiency in Deception."],["Venom Veins","Resistance to poison damage, and advantage against being poisoned."],["Venom Bite","Bonus action: bite an adjacent creature for 1d4 poison damage. It makes a Constitution save or is poisoned until the end of your next turn. Uses equal to your proficiency bonus per long rest."]],"uses":[{"key":"bite","name":"Venom Bite","max":"prof","rest":"long"}]},
    "Reefkin": {"group":"rare","speed":30,"swim":30,"size":"Medium","skill":"Athletics","note":"Fish-folk of the deep and the reef, with scales that shine in the dark. They are strong swimmers and stubborn defenders of their home waters.","traits":[["Gills","You have a swim speed of 30 ft and you breathe air and water."],["Reef-Strong","Proficiency in Athletics."],["Sea’s Resolve","Advantage on saves against being frightened or poisoned."],["Murk Cloud","Reaction: when you are hit, release ink that heavily obscures a 10 ft area around you until the start of your next turn, and move 10 ft. Once per short or long rest."]],"uses":[{"key":"murk","name":"Murk Cloud","max":1,"rest":"short"}]},
    "Leapori": {"group":"far","speed":35,"size":"Medium","skill":"Perception","note":"Hare-folk of the wild meadows and the hedgerows. They notice trouble first and would rather leave it behind than stand and fight.","traits":[["Long Ears","Proficiency in Perception, and advantage on hearing-based Perception checks."],["Fleet","Your walking speed is 35 feet."],["Bolt","Bonus action: take the Dash action. Creatures can’t make opportunity attacks against you this turn. Once per short or long rest."]],"uses":[{"key":"bolt","name":"Bolt","max":1,"rest":"short"}]},
    "Strixen": {"group":"far","speed":30,"size":"Medium","dark":60,"skill":"Stealth","note":"Owl-folk of the deep woods and old ruins. They move without a sound, see clearly in the dark and are rarely heard coming.","traits":[["Night Eyes","Darkvision 60 ft: darkness counts as dim light and dim light as bright."],["Hushed Step","Proficiency in Stealth."],["Wide Gaze","You can’t be flanked, and you have advantage on Perception checks against creatures behind you."]]},
    "Ranari": {"group":"far","speed":25,"climb":25,"size":"Small","skill":"Acrobatics","note":"Small, bright-coloured frog-folk of the jungle whose skin is poisonous to the touch. They must return to water often, and they are rarely caught off guard.","traits":[["Sticky Pads","You have a climb speed of 25 ft and proficiency in Acrobatics."],["Springy","Your jumps are tripled, and you don’t need a run-up."],["Slippery","Reaction: when you are grappled or restrained, you slip free. Once per short or long rest."]],"uses":[{"key":"slippery","name":"Slippery","max":1,"rest":"short"}]},
    "Mantari": {"group":"far","speed":30,"size":"Medium","dark":60,"ac":{"base":12,"stat":"dex"},"note":"Insectoid folk of the savannah with four arms and a chameleon-like carapace. They are sleepless and focused, and they talk to one another without speaking.","traits":[["Chitin Plate","Without armour, your AC is 12 + Dexterity."],["Compound Eyes","Darkvision 60 ft, and advantage on Perception checks to notice movement."],["Never Sleeps","You don’t need sleep, and magic can’t put you to sleep."],["Mantis Snap","Bonus action: strike a creature within 5 ft with your raptor arms for 1d6 plus your Strength modifier piercing damage. Uses equal to your proficiency bonus per long rest."]],"uses":[{"key":"snap","name":"Mantis Snap","max":"prof","rest":"long"}]},
    "Apereth": {"group":"far","speed":30,"climb":30,"size":"Medium","skill":"Acrobatics","note":"Monkey-folk of the island jungles who glide between the treetops on flaps of skin. They are nimble and acrobatic, and happy to trade a fight for a bit of showing off.","traits":[["Treetop Born","You have a climb speed of 30 ft and proficiency in Acrobatics."],["Prehensile Tail","Your tail can hold one item, and you have advantage on checks to hang or swing from things."],["Quick Grab","Bonus action: snatch an unattended item within 10 ft, or make a contested Sleight of Hand check to take a loose worn item. Uses equal to your proficiency bonus per long rest."]],"uses":[{"key":"grab","name":"Quick Grab","max":"prof","rest":"long"}]},
    "Hippotrus": {"group":"far","speed":30,"swim":30,"size":"Medium","big":true,"note":"Big, cheerful hippo-folk of the river country, and extremely good with firearms. They treat a gun like a finely made tool and never miss a chance to laugh.","traits":[["Steady Strike","Once per turn, add your proficiency bonus to damage with a simple or martial weapon. Uses equal to your proficiency bonus per long rest."],["Gunpowder Craft","Proficiency with firearms, with no loading penalty."],["Powerful Build","You count as one size larger for carrying and pushing, and you have advantage on Strength saves."]],"uses":[{"key":"steady","name":"Steady Strike","max":"prof","rest":"long"}]},
    "Ironcored": {"group":"rare","speed":30,"size":"Medium","ac":{"base":12,"stat":"dex"},"note":"Clockwork people built for the Draconic Wars, each running on a persona core made in the [[Draconic Imperium]]. A few dwarves and draconic folk can still make a core, but a new one is dull and slow beside the old. A player Ironcored is always one of the war-era makings. Nobody has settled whether an Ironcored is a person or property. See [[Clockwork]].","traits":[["War-era Persona Core","Your mind runs on a persona core made in the Draconic Imperium, with years of experience behind it. You get flashbacks of the Draconic Wars; the DM decides when they come and what they show. Advantage on all Intelligence (History) checks."],["Clockwork Body","You don’t need to eat, drink or breathe, you can’t catch diseases, and you have advantage on saves against being poisoned. In Avarenth you count as clockwork, with deeper, mystical magic than any helper or commissioned warrior."],["Plated Body","Without armour, your AC is 12 + Dexterity. You can still wear armour normally."],["Spring Surge","Bonus action: gain 1d8 plus your proficiency bonus in temporary hit points as your springs tighten. Once per short or long rest."]],"uses":[{"key":"surge","name":"Spring Surge","max":1,"rest":"short"}]}
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
      'Akoron': { Cleric: ['Life Domain', 'Dawn Domain', 'Harmony Domain'], Warlock: ['The Radiant Patron'], Paladin: ['Oath of Devotion', 'Oath of Mercy'] },
      'Roselle': { Cleric: ['Wildwood Domain', 'Life Domain'], Warlock: ['The Radiant Patron'], Paladin: ['Oath of the Elders', 'Oath of Mercy'] },
      'Azrul': { Cleric: ['Grim Domain', 'Tomb Domain', 'Dusk Domain'], Warlock: ['The Radiant Patron'], Paladin: ['Oath of the Nightwatch', 'Oath of Devotion'] },
      'Korinth': { Cleric: ['Lore Domain', 'Sigil Domain'], Warlock: ['The Radiant Patron'], Paladin: ['Oath of the Nightwatch', 'Oath of Devotion'] },
      'Thorum': { Cleric: ['Thunder Domain'], Warlock: ['The Radiant Patron', 'The Deep Patron'], Paladin: ['Oath of Reckoning', 'Oath of Renown'] },
      'Florin': { Cleric: ['Mischief Domain'], Warlock: ['The Radiant Patron'], Paladin: ['Oath of Renown', 'Oath of Mercy'] },
      'Rook': { Cleric: ['Battle Domain', 'Law Domain', 'Anvil Domain'], Warlock: ['The Radiant Patron'], Paladin: ['Oath of Devotion', 'Oath of Dominion', 'Oath of Renown'] },
      'The Hungering Head': { Cleric: ['Grim Domain', 'Dusk Domain'], Warlock: ['The Outer Horror'], Paladin: ['Oathbroken', 'Oath of Dominion'] },
      'Kharneth': { Cleric: ['Law Domain', 'Lore Domain'], Warlock: ['The Fiend'], Paladin: ['Oath of Dominion', 'Oath of Reckoning'] },
      'Drakhar': { Cleric: ['Battle Domain', 'Law Domain'], Warlock: ['The Bladebound', 'The Fiend'], Paladin: ['Oath of Dominion'] },
      'The Pyre-Saint': { Cleric: ['Dawn Domain', 'Battle Domain'], Warlock: ['The Radiant Patron', 'The Fiend'], Paladin: ['Oath of Reckoning', 'Oath of Dominion'] },
      'Marrow': { Cleric: ['Grim Domain', 'Wildwood Domain'], Warlock: ['The Deathless', 'The Outer Horror'] },
      'Velvet': { Cleric: ['Mischief Domain', 'Dusk Domain'], Warlock: ['The Fey Court'] },
      'Sytha': { Cleric: ['Mischief Domain', 'Wildwood Domain'], Warlock: ['The Fey Court', 'The Outer Horror'] },
      'The Nine Below': { Cleric: ['Grim Domain', 'Tomb Domain'], Warlock: ['The Deathless'], Paladin: ['Oathbroken', 'Oath of Reckoning'] },
      'The Mask': { Cleric: ['Mischief Domain'], Warlock: ['The Fey Court', 'The Outer Horror'] },
      'Veyl': { Cleric: ['Lore Domain', 'Sigil Domain'], Warlock: ['The Outer Horror'] },
      'Vaunt and Ruin': { Cleric: ['Battle Domain'], Warlock: ['The Bladebound', 'The Fiend'], Paladin: ['Oath of Renown', 'Oath of Dominion', 'Oathbroken'] },
      'Lull': { Cleric: ['Thunder Domain', 'Grim Domain'], Warlock: ['The Deep Patron'] }
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
