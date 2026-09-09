const {test}=require('node:test');
const assert=require('node:assert/strict');
const {allowed}=require('../policy/licenses.cjs');
const {evaluate}=require('../policy/audit.cjs');
const policy=require('../policy/security-exceptions.json');
test('SPDX boolean expressions preserve prohibited obligations',()=>{
 for(const s of ['BSD','MIT OR Apache-2.0','(MIT OR GPL-3.0-or-later)','(BSD-3-Clause OR GPL-2.0)','MIT AND Apache-2.0','MIT OR (GPL-3.0 AND Apache-2.0)']) assert.equal(allowed(s),true,s);
 for(const s of ['GPL-3.0-only','MIT AND GPL-3.0-or-later','(MIT OR Apache-2.0) AND AGPL-3.0','GPL-2.0-only WITH Classpath-exception-2.0','MIT OR','MIT garbage']) assert.equal(allowed(s),false,s);
});
function fixture(){
 const a={severity:'high',url:'https://github.com/advisories/GHSA-w3rx-r6r6-pgpr'};
 const v={name:'image-size',severity:'high',via:[a],nodes:['node_modules/image-size']};
 return {audit:{auditReportVersion:2,vulnerabilities:{'image-size':v,tool:{name:'tool',severity:'high',via:['image-size','cycle'],nodes:['node_modules/tool']},cycle:{name:'cycle',severity:'high',via:['tool'],nodes:['node_modules/cycle']}},metadata:{vulnerabilities:{total:3}}},lock:{packages:{'node_modules/image-size':{version:'2.0.2'},'node_modules/addons-linter':{dependencies:{'image-size':'2.0.2'}}}}};
}
const run=(f,repo='starter-series/browser-extension-starter',date='2026-09-09')=>evaluate(f.audit,f.lock,repo,policy,date);
test('exact exception covers advisory propagation and cycles, with visible expiry',()=>{
 const r=run(fixture());assert.equal(r.blocked.length,0);assert.match(r.accepted[0],/expires 2026-09-23/);
 assert.match(run(fixture(),undefined,'2026-09-16').accepted[0],/REVIEW DUE/);
});
test('expiry, new advisory, different repo/version/path fail closed',()=>{
 assert.throws(()=>run(fixture(),undefined,'2026-09-23'),/expired/);
 assert.ok(run(fixture(),'unrelated/repo').blocked.length);
 let f=fixture();f.lock.packages['node_modules/image-size'].version='2.0.3';assert.ok(run(f).blocked.length);
 f=fixture();f.lock.packages['node_modules/new-tool']={dependencies:{'image-size':'2.0.2'}};assert.ok(run(f).blocked.length);
 f=fixture();f.audit.vulnerabilities['image-size'].via.push({severity:'critical',url:'https://github.com/advisories/GHSA-new'});assert.ok(run(f).blocked.length);
});
test('malformed audit and unexplained severities cannot be accepted',()=>{
 assert.throws(()=>run({audit:{},lock:{}}));
 const f=fixture();f.audit.vulnerabilities.tool.via=['missing'];assert.throws(()=>run(f),/Invalid audit/);
 const g=fixture();g.audit.vulnerabilities['image-size'].via[0].severity='moderate';assert.ok(run(g).blocked.length);
});
