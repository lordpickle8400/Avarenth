"""Avarenth class lists: base official class lists only (no subclass spells), capped at
5th level for full casters and 4th for everyone else. Anything higher is tome-only.
Fighter, Rogue, Barbarian and Monk have no official base list, so they get short themed lists."""
import json
spells = json.load(open('work/spells.json'))  # base class lists straight from the source data
FULL = {'Wizard', 'Sorcerer', 'Cleric', 'Druid', 'Bard', 'Warlock'}
MARTIAL = {
 'Fighter': "Blade Ward;Booming Blade;Green-Flame Blade;Lightning Lure;Sword Burst;True Strike;Shocking Grasp;Shield;Absorb Elements;Compelled Duel;Thunderous Smite;Searing Smite;Wrathful Smite;Heroism;Longstrider;Jump;Expeditious Retreat;Zephyr Strike;Magic Weapon;Shadow Blade;Enhance Ability;Misty Step;Branding Smite;Blur;Aid;Elemental Weapon;Haste;Crusader's Mantle;Protection from Energy;Blinding Smite;Thunder Step;Staggering Smite;Stoneskin;Fire Shield;Freedom of Movement",
 'Rogue': "Mage Hand;Minor Illusion;Message;Prestidigitation;Mind Sliver;Friends;Booming Blade;Disguise Self;Silent Image;Charm Person;Feather Fall;Fog Cloud;Expeditious Retreat;Illusory Script;Comprehend Languages;Tasha's Hideous Laughter;Dissonant Whispers;Distort Value;Invisibility;Darkness;Pass without Trace;Knock;Spider Climb;Shadow Blade;Silence;Suggestion;Detect Thoughts;Mirror Image;Nystul's Magic Aura;Misty Step;Rope Trick;Nondetection;Major Image;Gaseous Form;Blink;Greater Invisibility;Dimension Door;Shadow of Moil;Hallucinatory Terrain",
 'Barbarian': "Thorn Whip;Primal Savagery;Thunderclap;Resistance;Magic Stone;Longstrider;Jump;Speak with Animals;Thunderous Smite;Wrathful Smite;Heroism;Absorb Elements;Beast Bond;Enlarge/Reduce;Barkskin;Enhance Ability;Beast Sense;Earthbind;Speak with Dead;Elemental Weapon;Protection from Energy;Wind Wall;Thunder Step;Stoneskin;Guardian of Nature;Freedom of Movement;Staggering Smite",
 'Monk': "Blade Ward;Resistance;Gust;Shape Water;Mold Earth;Control Flames;Thunderclap;Burning Hands;Thunderwave;Feather Fall;Jump;Longstrider;Expeditious Retreat;Fog Cloud;Sanctuary;Earth Tremor;Zephyr Strike;Absorb Elements;Darkness;Pass without Trace;Silence;Misty Step;Gust of Wind;Hold Person;Darkvision;Shatter;Enhance Ability;Spider Climb;Lesser Restoration;Warding Wind;Fly;Gaseous Form;Water Walk;Wall of Water;Erupting Earth;Fireball;Wind Wall;Thunder Step;Fire Shield;Stoneskin;Freedom of Movement;Wall of Fire;Ice Storm;Dimension Door",
}
DUNAMANCY = ['Sorcerer', 'Wizard']
def cap(cls): return 5 if cls in FULL else 4
out = {}
for s in spells:
    base = set(s['classes'] or (DUNAMANCY if s['source'] == 'EGW' else []))
    base.discard('Monk')  # official Monk has no base list; it gets the themed list below
    for cls, names in MARTIAL.items():
        if s['name'] in names.split(';'): base.add(cls)
    out[s['name']] = sorted(c for c in base if s['level'] <= cap(c))
json.dump(out, open('work/avarenth_lists.json', 'w'), indent=0)
from collections import Counter
cnt = Counter(c for v in out.values() for c in v)
print(sorted(cnt.items()))
print('tome only:', sum(1 for v in out.values() if not v))
