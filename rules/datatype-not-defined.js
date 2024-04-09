const {
    isAny
  } = require('dmnlint-utils');
  
  
  /**
   * checks data type not defined for node and decision
   */
  module.exports = function() {
  
    function check(node, reporter) {
      
      if (isAny(node, [
        'dmn:InformationItem',

      ])) {
 
        if (!node.hasOwnProperty('typeRef') || !node.typeRef) {
          reporter.report(node.id, `datatype is missing for ${node.name}`);
        }
      }
    }
  
    return check 
  }