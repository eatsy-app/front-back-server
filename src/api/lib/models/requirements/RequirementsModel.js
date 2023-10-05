import { INTEGER, SMALLINT, STRING, literal } from 'sequelize'

import connect from '../../db'
import AreasModel from '../areas/AreasModel'
import { enCode } from '../../utils/util'
const sequelize = connect()

const RequirementsModel = sequelize.define('requirements', {
  rId: {
    type: INTEGER,
    primaryKey: true,
    autoIncrement: true,
    get (x) { return enCode(this.getDataValue(x)) }
  },
  aId: {
    type: INTEGER,
    allowNull: false,
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE',
    references: {
      model: AreasModel,
      key: 'aId'
    },
    get (x) { return enCode(this.getDataValue(x)) }
  },
  rPriority: {
    type: SMALLINT,
    allowNull: false
  },
  rName: {
    type: STRING(60),
    allowNull: false
  },
  rAcronym: {
    type: STRING(15),
    allowNull: false
  },
  rQuality: {
    type: INTEGER,
    allowNull: false
  },
  rState: {
    type: SMALLINT,
    allowNull: false
  },
  rDatCre: {
    type: 'TIMESTAMP',
    defaultValue: literal('CURRENT_TIMESTAMP'),
    allowNull: false
  },
  rDatMod: {
    type: 'TIMESTAMP',
    defaultValue: literal('CURRENT_TIMESTAMP'),
    allowNull: false
  }
}, {
  timestamps: false
})

export default RequirementsModel
