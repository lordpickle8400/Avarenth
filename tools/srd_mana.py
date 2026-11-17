"""Rewrite srd.json for Avarenth's mana rules (from the wiki's Mana Guide), keeping the 2024 text as 'orig'.
Each converted entry gains meta: {"orig": blocks, "av": "rewritten"|"converted", "ruling": bool}."""
import json, re, sys, copy
P = sys.argv[1]
d = json.load(open(P))

COST = {1: 5, 2: 10, 3: 18, 4: 28, 5: 40, 6: 60, 7: 85, 8: 110, 9: 150}
MANA = {"Wizard": (25, 15), "Sorcerer": (35, 17), "Cleric": (25, 14), "Druid": (25, 14), "Bard": (30, 13), "Warlock": (30, 12),
        "Paladin": (20, 9), "Ranger": (20, 9), "Monk": (20, 8), "Fighter": (15, 7), "Rogue": (15, 6), "Barbarian": (10, 6)}
CHARGES = {"Wizard": "High Magic Charges at levels 11, 13, 15, 17 and 19 (up to 5), and a Reality Channel at 17",
           "Sorcerer": "High Magic Charges at levels 11, 13, 15, 17 and 19 (up to 5), and a Reality Channel at 17",
           "Cleric": "High Magic Charges at levels 11, 13, 15 and 19 (up to 4), and a Reality Channel at 17",
           "Druid": "High Magic Charges at levels 11, 13, 15 and 19 (up to 4), and a Reality Channel at 17",
           "Bard": "High Magic Charges at levels 11, 15 and 19 (up to 3), and a Reality Channel at 19",
           "Warlock": "High Magic Charges at levels 11, 15 and 19 (up to 3), and a Reality Channel at 19",
           "Paladin": "High Magic Charges at levels 15 and 19 (up to 2), and never a Reality Channel",
           "Ranger": "High Magic Charges at levels 15 and 19 (up to 2), and never a Reality Channel"}
FULL = {"Wizard", "Sorcerer", "Cleric", "Druid", "Bard", "Warlock"}
NOTE = ("_Avarenth._ There are no spell slots: read any spell slot here as mana. A level 1–9 spell costs "
        "5 / 10 / 18 / 28 / 40 / 60 / 85 / 110 / 150 mana; 6th–8th also need a High Magic Charge, 9th a Reality Channel.")

def P_(t): return ["p", t]

def spellcasting(cls, orig):
    start, per = MANA[cls]
    top = "5th" if cls in FULL else "4th"
    out = [P_("_Avarenth: mana, not spell slots._ You cast with a mana pool: %d mana at 1st level and +%d each level after, all back on a Long Rest. "
              "A spell costs mana by its level: 5 (1st), 10 (2nd), 18 (3rd), 28 (4th), 40 (5th), 60 (6th), 85 (7th), 110 (8th), 150 (9th). Cantrips are free." % (start, per)),
           P_("_High magic._ 6th to 8th-level spells also need a High Magic Charge, and a 9th-level spell needs a Reality Channel. As a %s you gain %s. Charges and Channels come back on a Long Rest." % (cls, CHARGES.get(cls, "no High Magic Charges"))),
           P_("_Your spells._ You start with your class's base spells and gain free picks from your class list as you level (the character builder and level-up guide hand them out). "
              "Your class list stops at %s level; anything beyond it, or off the list, is learned from a spell tome, if you're high enough level (2nd-level spells at 3, 3rd at 5, 4th at 7, 5th at 9, 6th at 11, 7th at 13, 8th at 15, 9th at 17) "
              "and can pay the learning cost. Leveling raises what you can handle; discovery decides what you know." % top)]
    if cls == "Wizard":
        out.append(P_("_Spellbook._ You can copy compatible spells from tomes and scrolls into your spellbook. Every spell you know is in it."))
    if cls == "Warlock":
        out.append(P_("_Your patron._ Your patron is one of Avarenth's gods or demons, named on your sheet, and which pacts you can take depends on who it is. Patron magic may need your patron's approval, and gifts are debts."))
    keep = [b for b in orig if b[0] == "p" and re.match(r"_(Spellcasting Ability|Spellcasting Focus|Ritual)", b[1])]
    return out + keep

OVR = {
    ("Paladin", "Paladin's Smite"): (False, [P_("_Avarenth: Divine Smite with mana._ When you hit a creature with a melee weapon, you can spend mana to deal extra Radiant damage: 2d8 for 5 mana, 3d8 for 10, 4d8 for 18, or 5d8 for 28. Add 1d8 against Undead and Fiends.")]),
    ("Wizard", "Arcane Recovery"): (False, [P_("_Avarenth._ Once per day, when you finish a Short Rest, you regain mana equal to 5 × your Wizard level.")]),
    ("Wizard", "Spell Mastery"): (False, [P_("_Avarenth._ Choose one 1st-level and one 2nd-level spell you know. They cost you no mana. Whenever you finish a Long Rest, you can swap either for another spell you know of the same level.")]),
    ("Wizard", "Signature Spells"): (False, [P_("_Avarenth._ Choose two 3rd-level spells you know. You can cast each of them once without spending mana, and regain that use when you finish a Short or Long Rest.")]),
    ("Warlock", "Mystic Arcanum"): (False, [P_("_Avarenth._ Your patron is your tome. At 11th level it teaches you a 6th-level spell without a tome, then a 7th at 13th, an 8th at 15th and a 9th at 17th. You still need a High Magic Charge (or a Reality Channel for the 9th) to cast it."),
                                             P_("Every gift is a debt your patron will call in, and it leaves a mark on you that grows with each one. Record the debt and the mark on your sheet.")]),
    ("Warlock", "Eldritch Master"): (False, [P_("_Avarenth._ Once per Long Rest, you can plead with your patron for 1 minute to regain mana equal to half your maximum.")]),
    ("Warlock", "Magical Cunning"): (True, [P_("_Avarenth (DM's call)._ Once per Long Rest, you can perform a 1-minute rite to your patron and regain mana equal to 5 × your Warlock level, up to your maximum.")]),
    ("Bard", "Magical Secrets"): (False, [P_("_Avarenth._ At 10th, 14th and 18th level, you learn two spells from any class's list. You need no tome, and you pay half the usual learning cost.")]),
    ("Sorcerer", "Font of Magic"): (False, None),  # built below: keep the Sorcery Points part
    ("Druid", "Wild Resurgence"): (True, [P_("_Avarenth (DM's call)._ Once on each of your turns, if you have no uses of Wild Shape left, you can spend 5 mana to regain one use (no action required)."),
                                          P_("You can also expend one use of Wild Shape to regain 5 mana (no action required). Once you do so, you can't do so again until you finish a Long Rest.")]),
}
ARCHDRUID_NM = "_Nature Magician._ You can turn uses of Wild Shape into mana (no action required). Each use counts as 2 spell levels: one use gives 10 mana, two give 28, three give 60, four give 110. A spell of 6th level or higher still needs its High Magic Charge. Once you use this benefit, you can't do so again until you finish a Long Rest."
SUB_OVR = {
    ("Druid", "Natural Recovery"): (True, [P_("_Avarenth (DM's call)._ Once per day, when you finish a Short Rest, you can regain mana equal to 5 × your Druid level.")]),
}

def convert(blocks):
    """Rewrite spell-slot phrases as mana. Returns (blocks, changed, leftover)."""
    changed = False
    def fix(t):
        nonlocal changed
        o = t
        t = re.sub(r"\b[Ll]evel (\d) or higher spell slots?", lambda m: "mana for a level %s or higher spell (at least %d)" % (m.group(1), COST[int(m.group(1))]), t)
        t = re.sub(r"\bspell slots? of level (\d) or higher", lambda m: "mana for a level %s or higher spell (at least %d)" % (m.group(1), COST[int(m.group(1))]), t)
        t = re.sub(r"\b(a |one )?[Ll]evel (\d) spell slot", lambda m: "%d mana (a level %s spell's cost)" % (COST[int(m.group(2))], m.group(2)), t)
        t = re.sub(r"without (expending|using|spending) a spell slot", "without spending mana", t)
        t = re.sub(r"without a spell slot", "without spending mana", t)
        t = re.sub(r"\b(expend|expends|expending|expended) a spell slot", lambda m: {"expend": "spend", "expends": "spends", "expending": "spending", "expended": "spent"}[m.group(1)] + " 5 mana", t)
        t = re.sub(r"with a spell slot of levels", "of levels", t)
        t = re.sub(r"each level of the spell slot", "each level of the spell", t)
        t = re.sub(r"\b(expend|expending) (one of your|your) spell slots", lambda m: ("spend" if m.group(1) == "expend" else "spending") + " mana", t)
        t = re.sub(r"\bspell slots\b", "mana", t)
        t = re.sub(r"\ba spell slot\b", "mana", t)
        t = re.sub(r"\bthe slot's level\b", "the level of the spell whose mana you spent", t)
        if t != o: changed = True
        return t
    out = []
    for b in blocks:
        if b[0] in ("p", "h"): out.append([b[0], fix(b[1])])
        elif b[0] == "ul": out.append(["ul", [fix(x) for x in b[1]]])
        else: out.append(b)
    left = "slot" in json.dumps(out).lower()
    return out, changed, left

def apply(blocks, key=None, sub=False, cls=None, name=None):
    orig = copy.deepcopy(blocks)
    table = SUB_OVR if sub else OVR
    if cls and name == "Spellcasting" or (cls == "Warlock" and name == "Pact Magic"):
        return spellcasting(cls, orig), {"orig": orig, "av": "rewritten", "ruling": False}
    if cls == "Sorcerer" and name == "Font of Magic":
        keep = [b for b in orig if not ("slot" in json.dumps(b).lower()) and b[0] == "p"]
        new = keep + [P_("_Avarenth: Sorcery Points and mana._ As a Bonus Action, you can turn 1 Sorcery Point into 5 mana, or spend 6 mana to gain 1 Sorcery Point. Neither can go above its maximum. Both trades are on your character sheet.")]
        return new, {"orig": orig, "av": "rewritten", "ruling": False}
    if (cls, name) in table:
        ruling, new = table[(cls, name)]
        return new, {"orig": orig, "av": "rewritten", "ruling": ruling}
    if sub and re.search(r"(Domain|Land|Devotion|Draconic|Fiend) Spells$", name or ""):
        who = {"Cleric": "your god's temples", "Paladin": "your order", "Warlock": "your patron", "Druid": "the land's spirits and groves", "Sorcerer": "your bloodline"}.get(cls, "your teachers")
        lead = P_("_Avarenth: subclasses add no spells._ These are the spells that suit this path, and %s will help you find them, but you still learn each one from a tome (or a teacher) at the usual cost and level. Once learned, they cast with mana like any other spell." % who)
        keep = [b for b in orig if not (b[0] == "p" and re.search(r"always have|prepared|ensures you", b[1]))]
        return [lead] + keep, {"orig": orig, "av": "rewritten", "ruling": False}
    if cls == "Druid" and name == "Archdruid":
        new = [P_(ARCHDRUID_NM) if b[0] == "p" and b[1].startswith("_Nature Magician._") else b for b in orig]
        new = [b for b in new if not (b[0] == "p" and "slot" in b[1].lower() and not b[1].startswith("_Nature"))]
        return new, {"orig": orig, "av": "rewritten", "ruling": True}
    new, changed, left = convert(blocks)
    if not changed and not left: return blocks, None
    if left: new = new + [P_(NOTE)]
    return new, {"orig": orig, "av": "converted", "ruling": left}

n = 0
for cls, feats in d["classes"].items():
    for f in feats:
        nb, meta = apply(f[2], cls=cls, name=f[1])
        if meta: f[2] = nb; f[:] = f[:3] + [meta]; n += 1
for cls, s in d["subclasses"].items():
    for f in s["features"]:
        nb, meta = apply(f[2], sub=True, cls=cls, name=f[1])
        if meta: f[2] = nb; f[:] = f[:3] + [meta]; n += 1
for f in d["feats"]:
    nb, meta = apply(f["text"])
    if meta: f["text"] = nb; f["meta"] = meta; n += 1
for k, opts in d["options"].items():
    for o in opts:
        nb, meta = apply(o["text"])
        if meta: o["text"] = nb; o["meta"] = meta; n += 1
for k, sp in d["species"].items():
    nb, meta = apply(sp["text"])
    if meta: sp["text"] = nb; sp["meta"] = meta; n += 1
d["mana"] = "Spell slots rewritten as mana from the Avarenth Mana Guide; the 2024 text is kept as 'orig'."
json.dump(d, open(P, "w"), ensure_ascii=False, separators=(",", ":"))
print("converted", n)
left = []
def scan(where, blocks, meta):
    if "slot" in json.dumps(blocks).lower() and not (meta and meta.get("ruling")): left.append(where)
for cls, feats in d["classes"].items():
    for f in feats: scan(cls + " " + f[1], f[2], f[3] if len(f) > 3 else None)
print("still mentioning slots without a note:", left)
