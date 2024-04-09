const {
    isAny
  } = require('dmnlint-utils');
  
  
  /**
   * Sample Rule.
   */
  module.exports = function() {
  
    function check(node, reporter) {
      
      if (isAny(node, [
        'dmn:InformationItem'
      ])) {
  
        const name = (node.name || '').trim();
  
        if (name.length === 0) {
          reporter.report(node.id, 'Variable is missing name');
        }
      }
    }
  
    return check 
  }