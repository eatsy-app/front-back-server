"use strict";

const Sequelize = require('sequelize');

const {
  enCode
} = require('../../utils/util');

const connect = require('../../db');

const sequelize = connect(); // 

const CategoryProductsModel = sequelize.define('categorieproduct', {
  caId: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true,

    get(x) {
      return enCode(this.getDataValue(x));
    }

  },
  cpName: {
    type: Sequelize.STRING(200),
    allowNull: false
  },
  cpImage: {
    type: Sequelize.STRING,
    trim: true,
    allowNull: true
  },
  cpState: {
    type: Sequelize.SMALLINT,
    allowNull: false
  },
  DatCre: {
    type: 'TIMESTAMP',
    defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
    allowNull: false
  },
  DatMod: {
    type: 'TIMESTAMP',
    defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
    allowNull: false
  }
}, {
  timestamps: false
});
module.exports = CategoryProductsModel;