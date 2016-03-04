/**
 * Table.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

module.exports = {
  attributes: {
    studentId: {
      type: 'string'
    },
    name: {
      type: 'string'
    },
    postAccount: {
      type: 'string'
    },
    account: {
      type: 'string'
    },
    originDesk: {
      type: 'integer'
    },
    originJobs: {
      type: 'integer'
    },
    schedule: {
      type: 'integer'
    },
    base: {
      type: 'integer'
    },
    salary: {
      type: 'integer'
    },
    other: {
      type: 'integer'
    },
    prev: {
      type: 'integer'
    },
    total: {
      type: 'integer'
    },
    pay: {
      type: 'integer'
    },
    next: {
      type: 'integer'
    },
  }
};
