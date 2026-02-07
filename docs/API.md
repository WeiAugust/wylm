# WYLM API 文档

## 基础信息

- **Base URL**: `http://localhost:3000/api`
- **认证方式**: JWT Token (Bearer Token)
- **响应格式**: JSON

## 通用响应格式

### 成功响应

```json
{
  "success": true,
  "data": { ... },
  "message": "操作成功"
}
```

### 错误响应

```json
{
  "success": false,
  "message": "错误信息",
  "error": "详细错误描述",
  "code": 400
}
```

## 认证相关 API

### 1. 用户注册

**POST** `/api/auth/register`

注册新用户账号。

**请求参数**

```json
{
  "phone": "13800138000",
  "password": "Password123",
  "verificationCode": "123456",
  "nickname": "用户昵称"
}
```

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| phone | string | 是 | 手机号（11位） |
| password | string | 是 | 密码（至少8位，包含大小写字母和数字） |
| verificationCode | string | 是 | 短信验证码（6位数字） |
| nickname | string | 否 | 用户昵称 |

**响应示例**

```json
{
  "success": true,
  "data": {
    "user": {
      "id": "clx1234567890",
      "phone": "13800138000",
      "nickname": "用户昵称",
      "avatar": null,
      "bio": null,
      "email": null,
      "createdAt": "2026-02-07T10:00:00.000Z",
      "updatedAt": "2026-02-07T10:00:00.000Z"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  },
  "message": "注册成功"
}
```

---

### 2. 用户登录

**POST** `/api/auth/login`

用户登录，支持密码登录和验证码登录。

**请求参数**

```json
{
  "phone": "13800138000",
  "password": "Password123",
  "loginType": "password"
}
```

或

```json
{
  "phone": "13800138000",
  "verificationCode": "123456",
  "loginType": "code"
}
```

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| phone | string | 是 | 手机号 |
| password | string | 条件必填 | 密码（loginType为password时必填） |
| verificationCode | string | 条件必填 | 验证码（loginType为code时必填） |
| loginType | string | 是 | 登录方式：password（密码）或 code（验证码） |

**响应示例**

```json
{
  "success": true,
  "data": {
    "user": {
      "id": "clx1234567890",
      "phone": "13800138000",
      "nickname": "用户昵称",
      "avatar": null,
      "bio": null,
      "email": null,
      "status": "ACTIVE",
      "createdAt": "2026-02-07T10:00:00.000Z",
      "updatedAt": "2026-02-07T10:00:00.000Z",
      "roles": ["普通用户"]
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  },
  "message": "登录成功"
}
```

---

### 3. 发送验证码

**POST** `/api/auth/send-code`

发送短信验证码。

**请求参数**

```json
{
  "phone": "13800138000",
  "type": "register"
}
```

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| phone | string | 是 | 手机号 |
| type | string | 是 | 验证码类型：register（注册）、login（登录）、reset（重置密码） |

**响应示例**

```json
{
  "success": true,
  "data": null,
  "message": "验证码发送成功"
}
```

**注意事项**

- 同一手机号1分钟内只能发送一次验证码
- 验证码有效期为5分钟
- 开发环境下会在响应中返回验证码（生产环境不返回）

---

### 4. 获取当前用户信息

**GET** `/api/auth/me`

获取当前登录用户的信息。

**请求头**

```
Authorization: Bearer <token>
```

**响应示例**

```json
{
  "success": true,
  "data": {
    "id": "clx1234567890",
    "phone": "13800138000",
    "nickname": "用户昵称",
    "avatar": "https://example.com/avatar.jpg",
    "bio": "个人简介",
    "email": "user@example.com",
    "roles": ["普通用户"],
    "createdAt": "2026-02-07T10:00:00.000Z",
    "updatedAt": "2026-02-07T10:00:00.000Z"
  }
}
```

---

## 博客相关 API

### 1. 获取文章列表

**GET** `/api/blog/posts`

获取博客文章列表，支持分页、筛选和排序。

**查询参数**

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| page | number | 否 | 页码（默认1） |
| pageSize | number | 否 | 每页数量（默认10） |
| categoryId | string | 否 | 分类ID |
| tagId | string | 否 | 标签ID |
| status | string | 否 | 状态：DRAFT、PUBLISHED、ARCHIVED |
| keyword | string | 否 | 搜索关键词 |
| sortBy | string | 否 | 排序字段：createdAt、viewCount、likeCount |
| sortOrder | string | 否 | 排序方式：asc、desc（默认desc） |

**响应示例**

```json
{
  "success": true,
  "data": {
    "data": [
      {
        "id": "clx1234567890",
        "title": "文章标题",
        "slug": "article-slug",
        "excerpt": "文章摘要",
        "coverImage": "https://example.com/cover.jpg",
        "author": {
          "id": "clx0987654321",
          "nickname": "作者昵称",
          "avatar": "https://example.com/avatar.jpg"
        },
        "category": {
          "id": "clx1111111111",
          "name": "技术",
          "slug": "tech"
        },
        "tags": [
          {
            "id": "clx2222222222",
            "name": "JavaScript",
            "slug": "javascript"
          }
        ],
        "status": "PUBLISHED",
        "isPinned": false,
        "viewCount": 100,
        "likeCount": 10,
        "commentCount": 5,
        "publishedAt": "2026-02-07T10:00:00.000Z",
        "createdAt": "2026-02-07T10:00:00.000Z",
        "updatedAt": "2026-02-07T10:00:00.000Z"
      }
    ],
    "pagination": {
      "page": 1,
      "pageSize": 10,
      "total": 50,
      "totalPages": 5
    }
  }
}
```

---

### 2. 获取文章详情

**GET** `/api/blog/posts/:id`

获取指定文章的详细信息。

**路径参数**

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| id | string | 是 | 文章ID |

**响应示例**

```json
{
  "success": true,
  "data": {
    "id": "clx1234567890",
    "title": "文章标题",
    "slug": "article-slug",
    "content": "# 文章内容\n\n这是文章的Markdown内容...",
    "excerpt": "文章摘要",
    "coverImage": "https://example.com/cover.jpg",
    "author": {
      "id": "clx0987654321",
      "nickname": "作者昵称",
      "avatar": "https://example.com/avatar.jpg",
      "bio": "作者简介"
    },
    "category": {
      "id": "clx1111111111",
      "name": "技术",
      "slug": "tech",
      "description": "技术相关文章"
    },
    "tags": [
      {
        "id": "clx2222222222",
        "name": "JavaScript",
        "slug": "javascript",
        "color": "#F7DF1E"
      }
    ],
    "status": "PUBLISHED",
    "isPinned": false,
    "viewCount": 100,
    "likeCount": 10,
    "commentCount": 5,
    "publishedAt": "2026-02-07T10:00:00.000Z",
    "createdAt": "2026-02-07T10:00:00.000Z",
    "updatedAt": "2026-02-07T10:00:00.000Z"
  }
}
```

---

### 3. 创建文章

**POST** `/api/blog/posts`

创建新的博客文章（需要权限）。

**请求头**

```
Authorization: Bearer <token>
```

**请求参数**

```json
{
  "title": "文章标题",
  "slug": "article-slug",
  "content": "# 文章内容\n\n这是文章的Markdown内容...",
  "excerpt": "文章摘要",
  "coverImage": "https://example.com/cover.jpg",
  "categoryId": "clx1111111111",
  "tagIds": ["clx2222222222", "clx3333333333"],
  "status": "PUBLISHED",
  "publishedAt": "2026-02-07T10:00:00.000Z"
}
```

**响应示例**

```json
{
  "success": true,
  "data": {
    "id": "clx1234567890",
    "title": "文章标题",
    "slug": "article-slug",
    ...
  },
  "message": "文章创建成功"
}
```

---

## 摄影作品相关 API

### 1. 获取作品列表

**GET** `/api/gallery/photos`

获取摄影作品列表。

**查询参数**

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| page | number | 否 | 页码（默认1） |
| pageSize | number | 否 | 每页数量（默认20） |
| categoryId | string | 否 | 分类ID |
| tagId | string | 否 | 标签ID |
| albumId | string | 否 | 相册ID |
| sortBy | string | 否 | 排序字段：createdAt、viewCount、likeCount |

**响应示例**

```json
{
  "success": true,
  "data": {
    "data": [
      {
        "id": "clx1234567890",
        "title": "作品标题",
        "description": "作品描述",
        "imageUrl": "https://example.com/photo.jpg",
        "thumbnailUrl": "https://example.com/thumb.jpg",
        "width": 1920,
        "height": 1080,
        "author": {
          "id": "clx0987654321",
          "nickname": "摄影师昵称"
        },
        "category": {
          "id": "clx1111111111",
          "name": "风光"
        },
        "tags": [
          {
            "id": "clx2222222222",
            "name": "自然"
          }
        ],
        "location": "杭州西湖",
        "takenAt": "2026-02-01T10:00:00.000Z",
        "viewCount": 200,
        "likeCount": 20,
        "downloadCount": 5,
        "allowDownload": true,
        "createdAt": "2026-02-07T10:00:00.000Z"
      }
    ],
    "pagination": {
      "page": 1,
      "pageSize": 20,
      "total": 100,
      "totalPages": 5
    }
  }
}
```

---

## 产品相关 API

### 1. 获取产品列表

**GET** `/api/products`

获取产品列表。

**响应示例**

```json
{
  "success": true,
  "data": [
    {
      "id": "clx1234567890",
      "name": "产品名称",
      "slug": "product-slug",
      "description": "产品描述",
      "coverImage": "https://example.com/product.jpg",
      "status": "PUBLISHED",
      "plans": [
        {
          "id": "clx0987654321",
          "name": "基础版",
          "price": 99.00,
          "currency": "CNY",
          "isPopular": false
        }
      ],
      "createdAt": "2026-02-07T10:00:00.000Z"
    }
  ]
}
```

---

## 错误码说明

| 错误码 | 说明 |
|--------|------|
| 400 | 请求参数错误 |
| 401 | 未授权（未登录或Token无效） |
| 403 | 无权限访问 |
| 404 | 资源不存在 |
| 500 | 服务器内部错误 |

---

## 认证说明

大部分API需要在请求头中携带JWT Token：

```
Authorization: Bearer <your-token>
```

获取Token的方式：
1. 通过登录接口获取
2. 通过注册接口获取

Token有效期为7天。

---

## 分页说明

所有列表接口都支持分页，使用以下参数：

- `page`: 页码（从1开始）
- `pageSize`: 每页数量

响应中包含分页信息：

```json
{
  "pagination": {
    "page": 1,
    "pageSize": 10,
    "total": 50,
    "totalPages": 5
  }
}
```

---

## 更新日志

### v1.0.0 (2026-02-07)

- 初始版本
- 实现认证相关API
- 实现博客、摄影、产品基础API
