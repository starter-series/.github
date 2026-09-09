const severities = new Set(['info', 'low', 'moderate', 'high', 'critical']);
const high = s => s === 'high' || s === 'critical';
const same = (a,b) => JSON.stringify([...a].sort()) === JSON.stringify([...b].sort());
function evaluate(audit, lock, repository, policy, today = new Date().toISOString().slice(0,10)) {
  if (audit.auditReportVersion !== 2 || audit.error || !audit.vulnerabilities || !audit.metadata?.vulnerabilities || !lock.packages) throw Error('Invalid or incomplete npm audit/lockfile');
  if (policy.schemaVersion !== 1 || !Array.isArray(policy.exceptions)) throw Error('Invalid exception policy');
  for (const e of policy.exceptions) {
    for (const key of ['id','package','reason','risk','added','review','expires']) if (!e[key]) throw Error(`Missing exception ${key}`);
    for (const key of ['added','review','expires']) if (!/^\d{4}-\d{2}-\d{2}$/.test(e[key]) || !Number.isFinite(Date.parse(e[key]))) throw Error('Invalid exception date');
    if (!(e.added <= today && e.added <= e.review && e.review < e.expires) || (today >= e.expires && e.scope?.some(s => s.repository === repository))) throw Error(`Exception expired or invalid: ${e.id}`);
    if (!e.upstream?.status || !e.upstream?.urls?.length || !e.advisories?.length || !e.scope?.length) throw Error('Incomplete exception evidence');
  }
  const blocked = new Set(), accepted = new Set();
  const vulns = audit.vulnerabilities;
  function exempt(v, advisory) {
    return policy.exceptions.find(e => e.package === v.name && e.advisories.some(id => advisory.url === `https://github.com/advisories/${id}`) && e.scope.some(s => {
      if (s.repository !== repository || !s.dependencyPaths?.length || !same(s.nodes, v.nodes)) return false;
      if (!s.nodes.every(n => n.endsWith('/'+e.package) && lock.packages[n]?.version === s.version)) return false;
      const parents = Object.entries(lock.packages).filter(([,m]) => ['dependencies','devDependencies','optionalDependencies','peerDependencies'].some(k => Object.hasOwn(m[k] || {}, e.package))).map(([p]) => p);
      return same(parents,s.parents);
    }));
  }
  function roots(name, seen = new Set()) {
    if (seen.has(name)) return [];
    seen.add(name);
    const v = vulns[name];
    if (!v || !severities.has(v.severity) || !Array.isArray(v.via) || !v.via.length || !v.nodes?.length) throw Error(`Invalid audit dependency: ${name}`);
    return v.via.flatMap(a => {
      if (typeof a === 'string') return roots(a, seen);
      if (!a || !severities.has(a.severity) || typeof a.url !== 'string') throw Error('Invalid advisory');
      return [{v,a}];
    });
  }
  for (const [name,v] of Object.entries(vulns)) {
    const findings = roots(name);
    if (high(v.severity) && !findings.some(({a})=>high(a.severity))) blocked.add(`Unexplained high severity: ${name}`);
    for (const {v:origin,a} of findings.filter(({a})=>high(a.severity))) {
      const e = exempt(origin,a);
      if (e) accepted.add(`${e.id}: ${a.url}; expires ${e.expires}${today >= e.review ? '; REVIEW DUE' : ''}`);
      else blocked.add(`${origin.name}: ${a.url}`);
    }
  }
  if (Object.keys(vulns).length !== audit.metadata.vulnerabilities.total) throw Error('Inconsistent audit totals');
  return {blocked:[...blocked],accepted:[...accepted]};
}
module.exports = {evaluate};
