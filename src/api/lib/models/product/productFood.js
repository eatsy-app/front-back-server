import { INTEGER, STRING, TEXT, literal, SMALLINT, DECIMAL } from 'sequelize'

import connect from '../../db'
import SizeModel from '../information/size'
import colorModel from '../information/color'
import CountriesModel from '../information/CountriesModel'
import DepartmentsModel from '../information/DepartmentsModel'
import CitiesModel from '../information/CitiesModel'
import Feature from '../feature/feature'
import CategoryProductsModel from '../Categories/CategoryProducts'
import { enCode } from '../../utils/util'
import Users from '../Users'
import Store from '../Store/Store'
import catProducts from '../Store/cat'

const sequelize = connect()

export const PRODUCT_FOOD_MODEL = 'productmodelfoods'

const productModelFood = sequelize.define(PRODUCT_FOOD_MODEL, {
  pId: {
    type: INTEGER,
    primaryKey: true,
    autoIncrement: true,
    get (x) { return enCode(this.getDataValue(x)) }
  },
  // id store
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
  // User
  id: {
    type: INTEGER,
    allowNull: false,
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE',
    references: {
      model: Users,
      key: 'id'
    },
    get (x) { return enCode(this.getDataValue(x)) }
  },
  // CATEGORY PRODUCT
  carProId: {
    type: INTEGER,
    allowNull: true,
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE',
    references: {
      model: catProducts,
      key: 'carProId'
    },
    get (x) { return enCode(this.getDataValue(x)) }
  },
  // Talla
  sizeId: {
    type: INTEGER,
    allowNull: true,
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE',
    references: {
      model: SizeModel,
      key: 'sizeId'
    },
    get (x) { return enCode(this.getDataValue(x)) }
  },
  vat: {
    type: DECIMAL(1000, 2),
    allowNull: true
  },
  // color
  colorId: {
    type: INTEGER,
    allowNull: true,
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE',
    references: {
      model: colorModel,
      key: 'colorId'
    },
    get (x) { return this.getDataValue(x) ? enCode(this.getDataValue(x)) : null }
  },
  // Locations
  cId: {
    type: INTEGER,
    allowNull: true,
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE',
    references: {
      model: CountriesModel,
      key: 'cId'
    },
    get (x) { return enCode(this.getDataValue(x)) }
  },
  dId: {
    type: INTEGER,
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE',
    allowNull: true,
    references: {
      model: DepartmentsModel,
      key: 'dId'
    },
    get (x) { return enCode(this.getDataValue(x)) }
  },
  ctId: {
    type: INTEGER,
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE',
    allowNull: true,
    references: {
      model: CitiesModel,
      key: 'ctId'
    },
    get (x) { return enCode(this.getDataValue(x)) }
  },
  fId: {
    type: INTEGER,
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE',
    references: {
      model: Feature,
      key: 'fId'
    },
    get (x) { return enCode(this.getDataValue(x)) }
  },
  caId: {
    type: INTEGER,
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE',
    references: {
      model: CategoryProductsModel,
      key: 'caId'
    },
    get (x) { return enCode(this.getDataValue(x)) }
  },
  poPriority: {
    type: SMALLINT,
    allowNull: false,
    defaultValue: 1
  },
  valueDelivery: {
    type: DECIMAL(1000, 2),
    allowNull: true,
    defaultValue: 0
  },
  pName: {
    type: STRING,
    allowNull: false
  },
  pCode: {
    type: STRING(100),
    allowNull: false
  },
  ProPrice: {
    type: DECIMAL(1000, 2),
    allowNull: true
  },
  ProDescuento: {
    type: DECIMAL(1000, 2),
    allowNull: true
  },
  ProUniDisponibles: {
    type: INTEGER,
    allowNull: true
  },
  ProDescription: {
    type: TEXT,
    allowNull: true
  },
  pState: {
    type: INTEGER,
    allowNull: false
  },
  sTateLogistic: {
    type: INTEGER,
    allowNull: false
  },
  // Si el producto esta asegurado ( Protegido )
  ProProtegido: {
    type: INTEGER,
    allowNull: true
  },
  // GARANTÍA )
  ProAssurance: {
    type: STRING,
    allowNull: true
  },
  // Numero de estrellas
  ProStar: {
    type: INTEGER,
    allowNull: true
  },
  ProImage: {
    type: STRING,
    trim: true,
    allowNull: true
  },
  // ---------------------
  // Ancho
  ProWidth: {
    type: INTEGER
  },
  // Alto
  ProHeight: {
    type: INTEGER,
    defaultValue: 1
  },
  free: {
    type: INTEGER,
    defaultValue: 0
  },
  // Largo
  ProLength: {
    type: STRING,
    defaultValue: 1
  },
  // Peso
  ProWeight: {
    type: STRING,
    defaultValue: 1
  },
  // -----------------------------Listo-----------------------------
  // Cantidad
  ProQuantity: {
    type: INTEGER,
    allowNull: true
  },
  // Destacado
  ProOutstanding: {
    type: INTEGER
  },
  // Entrega
  ProDelivery: {
    type: INTEGER
  },
  // Entrega
  ProVoltaje: {
    type: STRING,
    allowNull: true
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
}, {
  timestamps: false
})

export default productModelFood
