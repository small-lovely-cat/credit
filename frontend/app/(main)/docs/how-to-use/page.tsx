"use client"

import { MarkdownRenderer } from "@/components/common/docs/markdown-renderer"
import { TableOfContents } from "@/components/common/docs/toc"

const CONTENT = `
## 1. 快速开始
> 为社区开发者与用户提供完整的平台使用说明
 
- 身份认证：基于 LINUX DO Connect (OAuth)
- 认证方式：账户积分消耗认证
- 手续费：动态费率，由服务方承担
- 争议处理：支持服务方与消费方的双方争议处理

## 2. 角色说明

- **服务方**：最终积分流转的转入方
- **消费方**：最终积分流转的转出方
- **认证平台**：LINUX DO Credit 系统本身

## 3. 接入积分服务

### 3.1 使用 API 接口

1. 创建应用

    - 前往 [集市中心](/merchant)
    - 点击顶部右侧 **创建应用** 按钮
    - 填写必要信息：应用名称、应用主页、回调地址、通知地址

2. 获取 API 凭证
    - 在集市中心顶部右侧选择器中选择您的应用
    - 在 **API 配置** 面板中获取：
      - \`Client ID\`：客户端ID，用于标识您的身份
      - \`Client Secret\`：客户端密钥，用于签名验证（**请妥善保管，切勿泄露**）

3. 使用 API 接口
    - 使用 API 接口创建积分流转服务
    - 参考文档：[API 接口文档](/docs/api)

### 3.2 使用在线服务

- 适用场景：无代码开发基础，或只用于简单的积分服务。
- 操作步骤：
  1. 前往 [集市中心](/merchant) 创建应用，获取 API 凭证
  2. 选择应用，点击 **在线收款** 功能
  3. 创建在线积分服务
  4. 获取唯一积分服务链接
  5. 发送给您所服务的客户使用

### 3.3 快速集成 New API 

- 适用场景：New API 站点，LINUX DO Credit 兼容 EasyPay 协议，公益站站长可直接集成。
- 操作步骤：
  1. 前往 [集市中心](/merchant)，点击 **创建应用**，填写 New API 站点信息：

  | 字段 | 值 |
  | :-- | :-- |
  | 应用名称 | \`您的应用名称\` |
  | 应用主页 | \`https://{您的 New API 域名}\` |
  | 回调地址 | \`https://{您的 New API 域名}/console/log\` |
  | 通知地址 | \`https://{您的 New API 域名}/api/user/epay/notify\` |

  2. 前往 New API 站点的系统设置，找到 **支付设置**。

  3. 配置 LINUX DO Credit 平台参数：

  | 参数 | 值 |
  | :-- | :-- |
  | 支付地址 | \`http://credit.linux.do/epay/pay\` |
  | 易支付商户ID | 您的 \`Client ID\` |
  | 易支付商户密钥 | 您的 \`Client Secret\` |
  | 回调地址 | \`https://{您的 New API 域名}\` |

  4. 配置充值方式（JSON 格式）：
  \`\`\`json
  [
    {"color":"rgba(var(--semi-blue-5), 1)","name":"支付宝","type":"alipay"},
    {"color":"rgba(var(--semi-green-5), 1)","name":"微信","type":"wxpay"},
    {"color":"black","name":"Linux Do Credit","type":"epay"}
  ]
  \`\`\`

## 4. 使用 LINUX DO Credit 积分

您可以在任意支持 LINUX DO Credit 的平台下使用积分。在其他平台点击使用 LINUX DO Credit 积分时，会自动跳转到 LINUX DO Credit 的积分流转服务页面，您只需要确认积分流转信息无误，并选择使用 LINUX DO Credit 进行账户认证，即可完成整个交易服务。

## 5. 服务（手续）费

### 5.1 规则说明

为了更好的维持 LINUX DO Credit 平台的积分服务机制，保证社区积分的生态可持续发展，我们会按照规范进行不同程度的服务（手续）费用收取。

- **承担方**：服务（手续）费默认**由服务方承担**
- **消费方使用**：不会产生额外费用
- **服务方实收**：订单金额 - 服务（手续）费

计算公式：
\`\`\`
手续费 = 订单金额 × 当前费率
商家实际到账 = 订单金额 - 手续费
\`\`\`

### 5.2 动态费率
费率并非固定不变，会根据以下因素动态调整：
- 服务方平台等级
- 服务方平台积分
- LINUX DO Credit 平台活动

## 6. 争议处理

为了保障服务方与消费方的合法权益，当积分服务出现纠纷时，可使用争议功能。

- 作为服务方，您需要及时响应消费方的争议请求：
  1. 在集市中心或通知中查看到 **待处理的争议**
  2. 查看消费方理由，选择操作：
    - **同意**：认可消费方诉求，积分原路退回给消费方
    - **拒绝**：如果您认为已履约，请提交相关证据

> **重要**：建议服务方与消费方优先通过沟通解决。长时间未处理的争议会由 LINUX DO Credit 平台介入仲裁，这可能会影响您的服务方信誉。

## 7. 积分转移

- 适用场景：向 LINUX DO Credit 平台内的其他用户进行积分转移。
- 操作步骤
  1. 进入 **活动** 页面，选择 **积分转移**
  2. 填写接收方信息：
    - **接收方账户**：对方的用户名
    - **接收方 ID**：对方的用户ID，确保积分去向准确
    - **积分数量**：转移的积分数量
  3. 验证安全密码后，积分将实时到账

> **重要**：请勿滥用积分转移进行刷号、交易等违规行为，积分审计系统发现此类行为会立即封禁相关账户！

## 8. 社区积分

您的 LINUX DO Credit 平台基础积分主要由 **社区积分 (Community Balance)** 划转而来。

- **基本获取方式**：通过在 LINUX DO 社区的活跃行为获得：
  - 发帖、回复、点赞等社区贡献
  - 详情可见 [LINUX DO 社区](https://linux.do/)

- **划转规则**：
  - 划转时间：社区积分每日凌晨 **00:00** 自动划转至可用余额
  - 限制说明：划转前不可用于任何积分服务
  - 服务费用：目前划转 **服务费**

## 9. 账户设置

您可以在 **设置 (Settings)** 页面管理您的账户信息。

## 功能列表
- **个人资料**：查看当前的账户信息和会员等级
- **安全设置**：修改认证密码
- **通知设置**：暂未上线
- **外观设置**：切换页面主题、界面外观
`

export default function HowToUsePage() {
  return (
    <div className="py-6">
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_240px] gap-10">
        <main className="min-w-0 pb-[60vh]">
          <MarkdownRenderer content={CONTENT} />
        </main>
        <aside className="hidden lg:block relative">
          <div className="sticky top-6">
            <TableOfContents content={CONTENT} />
          </div>
        </aside>
      </div>
    </div>
  )
}
