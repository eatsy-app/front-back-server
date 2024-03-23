const { STRING, literal } = require('sequelize')
const { INTEGER } = require('sequelize')
const { DATE } = require('sequelize')

const { enCode } = require('../../utils/util')
const { STATUS_ORDER_MODEL } = require('../../models/Store/statusPedidoFinal')
const { STORE_MODEL, defaultSchema } = require('../../models/Store/Store')

exports.up = async (queryInterface, schemaName) => {
  await queryInterface.createTable(STATUS_ORDER_MODEL, {
    stPId: {
      type: INTEGER,
      primaryKey: true,
      autoIncrement: true,
      get (x) { return enCode(this.getDataValue(x)) }
    },
    id: {
      type: INTEGER,
      allowNull: true,
      get (x) { return enCode(this.getDataValue(x)) }
    },
    idStore: {
      type: INTEGER,
      allowNull: true,
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE',
      references: {
        model: {
          tableName: STORE_MODEL,
          schema: defaultSchema
        },
        key: 'idStore'
      },
      get (x) {
        return enCode(this.getDataValue(x))
      }
    },
    pSState: {
      type: INTEGER,
      defaultValue: 0
    },
    valueDelivery: {
      type: INTEGER,
      defaultValue: 0
    },
    locationUser: {
      type: STRING,
      allowNull: true
    },
    discount: {
      type: INTEGER,
      allowNull: true
    },
    tip: {
      type: INTEGER,
      allowNull: true,
      defaultValue: 0
    },
    change: {
      type: INTEGER,
      allowNull: true,
      defaultValue: 0
    },
    pCodeRef: {
      type: STRING(100),
      unique: true,
      allowNull: false
    },
    totalProductsPrice: {
      type: INTEGER,
      allowNull: false
    },
    payMethodPState: {
      type: INTEGER,
      defaultValue: 1
    },
    pickUp: {
      type: INTEGER,
      defaultValue: 0
    },
    channel: {
      type: INTEGER, // store or client-store
      defaultValue: 0
    },
    pPDate: {
      type: DATE
    },
    pDatCre: {
      type: 'TIMESTAMP',
      defaultValue: literal('CURRENT_TIMESTAMP'),
      allowNull: false
    },
    pDatMod: {
      type: 'TIMESTAMP',
      defaultValue: literal('CURRENT_TIMESTAMP'),
      allowNull: false
    }
  }, { schema: schemaName })
}

exports.down = async (queryInterface, schemaName) => {
  await queryInterface.dropTable(STATUS_ORDER_MODEL, { schema: schemaName })
}
