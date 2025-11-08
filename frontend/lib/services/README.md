# 服务层架构

服务层是前端与 API 交互的统一入口，基于以下原则：

- **关注点分离** - 每个服务负责一个业务领域
- **统一入口** - 通过 `services` 对象导出所有服务
- **类型安全** - 所有请求和响应有明确类型定义
- **错误分类** - 细粒度的错误类型
- **可取消请求** - 支持请求取消机制
- **环境配置** - 支持多环境配置

## 目录结构

```
lib/services/
├── core/                 # 核心服务层
│   ├── api-client.ts    # Axios 客户端实例
│   ├── base.service.ts  # 服务基类
│   ├── config.ts        # API 配置
│   ├── errors.ts        # 错误类型定义
│   ├── types.ts         # 核心类型定义
│   └── index.ts         # 导出核心模块
├── auth/                # 认证服务
│   ├── types.ts         # 认证相关类型
│   ├── auth.service.ts  # 认证服务实现
│   └── index.ts         # 导出认证服务
├── index.ts             # 服务层统一入口
└── README.md            # 文档
```

## 核心模块

### config.ts

提供 API 配置管理：
- 环境变量支持（`NEXT_PUBLIC_API_URL`）
- 统一的超时配置
- 凭证配置

### api-client.ts

提供统一的 HTTP 客户端，包含：
- 请求/响应拦截器
- 统一错误处理
- 自动 401 重定向
- 请求取消机制
- 超时控制

### base.service.ts

提供服务基类，封装：
- GET、POST、PUT、PATCH、DELETE 方法
- 统一的路径处理
- 类型安全的响应解析
- 支持额外的请求配置

### errors.ts

定义错误类型层级：
- `ApiErrorBase` - API 错误基类
- `NetworkError` - 网络连接错误
- `TimeoutError` - 请求超时错误
- `UnauthorizedError` - 未授权错误 (401)
- `ForbiddenError` - 权限不足错误 (403)
- `NotFoundError` - 资源未找到错误 (404)
- `ValidationError` - 参数验证错误 (400)
- `ServerError` - 服务器错误 (5xx)

### types.ts

定义核心类型：
- `ApiResponse<T>` - API 响应结构
- `ApiError` - 错误响应结构
- `PaginationParams` - 分页请求参数
- `PaginationResponse<T>` - 分页响应结构

## 使用方式

### 1. 推荐：使用统一的 services 对象

```typescript
import services from '@/lib/services';

// 调用认证服务
const user = await services.auth.getCurrentUser();
const loginResult = await services.auth.login({ username, password });
```

### 2. 按需导入：直接导入特定服务

```typescript
import { AuthService } from '@/lib/services';

const user = await AuthService.getCurrentUser();
```

### 3. 错误处理

```typescript
import services, { UnauthorizedError, ValidationError } from '@/lib/services';

try {
  const user = await services.auth.login({ username, password });
  console.log('登录成功', user);
} catch (error) {
  if (error instanceof UnauthorizedError) {
    console.error('登录失败：用户名或密码错误');
  } else if (error instanceof ValidationError) {
    console.error('登录失败：参数验证失败', error.details);
  } else {
    console.error('登录失败：', error.message);
  }
}
```

### 4. 取消请求

```typescript
import { cancelRequest, cancelAllRequests } from '@/lib/services';

// 取消特定请求
cancelRequest('GET', '/api/v1/users');

// 取消所有请求（例如在组件卸载时）
useEffect(() => {
  return () => {
    cancelAllRequests();
  };
}, []);
```

### 5. 使用核心模块

```typescript
import { apiClient, BaseService } from '@/lib/services/core';

// 直接使用 apiClient
const response = await apiClient.get('/api/v1/users');

// 继承 BaseService 创建新服务
class UserService extends BaseService {
  protected static readonly basePath = '/api/v1/users';
  
  static async getAll() {
    return this.get('/');
  }
}
```

## 创建新服务

### 1. 创建目录结构

```bash
lib/services/新服务名/
  ├── types.ts           # 类型定义
  ├── 服务名.service.ts   # 服务实现
  └── index.ts           # 导出服务
```

### 2. 定义类型（types.ts）

```typescript
/**
 * 用户信息
 */
export interface User {
  id: string;
  name: string;
  email: string;
}

/**
 * 创建用户请求
 */
export interface CreateUserRequest {
  name: string;
  email: string;
}
```

### 3. 实现服务类（服务名.service.ts）

```typescript
import { BaseService } from '../core/base.service';
import type { User, CreateUserRequest } from './types';

/**
 * 用户服务
 * 处理用户相关的 API 请求
 */
export class UserService extends BaseService {
  protected static readonly basePath = '/api/v1/users';

  /**
   * 获取用户列表
   * @returns 用户列表
   */
  static async getAll(): Promise<User[]> {
    return this.get<User[]>('/');
  }

  /**
   * 获取单个用户
   * @param id - 用户 ID
   * @returns 用户信息
   */
  static async getById(id: string): Promise<User> {
    return this.get<User>(`/${id}`);
  }

  /**
   * 创建用户
   * @param request - 创建请求
   * @returns 创建的用户
   */
  static async create(request: CreateUserRequest): Promise<User> {
    return this.post<User>('/', request);
  }

  /**
   * 更新用户
   * @param id - 用户 ID
   * @param request - 更新请求
   * @returns 更新后的用户
   */
  static async update(id: string, request: Partial<CreateUserRequest>): Promise<User> {
    return this.put<User>(`/${id}`, request);
  }

  /**
   * 删除用户
   * @param id - 用户 ID
   */
  static async delete(id: string): Promise<void> {
    return this.delete<void>(`/${id}`);
  }
}
```

### 4. 导出服务（index.ts）

```typescript
/**
 * 用户服务模块
 */

export { UserService } from './user.service';
export type { User, CreateUserRequest } from './types';
```

### 5. 注册到服务层（services/index.ts）

```typescript
import { AuthService } from './auth';
import { UserService } from './user';  // 新增

const services = {
  auth: AuthService,
  user: UserService,  // 新增
};

export default services;

// 导出新服务
export { UserService } from './user';
export type { User, CreateUserRequest } from './user';
```

## 最佳实践

### 1. 类型安全

✅ **推荐**：明确类型定义
```typescript
static async getUser(id: string): Promise<User> {
  return this.get<User>(`/${id}`);
}
```

❌ **避免**：使用 `any` 类型
```typescript
static async getUser(id: string): Promise<any> {
  return this.get(`/${id}`);
}
```

### 2. 错误处理

✅ **推荐**：使用类型化错误处理
```typescript
import { UnauthorizedError, ValidationError, NetworkError } from '@/lib/services';

try {
  const user = await services.auth.getCurrentUser();
  setUser(user);
} catch (error) {
  if (error instanceof UnauthorizedError) {
    router.push('/login');
  } else if (error instanceof NetworkError) {
    toast.error('网络连接失败，请检查您的网络');
  } else if (error instanceof ValidationError) {
    toast.error(error.message);
    console.log('验证错误详情:', error.details);
  } else {
    toast.error('操作失败，请稍后重试');
  }
}
```

### 3. 请求取消

✅ **推荐**：在组件卸载时取消请求
```typescript
import { useEffect } from 'react';
import { cancelAllRequests } from '@/lib/services';

function MyComponent() {
  useEffect(() => {
    // 组件卸载时取消所有请求
    return () => {
      cancelAllRequests();
    };
  }, []);
}
```

### 4. 参数校验

✅ **推荐**：使用 ValidationError 返回详细信息
```typescript
static async createUser(data: CreateUserRequest): Promise<User> {
  if (!data.email) {
    throw new ValidationError('邮箱不能为空', { field: 'email' });
  }
  return this.post<User>('/', data);
}
```

### 5. 文档注释

✅ **推荐**：使用 JSDoc 注释
```typescript
/**
 * 获取用户信息
 * @param id - 用户 ID
 * @returns 用户信息
 * @throws {NotFoundError} 当用户不存在时
 * @throws {UnauthorizedError} 当未登录时
 */
static async getUser(id: string): Promise<User> {
  return this.get<User>(`/${id}`);
}
```

### 6. 使用统一的 services 对象

✅ **推荐**：统一风格
```typescript
import services from '@/lib/services';

// 所有服务调用都通过 services 对象
const user = await services.auth.getCurrentUser();
const orders = await services.order.getAll();
```

❌ **避免**：混用两种方式
```typescript
import services, { AuthService } from '@/lib/services';

// 不要混用
const user = await services.auth.getCurrentUser();
const profile = await AuthService.getProfile(); // 不推荐
```

## 注意事项

1. **禁止使用 `any` 类型** - 所有类型必须明确定义
2. **使用 `unknown` 必须断言** - 需要类型断言或类型守卫
3. **继承 BaseService** - 新服务必须继承 `BaseService` 类
4. **设置 basePath** - 每个服务必须使用 `readonly` 设置 `basePath`
5. **导出类型** - 在 `index.ts` 中导出所有类型定义
6. **统一错误处理** - 使用 `errors.ts` 中定义的错误类型
7. **环境变量** - 使用 `NEXT_PUBLIC_API_URL` 配置 API 地址
8. **请求取消** - 在适当的时机取消不需要的请求
