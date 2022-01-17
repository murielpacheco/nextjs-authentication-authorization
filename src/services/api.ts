import axios, { AxiosError } from 'axios'
import { parseCookies, setCookie, destroyCookie } from 'nookies'
import { signOut } from '../contexts/AuthContext'


let cookies = parseCookies()
let isRefreshing = false
let failedRequestsQueue = []

export const api = axios.create({
  baseURL: 'http://localhost:3333',
  headers: {
    Authorization: `Bearer ${cookies['nextauth.token']}`
  }
})

api.interceptors.response.use(response => {
  return response;
}, (error: AxiosError) => {
  if (error.response.status === 401) {
    if (error.response.data?.code === 'token.expired') {
      // renovar o token 
      cookies = parseCookies()

      const { 'nextauth.refresToken': refreshToken } = cookies
      const originalConfig = error.config // confida requisição pro backend

      if (!isRefreshing) {
        isRefreshing = true

        api.post('/refresh', {
          refreshToken,
        }).then(response => {
          const { token } = response.data

          setCookie(undefined, 'nextauth.token', token, {
            maxAge: 60 * 60 * 24 * 30, // 30 dias
            path: '/'
          })

          setCookie(undefined, 'nextauth.refreshToken', response.data.refresToken, {
            maxAge: 60 * 60 * 24 * 30, // 30 dias
            path: '/'
          })

          api.defaults.headers['Authorization'] = `Bearer ${token}`

          failedRequestsQueue.forEach(request => request.onSucess(token))
          failedRequestsQueue = []

        }).catch(error => {
          failedRequestsQueue.forEach(request => request.onFailure(error))
          failedRequestsQueue = []

        }).finally(() => {
          isRefreshing = false
        })
      }

      return new Promise((resolve, reject) => {
        failedRequestsQueue.push({
          onSucess: (token: string) => {
            originalConfig.headers['Authorization'] = `Bearer ${token}`

            resolve(api(originalConfig)) // axios vai aguardar essa linha rodar, pois está no resolve
          },
          onFailure: (error: AxiosError) => {
            reject(error)
          }
        })
      })
    }
    else {
      // deslogar o usuario
      signOut()
    }
  }

  return Promise.reject(error)
})