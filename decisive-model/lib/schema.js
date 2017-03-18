"use strict";

var Schema = module.exports = function Schema(schema){
};

Schema.types = {
  string: new Schema("string"),
};

Schema.wireType = function (key) {
  switch (key) {
    case 'string':
      return 'S';
    case 'date':
      return 'DATE';
    case 'number':
      return 'N';
    case 'boolean':
      return 'BOOL';
    case 'binary':
      return 'B';
    case 'array':
      return 'L';
    default:
      return null;
  }
};

// {
//   tableName: "places",
//   hashKey : "placeId",

//   timestamps : true,

//   schema : {
//     placeId : Joi.string(),
//     geometry : {
//       location : {
//         lat : Joi.number(),
//         lng : Joi.number(),
//       }
//     },
//     tags : {
//       vibes : vogels.types.stringSet(),
//       music : vogels.types.stringSet(),
//       crowd : vogels.types.stringSet(),
//     },
//     metrics: {
//       coverCharge  : Joi.number().min(0).max(9),
//       crowdDensity : Joi.number().min(0).max(9),
//       genderRatio  : Joi.number().min(0).max(9),
//       noiseLevel : Joi.number().min(0).max(9),
//       rating : Joi.number().min(0).max(9),
//       waitTime : Joi.number().min(0).max(9),
//     },
//     metricsUpdatedAt: Joi.date(),
//     metricsUpdatedBy: Joi.string(),
//     name            : Joi.string(),
//     types           : vogels.types.stringSet(),
//     vicinity        : Joi.string(),
//   },

//   indexes: [
//     { hashKey: "email", name: "email-index", type: "global" },
//   ],

// })
