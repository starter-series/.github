const parse = require('spdx-expression-parse');
const denied = /^(?:AGPL|GPL)-(?:2\.0|3\.0)(?:-only|-or-later)?$/;
function permitted(node) {
  if (node.conjunction === 'or') return permitted(node.left) || permitted(node.right);
  if (node.conjunction === 'and') return permitted(node.left) && permitted(node.right);
  // WITH does not automatically waive a prohibited base license.
  return !denied.test(node.license);
}
function allowed(expression) {
  // Legacy npm metadata uses BSD without a clause identifier. Preserve the
  // existing allowed BSD family; do not guess or rewrite its exact license.
  if (expression === 'BSD') return true;
  try { return permitted(parse(expression)); } catch { return false; }
}
module.exports = {allowed};
