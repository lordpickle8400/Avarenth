# Own-words summaries (not book text). [level, feature, what it does]. Slot costs are given in Avarenth mana.
S = {}
SP = "Avarenth: subclasses add no spells. These suit the path; learn them from tomes or teachers at the usual cost."

S["Barbarian"] = {
 "Path of the Totem Warrior": ("Draws on animal spirits for gifts that change by the animal you pick at each step.", [
  [3, "Spirit Seeker", "Cast Beast Sense and Speak with Animals as rituals."],
  [3, "Totem Spirit", "Pick an animal for your rage: Bear (resist all damage but psychic), Eagle (enemies have disadvantage on opportunity attacks; Dash as a bonus action), Wolf (allies have advantage on melee attacks against enemies within 5 ft of you), Elk or Tiger."],
  [6, "Aspect of the Beast", "A lasting gift: Bear (double carrying capacity), Eagle (see a mile clearly, no penalty in dim light), Wolf (track at fast pace, stealth at normal pace), Elk or Tiger."],
  [10, "Spirit Walker", "Cast Commune with Nature as a ritual."],
  [14, "Totemic Attunement", "A raging power: Bear (adjacent enemies have disadvantage attacking anyone but you), Eagle (fly while raging), Wolf (knock a Large or smaller creature prone with a bonus action after a hit), Elk or Tiger."]]),
 "Path of the Ancestral Guardian": ("Your ancestors' spirits fight beside you and shield your friends.", [
  [3, "Ancestral Protectors", "The first creature you hit each turn while raging has disadvantage on attacks against anyone but you, and anyone else it hits takes half damage, until your next turn."],
  [6, "Spirit Shield", "While raging, use your reaction when an ally within 30 ft takes damage to reduce it by 2d6 (3d6 at 10th, 4d6 at 14th)."],
  [10, "Consult the Spirits", "Cast Augury or Clairvoyance without spending mana, once per short or long rest."],
  [14, "Vengeful Ancestors", "Whatever Spirit Shield prevents is dealt back as force damage to the attacker."]]),
 "Path of the Storm Herald": ("Your rage becomes a storm of desert heat, sea gales or tundra cold around you.", [
  [3, "Storm Aura", "While raging, a 10 ft aura: Desert (fire damage to creatures around you), Sea (lightning to one creature, Dex save half) or Tundra (temp HP to you and allies). Use it again with a bonus action each turn."],
  [6, "Storm Soul", "Resistance to your storm's damage type plus a small utility gift (no extreme heat or cold trouble, breathe and swim underwater, or freeze water)."],
  [10, "Shielding Storm", "Allies in your aura gain resistance to your storm's damage type."],
  [14, "Raging Storm", "Your aura bites back: Desert burns attackers, Sea knocks enemies prone, Tundra slows creatures to 0 speed."]]),
 "Path of the Zealot": ("A god's fury burns through you, and death struggles to hold you.", [
  [3, "Divine Fury", "While raging, your first hit each turn deals extra radiant or necrotic damage: 1d6 + half your barbarian level."],
  [3, "Warrior of the Gods", "Spells that bring you back to life need no material components."],
  [6, "Fanatical Focus", "Once per rage, reroll a failed saving throw."],
  [10, "Zealous Presence", "Bonus action, once per long rest: up to ten creatures gain advantage on attacks and saves until your next turn."],
  [14, "Rage Beyond Death", "While raging, you don't die at 0 HP; you fall only when the rage ends, if you're still at 0."]]),
 "Path of the Beast": ("Your rage changes your body: claws, jaws or a lashing tail.", [
  [3, "Form of the Beast", "When you rage, grow a natural weapon: bite (heal a little when you hit while under half HP), claws (an extra claw attack), or tail (reaction to add to your AC against a hit)."],
  [6, "Bestial Soul", "Your natural weapons count as magical, and you choose a gift each rest: swim speed, climb speed, or a jumping boost."],
  [10, "Infectious Fury", "When your natural weapon hits, the target saves (Wis) or must attack someone else or take psychic damage. A few times per long rest."],
  [14, "Call the Hunt", "When you rage, up to your Con modifier allies gain extra damage once per turn while you gain temporary HP. Uses equal to proficiency bonus per long rest."]]),
 "Path of Wild Magic": ("Wild magic surges out of you every time you rage.", [
  [3, "Magic Awareness", "Sense spells and magic items within 60 ft as an action, a few times per long rest."],
  [3, "Wild Surge", "When you rage, roll on the Wild Magic table for a random magical effect (shadow tendrils, teleporting, a burst of light, a hungry spirit and so on)."],
  [6, "Bolstering Magic", "Touch an ally to give them a d3 bonus to attacks and checks for 10 minutes, or to restore some of their mana: roll a d3 and they regain 5, 10 or 18 mana. Uses per long rest equal to proficiency bonus."],
  [10, "Unstable Backlash", "When you take damage or fail a save while raging, reroll your wild surge as a reaction."],
  [14, "Controlled Surge", "Roll twice on the Wild Magic table and pick the result you want."]]),
 "Path of the Giant": ("You grow with the strength of the giants and hurl your foes.", [
  [3, "Giant's Power", "Learn Druidcraft or Thaumaturgy and the Giant language."],
  [3, "Giant's Havoc", "While raging you count as Large (if space allows), your reach grows by 5 ft, and thrown or Strength-based hits add more damage."],
  [6, "Elemental Cleaver", "When you rage, infuse a weapon with acid, cold, fire, thunder or lightning; it deals an extra 1d6 of that type and returns to your hand when thrown."],
  [10, "Mighty Impel", "As a bonus action while raging, hurl a Medium or smaller creature up to 30 ft (unwilling ones save)."],
  [14, "Demiurgic Colossus", "While raging you can grow to Large or Huge, your reach grows further and your Elemental Cleaver damage rises to 2d6."]]),
}

S["Fighter"] = {
 "Battle Master": ("A tactician who uses superiority dice to fuel combat maneuvers.", [
  [3, "Combat Superiority", "Learn three maneuvers and gain four d8 superiority dice, back on a short rest. Spend a die to trip, disarm, push, feint, parry, rally an ally and more. More maneuvers at 7th, 10th and 15th."],
  [3, "Student of War", "Proficiency with one artisan's tool."],
  [7, "Know Your Enemy", "Study a creature for a minute to learn how it compares to you in two traits (Strength, AC, HP, class levels and so on)."],
  [10, "Improved Combat Superiority", "Superiority dice become d10."],
  [15, "Relentless", "If you roll initiative with no superiority dice left, regain one."],
  [18, "Improved Combat Superiority", "Superiority dice become d12."]]),
 "Eldritch Knight": ("A fighter who blends swordplay with abjuration and evocation magic.", [
  [3, "Weapon Bond", "Bond with up to two weapons: they can't be disarmed and you can summon one to your hand as a bonus action."],
  [3, "Spellcasting", "Your mana fuels a small wizard repertoire, mostly abjuration and evocation spells. Intelligence is your spellcasting ability. " + SP],
  [7, "War Magic", "When you cast a cantrip as an action, make one weapon attack as a bonus action."],
  [10, "Eldritch Strike", "A creature you hit has disadvantage on its next save against your spell before the end of your next turn."],
  [15, "Arcane Charge", "When you Action Surge, teleport up to 30 ft."],
  [18, "Improved War Magic", "When you cast a spell as an action, make one weapon attack as a bonus action."]]),
 "Arcane Archer": ("An archer who weaves magic into arrows.", [
  [3, "Arcane Archer Lore", "Learn Arcana or Nature, and Prestidigitation or Druidcraft."],
  [3, "Arcane Shot", "Know two Arcane Shot options (banishing, beguiling, bursting, grasping, piercing, seeking, shadow, enfeebling) and use them twice per short rest when you hit with an arrow. More options at 7th, 10th, 15th and 18th."],
  [7, "Magic Arrow", "Your arrows count as magical."],
  [7, "Curving Shot", "When you miss with a magic arrow, use a bonus action to reroll the attack against a different target within 60 ft."],
  [15, "Ever-Ready Shot", "If you roll initiative with no Arcane Shot uses left, regain one."],
  [18, "Improved Shots", "Your Arcane Shot damage increases."]]),
 "Cavalier": ("A mounted warrior and bodyguard who locks enemies down.", [
  [3, "Bonus Proficiency", "One skill (Animal Handling, History, Insight, Performance or Persuasion) or a language."],
  [3, "Born to the Saddle", "Advantage on saves against falling off your mount, land on your feet if you fall, and mount or dismount cheaply."],
  [3, "Unwavering Mark", "Mark creatures you hit: they have disadvantage attacking anyone else, and if they do you can make a bonus action attack with extra damage."],
  [7, "Warding Maneuver", "Reaction: add 1d8 to an ally's AC against an attack, and give them resistance if it still hits."],
  [10, "Hold the Line", "Creatures that move within your reach provoke opportunity attacks, and a hit stops them in place."],
  [15, "Ferocious Charger", "Moving 10 ft straight before a hit can knock the target prone."],
  [18, "Vigilant Defender", "An extra reaction each round, only for opportunity attacks."]]),
 "Samurai": ("Unshakeable resolve that turns into precise, relentless strikes.", [
  [3, "Bonus Proficiency", "One skill (History, Insight, Performance or Persuasion) or a language."],
  [3, "Fighting Spirit", "Bonus action, three times per long rest: advantage on attacks this turn and some temporary HP."],
  [7, "Elegant Courtier", "Add Wisdom to Persuasion and gain Wisdom save proficiency (or another save if you have it)."],
  [10, "Tireless Spirit", "If you roll initiative with no Fighting Spirit uses left, regain one."],
  [15, "Rapid Strike", "Trade advantage on one attack for an extra attack."],
  [18, "Strength Before Death", "When you drop to 0 HP, take an extra full turn before falling, once per long rest."]]),
 "Echo Knight": ("You fight alongside an echo of yourself from another possible timeline.", [
  [3, "Manifest Echo", "Summon a translucent echo (AC 14 + proficiency, 1 HP). You can attack from its space, swap places with it, and it makes opportunity attacks."],
  [3, "Unleash Incarnation", "When you take the Attack action, make one extra attack through your echo. Uses equal to Con modifier per long rest."],
  [7, "Echo Avatar", "See and hear through your echo, and send it up to 1,000 ft away."],
  [10, "Shadow Martyr", "Your echo throws itself in front of an attack meant for an ally, once per short rest."],
  [15, "Reclaim Potential", "When your echo is destroyed, gain temporary HP a few times per long rest."],
  [18, "Legion of One", "Two echoes at once, and regain an Unleash Incarnation use when you roll initiative with none left."]]),
 "Psi Warrior": ("Psionic power adds force to your blows and shields your allies.", [
  [3, "Psionic Power", "Psionic Energy dice (d6, rising with level), back on a long rest; regain one per short rest. Spend one to add force damage to a hit, cut damage to an ally, or move a creature or object with your mind."],
  [7, "Telekinetic Adept", "Psi-powered leap (fly for a turn) and Telekinetic Thrust (push or knock prone with your force strikes)."],
  [10, "Guarded Mind", "Resistance to psychic damage; spend a die to end charm or fear on yourself."],
  [15, "Bulwark of Force", "Bonus action: give a few creatures half cover for a minute, once per long rest (or spend a die)."],
  [18, "Telekinetic Master", "Cast Telekinesis without spending mana once per long rest (or spend a die), and attack as a bonus action while concentrating on it."]]),
 "Rune Knight": ("Giant runes carved into your gear, and the power to grow huge.", [
  [3, "Bonus Proficiencies", "Smith's tools and the Giant language."],
  [3, "Rune Carver", "Know two runes (cloud, fire, frost, stone, hill, storm) with a passive gift and an activated power each, once per short rest. More runes at 7th, 10th and 15th."],
  [3, "Giant's Might", "Bonus action: become Large for a minute, with advantage on Strength checks and saves and an extra 1d6 damage once per turn. Uses per long rest equal to proficiency bonus."],
  [7, "Runic Shield", "Reaction: force a creature to reroll an attack against an ally, a few times per long rest."],
  [10, "Great Stature", "Grow a little taller permanently; Giant's Might damage rises to 1d8."],
  [15, "Master of Runes", "Use each rune's power twice per short rest."],
  [18, "Runic Juggernaut", "Giant's Might makes you up to Huge, with 1d10 extra damage and more reach."]]),
}

S["Monk"] = {
 "Way of Shadow": ("A ninja-like monk who moves between shadows.", [
  [3, "Shadow Arts", "Spend 2 ki to cast Darkness, Darkvision, Pass without Trace or Silence without spending mana; learn Minor Illusion."],
  [6, "Shadow Step", "In dim light or darkness, teleport 60 ft to another dark spot as a bonus action and gain advantage on your next melee attack."],
  [11, "Cloak of Shadows", "Become invisible in dim light or darkness until you attack or cast."],
  [17, "Opportunist", "Reaction: attack a creature within 5 ft that just got hit by someone else."]]),
 "Way of the Four Elements": ("You channel ki into elemental disciplines.", [
  [3, "Disciple of the Elements", "Learn Elemental Attunement and one discipline (more at 6th, 11th and 17th). Disciplines spend ki to produce effects like Fangs of the Fire Snake, Water Whip or Shape the Flowing River, some copying spells without spending mana."],
  [6, "More disciplines", "Learn another discipline; you can swap one out when you gain a discipline."],
  [11, "More disciplines", "Learn another discipline and spend more ki to empower them."],
  [17, "More disciplines", "Learn another discipline."]]),
 "Way of the Long Death": ("A monk who studies death and feeds on it.", [
  [3, "Touch of Death", "When you reduce a creature within 5 ft to 0 HP, gain temporary HP."],
  [6, "Hour of Reaping", "Action: creatures within 30 ft save (Wis) or are frightened of you."],
  [11, "Mastery of Death", "When you drop to 0 HP, spend 1 ki to stay at 1 HP instead."],
  [17, "Touch of the Long Death", "Spend 1–10 ki to deal 2d10 necrotic per ki spent (Con save halves)."]]),
 "Way of the Sun Soul": ("You hurl ki as searing radiant light.", [
  [3, "Radiant Sun Bolt", "A 30 ft ranged radiant attack that uses your martial arts die; can replace attacks and be used with Flurry."],
  [6, "Searing Arc Strike", "After the Attack action, spend 2 ki to cast Burning Hands as a bonus action (more ki for a stronger version)."],
  [11, "Searing Sunburst", "Action: a 20 ft radius burst of radiant light (Con save); spend ki to strengthen it."],
  [17, "Sun Shield", "Shed bright light, and creatures that hit you in melee take radiant damage."]]),
 "Way of the Drunken Master": ("Lurching, staggering moves that make you impossible to pin down.", [
  [3, "Bonus Proficiencies", "Performance and brewer's supplies."],
  [3, "Drunken Technique", "Flurry of Blows also gives you Disengage and +10 ft speed."],
  [6, "Tipsy Sway", "Stand up for 5 ft of movement, and redirect a missed melee attack to another creature."],
  [11, "Drunkard's Luck", "Spend 2 ki to cancel disadvantage on a check, attack or save."],
  [17, "Intoxicated Frenzy", "Flurry of Blows can make up to five attacks if each hits a different target."]]),
 "Way of the Kensei": ("A weapon master whose chosen weapons are part of their martial arts.", [
  [3, "Path of the Kensei", "Pick kensei weapons that count as monk weapons, gain an AC bonus when you skip an attack, and add extra damage to ranged hits as a bonus action."],
  [6, "One with the Blade", "Your kensei weapons count as magical; spend ki for extra damage on a hit."],
  [11, "Sharpen the Blade", "Spend up to 3 ki to give a kensei weapon that bonus to attack and damage for a minute."],
  [17, "Unerring Accuracy", "Reroll a missed monk-weapon attack once per turn."]]),
 "Way of the Astral Self": ("You summon your astral self: spectral arms, a visage, then a full body.", [
  [3, "Arms of the Astral Self", "Spend 1 ki to summon spectral arms that strike using Wisdom with longer reach, and push enemies away when they appear."],
  [6, "Visage of the Astral Self", "Your astral face lets you see in magical darkness and speak with intimidating or quiet clarity."],
  [11, "Body of the Astral Self", "With arms and visage out, deflect energy damage and add extra damage on a hit."],
  [17, "Awakened Astral Self", "Spend 5 ki to manifest everything at once: AC bonus and an extra attack."]]),
 "Way of Mercy": ("Healers and harbingers who carry both life and death in their hands.", [
  [3, "Implements of Mercy", "Insight and Medicine proficiency, and the herbalism kit."],
  [3, "Hand of Healing", "Spend 1 ki to heal a creature with a martial arts die + Wisdom; can replace a Flurry strike."],
  [3, "Hand of Harm", "Once per turn, spend 1 ki on a hit for extra necrotic damage."],
  [6, "Physician's Touch", "Hand of Healing also cures a disease or condition; Hand of Harm can poison."],
  [11, "Flurry of Healing and Harm", "Replace each Flurry of Blows strike with Hand of Healing, and use Hand of Harm on one for free."],
  [17, "Hand of Ultimate Mercy", "Spend 5 ki to bring back a creature that died in the last 24 hours, once per long rest."]]),
}

S["Rogue"] = {
 "Assassin": ("Killer who strikes first and from hiding.", [
  [3, "Bonus Proficiencies", "Disguise kit and poisoner's kit."],
  [3, "Assassinate", "Advantage against creatures that haven't acted yet in combat, and any hit on a surprised creature is a critical hit."],
  [9, "Infiltration Expertise", "Spend a week and some gold to build a solid false identity."],
  [13, "Impostor", "Copy someone's speech, writing and mannerisms after studying them for three hours."],
  [17, "Death Strike", "Hitting a surprised creature forces a Con save or doubles the damage."]]),
 "Arcane Trickster": ("A rogue with enchantment and illusion magic.", [
  [3, "Spellcasting", "Your mana fuels a small wizard repertoire, mostly enchantment and illusion. Intelligence is your spellcasting ability. " + SP],
  [3, "Mage Hand Legerdemain", "Your Mage Hand is invisible and can pick locks, plant or lift objects at range."],
  [9, "Magical Ambush", "If you're hidden when you cast, the target has disadvantage on its save."],
  [13, "Versatile Trickster", "Bonus action: your mage hand distracts a creature, giving you advantage on attacks against it."],
  [17, "Spell Thief", "Reaction when a spell targets you: force a save to negate it and steal the spell for 8 hours, once per long rest."]]),
 "Inquisitive": ("A detective who reads lies and finds weak points.", [
  [3, "Ear for Deceit", "Insight rolls to spot lies treat a die below 8 as an 8."],
  [3, "Eye for Detail", "Bonus action: Perception to spot hidden things or Investigation to find clues."],
  [3, "Insightful Fighting", "Bonus action: Insight against a target's Deception to gain Sneak Attack on it without advantage for a minute."],
  [9, "Steady Eye", "Advantage on Perception and Investigation if you move half speed or less."],
  [13, "Unerring Eye", "Sense illusions, shapechangers and magic deception nearby, a few times per long rest."],
  [17, "Eye for Weakness", "Sneak Attack deals an extra 3d6 against a target you've read with Insightful Fighting."]]),
 "Mastermind": ("A schemer who directs allies from the shadows.", [
  [3, "Master of Intrigue", "A gaming set, a disguise kit, two languages, and the knack of mimicking accents."],
  [3, "Master of Tactics", "Help as a bonus action, from up to 30 ft away."],
  [9, "Insightful Manipulator", "Study a creature for a minute to learn how it compares to you in mental abilities and other traits."],
  [13, "Misdirection", "Reaction: redirect an attack aimed at you to a creature giving you cover."],
  [17, "Soul of Deceit", "Your thoughts can't be read; you can feed false thoughts, and magic can't force the truth out of you."]]),
 "Scout": ("A skirmisher and wilderness expert.", [
  [3, "Skirmisher", "Reaction: move half your speed when an enemy ends its turn next to you, without provoking."],
  [3, "Survivalist", "Proficiency and expertise in Nature and Survival."],
  [9, "Superior Mobility", "+10 ft speed (walk, climb, swim)."],
  [13, "Ambush Master", "Advantage on initiative, and your first target in the first round is easier for everyone to hit."],
  [17, "Sudden Strike", "A bonus action attack after the Attack action, which can Sneak Attack a different target."]]),
 "Swashbuckler": ("A flashy duelist who darts in and out of combat.", [
  [3, "Fancy Footwork", "A creature you attack in melee can't make opportunity attacks against you that turn."],
  [3, "Rakish Audacity", "Add Charisma to initiative, and Sneak Attack a lone enemy in a one-on-one without advantage."],
  [9, "Panache", "Persuasion against Insight: an enemy fixates on you (disadvantage on others) or a non-hostile creature is charmed."],
  [13, "Elegant Maneuver", "Bonus action: advantage on your next Acrobatics or Athletics check this turn."],
  [17, "Master Duelist", "Reroll a missed attack with advantage, once per short rest."]]),
 "Phantom": ("A rogue touched by death who steals knowledge from the dead.", [
  [3, "Whispers of the Dead", "After a rest, gain proficiency in a skill or tool of your choice."],
  [3, "Wails from the Grave", "After Sneak Attack, deal half the Sneak Attack dice as necrotic to another creature nearby. Uses per long rest equal to proficiency bonus."],
  [9, "Tokens of the Departed", "Catch a soul trinket when someone dies nearby; use them for advantage on saves, extra wails, or to ask a spirit a question."],
  [13, "Ghost Walk", "Become spectral for 10 minutes: fly slowly, pass through objects, attackers have disadvantage."],
  [17, "Death's Friend", "Wails from the Grave hits both targets with necrotic, and you always find a token after a rest if you have none."]]),
 "Soulknife": ("Psionic blades formed from your mind.", [
  [3, "Psionic Power", "Psionic Energy dice (d6, rising with level); spend them to boost failed checks or speak telepathically."],
  [3, "Psychic Blades", "Manifest blades of psychic energy to make melee or thrown attacks, with a bonus action second blade."],
  [9, "Soul Blades", "Spend a die to turn a miss into a hit, or teleport with a thrown blade."],
  [13, "Psychic Veil", "Become invisible for an hour, once per long rest (or spend a die)."],
  [17, "Rend Mind", "A Sneak Attack with your blades can stun the target (Wis save), once per long rest (or spend dice)."]]),
}
