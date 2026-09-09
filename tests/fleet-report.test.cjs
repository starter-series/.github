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
