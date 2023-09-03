import { INTEGER, TINYINT, literal } from 'sequelize'
import connect from '../../db'
const sequelize = connect()
import { enCode } from '../../utils/util'
import UserModulesModel from '../modules/UserModulesModel'
import SubModulesModel from './SubModulesModel'

/**
 * @deprecated
 */
const UserSubModulesModel = sequelize.define('usersubmodules', {
  usmId: {
    type: INTEGER,
    primaryKey: true,
    autoIncrement: true,
    get(x) {return enCode(this.getDataValue(x))}
  },
  umdId: {
    type: INTEGER,
    allowNull: false,
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE',
    references: {
      model: UserModulesModel,
      key: 'umdId'
    },
    get(x) {return enCode(this.getDataValue(x))}
  },
  smId: {
    type: INTEGER,
    allowNull: false,
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE',
    references: {
      model: SubModulesModel,
      key: 'smId'
    },
    get(x) {return enCode(this.getDataValue(x))}
  },
  usmPriority: {
    type: TINYINT,
    allowNull: false
  },
  usmState: {
    type: TINYINT,
    allowNull: false
  },
  usmDatCre: {
    type: 'TIMESTAMP',
    defaultValue: literal('CURRENT_TIMESTAMP'),
    allowNull: false
  },
  usmDatMod: {
    type: 'TIMESTAMP',
    defaultValue: literal('CURRENT_TIMESTAMP'),
    allowNull: false
  }
},{
  timestamps: false
})

export default UserSubModulesModel