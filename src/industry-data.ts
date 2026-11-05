import type { Market } from "./regions"

export type Industry = {
  id: string
  name: string
  shortName: string
  description: string
  market: Market
  researchStatus: "failed" | "completed"
  updatedAt: string
  applications: string[]
  customers: string[]
  opportunities: string[]
}
export type IndustryView = "overview" | "chat"
export const industries: Industry[] = [
  {
    id: "reflective-composite",
    name: "反光材料（含反光布 / 反光带 / 反光膜）",
    shortName: "反光复合材料",
    description: "面向反光涂层、复合材料与功能性面料的生产及应用。",
    market: "domestic",
    researchStatus: "failed",
    updatedAt: "10/31 21:06",
    applications: ["包装业", "化工及复合材料添加", "箱包与鞋材", "功能性面料"],
    customers: ["功能性面料生产企业", "箱包与鞋材制造企业", "复合材料加工企业"],
    opportunities: [
      "梳理反光涂层与复合加工的应用条件",
      "核实客户对耐磨、耐候性能的具体要求",
      "区分终端工厂与材料渠道商",
    ],
  },
  {
    id: "printing",
    name: "3D 打印 / 增材制造（工业级 FDM 3D 打印机及耗材）",
    shortName: "3D 打印",
    description: "工业级 FDM 3D 打印机及耗材，连接研发打样与柔性生产。",
    market: "domestic",
    researchStatus: "failed",
    updatedAt: "10/29 10:02",
    applications: ["工业研发打样", "工装夹具", "教育与科研", "小批量定制"],
    customers: ["制造业研发中心", "工业设计与打样服务商", "高校及科研机构"],
    opportunities: [
      "确认使用场景与材料兼容性",
      "区分设备采购、耗材复购和打印服务需求",
      "按精度、速度与成本要求建立客户画像",
    ],
  },
  {
    id: "fabric",
    name: "坯布",
    shortName: "坯布",
    description: "以生产和销售坯布为核心，覆盖服装面料与工业用布。",
    market: "domestic",
    researchStatus: "completed",
    updatedAt: "11/03 01:20",
    applications: ["染色加工用坯", "印花加工用坯", "涂层加工用布", "服装面料"],
    customers: ["染整与印花加工厂", "服装面料供应商", "产业用纺织品企业"],
    opportunities: [
      "按纤维成分、克重、幅宽区分需求",
      "关注加工工艺与质量验收标准",
      "核实常规采购量和交付周期",
    ],
  },
  {
    id: "reflective",
    name: "反光材料",
    shortName: "反光材料",
    description: "以生产反光布、反光带和反光膜为主，面向防护服装与交通安全。",
    market: "domestic",
    researchStatus: "completed",
    updatedAt: "10/30 02:51",
    applications: [
      "休闲服饰",
      "防护工装",
      "舞台服装",
      "箱包与鞋材",
      "交通标识",
    ],
    customers: [
      "防护服装生产企业",
      "交通安全设施企业",
      "户外用品与箱包企业",
      "劳保用品渠道商",
    ],
    opportunities: [
      "优先确认客户的应用场景与认证要求",
      "结合耐洗、耐候和反光性能提供样品",
      "通过样品验证推进规格、报价和交付沟通",
    ],
  },
]

export type ChatAttachment = {
  id: string
  name: string
  size: number
}
export type ChatMessage = {
  id: string
  role: "user" | "assistant"
  content: string
  attachments?: ChatAttachment[]
  feedback?: "positive" | "negative" | null
  stopped?: boolean
}
export type Conversation = {
  id: string
  title: string
  industryId: string | null
  messages: ChatMessage[]
  example?: boolean
}
export const exampleConversations: Conversation[] = [
  {
    id: "example-reflective",
    title: "反光材料的目标客户怎么找？",
    industryId: "reflective",
    example: true,
    messages: [
      {
        id: "er-user",
        role: "user",
        content: "我们生产反光布和反光带，应该优先开发哪些客户？",
      },
      {
        id: "er-assistant",
        role: "assistant",
        content:
          "可以先按**应用场景**拆分客户，而不是直接从一张大名单开始。\n\n### 建议先看这三类客户\n- **防护工装企业**：先核实耐洗标准、反光性能和认证要求。\n- **交通安全设施企业**：关注户外耐候性、产品规格和交付周期。\n- **户外用品与箱包企业**：关注复合工艺、外观和小批量定制。\n\n### 下一步需要确认\n你们的主要产品规格、已有认证，以及更希望开发国内还是海外客户。\n\n以上为界面示例，不是联网研究结论。",
      },
    ],
  },
  {
    id: "example-applications",
    title: "梳理防护服装的应用场景",
    industryId: "reflective",
    example: true,
    messages: [
      {
        id: "ea-user",
        role: "user",
        content: "帮我梳理反光材料在防护服装里的应用。",
      },
      {
        id: "ea-assistant",
        role: "assistant",
        content:
          "可以从**使用环境、加工方式和质量标准**三个维度梳理。\n\n- **道路与环卫作业**：关注高可视性、耐候性和清洗频率。\n- **工业与物流作业**：关注耐磨、穿着舒适度和加工兼容性。\n- **户外作业**：关注温度变化、雨水和日晒条件。\n\n在实际开发客户前，需要用产品规格与检测材料核验匹配程度。\n\n以上为演示性分析框架，未执行真实研究。",
      },
    ],
  },
  {
    id: "example-printing",
    title: "工业级 3D 打印的采购画像",
    industryId: "printing",
    example: true,
    messages: [
      {
        id: "ep-user",
        role: "user",
        content: "工业级 FDM 设备的采购客户有哪些特点？",
      },
      {
        id: "ep-assistant",
        role: "assistant",
        content:
          "建议区分**研发打样、工装夹具和小批量生产**三类用途。\n\n- 先确认打印尺寸、精度和材料要求。\n- 再明确使用频率、预算和售后服务需求。\n- 最后核实采购部门、技术评估人和最终决策人。\n\n这是用于界面演示的客户画像框架，不代表真实客户采购情况。",
      },
    ],
  },
]

export function makeDemoReply(
  prompt: string,
  industry: Industry | undefined,
  market: Market,
  attachments: ChatAttachment[],
) {
  const product = industry?.shortName || "你的产品"
  const scope = /海外/.test(prompt)
    ? "海外市场"
    : /国内/.test(prompt)
      ? "国内市场"
      : market === "domestic"
        ? "国内市场"
        : "海外市场"
  let content: string
  if (/^(你好|您好|hi|hello|嗨)[！!。.，,\s]*$/i.test(prompt.trim())) {
    content = `你好！我们可以先从${
      product === "你的产品" ? "你的产品和业务" : `**${product}**的产品与业务`
    }开始。\n\n告诉我下面三件事，就能逐步梳理研究方向：\n- 主要生产或销售什么产品？\n- 希望开拓国内还是海外市场？\n- 目前最想解决的是客户筛选、应用场景，还是开发策略？\n\n不需要一次说得很完整，我们可以边聊边补充。`
  } else if (/客户|买家|采购|画像/.test(prompt)) {
    const customers = industry?.customers || [
      "有明确应用需求的生产企业",
      "相关产业链中的加工与集成企业",
      "具备渠道能力的经销商",
    ]
    content = `围绕**${product}**，建议先按客户的实际用途建立分层，而不是只按企业名称找客户。\n\n### 优先梳理的客户类型\n${customers.map((c) => `- **${c}**：先核实产品用途、采购规格与决策角色。`).join("\n")}\n\n### 面向${scope}的下一步\n- 明确产品规格、认证和可交付能力。\n- 确认目标地区、采购节奏与现有供应商情况。\n- 用小范围客户验证画像，再扩大筛选范围。\n\n你们目前最有优势的产品规格是什么？`
  } else if (/应用|场景|用途/.test(prompt)) {
    content = `可以围绕**${product}**，用「应用场景 → 性能要求 → 目标客户」的方式整理。\n\n### 可先核验的应用方向\n${(industry?.applications || ["终端产品应用", "生产加工环节", "配套服务与渠道"]).map((a) => `- **${a}**：确认使用环境、加工条件和验收标准。`).join("\n")}\n\n### 需要补充的信息\n- 产品的主要性能、规格和已有认证。\n- 现有客户最常见的用途。\n- 是否有不能覆盖的工况或应用限制。\n\n这些信息能帮助我们排除不匹配的客户，而不是仅扩大名单。`
  } else if (/海外|国内|地区|市场|国家/.test(prompt)) {
    content = `针对**${product}**的市场选择，建议先做匹配验证，再确定地区优先级。\n\n### 先明确市场条件\n- 目标市场：**${scope}**；如需切换，请说明希望开拓的国家或地区。\n- 需求匹配：当地客户的应用场景和产品规格。\n- 进入条件：认证、交付、服务与语言要求。\n\n### 再安排开发顺序\n先选择少量目标地区，核实客户需求和采购链路，再根据反馈调整筛选条件。\n\n**当前没有执行联网搜索**，不能据此给出真实市场规模或具体采购企业名单。`
  } else {
    content = `收到。关于「${prompt.trim().slice(0, 100)}${
      prompt.length > 100 ? "…" : ""
    }」，我们可以从**${product}**的业务条件开始梳理。\n\n### 先把业务说清楚\n- 产品：主要规格、性能优势和交付能力。\n- 应用：产品用在哪个环节，解决什么具体问题。\n- 客户：谁使用、谁采购、谁参与技术评估。\n\n### 建议的研究方向\n${(industry?.opportunities || ["明确产品和应用边界", "建立目标客户画像", "核验目标市场与开发优先级"]).map((t) => `- ${t}。`).join("\n")}\n\n下一步可以先补充：**你们的核心产品，以及希望优先开发的客户类型**。`
  }
  if (attachments.length)
    content += `\n\n**附件说明**：已选择 ${attachments.length} 个本地附件，仅展示文件名；本次演示不会上传或解析附件内容。`
  return {
    content,
  }
}
