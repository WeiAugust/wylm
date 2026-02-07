import bcrypt from 'bcryptjs'

const SALT_ROUNDS = 10

export class PasswordHelper {
  /**
   * 加密密码
   */
  static async hash(password: string): Promise<string> {
    return bcrypt.hash(password, SALT_ROUNDS)
  }

  /**
   * 验证密码
   */
  static async verify(password: string, hashedPassword: string): Promise<boolean> {
    return bcrypt.compare(password, hashedPassword)
  }

  /**
   * 验证密码强度
   * 至少8位，包含大小写字母和数字
   */
  static validateStrength(password: string): { valid: boolean; message?: string } {
    if (password.length < 8) {
      return { valid: false, message: '密码长度至少为8位' }
    }

    if (!/[a-z]/.test(password)) {
      return { valid: false, message: '密码必须包含小写字母' }
    }

    if (!/[A-Z]/.test(password)) {
      return { valid: false, message: '密码必须包含大写字母' }
    }

    if (!/[0-9]/.test(password)) {
      return { valid: false, message: '密码必须包含数字' }
    }

    return { valid: true }
  }
}
