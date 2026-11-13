"""Extract original groups without flattening/changing geometry; preserve source SVGs."""
from pathlib import Path
import xml.etree.ElementTree as E
import json,hashlib
E.register_namespace('', 'http://www.w3.org/2000/svg');E.register_namespace('xlink','http://www.w3.org/1999/xlink')
a=Path('src/assets/dynasty')
def source(n):return E.parse(a/(n+'.svg')).getroot()
def group(n,id):return E.tostring(next(e for e in source(n).iter() if e.get('id')==id),encoding='unicode')
parts={
 'tail':group('Derbil','TAIL'),'leftFoot':group('Derbil','LEFT_FOOT'),'rightFoot':group('Derbil','RIGHT_FOOT'),
 'body':group('Derbil','BODY'),'eyes':group('Derbil','EYES'),'wings':group('Derbil_Fly','WINGS'),
 'leftArm':group('Derbil_Strength','ARMS_LEFT'),'rightArm':group('Derbil_Strength','ARMS_RIGHT'),'fin':group('Derbil_Swim','FIN')}
parts['berry']=group('Bush','BERRY_1')
parts['egg']=(a/'Egg.svg').read_text();parts['bush']=(a/'Bush.svg').read_text();parts['kelp']=(a/'Kelp.svg').read_text()
Path('src/render/dynasty-parts.json').write_text(json.dumps(parts,indent=2)+'\n')
manifest={p.name:hashlib.sha256(p.read_bytes()).hexdigest() for p in a.glob('*.svg')}
Path('docs/ASSET_HASHES.json').write_text(json.dumps(manifest,indent=2)+'\n')
