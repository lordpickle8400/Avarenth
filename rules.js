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
    about: 'Performers whose songs and spells are one craft, inspiring allies and unsettling enemies alike.',
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
    about: 'Priests who channel the power of their gods, healing the wounded and turning back the dead.',
    hd: 8, primary: 'Wisdom', saves: ['wis', 'cha'],
    armor: 'Light and medium armor, shields', weapons: 'Simple weapons', tools: '',
    skills: { n: 2, from: ['History', 'Insight', 'Medicine', 'Persuasion', 'Religion'] },
    subclassLevel: 1, subclassLabel: 'Divine Domain', asi: [4, 8, 12, 16, 19],
    subclasses: ['Knowledge Domain', 'Life Domain', 'Light Domain', 'Nature Domain', 'Tempest Domain', 'Trickery Domain', 'War Domain', 'Forge Domain', 'Grave Domain', 'Order Domain', 'Peace Domain', 'Twilight Domain', 'Arcana Domain', 'Death Domain'],
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
    subclasses: ['Circle of the Land', 'Circle of the Moon', 'Circle of Dreams', 'Circle of the Shepherd', 'Circle of Spores', 'Circle of Stars', 'Circle of Wildfire'],
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
    subclasses: ['Champion', 'Battle Master', 'Eldritch Knight', 'Arcane Archer', 'Cavalier', 'Samurai', 'Echo Knight', 'Psi Warrior', 'Rune Knight'],
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
    about: 'Holy warriors bound by an oath, who guard the innocent and smite the wicked with divine might.',
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
    about: 'Wilderness hunters and trackers who fight with blade and bow, and who walk the edges of the settled lands.',
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
    about: 'Stealthy opportunists who strike from the shadows, pick locks and find the weak point in any defense.',
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
    about: 'Gifted casters whose magic is innate and wild, flowing out of a single source in their blood.',
    hd: 6, primary: 'Charisma', saves: ['con', 'cha'],
    armor: 'None', weapons: 'Daggers, darts, slings, quarterstaffs, light crossbows', tools: '',
    skills: { n: 2, from: ['Arcana', 'Deception', 'Insight', 'Intimidation', 'Persuasion', 'Religion'] },
    subclassLevel: 1, subclassLabel: 'Sorcerous Origin', asi: [4, 8, 12, 16, 19],
    subclasses: ['Draconic Bloodline', 'Wild Magic', 'Divine Soul', 'Shadow Magic', 'Storm Sorcery', 'Aberrant Mind', 'Clockwork Soul'],
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
    about: 'Scholars of arcane lore who learn spells from their books and shape the world through careful study.',
    hd: 6, primary: 'Intelligence', saves: ['int', 'wis'],
    armor: 'None', weapons: 'Daggers, darts, slings, quarterstaffs, light crossbows', tools: '',
    skills: { n: 2, from: ['Arcana', 'History', 'Insight', 'Investigation', 'Medicine', 'Religion'] },
    subclassLevel: 2, subclassLabel: 'Arcane Tradition', asi: [4, 8, 12, 16, 19],
    subclasses: ['School of Abjuration', 'School of Conjuration', 'School of Divination', 'School of Enchantment', 'School of Evocation', 'School of Illusion', 'School of Necromancy', 'School of Transmutation', 'Bladesinging', 'War Magic', 'Chronurgy Magic', 'Graviturgy Magic', 'Order of Scribes'],
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
    'Human': { speed: 30, size: 'Medium', note: 'The most common folk of the isles and the empire alike. Humans came with the Landing and have been building ever since, from the cramped streets of [[Loreaon]] to the far baronies of the west.', traits: [['Versatile', 'Humans are quick to learn and quick to adapt. Gain one extra skill proficiency of your choice.']], extraSkill: 1 },
    'Dwarf': { speed: 25, size: 'Medium', dark: 60, note: 'Stone-hewers and smiths who keep old oaths and older grudges. The dwarves of the isles still dig, forge and drink in the halls under the high hills, and they remember every debt.', traits: [['Dwarven Resilience', 'You have advantage on saves against poison, and resistance to poison damage.'], ['Stonecunning', 'You know stonework, its history and how old a wall is just by looking at it. Advantage on History checks about stonework.'], ['Heavy Armor Stride', 'Heavy armor doesn’t slow your speed down.']] },
    'Elf': { speed: 30, size: 'Medium', dark: 60, skill: 'Perception', note: 'Long-lived and slow to trust, the elves of the isles are mostly gone. The few who remain keep to quiet corners and remember when the forests were theirs.', traits: [['Keen Senses', 'Proficiency in Perception.'], ['Fey Ancestry', 'You have advantage against being charmed, and magic can’t put you to sleep.'], ['Trance', 'You meditate for 4 hours instead of sleeping, and come out of it rested.']] },
    'Halfling': { speed: 25, size: 'Small', note: 'Small, cheerful folk who settled the marshes and lakes around the capital because nobody else wanted them. Halfling towns are built on stilts, with a boat tied up at every door.', traits: [['Lucky', 'When you roll a natural 1 on an attack, check or save, you can reroll it and must use the new roll.'], ['Brave', 'Advantage on saves against being frightened.'], ['Nimble', 'You can move through the space of any creature larger than you.']] },
    'Dragonborn': { speed: 30, size: 'Medium', note: 'Born of the draconic blood of the Draconic Wars, the dragonborn are proud, honest and bound by their word. Many serve House Ignis and the lords of [[Dragonsneck]], and few forget a debt or an insult.', traits: [['Draconic Ancestry', 'Pick a dragon colour when you make your character. It sets your breath weapon and damage resistance.'], ['Breath Weapon', 'Exhale destructive energy in a cone or a line, dealing damage that matches your ancestry. Recharges on a short or long rest.'], ['Damage Resistance', 'Resistance to the damage type of your ancestry.']] },
    'Kobold': { speed: 30, size: 'Small', dark: 60, note: 'Small scaled folk who claim the same draconic ancestor as the dragonborn, and serve the house with quick hands. Kobolds are scouts, traders and go-betweens, and most of the councillors of [[House Ignis]] are kobolds.', traits: [['Draconic Cry', 'As a bonus action, give one ally you can see advantage on their next attack roll. Uses equal to proficiency bonus per long rest.'], ['Kobold Legacy', 'A small draconic gift: a skill proficiency, a cantrip, or resistance to one damage type of your choice.']] },
    'Lizardfolk': { speed: 30, size: 'Medium', note: 'Cold-blooded hunters of the swamps and the warm coastal marshes. They are patient, practical and unbothered by most things that rattle other folk.', traits: [['Bite', 'Your bite is a natural weapon that deals 1d6 piercing damage.'], ['Hold Breath', 'You can hold your breath for 15 minutes.'], ['Natural Armor', 'Without armour, your AC is 13 + Dexterity.'], ['Hungry Jaws', 'As a bonus action, bite a creature you can reach and gain temporary hit points. Once per short or long rest.']] },
    'Gnome': { speed: 25, size: 'Small', dark: 60, note: 'Inventive tinkerers and tricksters who love a puzzle more than a fight. Gnomes make the best clockmakers and mapmakers in the isles, and they know a spell when they see one.', traits: [['Gnome Cunning', 'Advantage on Intelligence, Wisdom and Charisma saves against magic.']] },
    'Half-Elf': { speed: 30, size: 'Medium', dark: 60, note: 'Born of two peoples and at home in neither, half-elves are charming, adaptable and easy to underestimate. They are common in the port towns and in the courts of the great houses.', traits: [['Fey Ancestry', 'You have advantage against being charmed, and magic can’t put you to sleep.'], ['Skill Versatility', 'Proficiency in two skills of your choice.']], extraSkill: 2 },
    'Half-Orc': { speed: 30, size: 'Medium', dark: 60, skill: 'Intimidation', note: 'Children of humans and orcs, raised on both sides of the prejudice. Half-orcs are strong, stubborn and often the first into a fight.', traits: [['Relentless Endurance', 'When you drop to 0 hit points but not outright, you drop to 1 hit point instead. Once per long rest.'], ['Savage Attacks', 'When you score a critical hit with a melee weapon, roll one extra damage die.']] },
    'Orc': { speed: 30, size: 'Medium', dark: 60, note: 'The orcs of the isles came with the Landing as shock troops and were given the west when nobody else would have them. Most live in [[Marloo]], the herding country and the watch.', traits: [['Adrenaline Rush', 'As a bonus action, take the Dash action and gain temporary hit points equal to your proficiency bonus. Uses equal to proficiency bonus per long rest.'], ['Powerful Build', 'You count as one size larger for carrying and pushing.']] },
    'Goliath': { speed: 30, size: 'Medium', skill: 'Athletics', note: 'Mountain folk who test themselves against stone and weather. Goliaths in the isles work the quarries and the high roads, and they measure a life by its challenges.', traits: [['Stone’s Endurance', 'When you take damage, use your reaction to reduce it by a roll of your d12 plus your Constitution. Once per short or long rest.'], ['Powerful Build', 'You count as one size larger for carrying and pushing.'], ['Mountain Born', 'You have resistance to cold damage and are at home at high altitude.']] },
    'Tiefling': { speed: 30, size: 'Medium', dark: 60, note: 'Folk with fiendish blood who are often judged by their horns before anything else. Tieflings in the isles are scholars, bards and schemers, and some of them have made a good name for themselves.', traits: [['Hellish Resistance', 'Resistance to fire damage.'], ['Infernal Legacy', 'You know Thaumaturgy. From 3rd level, you can cast Hellish Rebuke once per long rest. From 5th level, you can cast Darkness once per long rest. Both without mana.']] },

    // More peoples (summaries in our own words). group: 'isles' lives in Avarenth, 'rare' is seldom seen, 'far' comes from beyond the empire. Ask the DM before playing a 'far' one. Innate spells cast without mana.
    'Sea Elf': { group: 'isles', speed: 30, swim: 30, size: 'Medium', dark: 60, skill: 'Perception', note: 'Sea elves are the last of the old elven seafolk, and most keep faith with Thorum. Many of them live in the city-state of [[The City-State of Coralyn]] and on the sea-chapels of [[Galecliff]].', traits: [['Child of the Sea', 'You have a swim speed of 30 ft, and you can breathe air and water.'], ['Friend of the Sea', 'You can speak simple ideas with sea beasts.'], ['Keen Senses', 'Proficiency in Perception.'], ['Fey Ancestry', 'You have advantage against being charmed, and magic can’t put you to sleep.'], ['Trance', 'You meditate for 4 hours instead of sleeping.']] },
    'Drow': { group: 'isles', speed: 30, size: 'Medium', dark: 120, skill: 'Perception', note: 'The dark elves of the deep places. Surface folk distrust them on sight, and the drow have long memories of being driven out of the light.', traits: [['Superior Darkvision', 'You can see 120 ft in darkness.'], ['Drow Magic', 'Dancing Lights at will. Faerie Fire at 3rd level and Darkness at 5th, each once per long rest without mana.'], ['Keen Senses', 'Proficiency in Perception.'], ['Fey Ancestry', 'You have advantage against being charmed, and magic can’t put you to sleep.'], ['Trance', 'You meditate for 4 hours instead of sleeping.']] },
    'Tortle': { group: 'isles', speed: 30, size: 'Medium', note: 'Tortles are slow-moving, patient folk who carry their homes on their backs. They trade and keep shop along the [[The Golden Coast]], and they are known for keeping their word.', traits: [['Natural Armor', 'Your shell gives you AC 17. You can’t wear armour, but a shield still adds its bonus.'], ['Shell Defense', 'As an action, withdraw into your shell for +4 AC and advantage on Strength and Constitution saves, but you are prone and can’t move or act until you come out.'], ['Claws', 'Your claws are natural weapons that deal 1d6 slashing damage.'], ['Hold Breath', 'You can hold your breath for an hour.'], ['Nature’s Intuition', 'Proficiency in one of Animal Handling, Medicine, Nature, Perception, Stealth or Survival.']], extraSkill: 1 },
    'Troglodyte': { group: 'isles', speed: 30, size: 'Medium', dark: 60, note: 'Avarenth’s own: a draconic people from the deep enclaves of the Greywalls. Many work the dwarves’ mines and the charcoal pits, and they like warm caves more than open sky.', traits: [['Stone Skin', 'Without armour, your AC is 12 + Dexterity.'], ['Chameleon Skin', 'Advantage on Stealth checks to hide in rocky terrain.'], ['Stench', 'As a bonus action, creatures of your choice within 5 ft make a Constitution save or have disadvantage on attacks until your next turn. Once per short or long rest.'], ['Bite and Claws', 'Your bite and claws are natural weapons that deal 1d6 piercing and slashing damage.'], ['Sunlight Sensitivity', 'Disadvantage on sight-based Perception checks and on attacks in direct sunlight.']] },
    'Aasimar': { group: 'rare', speed: 30, size: 'Medium', dark: 60, note: 'Folk touched by the light of the gods, with a faint glow in their eyes when they are moved. In the isles they are often taken for saints, and some of the church’s bishops would like them kept close.', traits: [['Celestial Resistance', 'Resistance to necrotic and radiant damage.'], ['Healing Hands', 'As an action, touch a creature to heal it by a d4 per proficiency bonus. Once per long rest.'], ['Light Bearer', 'You know the Light cantrip.'], ['Celestial Revelation', 'From 3rd level, transform for a minute once per long rest: radiant wings to fly, a searing aura, or a frightening shroud, each adding radiant or necrotic damage.']] },
    'Firbolg': { group: 'rare', speed: 30, size: 'Medium', note: 'Gentle forest giant-kin who keep to the deep woods and avoid the towns. They are quiet, watchful and very patient with those who respect the trees.', traits: [['Firbolg Magic', 'Detect Magic and Disguise Self, each once per long rest without mana.'], ['Hidden Step', 'As a bonus action, turn invisible until the start of your next turn. Uses equal to proficiency bonus per long rest.'], ['Powerful Build', 'You count as one size larger for carrying and pushing.'], ['Speech of Beast and Leaf', 'Beasts and plants understand the gist of what you say.']] },
    'Goblin': { group: 'rare', speed: 30, size: 'Small', dark: 60, note: 'Quick, clever and always half a step ahead of the bigger folk. Goblins make good scouts and worse neighbours, and they have a long memory for every slight.', traits: [['Fury of the Small', 'Once per turn, add your proficiency bonus to damage against a creature larger than you. Uses equal to proficiency bonus per long rest.'], ['Nimble Escape', 'As a bonus action, take the Disengage or Hide action.'], ['Fey Ancestry', 'You have advantage against being charmed.']] },
    'Hobgoblin': { group: 'rare', speed: 30, size: 'Medium', dark: 60, note: 'Disciplined soldiers who value order and a good plan. Hobgoblins keep their word and expect others to keep theirs, and their armies are feared for their discipline.', traits: [['Fortune from the Many', 'When you miss or fail a check, add a bonus equal to the number of allies you can see (up to 3). Uses equal to proficiency bonus per long rest.'], ['Fey Gift', 'When you use the Help action, the ally gets a small boon as well. Uses equal to proficiency bonus per long rest.'], ['Fey Ancestry', 'You have advantage against being charmed.']] },
    'Bugbear': { group: 'rare', speed: 30, size: 'Medium', dark: 60, skill: 'Stealth', note: 'The goblinkin’s shock troops: big, strong and not clever. A goblin boss or a hobgoblin captain points a bugbear at a gate or a wall and waits. Told to wait in the dark, a bugbear will sit there all night without a sound, and when it is told to stop waiting it hits first and hardest.', traits: [['Long Reach', 'Your melee reach is 5 ft longer on your turn.'], ['Ambusher’s Strike', 'If you hit a creature that hasn’t acted yet in combat, that creature takes an extra 2d6 damage.'], ['Powerful Build', 'You count as one size larger for carrying and pushing, and you can squeeze through Small spaces.'], ['Sneaky', 'Proficiency in Stealth.'], ['Fey Ancestry', 'You have advantage against being charmed.']] },
    'Kenku': { group: 'rare', speed: 30, size: 'Medium', note: 'Crow-folk who cannot make their own voices and so copy every sound they hear. They are clever, observant and very good at forgery.', traits: [['Expert Duplication', 'Advantage when copying writing or craftwork you have seen.'], ['Kenku Recall', 'Proficiency in two skills, and advantage on a check with a skill you know. Uses equal to proficiency bonus per long rest.'], ['Mimicry', 'You can imitate sounds and voices you have heard.']], extraSkill: 2 },
    'Tabaxi': { group: 'far', speed: 30, climb: 30, size: 'Medium', dark: 60, skill: 'Perception', note: 'Cat-folk who love to explore, collect and steal a little from everyone. They are curious, quick and often out of sight before anyone notices them.', traits: [['Cat’s Claws', 'You have a climb speed of 30 ft, and your claws deal 1d6 slashing damage.'], ['Cat’s Talent', 'Proficiency in Stealth.'], ['Feline Agility', 'Double your speed for a turn. It recharges when you don’t move for a turn.']], extraSkill: 1 },
    'Triton': { group: 'rare', speed: 30, swim: 30, size: 'Medium', dark: 60, note: 'Guardians of the deep water. Sailors swear they have seen them off the Quilted Sea, and that they will answer a call for help from a drowning crew.', traits: [['Amphibious', 'You can breathe air and water, and you have a swim speed of 30 ft.'], ['Control Air and Water', 'Fog Cloud. Gust of Wind at 3rd level and Water Walk at 5th, each once per long rest without mana.'], ['Emissary of the Sea', 'You can speak simple ideas with water-breathing creatures.'], ['Guardian of the Depths', 'Resistance to cold damage, and no penalty for deep water.']] },
    'Air Genasi': { group: 'far', speed: 35, size: 'Medium', dark: 60, note: 'Folk of the storm and the open sky, born where the air is thick with magic. They are restless, free and rarely kept in one place.', traits: [['Unending Breath', 'You can hold your breath as long as you like.'], ['Lightning Resistance', 'Resistance to lightning damage.'], ['Mingle with the Wind', 'Shocking Grasp. Feather Fall at 3rd level and Levitate at 5th, each once per long rest without mana.']] },
    'Earth Genasi': { group: 'far', speed: 30, size: 'Medium', dark: 60, note: 'Folk of stone and deep ground, steady and slow to anger. They can feel the earth move before anyone else does.', traits: [['Earth Walk', 'Difficult terrain of earth or stone doesn’t slow you.'], ['Merge with Stone', 'As a bonus action, cast Blade Ward a few times per long rest. Pass without Trace at 5th level, once per long rest without mana.']] },
    'Fire Genasi': { group: 'far', speed: 30, size: 'Medium', dark: 60, note: 'Folk of flame and ember, warm-hearted and quick-tempered. A fire genasi is rarely cold, and rarely quiet.', traits: [['Fire Resistance', 'Resistance to fire damage.'], ['Reach to the Blaze', 'Produce Flame. Burning Hands at 3rd level and Flame Blade at 5th, each once per long rest without mana.']] },
    'Water Genasi': { group: 'far', speed: 30, swim: 30, size: 'Medium', dark: 60, note: 'Folk of rain, tide and fog. They are calm, patient and most at home near the water, where they can hear the sea talk.', traits: [['Acid Resistance', 'Resistance to acid damage.'], ['Amphibious', 'You can breathe air and water, and you have a swim speed of 30 ft.'], ['Call to the Wave', 'Acid Splash. Create or Destroy Water at 3rd level and Water Walk at 5th, each once per long rest without mana.']] },
    'Dhampir': { group: 'rare', speed: 30, size: 'Medium', dark: 60, note: 'Half-living, touched by vampirism. Hide it in Doresmere, where the church would burn them as soon as look at them.', traits: [['Ancestral Legacy', 'Keep two skills of another species, or gain two of your choice.'], ['Deathless Nature', 'You don’t need to breathe.'], ['Spider Climb', 'You can climb walls and ceilings from 3rd level, without needing to make an ability check.'], ['Vampiric Bite', 'As an action, bite a creature to heal yourself or boost your next roll when it hits. Uses equal to proficiency bonus per long rest.']], extraSkill: 1 },
    'Centaur': { group: 'far', speed: 40, size: 'Medium', note: 'Half-horse, half-person, and proud of both. Centaurs are free-roaming herders and archers who keep to the plains and the high grasslands.', traits: [['Fey', 'Your creature type is fey.'], ['Charge', 'After moving 30 ft in a straight line, a melee hit lets you add a hoof attack as a bonus action.'], ['Equine Build', 'You count as one size larger for carrying. Climbing is harder for you.'], ['Hooves', 'Your hooves are natural weapons that deal 1d6 bludgeoning damage.'], ['Natural Affinity', 'Proficiency in one of Animal Handling, Medicine, Nature or Survival.']], extraSkill: 1 },
    'Minotaur': { group: 'far', speed: 30, size: 'Medium', note: 'Bull-headed folk of the labyrinths and deep mazes. They have a sure sense of direction and a strong sense of duty.', traits: [['Horns', 'Your horns are natural weapons that deal 1d6 piercing damage.'], ['Goring Rush', 'After you Dash and move at least 20 ft, you can gore a creature as a bonus action.'], ['Hammering Horns', 'After you hit a creature with a melee attack, you can shove it with your horns as a bonus action.'], ['Labyrinthine Recall', 'You always know which way is north, and you have advantage on Survival checks to navigate or track.']] },
    'Loxodon': { group: 'far', speed: 30, size: 'Medium', note: 'Elephant-folk who are calm, long-memoried and very hard to frighten. They are known as peacemakers and keep the records of their villages.', traits: [['Loxodon Serenity', 'Advantage on saves against being charmed or frightened.'], ['Natural Armor', 'Without armour, your AC is 12 + Constitution.'], ['Trunk', 'Your trunk can grasp, lift and draw water like a hand.'], ['Keen Smell', 'Advantage on Perception, Investigation and Survival checks that rely on smell.'], ['Powerful Build', 'You count as one size larger for carrying and pushing.']] },
    'Leonin': { group: 'far', speed: 35, size: 'Medium', dark: 60, note: 'Lion-folk who hunt in pride and are loyal to their own. Leonin are bold, proud and quick to defend the people they call family.', traits: [['Claws', 'Your claws are natural weapons that deal 1d4 slashing damage.'], ['Hunter’s Instincts', 'Proficiency in one of Athletics, Intimidation, Perception or Survival.'], ['Daunting Roar', 'As a bonus action, frighten creatures near you (Wisdom save). Once per short or long rest.']], extraSkill: 1 },
    'Aeryn': { group: 'far', speed: 30, fly: 30, size: 'Medium', note: 'Bird-folk of a far country of high cliffs, where there are more mountains than anything else. The Aeryn build their towns on the mountaintops and fly from cliff to cliff, and the ground is a place they visit, not where they live. In the isles they are quick, curious and never quite at ease with a roof over their heads.', traits: [['Flight', 'You can fly at your walking speed, but not in medium or heavy armour.'], ['Talons', 'Your talons are natural weapons that deal 1d6 slashing damage.'], ['Gale Call', 'From 3rd level, you can cast Gust of Wind once per long rest without spending mana.']] },
    'Satyr': { group: 'far', speed: 35, size: 'Medium', note: 'Revellers of the glades and the festivals. Satyrs are music, mischief and mirth, and they can make a party out of a funeral.', traits: [['Fey', 'Your creature type is fey.'], ['Ram', 'Your headbutt is a natural weapon that deals 1d6 bludgeoning damage.'], ['Magic Resistance', 'Advantage on saves against spells.'], ['Mirthful Leaps', 'Add a d8 to your long and high jumps.'], ['Reveler', 'Proficiency in Performance and Persuasion, and one musical instrument.']], skill: 'Performance', extraSkill: 1 },
    'Fairy': { group: 'far', speed: 30, fly: 30, size: 'Small', note: 'Small folk of the fey woods, bright and quick to take offence. Fairies can be kind or cruel, and they are almost never boring.', traits: [['Fey', 'Your creature type is fey.'], ['Flight', 'You can fly at your walking speed, but not in medium or heavy armour.'], ['Fairy Magic', 'Druidcraft. Faerie Fire at 3rd level and Enlarge/Reduce at 5th, each once per long rest without mana.']] },
    'Yuan-ti': { group: 'far', speed: 30, size: 'Medium', dark: 60, note: 'Snake-blooded folk who hide their nature and carry old serpent magic. Many are scholars of poison and secrets, and they do not like being looked at too closely.', traits: [['Magic Resistance', 'Advantage on saves against spells.'], ['Poison Resilience', 'Advantage against being poisoned, and resistance to poison damage.'], ['Serpentine Spellcasting', 'Poison Spray and Animal Friendship (snakes only) at will. Suggestion at 3rd level, once per long rest without mana.']] },
    'Locathah': { group: 'rare', speed: 30, swim: 30, size: 'Medium', note: 'Fish-folk of the deep and the reef, with scales that shine in the dark. They are strong swimmers and stubborn defenders of their home waters.', traits: [['Natural Armor', 'Without armour, your AC is 12 + Dexterity.'], ['Observant and Athletic', 'Proficiency in Athletics and Perception.'], ['Leviathan Will', 'Advantage on saves against being charmed, frightened, paralysed, poisoned, stunned or put to sleep.'], ['Limited Amphibiousness', 'You can breathe air and water, but you must soak in water every 4 hours.']], skill: 'Athletics', extraSkill: 1 },
    'Shadar-kai': { group: 'rare', speed: 30, size: 'Medium', dark: 60, skill: 'Perception', note: 'Fey-touched folk who serve the Raven Queen and carry a little of the grave in their blood. They are calm, careful and very hard to surprise.', traits: [['Blessing of the Raven Queen', 'As a bonus action, teleport 30 ft. From 3rd level, you also gain resistance to all damage until your next turn. Uses equal to proficiency bonus per long rest.'], ['Necrotic Resistance', 'Resistance to necrotic damage.'], ['Keen Senses', 'Proficiency in Perception.'], ['Fey Ancestry', 'You have advantage against being charmed, and magic can’t put you to sleep.'], ['Trance', 'You meditate for 4 hours instead of sleeping.']] },
    'Eladrin': { group: 'rare', speed: 30, size: 'Medium', dark: 60, skill: 'Perception', note: 'Fey folk who change with the seasons, and whose moods shift with the weather. They are graceful, changeable and often more dangerous than they look.', traits: [['Fey Step', 'As a bonus action, teleport 30 ft, with a seasonal extra effect from 3rd level. Uses equal to proficiency bonus per long rest.'], ['Keen Senses', 'Proficiency in Perception.'], ['Fey Ancestry', 'You have advantage against being charmed, and magic can’t put you to sleep.'], ['Trance', 'You meditate for 4 hours instead of sleeping.']] },
    'Duergar': { group: 'isles', speed: 30, size: 'Medium', dark: 120, note: 'Grey dwarves of the deep, cousins the Anvilborn would rather not talk about. They work in the dark, keep their secrets and never forget a betrayal.', traits: [['Duergar Magic', 'Enlarge/Reduce (enlarge only) at 3rd level and Invisibility at 5th level, each once per long rest without mana.'], ['Dwarven Resilience', 'Advantage on saves against poison, and resistance to poison damage.'], ['Psionic Fortitude', 'Advantage on saves against being charmed or stunned.'], ['Superior Darkvision', 'You can see 120 ft in darkness.']] },
    'Deep Gnome': { group: 'isles', speed: 25, size: 'Small', dark: 120, note: 'Gnomes of the Underdark who have learned to hide in plain stone. They are cautious, clever and very good at not being found.', traits: [['Gift of the Svirfneblin', 'Disguise Self at 3rd level and Nondetection at 5th level, each once per long rest without mana.'], ['Gnomish Magic Resistance', 'Advantage on Intelligence, Wisdom and Charisma saves against spells.'], ['Svirfneblin Camouflage', 'Advantage on Stealth checks in rocky terrain a few times per long rest.'], ['Superior Darkvision', 'You can see 120 ft in darkness.']] },

    'Harengon': { group: 'far', speed: 30, size: 'Medium', skill: 'Perception', note: 'Hare-folk of the wild meadows and the hedgerows. They notice trouble first and would rather leave it behind than stand and fight.', traits: [['Hare-Trigger', 'You add your proficiency bonus to initiative rolls.'], ['Leporine Senses', 'Proficiency in Perception.'], ['Lucky Footwork', 'As a reaction, add a d4 to a failed Dexterity saving throw.'], ['Rabbit Hop', 'As a bonus action, jump a few squares without provoking opportunity attacks. Uses equal to proficiency bonus per long rest.']] },
    'Owlin': { group: 'far', speed: 30, fly: 30, size: 'Medium', dark: 120, skill: 'Stealth', note: 'Owl-folk of the deep woods and old ruins. They move without a sound, see clearly in the dark and are rarely heard coming.', traits: [['Flight', 'You can fly at your walking speed, but not in medium or heavy armour.'], ['Silent Feathers', 'Proficiency in Stealth.'], ['Darkvision', 'You can see 120 ft in darkness.']] },
    'Grung': { group: 'far', speed: 25, climb: 25, size: 'Small', skill: 'Perception', note: 'Small, bright-coloured frog-folk of the jungle whose skin is poisonous to the touch. They must return to water often, and they are rarely caught off guard.', traits: [['Arboreal Alertness', 'Proficiency in Perception, and a climb speed of 25 ft.'], ['Poisonous Skin', 'Creatures that grapple or touch you are poisoned unless they succeed on a Constitution saving throw.'], ['Standing Leap', 'Your long jump is 25 ft and your high jump is 15 ft, with or without a run-up.'], ['Water Dependency', 'You must soak in water for an hour each day, or you suffer exhaustion.']] },
    'Thri-kreen': { group: 'far', speed: 30, size: 'Medium', dark: 60, note: 'Insectoid folk of the savannah with four arms and a chameleon-like carapace. They are sleepless and focused, and they talk to one another without speaking.', traits: [['Chameleon Carapace', 'Your AC is 13 + Dexterity without armour, and you have advantage on Stealth checks in terrain where your colour blends in.'], ['Secondary Arms', 'Two small arms that can hold light items and make simple manipulations.'], ['Sleepless', 'You don’t sleep. You stay alert while you rest.'], ['Thri-kreen Telepathy', 'You can speak telepathically to creatures that share a language with you.']] },
    'Hadozee': { group: 'far', speed: 30, climb: 30, size: 'Medium', note: 'Monkey-folk of the island jungles who glide between the treetops on flaps of skin. They are nimble and acrobatic, and happy to trade a fight for a bit of showing off.', traits: [['Dexterous Feet', 'You can use an object as a bonus action.'], ['Glide', 'You glide 5 ft for every 1 ft you fall, taking no falling damage.'], ['Hadozee Dodge', 'As a reaction, reduce damage by a d6 plus your proficiency bonus. Uses equal to proficiency bonus per long rest.']] },
    'Giff': { group: 'far', speed: 30, swim: 30, size: 'Medium', note: 'Big, cheerful hippo-folk of the river country, and extremely good with firearms. They treat a gun like a finely made tool and never miss a chance to laugh.', traits: [['Astral Spark', 'Once per turn, add your proficiency bonus to damage with a simple or martial weapon. Uses equal to proficiency bonus per long rest.'], ['Firearms Mastery', 'Proficiency with firearms, with no loading penalty.'], ['Hippo Build', 'You have advantage on Strength checks and saves, and you count as one size larger for carrying.']] },
    'Ironcored': { group: 'rare', speed: 30, size: 'Medium', note: 'Clockwork people built for the Draconic Wars, each running on a persona core made in the [[Draconic Imperium]]. A few dwarves and draconic folk can still make a core, but a new one is dull and slow beside the old. A player Ironcored is always one of the war-era makings. Nobody has settled whether an Ironcored is a person or property. See [[Clockwork]].', traits: [['War-era Persona Core', 'Your mind runs on a persona core made in the Draconic Imperium, with years of experience behind it. You get flashbacks of the Draconic Wars; the DM decides when they come and what they show. Advantage on all Intelligence (History) checks.'], ['Clockwork', 'In Avarenth you count as clockwork, but with deeper, mystical magic than any helper or commissioned warrior.'], ['Built Body', 'Advantage on saves against being poisoned and resistance to poison damage. You can’t catch diseases, you don’t need to eat, drink or breathe, and magic can’t put you to sleep.'], ['Watchful Stillness', 'Your long rest is six hours standing silent and still. You can’t act during it, but you stay fully aware of what’s around you.'], ['Bolted Plating', 'Plates are part of your body: +1 AC (the sheet adds it). Armour you’re proficient with bolts onto you, takes an hour to fit or remove, and can’t be stripped from you against your will while you live.'], ['Purpose-Built', 'You were made for a job: proficiency in one skill and one tool of your choice.']], extraSkill: 1 },
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
