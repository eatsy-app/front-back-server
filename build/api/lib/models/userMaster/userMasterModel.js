"use strict";

const Sequelize = require('sequelize');

const {
  enCode
} = require('../../utils/util');

const connect = require('../../db');

const sequelize = connect(); // const { enCode } = require('../../utils')
// 

const UserMasters = sequelize.define('usermastermodel', {
  IdM: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true,

    get(x) {
      return enCode(this.getDataValue(x));
    }

  },
  umSeCredential: {
    type: Sequelize.STRING(200),
    allowNull: false,
    unique: true
  },
  umDatCre: {
    type: 'TIMESTAMP',
    defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
    allowNull: false
  },
  umDatMod: {
    type: 'TIMESTAMP',
    defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
    allowNull: false
  }
}, {
  timestamps: false
});
module.exports = UserMasters;