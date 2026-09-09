const fs = require('node:fs');
const {spawnSync} = require('node:child_process');
const {evaluate} = require('../policy/audit.cjs');
try {
  const result = spawnSync('npm',['audit','--json','--audit-level=high'],{encoding:'utf8',maxBuffer:32*1024*1024});
  if (result.stderr) process.stderr.write(result.stderr);
  if (result.error || result.signal || ![0,1].includes(result.status)) throw Error('npm audit could not complete');
  // Preserve the complete findings in logs, including explicitly accepted risks.
  process.stdout.write(result.stdout);
  const report = evaluate(JSON.parse(result.stdout), JSON.parse(fs.readFileSync('package-lock.json','utf8')),
    process.env.FLEET_AUDIT_REPOSITORY, require('../policy/security-exceptions.json'));
  const lines = [...report.accepted.map(x=>`Accepted time-limited risk: ${x}`),...report.blocked.map(x=>`BLOCKED: ${x}`)];
  console.log('\n'+lines.join('\n'));
  if (process.env.GITHUB_STEP_SUMMARY) fs.appendFileSync(process.env.GITHUB_STEP_SUMMARY,'\n### Dependency audit\n'+lines.map(x=>'- '+x).join('\n')+'\n');
  if (report.blocked.length) process.exitCode=1;
} catch (error) { console.error(error.message); process.exitCode=1; }
