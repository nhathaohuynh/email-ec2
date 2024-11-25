import { plainToClass } from 'class-transformer'
import { validate } from 'class-validator'
import { NextFunction, Request, Response } from 'express'
import dtoRegistry from '~/dtos/dto-registration'
import { BadRequest } from '~/utils/error-response.util'

interface IParamsValidation {
  queryParams?: string[]
  routeParams?: string[]
}

export const validationPipe =
  ({ queryParams, routeParams }: IParamsValidation = {}) =>
  async (req: Request, res: Response, next: NextFunction) => {
    const isvalidateQueryParams = queryParams && queryParams.length > 0
    const isvalidateRouteParams = routeParams && routeParams.length > 0
    const path = req.originalUrl
    const method = req.method
    const strategyName = `${path}:${method}`
    const classValidation = dtoRegistry.get(strategyName)

    if (isvalidateQueryParams) {
      queryParams.forEach((param) => {
        if (!req.query[param]) {
          return next(new BadRequest(`Query param ${param} is required`))
        }
      })
    }

    if (isvalidateRouteParams) {
      routeParams.forEach((param) => {
        if (!req.params[param]) {
          return next(new BadRequest(`Route param ${param} is required`))
        }
      })
    }

    if (classValidation) {
      const dto = plainToClass(classValidation, req.body)
      const errors = await validate(dto)
      if (errors.length > 0) {
        const errorMessages = errors.map((error) => ({
          [error.property]: Object.values(error.constraints as object)
        }))

        return next(new BadRequest(errorMessages))
      }
    }

    next()
  }
