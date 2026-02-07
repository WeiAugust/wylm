import { NextResponse } from 'next/server'

export interface ApiResponse<T = any> {
  success: boolean
  data?: T
  message?: string
  error?: string
  code?: number
}

export class ApiResponseHelper {
  static success<T>(data?: T, message?: string): NextResponse<ApiResponse<T>> {
    return NextResponse.json({
      success: true,
      data,
      message,
    })
  }

  static error(message: string, code: number = 400, error?: string): NextResponse<ApiResponse> {
    return NextResponse.json(
      {
        success: false,
        message,
        error,
        code,
      },
      { status: code }
    )
  }

  static unauthorized(message: string = '未授权访问'): NextResponse<ApiResponse> {
    return this.error(message, 401)
  }

  static forbidden(message: string = '无权限访问'): NextResponse<ApiResponse> {
    return this.error(message, 403)
  }

  static notFound(message: string = '资源不存在'): NextResponse<ApiResponse> {
    return this.error(message, 404)
  }

  static serverError(message: string = '服务器错误'): NextResponse<ApiResponse> {
    return this.error(message, 500)
  }
}
