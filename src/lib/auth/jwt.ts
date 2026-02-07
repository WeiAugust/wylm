import jwt from 'jsonwebtoken'

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key'
const JWT_EXPIRES_IN = '7d'

export interface JwtPayload {
  userId: string
  phone: string
  roles?: string[]
}

export class JwtHelper {
  /**
   * 生成JWT Token
   */
  static sign(payload: JwtPayload): string {
    return jwt.sign(payload, JWT_SECRET, {
      expiresIn: JWT_EXPIRES_IN,
    })
  }

  /**
   * 验证JWT Token
   */
  static verify(token: string): JwtPayload | null {
    try {
      return jwt.verify(token, JWT_SECRET) as JwtPayload
    } catch (error) {
      return null
    }
  }

  /**
   * 解码JWT Token（不验证）
   */
  static decode(token: string): JwtPayload | null {
    try {
      return jwt.decode(token) as JwtPayload
    } catch (error) {
      return null
    }
  }
}
