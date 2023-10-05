/* eslint-disable no-undef */
import { ApolloError, ForbiddenError } from 'apollo-server-express'
import { Op } from 'sequelize'

import productModel from '../../models/product/food'
import tagsProduct from '../../models/Store/tagsProduct'
import { deCode, getAttributes } from '../../utils/util'

export const registerTag = async (parent, { input }, ctx) => {
  const {
    idStore,
    nameTag,
    pId,
    idUser
  } = input
  try {
    if (!ctx.User.id) throw new ForbiddenError('token expired')
    const tag = await tagsProduct.create({
      ...input,
      idStore: idStore ? deCode(idStore) : deCode(ctx.restaurant),
      idUser: idUser ? deCode(idUser) : deCode(ctx.User.id),
      pId: deCode(pId),
      nameTag
    })
    return tag
  } catch (error) {
    throw new Error(error)
  }
}

export const getOneTags = async (parent, { idStore }, _context, info) => {
  try {
    const attributes = getAttributes(tagsProduct, info)
    const data = await tagsProduct.findOne({ attributes, where: { idStore: deCode(parent.idStore ?? idStore) } })
    return data
  } catch (e) {
    throw ApolloError('Lo sentimos, ha ocurrido un error interno')
  }
}

export const getFoodAllProduct = async (root, args, context, info) => {
  const { search, min, max, gender, desc, categories } = args
  let whereSearch = {}
  if (search) {
    whereSearch = {
      [Op.or]: [
        { pName: { [Op.substring]: search.replace(/\s+/g, ' ') } },
        { ProPrice: { [Op.substring]: search.replace(/\s+/g, ' ') } },
        { ProDescuento: { [Op.substring]: search.replace(/\s+/g, ' ') } },
        { ProDelivery: { [Op.substring]: search.replace(/\s+/g, ' ') } }
      ]
    }
  }
  if (gender?.length) {
    whereSearch = {
      ...whereSearch,
      ProDelivery: {
        [Op.in]: gender.map(x => x)
      }
    }
  }
  if (desc?.length) {
    whereSearch = {
      ...whereSearch,
      ProDescuento: { [Op.in]: desc.map(x => x) }
    }
  }
  // validad que  venga una categoría para hacer el filtro por categorías
  if (categories?.length) {
    whereSearch = {
      ...whereSearch,
      caId: { [Op.in]: categories.map(x => deCode(x)) }
    }
  }

  const attributes = getAttributes(productModel, info)
  const data = await productModel.findAll({
    attributes,
    where: {
      [Op.or]: [
        {
          ...whereSearch,
          // ID Productos
          // pfId: pfId ? deCode(pfId) : { [Op.gt]: 0 },
          pState: 1
          // // ID departamento
          // dId: dId ? deCode(dId) : { [Op.gt]: 0 },
          // // ID Cuidad
          // ctId: ctId ? deCode(ctId) : { [Op.gt]: 0 },
        }
      ]
    },
    limit: max || 100,
    offset: min || 0,
    order: [['pDatCre', 'DESC']]
  })
  return data
}
// eslint-disable-next-line

export default {
  TYPES: {

  },
  QUERIES: {
  },
  MUTATIONS: {
    registerTag
  }
}
