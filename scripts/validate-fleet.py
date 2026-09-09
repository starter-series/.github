#!/usr/bin/env python3
"""Validate only the explicit fleet and its shared workflow call graph."""
import argparse,json,re
from pathlib import Path
import yaml

def load(path):
    data=yaml.safe_load(path.read_text())
    if True in data: data['on']=data.pop(True)
    return data

def main():
    parser=argparse.ArgumentParser();parser.add_argument('--root',type=Path,required=True);args=parser.parse_args()
    central=Path(__file__).resolve().parents[1]
    fleet=json.loads((central/'fleet.json').read_text())['repositories']
    assert len(fleet)==11 and len({r['repo'] for r in fleet})==11
    for item in fleet:
        repo=args.root/item['repo'];workflow=load(repo/'.github/workflows/ci.yml')
        call=workflow['jobs']['checks']['uses']
        expected=f"starter-series/.github/.github/workflows/reusable-{item['runtime']}-ci.yml@main"
        assert call==expected,(item['repo'],call)
        assert (repo/'.github/actions/validate/action.yml').is_file()
        assert workflow['jobs']['ci']['if']=='${{ always() }}'
        assert set(workflow['jobs']['ci']['needs'])==set(workflow['jobs'])-{'ci'}
        for file in ['ci.yml','codeql.yml','maintenance.yml']:
            d=load(repo/'.github/workflows'/file)
            assert 'schedule' not in d['on'],(item['repo'],file)
            text=(repo/'.github/workflows'/file).read_text()
            for banned in ['npm audit','gitleaks','license-checker','setup-node@','setup-python@','issues.create','issues.update']:
                assert banned not in text,(item['repo'],file,banned)
        extension=(repo/'.github/actions/validate/action.yml').read_text()
        for banned in ['npm audit','license-checker','pip-audit','gitleaks','setup-node@','setup-python@']:
            assert banned not in extension,(item['repo'],banned)
    for path in (central/'.github').rglob('*.yml'):
        text=path.read_text()
        for target in re.findall(r'uses:\s*[\'\"]?([^\s\'\"]+)',text):
            if target.startswith('./.github/workflows/'):
                assert (central/target[2:]).is_file(),target
            elif target.startswith('starter-series/.github/'):
                rel=target.split('@')[0][len('starter-series/.github/'):]
                local=central/rel
                assert local.is_file() or (local/'action.yml').is_file(),target
            elif not target.startswith('./'):
                assert re.search(r'@[0-9a-f]{40}$',target),target
    print('11 wrappers and central workflow/action call graph validated')
if __name__=='__main__':main()
