'use strict';
var models = require('../models');
const log4js = require('../utils/log4js');
const belogger = log4js.getLogger('be');

exports.GenerateNewId = function (entityName) {
  belogger.info("GenerateNewId");

  var promise = models.EntitySequence.findOne({ where: { entityName: entityName } })
    .then(result => {
      return result.increment("sequenceNumber", { by: 1 })
    }).then(result => {
      return result.sequenceNumber + 1;
    });

  return promise;
}