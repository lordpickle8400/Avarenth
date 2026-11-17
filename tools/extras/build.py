"""Build extras.json: own-words feats, backgrounds and class options from outside the SRD. The app merges these
into the SRD data so the builder, level-up and Rules pages offer them alongside the official free text."""
import json, sys, os, importlib.util
here = os.path.dirname(os.path.abspath(__file__))
def load(n):
    spec = importlib.util.spec_from_file_location(n, os.path.join(here, n + '.py')); m = importlib.util.module_from_spec(spec); spec.loader.exec_module(m); return m
F, B, O = load('feats'), load('backgrounds'), load('options')
out = {'feats': [{'name': n, 'category': c, 'prereq': p, 'book': b, 'text': [['p', t]], 'own': True} for n, c, p, b, t in F.FEATS],
       'backgrounds': {n: {'book': v[0], 'abilities': v[1], 'feat': v[2], 'skills': ' and '.join(v[3]), 'skillList': v[3], 'tool': v[4], 'equipment': v[5], 'about': v[6], 'feature': v[7] if len(v) > 7 else '', 'own': True} for n, v in B.BG.items()},
       'options': {k: [{'name': n, 'prereq': p, 'text': [['p', t]], 'own': True} for n, p, t in v] for k, v in O.OPTIONS.items()}}
names = [f['name'] for f in out['feats']]; assert len(names) == len(set(names))
json.dump(out, open(sys.argv[1], 'w'), ensure_ascii=False, separators=(',', ':'))
print(len(out['feats']), 'feats,', len(out['backgrounds']), 'backgrounds,', {k: len(v) for k, v in out['options'].items()})
