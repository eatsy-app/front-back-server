/* eslint-disable no-unused-vars */
import shopping from '../../models/Store/shopping'
import { deCode, getAttributes } from '../../utils/util'
import { Op } from 'sequelize'

export const newShopping = async (_, { input }, ctx) => {
  try {
    await shopping.create({ ...input, shoState: 1, id: deCode(ctx.User.id), idStore: deCode(ctx.restaurant) })
    return {
      success: true,
      message: 'creada'
    }
  } catch (error) {
    return { success: false, message: error }
  }
}
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const getAllShopping = async (_, { idStore }, ctx, info) => {
  try {
    const attributes = getAttributes(shopping, info)
    const data = await shopping.findAll({
      attributes,
      where: {
        idStore: deCode(ctx.restaurant),
        id: deCode(ctx.User.id),
        shoState: { [Op.gt]: 0 }
      }
    })
    return data
  } catch (e) {
    const error = new Error('Lo sentimos, ha ocurrido un error interno')
    return error
  }
}

export default {
  TYPES: {
  },
  QUERIES: {
    getAllShopping
  },
  MUTATIONS: {
    newShopping
  }
}
