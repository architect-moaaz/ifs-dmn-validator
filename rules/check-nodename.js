const {
    isAny
  } = require('dmnlint-utils');
  

  module.exports = function() {
  
    function check(node, reporter) {
      

    
      if (isAny(node, [
        'dmn:BusinessKnowledgeModel',
        'dmn:Decision',
        'dmn:InputData',
        'dmn:KnowledgeSource'
      ])) {
  
  
        if (!node.name || typeof node.name !== 'string' || /^[^a-zA-Z]/.test(node.name)) {
            reporter.report(`Invalid  ${node.name} name must start with a letter`);
          }
       
      }
    }
  
    return check 
  }

 