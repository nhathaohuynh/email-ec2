import env from '~/config/env.config'
import { IRoute } from '~/types'
import { HOST } from './constant.util'

export const colorizeMethod = async (method: string) => {
  const chalk = (await import('chalk')).default
  switch (method) {
    case 'GET':
      return chalk.green(method)
    case 'POST':
      return chalk.blue(method)
    case 'PUT':
      return chalk.yellow(method)
    case 'DELETE':
      return chalk.red(method)
    default:
      return chalk.green(method)
  }
}

export const routeApp = async (routeConfig: Record<string, IRoute>, basePath: string = '') => {
  for (const key in routeConfig) {
    const route = routeConfig[key]
    const url = `${HOST}:${env.APP_PORT}${basePath}${route.path}`

    if (route.method) {
      if (route.method === 'GET') {
        console.log(`${await colorizeMethod(route.method)}     ${await colorizeMethod(url)} `)
      } else if (route.method === 'POST') {
        console.log(`${await colorizeMethod(route.method)}    ${await colorizeMethod(url)} `)
      } else if (route.method === 'PUT') {
        console.log(`${await colorizeMethod(route.method)}     ${await colorizeMethod(url)} `)
      } else {
        console.log(`${await colorizeMethod(route.method)}  ${await colorizeMethod(url)} `)
      }
    }

    if (route.child) {
      routeApp(route.child, basePath + route.path)
    }
  }
}
