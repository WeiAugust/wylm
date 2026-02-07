/**
 * 本地存储工具类
 */
export class Storage {
  /**
   * 设置存储项
   */
  static set(key: string, value: any): void {
    try {
      const serializedValue = JSON.stringify(value)
      localStorage.setItem(key, serializedValue)
    } catch (error) {
      console.error('Storage set error:', error)
    }
  }

  /**
   * 获取存储项
   */
  static get<T>(key: string, defaultValue?: T): T | null {
    try {
      const item = localStorage.getItem(key)
      if (item === null) return defaultValue || null
      return JSON.parse(item) as T
    } catch (error) {
      console.error('Storage get error:', error)
      return defaultValue || null
    }
  }

  /**
   * 删除存储项
   */
  static remove(key: string): void {
    try {
      localStorage.removeItem(key)
    } catch (error) {
      console.error('Storage remove error:', error)
    }
  }

  /**
   * 清空所有存储
   */
  static clear(): void {
    try {
      localStorage.clear()
    } catch (error) {
      console.error('Storage clear error:', error)
    }
  }

  /**
   * 检查存储项是否存在
   */
  static has(key: string): boolean {
    return localStorage.getItem(key) !== null
  }

  /**
   * 获取所有存储的键
   */
  static keys(): string[] {
    return Object.keys(localStorage)
  }
}

/**
 * Token管理
 */
export class TokenManager {
  private static readonly TOKEN_KEY = 'auth_token'
  private static readonly USER_KEY = 'auth_user'

  /**
   * 保存Token
   */
  static setToken(token: string): void {
    Storage.set(this.TOKEN_KEY, token)
  }

  /**
   * 获取Token
   */
  static getToken(): string | null {
    return Storage.get<string>(this.TOKEN_KEY)
  }

  /**
   * 删除Token
   */
  static removeToken(): void {
    Storage.remove(this.TOKEN_KEY)
  }

  /**
   * 保存用户信息
   */
  static setUser(user: any): void {
    Storage.set(this.USER_KEY, user)
  }

  /**
   * 获取用户信息
   */
  static getUser<T>(): T | null {
    return Storage.get<T>(this.USER_KEY)
  }

  /**
   * 删除用户信息
   */
  static removeUser(): void {
    Storage.remove(this.USER_KEY)
  }

  /**
   * 清空认证信息
   */
  static clear(): void {
    this.removeToken()
    this.removeUser()
  }

  /**
   * 检查是否已登录
   */
  static isAuthenticated(): boolean {
    return this.getToken() !== null
  }
}
