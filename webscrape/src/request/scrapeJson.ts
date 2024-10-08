/* istanbul ignore file */

import axios from 'axios'
import { wait } from './wait'

export const getRequestJson = async (
  url: string,
  cookie?: string,
): Promise<string> => {
  try {
    const proxyClient = axios.create({
      headers: {
        Cookie: cookie !== undefined ? cookie : '',
      },
    })
    const response = await proxyClient.get(url)
    await wait(2000)
    return JSON.stringify(response.data)
  } catch {
    return ''
  }
}

export const postRequestJson = async (
  url: string,
  postRequestPayload: object,
  cookie?: string,
): Promise<string> => {
  try {
    const proxyClient = axios.create({
      headers: {
        Cookie: cookie !== undefined ? cookie : '',
      },
    })
    const response = await proxyClient.post(url, postRequestPayload)
    await wait(1000)
    return JSON.stringify(response.data)
  } catch {
    return ''
  }
}
