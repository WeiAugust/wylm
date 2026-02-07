/**
 * HTTP请求工具类
 */

interface RequestOptions extends RequestInit {
  params?: Record<string, any>
  timeout?: number
}

interface ApiResponse<T = any> {
  success: boolean
  data?: T
  message?: string
  error?: string
  code?: number
}

export class HttpClient {
  private baseURL: string
  private defaultTimeout: number

  constructor(baseURL: string = '/api', timeout: number = 30000) {
    this.baseURL = baseURL
    this.defaultTimeout = timeout
  }

  /**
   * 构建完整URL
   */
  private buildURL(url: string, params?: Record<string, any>): string {
    const fullURL = url.startsWith('http') ? url : `${this.baseURL}${url}`

    if (!params) return fullURL

    const searchParams = new URLSearchParams()
    Object.keys(params).forEach((key) => {
      if (params[key] !== null && params[key] !== undefined) {
        searchParams.append(key, String(params[key]))
      }
    })

    const queryString = searchParams.toString()
    return queryString ? `${fullURL}?${queryString}` : fullURL
  }

  /**
   * 获取请求头
   */
  private getHeaders(customHeaders?: HeadersInit): HeadersInit {
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      ...customHeaders,
    }

    // 添加认证Token
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('token')
      if (token) {
        headers['Authorization'] = `Bearer ${token}`
      }
    }

    return headers
  }

  /**
   * 发送请求
   */
  private async request<T>(
    url: string,
    options: RequestOptions = {}
  ): Promise<ApiResponse<T>> {
    const { params, timeout = this.defaultTimeout, ...fetchOptions } = options

    const fullURL = this.buildURL(url, params)
    const headers = this.getHeaders(fetchOptions.headers)

    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), timeout)

    try {
      const response = await fetch(fullURL, {
        ...fetchOptions,
        headers,
        signal: controller.signal,
      })

      clearTimeout(timeoutId)

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || '请求失败')
      }

      return data
    } catch (error: any) {
      if (error.name === 'AbortError') {
        throw new Error('请求超时')
      }
      throw error
    }
  }

  /**
   * GET请求
   */
  async get<T>(url: string, params?: Record<string, any>): Promise<ApiResponse<T>> {
    return this.request<T>(url, {
      method: 'GET',
      params,
    })
  }

  /**
   * POST请求
   */
  async post<T>(url: string, data?: any): Promise<ApiResponse<T>> {
    return this.request<T>(url, {
      method: 'POST',
      body: JSON.stringify(data),
    })
  }

  /**
   * PUT请求
   */
  async put<T>(url: string, data?: any): Promise<ApiResponse<T>> {
    return this.request<T>(url, {
      method: 'PUT',
      body: JSON.stringify(data),
    })
  }

  /**
   * DELETE请求
   */
  async delete<T>(url: string): Promise<ApiResponse<T>> {
    return this.request<T>(url, {
      method: 'DELETE',
    })
  }

  /**
   * PATCH请求
   */
  async patch<T>(url: string, data?: any): Promise<ApiResponse<T>> {
    return this.request<T>(url, {
      method: 'PATCH',
      body: JSON.stringify(data),
    })
  }
}

// 创建默认实例
export const http = new HttpClient()

// 导出便捷方法
export const get = http.get.bind(http)
export const post = http.post.bind(http)
export const put = http.put.bind(http)
export const del = http.delete.bind(http)
export const patch = http.patch.bind(http)
