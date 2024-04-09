const {
    isAny
  } = require('dmnlint-utils');
  

  module.exports = function() {
  
    function check(node, reporter) {
      

    
      if (isAny(node, [
        'dmn:Decision'
      ])) {
  
  
       if(!node.informationRequirement || !node.knowledgeRequirement){
        reporter.report(`input required for ${node.name}`)

       }
       
      }
    }
  
    return check 
  }

 