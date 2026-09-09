const fs = require('node:fs');
const fleet = require('../fleet.json');
const marker = '<!-- starter-series:fleet-health -->';

function classify(jobs) {
  if (!jobs.length) return 'missing';
  if (jobs.some(j => j.status !== 'completed')) return 'pending';
  if (jobs.some(j => j.conclusion !== 'success')) return 'failure';
  return 'success';
}

async function report({github, context, core}) {
  const {owner, repo} = context.repo;
  const jobs = await github.paginate(github.rest.actions.listJobsForWorkflowRun,
    {owner, repo, run_id: context.runId, per_page: 100});
  const rows = [];
  for (const item of fleet.repositories) {
    const matched = jobs.filter(j => j.name.startsWith(item.repo + ' /'))
      .filter(j => !(j.conclusion === 'skipped' && (
        (item.runtime === 'container' && j.name.includes('dependencies')) ||
        (item.runtime === 'node' && / \/ python(?: \(|$)/.test(j.name)) ||
        (item.runtime === 'python' && / \/ node(?: \(|$)/.test(j.name))))); 
    let state = classify(matched);
    const expected = item.runtime === 'python' ? 4 : item.runtime === 'node' ? 2 : 1;
    if (matched.length !== expected) state = 'missing';
    const failures = matched.filter(j => j.conclusion !== 'success').map(j => {
      const step = (j.steps || []).find(s => s.conclusion === 'failure');
      return `[${step?.name || j.name.split(' / ').slice(1).join(' / ')}](${j.html_url})`;
    });
    let head = 'unavailable';
    let latest = 'unavailable';
    try {
      const {data: commit} = await github.rest.repos.getCommit({owner: fleet.owner, repo: item.repo, ref: 'main'});
      head = commit.sha.slice(0, 7);
      const {data} = await github.rest.actions.listWorkflowRuns({owner: fleet.owner, repo: item.repo,
        workflow_id: 'ci.yml', branch: 'main', per_page: 100});
      const run = data.workflow_runs.find(r => ['push', 'workflow_dispatch'].includes(r.event));
      if (!run || run.head_sha !== commit.sha || run.status !== 'completed' || run.conclusion !== 'success') state = 'failure';
      latest = run ? `[${run.conclusion || run.status}](${run.html_url})${run.head_sha !== commit.sha ? ' (stale head)' : ''}` : 'missing';
    } catch (error) {
      state = 'failure';
      latest = `unavailable (HTTP ${error.status || 'unknown'})`;
    }
    rows.push({repo: item.repo, state, head, latest, details: failures.join('<br>') || 'All fresh maintenance jobs passed'});
  }
  const failed = rows.some(r => r.state !== 'success');
  const table = '| Starter | Fresh maintenance | Current main | Latest main CI | Details |\n|---|---|---|---|---|\n' +
    rows.map(r => `| ${r.repo} | ${r.state} | ${r.head} | ${r.latest} | ${r.details} |`).join('\n');
  const url = `https://github.com/${owner}/${repo}/actions/runs/${context.runId}`;
  const body = `${marker}\n# Starter Series fleet health\n\n[Maintenance run](${url})\n\n${table}\n\n` +
    'Audits include development dependencies. Failures are not waived. Product-specific health is the latest push or manually dispatched CI on the current main commit; stale or missing runs fail health. ' +
    'CodeQL runs on starter push/PR events; this central run does not upload analysis into another repository.\n';
  await core.summary.addRaw(body).write();
  const existing = (await github.paginate(github.rest.issues.listForRepo,
    {owner, repo, state: 'all', creator: 'github-actions[bot]', per_page: 100}))
    .find(i => !i.pull_request && i.body?.startsWith(marker));
  // Signature excludes run URLs: unchanged failures do not churn the issue.
  const signature = JSON.stringify(rows.map(r => ({repo:r.repo,state:r.state,head:r.head,
    steps:r.details.replace(/https:\/\/[^)]+/g,'run')})));
  const signatureMarker = `<!-- state:${Buffer.from(signature).toString('base64')} -->`;
  if (failed && !existing) {
    await github.rest.issues.create({owner,repo,title:'Fleet maintenance health',body:body+signatureMarker});
  } else if (existing && (!existing.body.includes(signatureMarker) || existing.state !== (failed ? 'open' : 'closed'))) {
    await github.rest.issues.update({owner,repo,issue_number:existing.number,
      state:failed?'open':'closed',body:body+signatureMarker});
  }
  if (failed) core.setFailed('Fleet maintenance has failed, pending, or missing checks. See the central summary.');
  return rows;
}
module.exports = report;
module.exports.classify = classify;
