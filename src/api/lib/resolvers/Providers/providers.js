import { Op } from 'sequelize'
import Providers from '../../models/Providers/providers'
import { deCode, getAttributes } from '../../utils/util'

export const getAllProviders = async (root, args, context, info) => {
  const { search, min, max, fromDate, toDate } = args
  let whereSearch = {}
  if (search) {
    whereSearch = {
      [Op.or]: [
        { prName: { [Op.substring]: search.replace(/\s+/g, ' ') } }
      ]
    }
  }
  const attributes = getAttributes(Providers, info)
  const data = await Providers.findAll({
    attributes,
    where: {
      [Op.or]: [
        {
          ...whereSearch,
          // ...((pId) ? { pId: deCode(pId) } : {}),
          idStore: deCode(context.restaurant),
          // // Productos state
          ...((fromDate && toDate) ? { DatCre: { [Op.between]: [fromDate, `${toDate} 23:59:59`] } } : {}),
          prState: { [Op.gt]: 0 }
        }
      ]
    }, limit: [min || 0, max || 100], order: [['DatCre', 'DESC']]
  })
  return data
}
// eslint-disable-next-line consistent-return
export const registerProviders = async (root, { input }, context) => {
  try {
    const { PrNumberPhone, PrNumberIdentity } = input || {}
    const [exist, created] = await Providers.findOrCreate({
      where: {
        PrNumberPhone,
        PrNumberIdentity
      },
      defaults: {
        ...input,
        idStore: deCode(context.restaurant)
      }
    })
    if (created) return { success: true, message: 'El proveedor fue creado con éxito' }

    if (exist) {
      return { success: true, message: 'El teléfono o El proveedor ya existe' }
    }
  } catch (e) {
    return { success: false, message: 'Lo sentimos, ha ocurrido un error interno', e }
  }
}
export default {
  TYPES: {
  },
  QUERIES: {
    getAllProviders
  },
  MUTATIONS: {
    registerProviders
  }
}
