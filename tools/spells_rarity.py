import json, re, sys
spells = json.load(open('work/spells.json'))
TIERS = ['Common', 'Uncommon', 'Rare', 'Very Rare', 'Legendary']
BASE = {0: 0, 1: 0, 2: 1, 3: 1, 4: 2, 5: 2, 6: 3, 7: 3, 8: 4, 9: 4}
# Game-changers: one tier rarer than their level suggests.
UP = """Shield; Silvery Barbs; Find Familiar; Bless; Healing Word; Sleep;
Pass without Trace; Hold Person; Invisibility; Spiritual Weapon;
Counterspell; Fireball; Hypnotic Pattern; Revivify; Spirit Guardians; Haste; Animate Dead; Conjure Animals; Fly;
Polymorph; Banishment; Greater Invisibility;
Raise Dead; Wall of Force; Animate Objects; Teleportation Circle; Scrying; Planar Binding; Geas;
Contingency; Magic Jar;
Simulacrum; Resurrection; Forcecage; Plane Shift"""
# Minor or utility magic: one tier more common.
DOWN = """Continual Flame; Magic Mouth; Arcane Lock; Gentle Repose; Locate Object; Skywrite; Darkvision; Knock; Rope Trick; Augury; Animal Messenger;
Feign Death; Meld into Stone; Water Breathing; Water Walk; Create Food and Water; Tongues; Sending; Speak with Dead; Speak with Plants; Catnap; Tiny Servant;
Locate Creature; Divination; Fabricate; Stone Shape; Mordenkainen's Private Sanctum; Leomund's Secret Chest; Mordenkainen's Faithful Hound;
Commune; Commune with Nature; Rary's Telepathic Bond;
Find the Path; Drawmij's Instant Summons; Guards and Wards; Move Earth; Create Homunculus;
Telepathy; Control Weather; Animal Shapes; Mighty Fortress"""
# Dunamancy spells have no class list in the source; they belong to sorcerers and wizards.
DUNAMANCY_CLASSES = ['Sorcerer', 'Wizard']
def names(block): return {n.strip().lower() for n in re.split(r'[;\n]', block) if n.strip()}
up, down = names(UP), names(DOWN)
have = {s['name'].lower() for s in spells}
missing = sorted((up | down) - have)
if missing: print('NOT FOUND:', missing); sys.exit(1)
for s in spells:
    t = BASE[s['level']]
    n = s['name'].lower()
    if n in up: t = min(4, t + 1); s['nudge'] = 'up'
    elif n in down: t = max(0, t - 1); s['nudge'] = 'down'
    s['rarity'] = TIERS[t]
    if not s['classes'] and s['source'] == 'EGW': s['classes'] = DUNAMANCY_CLASSES
json.dump(spells, open('work/spells_rated.json', 'w'), indent=0)
from collections import Counter
print(Counter(s['rarity'] for s in spells))
print('no classes left:', [s['name'] for s in spells if not s['classes']])
