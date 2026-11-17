"""Build spell-notes.json: own-words summaries of spells that aren't in the free SRD. None = not written yet."""
import json, sys, importlib.util, os
here = os.path.dirname(os.path.abspath(__file__))
out = {}
for f in 'abcd':
    spec = importlib.util.spec_from_file_location(f, os.path.join(here, f + '.py')); m = importlib.util.module_from_spec(spec); spec.loader.exec_module(m)
    for k, v in m.NOTES.items():
        assert k not in out, k
        out[k] = None if v is None else {'casting_time': v[0], 'range': v[1], 'components': v[2], 'duration': v[3], 'description': v[4], 'more': v[5]}
json.dump(out, open(sys.argv[1], 'w'), ensure_ascii=False, separators=(',', ':'))
print(len(out), 'entries,', sum(1 for v in out.values() if v), 'written,', sum(1 for v in out.values() if v is None), 'not yet')
