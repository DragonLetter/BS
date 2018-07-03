'use strict';
var models  = require('../models');

exports.GenerateNewId = function (entityName) {
   
    var promise= models.EntitySequence.findOne( { where: {entityName: entityName} })
    .then(result =>{
     return result.increment("sequenceNumber",{by:1})
    
    }).then(result=>{
      return result.sequenceNumber+1;
    });
  

  return promise;
}