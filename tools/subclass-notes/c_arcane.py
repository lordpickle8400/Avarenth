# Own-words summaries (not book text). [level, feature, what it does]. Slot costs are given in Avarenth mana.
S = {}
SP = "Avarenth: subclasses add no spells. These suit the path; learn them from tomes or teachers at the usual cost."

S["Bard"] = {
 "College of Courage": ("Skalds who inspire courage in battle and fight on the front line.", [
  [3, "Bonus Proficiencies", "Medium armor, shields and martial weapons."],
  [3, "Battle Verse", "Allies can add your Bardic Inspiration die to damage or to their AC against one attack."],
  [6, "Extra Attack", "Attack twice when you take the Attack action."],
  [14, "Blade and Spell", "When you cast a spell as an action, make one weapon attack as a bonus action."]]),
 "College of Veils": ("Bards touched by the fey who enthrall crowds.", [
  [3, "Fey Inspiration", "Spend Bardic Inspiration to give allies temporary HP and a free move without provoking."],
  [3, "Spellbound Show", "After performing for a minute, charm a few listeners for an hour (Wis save)."],
  [6, "Fey Majesty", "For a minute, cast Command as a bonus action each turn without spending mana. Once per long rest."],
  [14, "Regal Ward", "Attackers must save (Cha) or choose a new target, once per short rest."]]),
 "College of Blades": ("Blade-dancing performers who mix flourishes with steel.", [
  [3, "Bonus Proficiencies", "Medium armor and the scimitar; use a weapon as your focus."],
  [3, "Fighting Style", "Dueling or Two-Weapon Fighting."],
  [3, "Blade Showmanship", "+10 ft speed when you attack, and spend Bardic Inspiration on a hit for a flourish: Guarding (add to AC), Cleaving (hit a second creature) or Nimble (push the target)."],
  [6, "Extra Attack", "Attack twice when you take the Attack action."],
  [14, "Crowd Riposte", "Use a d6 for a flourish instead of spending Bardic Inspiration."]]),
 "College of Secrets": ("Spies who trade in secrets and fear.", [
  [3, "Night Blades", "Spend Bardic Inspiration on a hit for extra psychic damage (2d6, more at higher levels)."],
  [3, "Chilling Words", "Talk to someone alone for a minute and frighten them for an hour (Wis save)."],
  [6, "Whisper Mask", "Capture the shadow of a humanoid who dies near you and wear its persona as a disguise."],
  [14, "Hush Lore", "Whisper to a creature to charm it into obeying you for 8 hours (Wis save), once per long rest."]]),
 "College of Making": ("Bards who sing things into being.", [
  [3, "Spark of Invention", "Your Bardic Inspiration carries a mote with an extra effect on checks, attacks or saves."],
  [3, "Ballad of Making", "Create a nonmagical object worth up to 20 gp × bard level, once per long rest (or spend 10 mana to do it again)."],
  [6, "Stage Puppets", "Animate a Large or smaller object as a dancing companion, once per long rest (or spend 18 mana)."],
  [14, "Full Crescendo", "Create several objects at once with Ballad of Making, with no gold limit."]]),
 "College of Oratory": ("Masters of persuasive speech.", [
  [3, "Golden Speech", "Persuasion and Deception rolls below 10 count as 10."],
  [3, "Breaking Words", "Spend Bardic Inspiration to subtract the roll from a creature's next save."],
  [6, "Steadfast Verse", "A creature keeps your Bardic Inspiration die if the roll fails."],
  [6, "Common Tongue", "Make a few creatures understand you for an hour, once per long rest (or spend 5 mana)."],
  [14, "Carried Verse", "When a creature succeeds with your inspiration, give another creature a free die."]]),
 "College of Ghosts": ("Storytellers who channel the dead.", [
  [3, "Ghostly Guidance", "Learn Guidance, which reaches 60 ft."],
  [3, "Anchored Token", "Use a candle, crystal ball, skull or tarot deck as your focus, and later add a d6 to spell damage or healing."],
  [3, "Shade Tales", "Spend Bardic Inspiration to draw a spirit tale with a random effect you can use later."],
  [6, "Vigil Rite", "An hour-long ritual with allies to learn a divination or necromancy spell temporarily."],
  [14, "Spirit Link", "Roll twice for Shade Tales and choose."]]),
}

S["Druid"] = {
 "Circle of Lunar Forms": ("Druids who live in beast shapes and fight in them.", [
  [2, "Combat Wild Shape", "Wild Shape as a bonus action, and while transformed spend mana to heal 1d8 per spell level of that mana (5 mana heals 1d8, 10 heals 2d8, 18 heals 3d8, and so on)."],
  [2, "Circle Shapes", "Turn into tougher beasts: up to CR 1 at 2nd, then CR equal to a third of your druid level from 6th."],
  [6, "Primal Blow", "Your beast attacks count as magical."],
  [10, "Elemental Mantle", "Spend two Wild Shape uses to become an air, earth, fire or water elemental."],
  [14, "Endless Shapes", "Cast Alter Self at will, without spending mana."]]),
 "Circle of Slumber": ("Druids tied to the Feywild who heal and travel in dreams.", [
  [2, "Dew Balm", "A pool of d6s (equal to druid level) to heal and give temporary HP with a bonus action."],
  [6, "Lantern Shelter", "During a rest, make a 30 ft sphere that hides and shelters your group."],
  [10, "Winding Trails", "Teleport 60 ft as a bonus action (or teleport a willing ally 30 ft), Wisdom-mod times per long rest."],
  [14, "Dream Roamer", "After a short rest, cast Dream, Scrying or Teleportation Circle without spending mana, once per long rest."]]),
 "Circle of the Herder": ("Druids who call spirits to protect their flock.", [
  [2, "Forest Tongue", "Speak with beasts and learn Sylvan."],
  [2, "Spirit Effigy", "Summon a spirit for a minute: Bear (temporary HP, advantage on Strength), Hawk (advantage on attacks with your reaction) or Unicorn (better healing and finding creatures). Once per short rest."],
  [6, "Grand Summoner", "Beasts and fey you summon have extra HP and magical attacks."],
  [10, "Wisp Ward", "Your summoned creatures heal at the end of their turns in your totem's aura."],
  [14, "Bonded Summons", "When you drop to 0 HP, four beasts appear to protect you, once per long rest."]]),
 "Circle of Mycelia": ("Druids of decay who wield fungal spores and animate the dead.", [
  [2, "Circle spells", SP],
  [2, "Spore Ring", "Reaction: deal necrotic damage to a creature that moves near you or starts its turn there (Con save)."],
  [2, "Fungal Kinship", "Spend a Wild Shape use for temporary HP and stronger spores and melee necrotic damage."],
  [6, "Grave Sprout", "Raise a beast or humanoid that dies near you as a zombie for an hour."],
  [10, "Spore Burst", "Throw your spore cloud into an area instead."],
  [14, "Fungal Flesh", "Immune to blinded, deafened, frightened and poisoned, and critical hits become normal hits."]]),
 "Circle of the Heavens": ("Druids who map the stars and take on a starry form.", [
  [2, "Night Chart", "Learn Guidance, and cast Guiding Bolt without spending mana a few times per long rest."],
  [2, "Falling Star Form", "Spend a Wild Shape use to become a constellation: Bowstar (radiant bolt), Cup of Light (heal extra when you heal), or Serpent (rolls below 10 on Int/Wis checks and concentration count as 10)."],
  [6, "Heaven's Sign", "After a rest, gain weal or woe: add or subtract a d6 to others' rolls a few times."],
  [10, "Wheeling Constellations", "Star Form gets stronger, and you can switch constellations each turn."],
  [14, "Starlit Hide", "In Star Form, resistance to bludgeoning, piercing and slashing."]]),
 "Circle of Emberfire": ("Druids of fire and renewal, with a wildfire spirit companion.", [
  [2, "Circle spells", SP],
  [2, "Call Kindled Spirit", "Spend a Wild Shape use to summon a fiery spirit that fights and can teleport you and allies."],
  [6, "Kindred Flame", "Add a d8 to fire damage or healing spells while your spirit is out, and cast through it."],
  [10, "Sealing Embers", "When a creature dies near your spirit, leave a flame you can use to heal or burn."],
  [14, "Ash Revival", "If you drop to 0 HP, your spirit sacrifices itself to bring you back to half HP."]]),
}

S["Ranger"] = {
 "Beast Warden": ("A ranger with a beast companion.", [
  [3, "Beast Companion", "A beast companion that obeys you and fights beside you (or a primal beast of land, sea or sky)."],
  [7, "Companion Drill", "Your companion can Dash, Disengage or Help as a bonus action, and its attacks count as magical."],
  [11, "Feral Frenzy", "Your companion attacks twice."],
  [15, "Mirror Magic", "Spells you cast on yourself also affect your companion nearby."]]),
 "Shadow Hunter": ("A hunter in the dark, unseen and first to strike.", [
  [3, "Shadow Hunter spells", SP],
  [3, "Dusk Ambusher", "Add Wisdom to initiative, and on your first turn move faster and make an extra attack with extra damage."],
  [3, "Shadow Sight", "Darkvision, and creatures relying on darkvision can't see you in darkness."],
  [7, "Stone Mind", "Proficiency in Wisdom saves (or another save)."],
  [11, "Relentless Hunt", "Once per turn, when you miss, make another attack."],
  [15, "Veil Dodge", "Reaction: impose disadvantage on an attack against you."]]),
 "Planewalker": ("Guardians against planar threats who step through space.", [
  [3, "Planewalker spells", SP],
  [3, "Gate Sense", "Sense the nearest planar portal within a mile, once per short rest."],
  [3, "Otherworld Smite", "Bonus action: your next hit on a creature deals force damage and an extra 1d8 (2d8 at 11th)."],
  [7, "Ethereal Drift", "Step into the Ethereal Plane for a turn, once per short rest."],
  [11, "Reaching Strike", "Teleport 10 ft before each attack, and attack a third target if you hit two."],
  [15, "Ghostly Defense", "Reaction: gain resistance to an attack's damage."]]),
 "Monster Bane": ("Hunters of supernatural threats.", [
  [3, "Monster Bane spells", SP],
  [3, "Monster Sense", "Learn a creature's immunities, resistances and vulnerabilities, Wisdom-mod times per long rest."],
  [3, "Quarry's Brand", "Mark a creature: your first hit on it each turn deals an extra 1d6."],
  [7, "Warded Guard", "Add a d6 to saves and grapple escapes against your prey."],
  [11, "Spell Nemesis", "Reaction: stop a creature casting a spell or teleporting (Wis save), once per short rest."],
  [15, "Quarry's Riposte", "Reaction: when your prey forces a save, attack it; a hit makes you succeed."]]),
 "Feywalker": ("A ranger touched by fey magic, charming and hard to charm.", [
  [3, "Feywalker spells", SP],
  [3, "Dread Strikes", "Once per turn, a weapon hit deals an extra 1d4 psychic (1d6 at 11th)."],
  [3, "Fey Glamour", "Add Wisdom to Charisma checks, and gain one social skill."],
  [7, "Fey Redirect", "Advantage against charm and fear, and redirect those effects at others."],
  [11, "Fey Allies", "Cast Summon Fey without spending mana once per long rest, without concentration if you choose a shorter duration."],
  [15, "Mist Stepper", "Cast Misty Step without spending mana a few times, and take an ally with you."]]),
 "Swarm Warden": ("A ranger bound to a swarm of nature spirits.", [
  [3, "Swarm Warden spells", SP],
  [3, "Swarm Surge", "Once per turn on a hit, your swarm deals 1d6 extra piercing, pushes the target, or moves you."],
  [7, "Churning Tide", "Fly slowly on your swarm for a minute, a few times per long rest."],
  [11, "Swarm Might", "Swarm damage grows to 1d8, and its push knocks prone or its move gives you half cover."],
  [15, "Scattering Swarm", "Reaction: gain resistance and teleport 30 ft as you scatter into the swarm."]]),
 "Wyrmrider": ("A ranger with a young drake companion.", [
  [3, "Dragon Gift", "Learn Thaumaturgy and Draconic."],
  [3, "Drake Ally", "Summon a drake that fights beside you and grows with you."],
  [7, "Bond of Claw and Scale", "Your drake grows, can carry you while flying, and you gain resistance to its damage type."],
  [11, "Drake Breath", "Breathe a cone of your drake's element (or command the drake to), once per long rest (or spend 18 mana)."],
  [15, "Perfected Bond", "The drake grows to Large, hits harder, and can shield you from damage."]]),
}

S["Sorcerer"] = {
 "Chaotic Origin": ("Magic of chaos that surges unpredictably.", [
  [1, "Magic Storm", "After casting a spell with mana, the DM can have you roll for a random wild magic effect."],
  [1, "Fate's Tilt", "Gain advantage on one roll; regain it on a long rest or when the DM triggers a surge."],
  [6, "Nudge Fate", "Spend 2 sorcery points to add or subtract a d4 from someone else's roll."],
  [14, "Harnessed Surge", "Roll twice on the surge table and choose."],
  [18, "Surging Blast", "When you roll maximum on a damage die, roll it again and add it, once per turn."]]),
 "Heavenly Origin": ("A sorcerer with a spark of divine power.", [
  [1, "Heaven's Learning", "Learn spells from the cleric list as well as the sorcerer list, and gain one affinity spell (good, evil, law, chaos or neutrality)."],
  [1, "Fortune's Smile", "Add 2d4 to a failed save or missed attack, once per short rest."],
  [6, "Healing Cascade", "Spend 1 sorcery point to reroll healing dice."],
  [14, "Spectral Plumes", "Sprout spectral wings and fly."],
  [18, "Heaven's Pull", "Regain half your HP as a bonus action when below half, once per long rest."]]),
 "Umbral Origin": ("Magic drawn from the Shadowfell.", [
  [1, "Night Eyes", "Darkvision 120 ft, and cast Darkness with 2 sorcery points (you can see through it)."],
  [1, "Grave Grit", "When you'd drop to 0 HP, Cha save to stay at 1 HP, once per long rest."],
  [6, "Hound of Dread", "Spend 3 sorcery points to summon a shadow hound that hunts a target and makes it worse at saving against your spells."],
  [14, "Shadow Slip", "In dim light or darkness, teleport 120 ft as a bonus action."],
  [18, "Shade Form", "Spend 6 sorcery points to become shadowy for a minute: resist most damage and move through objects."]]),
 "Tempest Origin": ("Magic of wind and lightning.", [
  [1, "Storm Tongue", "Speak Primordial and its dialects."],
  [1, "Gale Lift", "Fly 10 ft without provoking after casting a spell with mana."],
  [6, "Thunder Core", "Resistance to lightning and thunder, and a burst of storm damage when you cast those spells."],
  [6, "Storm Sway", "Control rain and wind around you."],
  [14, "Storm's Rebuke", "Reaction: lightning damage and a push against a creature that hits you in melee."],
  [18, "Gale Soul", "Immune to lightning and thunder, fly 60 ft, and share flight with allies for an hour."]]),
 "Aberrant Origin": ("Psionic power from something alien.", [
  [1, "Psionic spells", SP],
  [1, "Thought Link", "Link minds with a creature to talk telepathically."],
  [6, "Dream Casting", "Cast your psionic spells with sorcery points instead of mana, with no components."],
  [6, "Mental Ward", "Resistance to psychic, advantage against charm and fear."],
  [14, "Flesh Changes", "Spend sorcery points for strange gifts: see invisible, fly, swim and breathe water, or squeeze through tiny gaps."],
  [18, "Warp Burst", "Teleport and pull creatures where you left with force damage, once per long rest (or 5 sorcery points)."]]),
 "Clockwork Origin": ("Magic of perfect order.", [
  [1, "Clockwork spells", SP],
  [1, "Steady Order", "Reaction: cancel advantage or disadvantage on a roll nearby, Proficiency-bonus times per long rest."],
  [6, "Ward of Order", "Spend sorcery points to give a creature a ward of d8s that soaks damage."],
  [14, "Trance of Precision", "For a minute, attacks against you can't have advantage and your rolls below 10 count as 10, once per long rest."],
  [18, "Clockwork Parade", "Summon spirits of order to heal, repair and end spells, once per long rest."]]),
}

S["Wizard"] = {
 "School of Warding": ("Wizards of wards and protection.", [
  [2, "Ward Scholar", "Copying abjuration spells costs half the gold and time."],
  [2, "Arcane Shell", "When you cast an abjuration spell with mana, you make a ward that absorbs damage, recharged by more abjuration spells."],
  [6, "Projected Shelter", "Use your ward to absorb damage for an ally nearby."],
  [10, "Greater Warding", "Add your proficiency bonus to ability checks made with abjuration spells (like Counterspell and Dispel Magic)."],
  [14, "Spell Bulwark", "Advantage on saves against spells and resistance to spell damage."]]),
 "School of Summoning": ("Wizards who summon and teleport.", [
  [2, "Summon Scholar", "Copying conjuration spells costs half the gold and time."],
  [2, "Trifle Summons", "Conjure a small nonmagical object for an hour."],
  [6, "Swap Stride", "Teleport 30 ft, or swap places with an ally, once per long rest (or after casting a conjuration spell)."],
  [10, "Steady Summons", "Damage can't break your concentration on conjuration spells."],
  [14, "Enduring Summons", "Creatures you summon get 30 temporary HP."]]),
 "School of Foresight": ("Seers who glimpse the future.", [
  [2, "Seer's Scholar", "Copying divination spells costs half the gold and time."],
  [2, "Foresight", "After a long rest, roll two d20s and keep them; replace any roll you see with one (three dice at 14th)."],
  [6, "Keen Seeing", "When you cast a divination spell of 2nd level or higher with mana, regain the mana cost of a spell one level lower (up to 40, a 5th-level spell)."],
  [10, "The Far Eye", "Gain darkvision, ethereal sight, the ability to read any language, or see invisible things until your next rest."],
  [14, "Greater Omen", "Roll three dice for Foresight."]]),
 "School of Charm": ("Wizards who charm and control minds.", [
  [2, "Charm Scholar", "Copying enchantment spells costs half the gold and time."],
  [2, "Lulling Gaze", "Charm a creature next to you and leave it dazed while you hold its gaze."],
  [6, "Flinch Charm", "Reaction: force an attacker to target someone else (Wis save)."],
  [10, "Paired Bind", "Single-target enchantment spells can target a second creature."],
  [14, "Smudge Memories", "Make a creature you charmed forget it was charmed and lose some hours of memory."]]),
 "School of Phantasms": ("Wizards whose illusions can become real.", [
  [2, "Phantom Scholar", "Copying illusion spells costs half the gold and time."],
  [2, "Layered Minor Illusion", "Minor Illusion makes both a sound and an image."],
  [6, "Shifting Veils", "Change an illusion you're maintaining as an action."],
  [10, "Mirage Double", "Reaction: an illusory double makes an attack miss, once per short rest."],
  [14, "Solid Illusion", "Make one object in your illusion real for a minute."]]),
 "School of Death": ("Wizards of death and the undead.", [
  [2, "Death Scholar", "Copying necromancy spells costs half the gold and time."],
  [2, "Gleaned Vitality", "When you kill with a spell, regain HP based on the spell's level."],
  [6, "Restless Dead", "Animate Dead raises one extra creature, and your undead are tougher."],
  [10, "Death-Hardened", "Resistance to necrotic, and your maximum HP can't be lowered."],
  [14, "Rule the Dead", "Take control of an undead creature (Cha save)."]]),
 "School of Alchemy": ("Wizards who change matter and bodies.", [
  [2, "Alchemy Scholar", "Copying transmutation spells costs half the gold and time."],
  [2, "Small Reshaping", "Change one material into another (wood, stone, iron, copper or silver) for an hour."],
  [6, "Alchemist's Shard", "Make a stone that gives darkvision, speed, a save proficiency or a resistance."],
  [10, "Reforming Self", "Cast Polymorph on yourself without spending mana, once per short rest."],
  [14, "Grand Alchemist", "Destroy your stone for a big effect: transform an object, cure everything, cast Raise Dead, or restore youth."]]),
 "Bladechant": ("Elegant duelists who weave spells into swordplay.", [
  [2, "Training in Edge and Hymn", "Light armor, one one-handed melee weapon, and Performance."],
  [2, "Edge Hymn", "Bonus action, a few times per long rest: add Intelligence to AC and concentration saves, move faster, and gain advantage on Acrobatics."],
  [6, "Extra Attack", "Attack twice, and replace one attack with a cantrip."],
  [10, "Hymn of Warding", "Reaction while your Edge Hymn is active: spend mana to cut damage by 5 per spell level of that mana (5 mana cuts 5, 10 cuts 10, 18 cuts 15, and so on)."],
  [14, "Hymn of Triumph", "Add Intelligence to melee weapon damage while your Edge Hymn is active."]]),
 "School of Battle Magic": ("Wizards trained for the battlefield.", [
  [2, "Arcane Parry", "Reaction: +2 AC or +4 to a save, but only cantrips on your next turn."],
  [2, "Field Sense", "Add Intelligence to initiative."],
  [6, "Power Spike", "Store power surges when you counter or dispel magic, and spend them for extra force damage."],
  [10, "Lasting Magic", "+2 AC and saves while concentrating."],
  [14, "Parrying Veil", "Arcane Deflection also blasts nearby creatures with force damage."]]),
 "Timecraft": ("Wizards who bend time.", [
  [2, "Temporal Nudge", "Reaction: force a creature to reroll an attack, check or save, twice per long rest."],
  [2, "Time Feel", "Add Intelligence to initiative."],
  [6, "Stolen Moment", "Freeze a Large or smaller creature in time (Con save), a few times per long rest."],
  [10, "Bead Vault", "Store a 4th-level or lower spell in a bead someone else can use, once per short rest."],
  [14, "Fated Sight", "Decide whether a roll you can see succeeds or fails, at the cost of a level of exhaustion."]]),
 "Weightcraft": ("Wizards who bend gravity.", [
  [2, "Shift Weight", "Make a creature heavier or lighter for a minute."],
  [6, "Sinking Well", "When your spell hits or affects a creature, move it 5 ft."],
  [10, "Forceful Pull", "Reaction: add damage to an attack, or to falling damage, a few times per long rest."],
  [14, "Gripping Field", "A field that drags enemies toward you and stops their movement, once per long rest (or spend 18 mana)."]]),
 "Order of the Inkwright": ("Wizards whose spellbook is alive.", [
  [2, "Inkwright's Pen", "A magical quill that copies spells quickly and cheaply."],
  [2, "Living Tome", "Swap a spell's damage type for another from your book, and cast rituals faster."],
  [6, "Inscribed Spirit", "Make your book's spirit appear and cast spells from its location."],
  [10, "Master Penman", "Make a magic scroll of a spell you know after a long rest, cast as one level higher."],
  [14, "Word-Bound", "Advantage on Arcana checks, and let your book take damage for you by erasing spells temporarily."]]),
}
