/* eslint-disable no-unused-vars */
import PaymentCard from '../../models/Store/paymentcard'
import PaymentCardType from '../../models/userMaster/paymentcardTypes'
import { deCode } from '../../utils'
import { getAttributes } from '../../utils/util'

/**
 * 
 * @param {*} _root no usado 
 * @param {*} param1 _
 * @param {*} _context context info global
 * @param {*} _info _
 * @returns 
 */
//  eslint-disable-next-line
export const registerPaymentCardType = async (_root, { input }, _context, _info) => {
  const { typeCardName } = input || {}
  try {
    const data = await PaymentCardType.create({
      typeCardName
    })
    return data
  } catch (e) {
    const error = new Error('Lo sentimos, ha ocurrido un error interno', e, 400)
    return error
  }

}
export const getAllPaymentCardType = async (_root, _args, _context, info) => {
  try {
    const attributes = getAttributes(PaymentCardType, info)
    const data = await PaymentCardType.findAll({ attributes })
    return data
  } catch (e) {
    const error = new Error('Lo sentimos, ha ocurrido un error interno', e, 400)
    return error
  }

}


// USER STORE
export const registerPaymentCard = async (_root, { input }, context) => {
  const { id, idStore } = input || {}
  try {
    return await PaymentCard.create({
      id: deCode(context.User.id || id),
      idStore: idStore ? deCode(idStore) : deCode(context.restaurant),
      ...input
    })
  } catch (e) {
    const error = new Error('No pudimos guardar la tarjeta', e, 400)
    return error
  }

}
// eslint-disable-next-line
export const deletePaymentCardType = async (_root, { cardtypeId }, _context) => {
  try {
    const isExist = await PaymentCardType.findOne({
      attributes: ['cardtypeId'],
      where: { cardtypeId: deCode(cardtypeId) }
    })
    if (isExist === null) {
      return {
        success: false,
        message: 'La tarjeta no existe'
      }
    } 
    PaymentCardType.destroy({ where: { cardtypeId: deCode(cardtypeId) } })
    return {
      success: true,
      message: 'Tarjeta eliminada con éxito'
    }
    
  } catch (e) {
    return {
      success: false,
      message:  `No pudimos eliminar la tarjeta', ${e}, ${400}`
    }
  }

}

export default {
  TYPES: {
  },
  QUERIES: {
    getAllPaymentCardType
  },
  MUTATIONS: {
    deletePaymentCardType,
    registerPaymentCard,
    registerPaymentCardType
  }
}
