# Own-words summaries (not book text) for the subclasses of the Artificer (Tasha's Cauldron of Everything)
# and the Blood Hunter (Matthew Mercer's class, 2020 revision). [level, feature, what it does]. Costs are in Avarenth mana.
S = {}

S["Artificer"] = {
 "Alchemist": ("An expert at brewing magic: elixirs, healing and acid.", [
  [3, "Tool Proficiency", "Proficiency with alchemist's supplies (or another artisan's tool if you have it)."],
  [3, "Experimental Elixir", "After a long rest, make a random magic elixir in an empty flask: healing, swiftness, resilience, boldness, flight or transformation. Spend 5 mana to brew one you choose (10 for a second, and so on by spell cost). More free elixirs at 6th and 15th."],
  [5, "Alchemical Savant", "When you cast a spell through alchemist's supplies, add your Intelligence modifier to one roll of its acid, fire, necrotic or poison damage or its healing."],
  [9, "Restorative Reagents", "Your elixirs also give temporary hit points, and you can cast Lesser Restoration without mana a few times per long rest."],
  [15, "Chemical Mastery", "Resistance to acid and poison, immune to being poisoned, and once per long rest each cast Greater Restoration and Heal without mana or materials."]]),
 "Armorer": ("You turn your armor into your weapon and your spell focus.", [
  [3, "Tools of the Trade", "Proficiency with heavy armor and smith's tools."],
  [3, "Arcane Armor", "Your armor becomes your spell focus, can't be removed against your will, covers your whole body and can be donned in an action."],
  [3, "Armor Model", "Guardian (thunder gauntlets that draw enemies to you, and temporary hit points as a bonus action) or Infiltrator (a lightning launcher, +5 speed and advantage on Stealth). Swap after a rest."],
  [5, "Extra Attack", "Attack twice when you take the Attack action."],
  [9, "Armor Modifications", "Your armor counts as separate items for infusions (armor, helmet, boots, weapon), so you can infuse more of it."],
  [15, "Perfected Armor", "Guardian: pull a Huge or smaller creature 30 feet toward you as a reaction and attack it. Infiltrator: creatures you hit glow and take extra lightning damage."]]),
 "Artillerist": ("You build a magical cannon and turn wand and staff into weapons.", [
  [3, "Tool Proficiency", "Proficiency with woodcarver's tools."],
  [3, "Eldritch Cannon", "Build a small or tiny magical cannon once per long rest (or spend 5 mana for another): a flamethrower, force ballista or protector (temporary hit points for allies). Fire it as a bonus action."],
  [5, "Arcane Firearm", "Carve a wand, staff or rod into a firearm; spells cast through it deal an extra 1d8 damage."],
  [9, "Explosive Cannon", "Your cannons hit harder (+1d8), and you can detonate one as an action."],
  [15, "Fortified Position", "You can have two cannons at once, and allies near a cannon have half cover."]]),
 "Battle Smith": ("A soldier-inventor who fights beside a loyal steel defender.", [
  [3, "Tool Proficiency", "Proficiency with smith's tools."],
  [3, "Battle Ready", "Proficiency with martial weapons, and use Intelligence for attacks and damage with magic weapons."],
  [3, "Steel Defender", "A loyal construct companion that fights on your turn, protects allies with its reaction and repairs itself. It grows with your level."],
  [5, "Extra Attack", "Attack twice when you take the Attack action."],
  [9, "Arcane Jolt", "When you or your defender hit, deal an extra 2d6 force damage or heal a creature within 30 feet for 2d6, a few times per long rest."],
  [15, "Improved Defender", "Arcane Jolt grows to 4d6, your defender gets +2 AC, and its deflections deal force damage back."]]),
}

S["Blood Hunter"] = {
 "Order of the Ghostslayer": ("The oldest order: hunters of undead who wield sunlight and spirit.", [
  [3, "Rite of the Dawn", "A new Crimson Rite that sheds light, gives resistance to necrotic damage, and deals extra damage to undead."],
  [3, "Curse Specialist", "Extra uses of Blood Maledict, and you can amplify a curse without the hit point cost once per rest."],
  [7, "Aether Walk", "For a few rounds, become partly ghostly: walk through creatures and objects, fly or hover. Once per short or long rest."],
  [11, "Brand of Sundering", "Your brand weakens spirits and keeps a branded creature from becoming incorporeal; your hits on it deal extra damage."],
  [15, "Blood Curse of the Exorcist", "A curse that ends being charmed, frightened or possessed on a creature, damaging the possessor."],
  [18, "Rite Revival", "When you drop to 0 hit points with a Crimson Rite active, you can end the rite to drop to 1 hit point instead, a few times per long rest."]]),
 "Order of the Lycan": ("Hunters who take the curse of the wolf into their own blood, and learn to control it.", [
  [3, "Heightened Senses", "Advantage on Perception checks that use hearing or smell."],
  [3, "Hybrid Transformation", "Turn into a half-wolf for an hour: stronger, faster, tougher against nonmagical weapons, with claws. You risk bloodlust when hurt (a Wisdom save to keep control). Once per short or long rest, more later."],
  [7, "Stalker's Prowess", "Better speed and jumping, and your claws get better in hybrid form."],
  [11, "Advanced Transformation", "Your hybrid form heals itself each turn and its claws strike harder."],
  [15, "Brand of the Voracious", "Better control of the bloodlust, and advantage on attacks against creatures you've branded."],
  [18, "Hybrid Transformation Mastery", "Full control of the beast: more uses, a blood curse of the howl, and you can change at will."]]),
 "Order of the Mutant": ("Hunters who drink alchemical mutagens to warp their own bodies.", [
  [3, "Formulas", "Learn mutagen formulas that boost one stat or sense at a cost (for example, stronger but slower). More formulas as you level."],
  [3, "Mutagencraft", "After a rest, brew a number of mutagens; drink one as a bonus action. Their side effects last until your next rest."],
  [7, "Strange Metabolism", "Immune to poison damage and the poisoned condition, and you can ignore one mutagen's side effect once per long rest."],
  [11, "Brand of Axiom", "Your brand stops a creature changing shape or turning invisible, and dispels illusions on it."],
  [15, "Blood Curse of Corrosion", "A curse that poisons a creature, damaging it each turn."],
  [18, "Exalted Mutation", "Change one active mutagen's effect for another as a bonus action, once per short rest."]]),
 "Order of the Profane Soul": ("Hunters who bargain with dark patrons to fight darkness with darkness.", [
  [3, "Otherworldly Patron", "Pick a patron (in Avarenth, one of the gods or demons). Your Crimson Rite and features take on its flavor."],
  [3, "Pact Magic", "You learn warlock spells and cast them with mana; your spellcasting ability is Intelligence. You start with two cantrips. Your list stops at 4th level like other half casters."],
  [3, "Rite Focus", "Your weapon is your spell focus while a Crimson Rite is active, and your patron gives your rite a small extra effect."],
  [7, "Mystic Frenzy", "When you cast a cantrip as an action, you can make one weapon attack as a bonus action."],
  [11, "Revealed Arcana", "Once per long rest, cast one spell from your patron's list without spending mana."],
  [15, "Brand of the Sapping Scar", "A creature you've branded has disadvantage on saves against your spells. You also learn a curse that lets you feed on the dying to regain a little mana."],
  [18, "Unsealed Arcana", "Once per long rest, cast a stronger spell your patron grants without spending mana."]]),
}
