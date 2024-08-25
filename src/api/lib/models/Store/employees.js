import { literal, INTEGER, STRING, SMALLINT, UUIDV4, UUID } from 'sequelize'

import connect from '../../db'
import Users from '../Users'
import { enCode } from '../../utils/util'

import Store from './Store'

const conn = connect()

export const EMPLOYEE_MODEL_NAME = 'employees'

export default conn.define(EMPLOYEE_MODEL_NAME, {
  eId: {
    type: UUID,
    primaryKey: false,
    autoIncrement: false,
    defaultValue: UUIDV4
  },
  idStore: {
    type: INTEGER,
    allowNull: false,
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE',
    references: {
      model: Store,
      key: 'idStore'
    },
    get (x) { return enCode(this.getDataValue(x)) }
  },
  idUser: {
    type: INTEGER,
    allowNull: true,
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE',
    references: {
      model: Users,
      key: 'id'
    },
    get (x) { return enCode(this.getDataValue(x)) }
  },
  idRole: {
    type: UUID,
    allowNull: false
  },
  priority: {
    type: INTEGER,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false
  },
  eEmail: {
    type: STRING,
    allowNull: false
  },
  eState: {
    type: SMALLINT,
    allowNull: false,
    defaultValue: 1
  },
  status: {
    type: STRING,
    allowNull: false,
    defaultValue: 'INACTIVE'
  },
  createdAt: {
    type: 'TIMESTAMP',
    defaultValue: literal('CURRENT_TIMESTAMP'),
    allowNull: false
  },
  updatedAt: {
    type: 'TIMESTAMP',
    defaultValue: literal('CURRENT_TIMESTAMP'),
    allowNull: false
  }
}, {
  timestamps: false
})
