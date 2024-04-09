const allRules = [
  'no-duplicate-requirements',
  'label-required',
  'variable-name',
  'datatype-not-defined',
  'input-node-required',
  'Check-bracket',
  'check-nodename'
];


module.exports = {
  rules: allRules.reduce(function(rules, ruleName) {
    rules[ruleName] = 'error';

    return rules;
  }, {})
};
