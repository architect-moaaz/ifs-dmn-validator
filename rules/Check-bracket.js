
const {
    isAny
  } = require('dmnlint-utils');
  

  module.exports = function() {
  
    function check(node, reporter) {
      
      if (isAny(node, [
        'dmn:Decision'
      ])) {
  
        if (
            node.decisionLogic &&
            node.decisionLogic.input &&
            node.decisionLogic.input.length > 0
          ) {
            const inputIndex = 0; 
    
            if (
                node.decisionLogic.input[inputIndex].inputExpression.typeRef=='number'
            ) {
              const  inputExpressionText = node.decisionLogic.rule[inputIndex].inputEntry[inputIndex].text;
                if (
                    !inputExpressionText.startsWith('[') ||
                    !inputExpressionText.endsWith(']') 
                  ){
                    reporter.report(node.id," Bracket should have square bracket")
                  }
                  if(inputExpressionText.split('.').length - 1 !== 2){
                    reporter.report(node.id,"Dots should not containe more or less than 2 dots")
                  }
            }
          }
       
      }
    }
  
    return check 
  }