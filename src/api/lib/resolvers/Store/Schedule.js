/* eslint-disable @typescript-eslint/no-unused-vars */
import { ApolloError } from 'apollo-server-express'
import { deCode } from '../../utils/util'
import { Op } from 'sequelize'
import ScheduleStore from '../../models/Store/scheduleStore'

export const updateStoreSchedule = async (_root, { input }) => {
  try {
    const { schId, ...restArgs } = input || {}
    await ScheduleStore.update(restArgs, { where: { schId: deCode(schId) } })
    return input
  } catch (e) {
    const error = new Error('Lo sentimos, ha ocurrido un error interno')
    return error
  }
}

export const setStoreScheduleReserve = async (_root, { input }) => {
  try {
    const { schData } = input || {}
    let response = []

    for (const element of schData) {
      const data = element
      if (data.schId) {
        await updateStoreSchedule(null, { input: data })
        response = [...response, data]
      }
      else {
        const dataNew = await ScheduleStore.create({ schState: 1, idStore: data.idStore, ...data })
        response = [...response, dataNew]
      }
    }
    return response
  } catch (e) {
    const error = new Error('Lo sentimos, ha ocurrido un error interno1')
    return error
  }
}
export const setStoreSchedule = async (_root, { input }, context, _info) => {
  const { 
    schHoSta, 
    schHoEnd, 
    schDay
  } = input || {}
  try {
    const [exist, _created] = await ScheduleStore.findOrCreate({
      where: {
        schDay,
        // ID Store
        idStore: deCode(context.restaurant)
      },
      defaults: {
        ...input,
        idStore: deCode(context.restaurant),
        id: deCode(context.User.id)
      }
    })
    if (exist) {
      await ScheduleStore.update({ schHoEnd: schHoEnd, schHoSta: schHoSta },
        {
          where:
                    {
                      schDay: schDay,
                      // ID Store
                      idStore: deCode(context.restaurant)
                    }
        })
      return {
        success: true,
        message: 'actualizado'
      }
    } 
    return {
      success: true,
      message: 'Creado con éxito'
    }
        
  } catch (e) {
    return { success: false, message: e }

  }
}
export const getStoreSchedules = async (root, { schDay, idStore }, context, info) => {
  try {
    const data = await ScheduleStore.findAll({
      attributes: [
        'idStore',
        'schId',
        'schDay',
        'schHoSta',
        'schHoEnd',
        'schState'
      ],
      where: {
        [Op.or]: [
          {
            schState: 1,
            idStore: deCode(idStore ? idStore : context.restaurant)
          }
        ]
      }, order: [['schDay', 'ASC']]
    })
    return data
  } catch (e) {
    const error = new ApolloError(e || 'Lo sentimos, ha ocurrido un error interno')
    return error
  }
}
const getOneStoreSchedules = async (root, { schDay, idStore }, context, info) => {
  try {
    const data = await ScheduleStore.findOne({
      attributes: [
        // 'idStore',
        'schId',
        // 'id',
        'schDay',
        'schHoSta',
        'schHoEnd',
        'schState'
        // 'store'
      ],
      where: {
        [Op.or]: [
          {
            // schState: 1,
            schDay: schDay,
            // ID Store
            idStore: idStore ? deCode(idStore) : deCode(context.restaurant)
          }
        ]
      }
    })
    return data
  } catch (e) {
    const error = new ApolloError(e || 'Lo sentimos, ha ocurrido un error interno')
    return error
  }
}
export default {
  TYPES: {
  },
  QUERIES: {
    getStoreSchedules,
    getOneStoreSchedules
  },
  MUTATIONS: {
    setStoreSchedule
  }
}
