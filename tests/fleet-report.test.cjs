const {test} = require('node:test');
const assert = require('node:assert/strict');
const {classify} = require('../scripts/fleet-report.cjs');
test('missing, skipped, cancelled and unfinished jobs never count as healthy', () => {
 assert.equal(classify([]),'missing');
 for (const conclusion of ['failure','cancelled','skipped','timed_out',null]) {
  assert.notEqual(classify([{status:'completed',conclusion}]),'success');
 }
 assert.equal(classify([{status:'in_progress',conclusion:null}]),'pending');
 assert.equal(classify([{status:'completed',conclusion:'success'}]),'success');
 assert.equal(classify([{status:'completed',conclusion:'success'},{status:'completed',conclusion:'failure'}]),'failure');
});
const report = require('../scripts/fleet-report.cjs');
const fleet = require('../fleet.json').repositories;
function harness({existing,latestSuccess=true}={}) {
 const calls=[];
 const jobs=fleet.flatMap(r => [
  {name:`${r.repo} / source / source`,status:'completed',conclusion:'success',html_url:'https://example.com/run'},
  ...(r.runtime==='node' ? [{name:`${r.repo} / dependencies / node`,status:'completed',conclusion:'success',html_url:'https://example.com/run'},
   {name:`${r.repo} / dependencies / python (3.11)`,status:'completed',conclusion:'skipped'}] : []),
  ...(r.runtime==='python' ? ['3.11','3.12','3.13'].map(v=>({name:`${r.repo} / dependencies / python (${v})`,status:'completed',conclusion:'success',html_url:'https://example.com/run'})) : []),
 ]);
 const listJobs=()=>{},listIssues=()=>{};
 const github={rest:{actions:{listJobsForWorkflowRun:listJobs,listWorkflowRuns:async()=>({data:{workflow_runs:[{head_sha:'abcdefg',status:'completed',conclusion:latestSuccess?'success':'failure',html_url:'https://example.com/ci'}]}})},repos:{getCommit:async()=>({data:{sha:'abcdefg'}})},issues:{listForRepo:listIssues,create:async p=>calls.push(['create',p]),update:async p=>calls.push(['update',p])}},paginate:async fn=>fn===listJobs?jobs:(existing?[existing]:[])};
 const core={summary:{addRaw(){return this},async write(){}},setFailed:m=>calls.push(['failed',m])};
 return {github,context:{repo:{owner:'starter-series',repo:'.github'},runId:1},core,calls,jobs};
}
test('healthy fresh audits and matching main CI do not create an issue',async()=>{
 const h=harness();const rows=await report(h);assert.ok(rows.every(r=>r.state==='success'));assert.deepEqual(h.calls,[]);
});
test('failed main CI creates one issue; identical failure does not churn it',async()=>{
 const h=harness({latestSuccess:false});await report(h);
 const created=h.calls.find(c=>c[0]==='create')[1];assert.ok(created.body.includes('starter-series:fleet-health'));
 const again=harness({latestSuccess:false,existing:{...created,number:1,state:'open'}});await report(again);
 assert.equal(again.calls.filter(c=>['create','update'].includes(c[0])).length,0);
});
test('missing one Python matrix cell never reports a healthy fleet',async()=>{
 const h=harness();h.jobs.splice(h.jobs.findIndex(j=>j.name.includes('python (3.13)')),1);
 await report(h);assert.ok(h.calls.some(c=>c[0]==='failed'));
});
