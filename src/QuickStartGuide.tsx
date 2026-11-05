import { useEffect, useId, useRef, useState, type ReactNode } from "react"
import { Icon } from "./ui"
import "./quick-start.css"

export type GuideDestination = "industry" | "opportunities" | "followups" | "contacts"
type Page = "guide" | "confirm" | "industry" | "opportunity" | "followup" | "contactsPage"
type Business = {
  product: string
  application: string
  target: string
  role: string
  market: string
  advantage: string
  exclude: string
}
const initialBusiness: Business = {
  product: "",
  application: "",
  target: "",
  role: "",
  market: "国内市场",
  advantage: "",
  exclude: "",
}
const prompts: {
  key: keyof Business
  text: string
  choices: string[]
}[] = [
  { key: "product", text: "先说说你们主要卖什么？用在什么地方？", choices: [] },
  {
    key: "target",
    text: "你们通常卖给哪类企业？",
    choices: [
      "安全防护服制造商",
      "交通设施企业",
      "渠道/贸易商",
      "不确定，稍后再说",
    ],
  },
  {
    key: "role",
    text: "这些客户更接近哪种业务角色？",
    choices: ["下游制造商", "渠道/贸易商", "项目采购方", "不确定，稍后再说"],
  },
  {
    key: "market",
    text: "你想先从哪个市场开始？",
    choices: ["国内市场", "海外市场", "全球市场"],
  },
  {
    key: "advantage",
    text: "你们的产品有什么优势？例如交期、认证、规格或价格。",
    choices: ["交期稳定", "有认证或特殊规格", "价格有优势", "暂时不确定"],
  },
  {
    key: "exclude",
    text: "有没有明确不希望出现的企业类型？",
    choices: ["没有，先广泛看看", "不找零售商", "不找同行", "稍后再补充"],
  },
]
const labels: [keyof Business, string][] = [
  ["product", "产品"],
  ["target", "目标客户"],
  ["role", "业务角色"],
  ["market", "研究范围"],
  ["advantage", "产品优势"],
  ["exclude", "排除条件"],
]
const titles: Record<Page, [string, string]> = {
  guide: [
    "和行业助手聊聊你的业务",
    "每次只回答一个关键问题，确认后再开始准备行业。",
  ],
  confirm: ["确认行业构建信息", "确认后系统才会开始准备行业和首批企业。"],
  industry: ["行业已准备好", "下一步查看系统建议优先处理的企业。"],
  opportunity: [
    "今天先处理这些企业",
    "先看推荐理由和待核实项，再决定是否加入跟进。",
  ],
  followup: ["跟进记录", "查看已加入的企业，并进入联系人入口。"],
  contactsPage: [
    "联系人与联系入口",
    "查看来源、更新时间和身份状态，销售人工接手。",
  ],
}
const leads = [
  {
    id: "protective",
    name: "某防护服制造商",
    signal: true,
    reason: "产品目录显示反光防护服，近期有采购相关信号。",
    uncertainty: "采购部门、产品规格和供应商准入方式。",
    evidence: "官网产品页 · 近期采购信息 · 来源时间已记录",
  },
  {
    id: "traffic",
    name: "某交通设施企业",
    signal: false,
    reason: "应用场景与产品范围匹配。",
    uncertainty: "当前是否有采购计划。",
    evidence: "建议先补充采购职能和供应商准入信息。",
  },
  {
    id: "workwear",
    name: "某工装制造商",
    signal: true,
    reason: "安全工装应用与产品适配，近期有公开业务动态。",
    uncertainty: "动态是否对应采购需求、具体规格和采购职能。",
    evidence: "企业产品页 · 公开业务动态 · 需求仍待人工核验",
  },
]
type Lead = typeof leads[number]
type Message = {
  role: "ai" | "user"
  text: string
}
type Followup = {
  id: string
  joinedAt: string
}

function extractApplication(text: string) {
  return (
    text
      .match(/(?:主要)?(?:用于|用在|应用于|应用在)[：:\s]*(.+)/)?.[1]
      ?.replace(/[。！!]+$/, "")
      .trim() || ""
  )
}

function GuideDialog({
  title,
  onClose,
  children,
}: {
  title: string
  onClose: () => void
  children: ReactNode
}) {
  const ref = useRef<HTMLDialogElement>(null)
  useEffect(() => {
    const node = ref.current
    const previous = document.activeElement as HTMLElement | null
    const overflow = document.body.style.overflow
    const ownsScrollLock = overflow !== "hidden"
    node?.showModal()
    if (ownsScrollLock) document.body.style.overflow = "hidden"
    return () => {
      node?.close()
      if (ownsScrollLock) document.body.style.overflow = overflow
      if (previous?.isConnected) previous.focus()
    }
  }, [])
  return (
    <dialog
      className="onboarding-flow flow-dialog"
      ref={ref}
      aria-labelledby="flow-dialog-title"
      onCancel={(e) => {
        e.preventDefault()
        onClose()
      }}
      onKeyDown={(e) => {
        if (e.key !== "Tab") return
        const nodes = ref.current?.querySelectorAll<HTMLElement>(
          "button, a[href], input, textarea",
        )
        if (!nodes?.length) return
        if (e.shiftKey && document.activeElement === nodes[0]) {
          e.preventDefault()
          nodes[nodes.length - 1].focus()
        } else if (
          !e.shiftKey &&
          document.activeElement === nodes[nodes.length - 1]
        ) {
          e.preventDefault()
          nodes[0].focus()
        }
      }}
    >
      <div className="top">
        <h2 id="flow-dialog-title">{title}</h2>
        <button className="btn secondary" onClick={onClose}>
          关闭
        </button>
      </div>
      {children}
    </dialog>
  )
}

export default function QuickStartGuide({
  onDismiss,
  onNavigate,
  active,
  mode = "guide",
  conversationName,
  initialMarket = "国内市场",
}: {
  onDismiss: () => void
  onNavigate?: (destination: GuideDestination, market?: string) => void
  active: boolean
  mode?: "guide" | "assistant" | "modal"
  conversationName?: string
  initialMarket?: string
}) {
  const formId = useId()
  const [page, setPage] = useState<Page>("guide")
  const [business, setBusiness] = useState<Business>(() => ({
    ...initialBusiness,
    market: initialMarket,
  }))
  const [chatStep, setChatStep] = useState(0)
  const [messages, setMessages] = useState<Message[]>([
    { role: "ai", text: prompts[0].text },
  ])
  const [answer, setAnswer] = useState("")
  const [quick, setQuick] = useState(false)
  const [quickProduct, setQuickProduct] = useState("")
  const [editing, setEditing] = useState(false)
  const [research, setResearch] = useState<"idle" | "preparing" | "ready">(
    "idle",
  )
  const [followups, setFollowups] = useState<Followup[]>([])
  const [selectedId, setSelectedId] = useState(leads[0].id)
  const [dialog, setDialog] =
    useState<"details" | "knowledge" | "history" | null>(null)
  const [toast, setToast] = useState("")
  const [lastFollowed, setLastFollowed] = useState<string | null>(null)
  const chatRef = useRef<HTMLDivElement>(null)
  const titleRef = useRef<HTMLHeadingElement>(null)
  const firstRender = useRef(true)
  const currentPrompt = prompts[chatStep]
  const currentLead = leads.find((lead) => lead.id === selectedId) || leads[0]
  const joined = (id: string) => followups.some((item) => item.id === id)
  const step =
    page === "guide" || page === "confirm" || page === "industry"
      ? 1
      : page === "opportunity"
        ? 2
        : page === "followup"
          ? 3
          : 4
  const missing = labels.filter(([key]) => !business[key])
  const assistantMode = mode === "assistant"
  const flowSteps = assistantMode
    ? ["构建行业"]
    : ["构建行业", "今日商机", "加入跟进", "查看联系人"]
  const sessionName =
    conversationName ||
    (business.product ? business.product.slice(0, 24) : "新业务对话")
  const headline =
    page === "industry" && research !== "ready"
      ? research === "preparing"
        ? [
            "行业正在准备",
            assistantMode
              ? "已收到产品信息，正在整理行业认知。"
              : "已收到产品信息，正在整理行业认知和企业候选。",
          ]
        : ["先构建你的行业", "描述产品和主要用途，确认后再开始准备行业。"]
      : assistantMode && page === "industry"
        ? ["行业信息已整理", "查看本次行业认知，也可以继续补充和完善业务信息。"]
        : assistantMode && page === "confirm"
          ? [
              "确认行业构建信息",
              "确认产品、主要应用和客户方向后，开始整理行业信息。",
            ]
          : titles[page]

  useEffect(() => {
    chatRef.current?.scrollTo({ top: chatRef.current.scrollHeight })
  }, [messages, page])
  useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false
      return
    }
    if (active) titleRef.current?.focus({ preventScroll: true })
    if (active && mode === "modal") {
      titleRef.current?.closest(".quick-start-modal")?.scrollTo({ top: 0 })
    } else if (active) {
      window.scrollTo({ top: 0 })
    }
  }, [page, active, mode])
  useEffect(() => {
    if (!toast) return
    const timer = setTimeout(() => setToast(""), 4000)
    return () => clearTimeout(timer)
  }, [toast])
  useEffect(() => {
    if (research !== "preparing") return
    const timer = setTimeout(() => {
      setResearch("ready")
      setPage((previous) => (previous === "confirm" ? "industry" : previous))
    }, 1400)
    return () => clearTimeout(timer)
  }, [research])
  useEffect(() => {
    if (!active) setDialog(null)
  }, [active])

  function go(next: Page) {
    if (
      assistantMode &&
      next !== "guide" &&
      next !== "confirm" &&
      next !== "industry"
    )
      return
    if (next === "opportunity" && research !== "ready") {
      setToast(
        research === "preparing"
          ? "行业正在准备，请完成后再查看今日商机。"
          : "请先描述产品并确认行业信息。",
      )
      setPage(research === "preparing" ? "industry" : "guide")
      return
    }
    setPage(next)
  }
  function respond(value: string, skip = false) {
    if (!currentPrompt) {
      setPage("confirm")
      return
    }
    if (!value.trim()) {
      setToast("请先输入你的回答，或点击跳过")
      return
    }
    const text = value.trim()
    setBusiness((previous) => ({
      ...previous,
      [currentPrompt.key]: skip
        ? currentPrompt.key === "market"
          ? previous.market
          : ""
        : text,
      ...(currentPrompt.key === "product"
        ? { application: skip ? "" : extractApplication(text) }
        : {}),
    }))
    const next = chatStep + 1
    setMessages((previous) => [
      ...previous,
      { role: "user", text },
      {
        role: "ai",
        text:
          prompts[next]?.text ||
          "关键资料已经整理好了。你可以先确认，也可以继续补充。",
      },
    ])
    setAnswer("")
    setChatStep(next)
    if (next >= prompts.length) setPage("confirm")
  }
  function build() {
    if (!business.product.trim() || !business.application.trim()) {
      setEditing(true)
      setToast("请补充产品和主要应用，其他信息可以稍后填写。")
      return
    }
    setToast("")
    setEditing(false)
    setResearch("preparing")
  }
  function follow(lead: Lead) {
    if (joined(lead.id)) {
      setToast("这家企业已加入跟进，无需重复添加。")
      return
    }
    setFollowups((previous) => [
      ...previous,
      { id: lead.id, joinedAt: new Date().toLocaleString("zh-CN") },
    ])
    setLastFollowed(lead.id)
    setToast("已加入跟进：下一步可查看联系人")
  }
  function contacts(id: string) {
    if (!joined(id)) {
      setToast("请先从今日商机加入跟进")
      return
    }
    setSelectedId(id)
    setPage("contactsPage")
  }
  function reset() {
    setPage("guide")
    setBusiness({ ...initialBusiness, market: initialMarket })
    setChatStep(0)
    setMessages([{ role: "ai", text: prompts[0].text }])
    setAnswer("")
    setQuick(false)
    setQuickProduct("")
    setEditing(false)
    setResearch("idle")
    setFollowups([])
    setSelectedId(leads[0].id)
    setDialog(null)
    setToast("")
    setLastFollowed(null)
  }

  return (
    <div
      className={`onboarding-flow ${assistantMode ? "assistant-flow" : ""}`}
      aria-label={assistantMode ? "行业对话助手" : undefined}
    >
      <div className="app">
        {mode === "guide" && (
          <aside className="side">
            <div className="brand">
              AI <span>Growth</span>
            </div>
            <nav className="nav" aria-label="引导导航">
              {([
                ["guide", "工作台引导"],
                ["industry", "我的行业"],
                ["opportunity", "今日商机"],
                ["followup", "跟进记录"],
              ] as const).map(([target, label]) => (
                <button
                  key={target}
                  className={
                    (
                      target === "guide"
                        ? page === "guide" || page === "confirm"
                        : target === "followup"
                          ? page === "followup" || page === "contactsPage"
                          : page === target
                    )
                      ? "active"
                      : ""
                  }
                  aria-current={
                    (
                      target === "guide"
                        ? page === "guide" || page === "confirm"
                        : target === "followup"
                          ? page === "followup" || page === "contactsPage"
                          : page === target
                    )
                      ? "page"
                      : undefined
                  }
                  onClick={() => go(target)}
                >
                  {label}
                </button>
              ))}
            </nav>
            <div className="hint">
              v1.1
              需求改进项：用户只做业务判断，研究、整理和状态管理由后台完成。
            </div>
          </aside>
        )}
        <main className="main">
          <header className="top">
            <div>
              <div className="eyebrow">
                SALES RADAR · V1.1 INTERACTION PROTOTYPE
              </div>
              <h1 ref={titleRef} tabIndex={-1}>
                {headline[0]}
              </h1>
              <p>{headline[1]}</p>
              {assistantMode && (
                <p
                  className="assistant-session-name"
                  aria-label={`当前会话：${sessionName}`}
                >
                  当前会话：{sessionName}
                </p>
              )}
            </div>
            <div className="flow-header-actions">
              <button className="btn secondary" onClick={reset}>
                重置演示
              </button>
              <button
                className={`btn link ${
                  mode === "modal" ? "guide-modal-close" : ""
                }`}
                aria-label={mode === "modal" ? "关闭快速上手指南" : undefined}
                onClick={onDismiss}
              >
                {mode === "modal" ? (
                  <Icon name="close" size={20} />
                ) : assistantMode ? (
                  "返回我的行业"
                ) : (
                  "返回工作台"
                )}
              </button>
            </div>
          </header>
          <div className="progress" aria-label="流程进度">
            {flowSteps.map((label, index) => (
              <div className="flow-step-group" key={label}>
                <div
                  className={`step ${index + 1 <= step ? "on" : ""}`}
                  aria-current={index + 1 === step ? "step" : undefined}
                >
                  <span className="dot">{index + 1}</span>
                  {label}
                </div>
                {index < flowSteps.length - 1 && (
                  <span className="arrow" aria-hidden="true">
                    →
                  </span>
                )}
              </div>
            ))}
          </div>

          {page === "guide" && (
            <section className="grid" aria-label="对话式行业构建">
              <article className="card">
                <h2>第 1 步：和行业助手聊聊你的业务</h2>
                <p className="muted">
                  用你熟悉的业务语言描述即可，不需要填写技术字段。
                </p>
                <div
                  className="chat"
                  ref={chatRef}
                  role="log"
                  aria-label="行业助手对话"
                  aria-live="polite"
                >
                  {messages.map((message, index) => (
                    <div className={`bubble ${message.role}`} key={index}>
                      {message.text}
                    </div>
                  ))}
                </div>
                {currentPrompt && (
                  <div className="choice-row">
                    {currentPrompt.choices.map((choice) => (
                      <button
                        key={choice}
                        className="choice"
                        onClick={() =>
                          respond(choice, /不确定|稍后|暂时/.test(choice))
                        }
                      >
                        {choice}
                      </button>
                    ))}
                  </div>
                )}
                {currentPrompt ? (
                  <form
                    className="chat-input"
                    onSubmit={(event) => {
                      event.preventDefault()
                      respond(answer)
                    }}
                  >
                    <input
                      aria-label="回答行业助手"
                      placeholder="输入你的回答，或说“不确定”"
                      value={answer}
                      onChange={(event) => setAnswer(event.target.value)}
                      onKeyDown={(event) => {
                        if (
                          event.nativeEvent.isComposing &&
                          event.key === "Enter"
                        )
                          event.preventDefault()
                      }}
                    />
                    <button className="btn" type="submit">
                      发送
                    </button>
                  </form>
                ) : (
                  <div className="actions">
                    <button className="btn" onClick={() => setPage("confirm")}>
                      查看确认信息
                    </button>
                  </div>
                )}
                <div className="actions">
                  {currentPrompt && (
                    <button
                      className="btn secondary"
                      onClick={() =>
                        respond("我暂时不确定，稍后再补充。", true)
                      }
                    >
                      跳过这一项
                    </button>
                  )}
                  <button
                    className="btn secondary"
                    aria-expanded={quick}
                    onClick={() => setQuick(!quick)}
                  >
                    快速填写
                  </button>
                </div>
                {quick && (
                  <form
                    onSubmit={(event) => {
                      event.preventDefault()
                      if (!quickProduct.trim()) {
                        setToast("请先填写产品和主要应用")
                        return
                      }
                      setBusiness((previous) => ({
                        ...previous,
                        product: quickProduct.trim(),
                        application: extractApplication(quickProduct),
                      }))
                      setPage("confirm")
                    }}
                  >
                    <div className="field">
                      <label htmlFor={`${formId}-quick-product`}>
                        产品与应用
                      </label>
                      <textarea
                        id={`${formId}-quick-product`}
                        placeholder="例如：我们生产反光布和反光带，主要用于安全工装。"
                        value={quickProduct}
                        onChange={(event) =>
                          setQuickProduct(event.target.value)
                        }
                      />
                    </div>
                    <button className="btn" type="submit">
                      使用填写内容继续
                    </button>
                  </form>
                )}
              </article>
              <aside className="card">
                <h3>已记录的信息</h3>
                <div className="known">
                  {labels.map(([key, label]) => (
                    <div className="known-row" key={key}>
                      <span>{label}</span>
                      <b>{business[key] || "待补充"}</b>
                    </div>
                  ))}
                </div>
                <div className="notice">
                  {missing.length
                    ? `仍需了解：${missing
                        .slice(0, 2)
                        .map(([, label]) => label)
                        .join("、")}`
                    : "关键行业信息已整理完成"}
                </div>
                <p className="mini">你可以跳过不确定的问题，之后再补充。</p>
              </aside>
            </section>
          )}

          {page === "confirm" && (
            <section className="grid">
              <article className="card">
                <h2>行业构建信息已整理</h2>
                <p className="muted">
                  请确认这些信息是否符合你的业务。确认后才会正式开始准备行业。
                </p>
                <div className="summary">
                  {([
                    ["product", "产品"],
                    ["application", "主要应用"],
                    ...labels.filter(([key]) => key !== "product"),
                  ] as [keyof Business, string][]).map(([key, label]) =>
                    editing ? (
                      <div className="field" key={key}>
                        <label htmlFor={`${formId}-edit-${key}`}>
                          {label}
                          {key === "product" || key === "application"
                            ? "（必填）"
                            : ""}
                        </label>
                        {key === "market" ? (
                          <select
                            id={`${formId}-edit-${key}`}
                            value={business.market}
                            onChange={(event) =>
                              setBusiness((previous) => ({
                                ...previous,
                                market: event.target.value,
                              }))
                            }
                          >
                            {["国内市场", "海外市场", "全球市场"].map(
                              (scope) => (
                                <option key={scope}>{scope}</option>
                              ),
                            )}
                          </select>
                        ) : (
                          <input
                            id={`${formId}-edit-${key}`}
                            value={business[key]}
                            onChange={(event) =>
                              setBusiness((previous) => ({
                                ...previous,
                                [key]: event.target.value,
                              }))
                            }
                          />
                        )}
                      </div>
                    ) : (
                      <p key={key}>
                        <b>{label}：</b>
                        {business[key] || "待补充"}
                      </p>
                    ),
                  )}
                </div>
                <div className="actions">
                  <button
                    className="btn"
                    disabled={research === "preparing"}
                    onClick={build}
                  >
                    {research === "preparing"
                      ? "正在准备行业…"
                      : "确认并开始准备行业"}
                  </button>
                  <button
                    className="btn secondary"
                    disabled={research === "preparing"}
                    onClick={() => setEditing(!editing)}
                  >
                    {editing ? "完成修改" : "修改信息"}
                  </button>
                  <button
                    className="btn secondary"
                    disabled={research === "preparing"}
                    onClick={() => {
                      setChatStep(0)
                      setAnswer(business.product)
                      setMessages((previous) => [
                        ...previous,
                        {
                          role: "ai",
                          text:
                            "可以修改之前的信息，也可以跳过不确定的问题。\n" +
                            prompts[0].text,
                        },
                      ])
                      setPage("guide")
                    }}
                  >
                    继续补充
                  </button>
                </div>
                {research === "preparing" && (
                  <div className="notice success" role="status">
                    {assistantMode
                      ? "已确认行业信息，正在整理本次产品、应用和客户方向。"
                      : "已确认行业信息，正在准备行业认知和首批企业候选。"}
                    <br />
                    当前为演示流程，不会发起真实研究任务。
                  </div>
                )}
              </article>
              <aside className="card">
                <h3>你将得到什么</h3>
                <p className="muted">
                  {assistantMode
                    ? "系统会整理产品应用、目标客户和行业认知。你可以离开页面，准备完成后再回来。"
                    : "系统会整理行业认知、产品应用和首批企业候选。你可以离开页面，准备完成后再回来。"}
                </p>
              </aside>
            </section>
          )}

          {page === "industry" && (
            <section className="grid">
              <article className="card">
                {research === "ready" ? (
                  <>
                    <h2>
                      {assistantMode
                        ? "第 1 步已完成：业务信息已整理"
                        : "第 1 步已完成：行业已建立"}
                    </h2>
                    <p className="muted">
                      {assistantMode
                        ? "本次产品、应用和客户方向已整理为确认信息。当前为演示，不会发起真实研究任务。"
                        : "行业认知已经准备好，接下来查看系统建议优先处理的企业。"}
                    </p>
                    <div className="metric-row">
                      <div className="metric">
                        <span>{assistantMode ? "业务信息" : "行业示例"}</span>
                        <b>{assistantMode ? "已整理" : "反光材料"}</b>
                      </div>
                      <div className="metric">
                        <span>研究状态</span>
                        <b>{assistantMode ? "演示完成" : "可查看"}</b>
                      </div>
                      <div className="metric">
                        <span>{assistantMode ? "研究范围" : "建议先看"}</span>
                        <b>
                          {assistantMode
                            ? business.market
                            : `${leads.length} 家`}
                        </b>
                      </div>
                    </div>
                    <div className="notice success">
                      {assistantMode
                        ? "行业信息整理演示已完成。你可以查看行业认知，或继续完善本次业务信息。"
                        : "行业构建演示完成，你可以进入今日商机。"}
                    </div>
                    <div className="actions">
                      {!assistantMode && (
                        <button
                          className="btn"
                          onClick={() => go("opportunity")}
                        >
                          第 2 步：查看今日商机
                        </button>
                      )}
                      <button
                        className={`btn ${assistantMode ? "" : "secondary"}`}
                        onClick={() => setDialog("knowledge")}
                      >
                        查看行业认知
                      </button>
                      {assistantMode && (
                        <button
                          className="btn secondary"
                          onClick={() => {
                            setResearch("idle")
                            setEditing(true)
                            go("confirm")
                          }}
                        >
                          继续完善行业信息
                        </button>
                      )}
                    </div>
                  </>
                ) : (
                  <>
                    <h2>
                      {research === "preparing"
                        ? "第 1 步进行中：行业正在准备"
                        : "先告诉我们你卖什么"}
                    </h2>
                    <p className="muted">
                      {research === "preparing"
                        ? "已提交产品信息，正在整理行业和产品方向。你可以离开此页面，稍后回来查看。"
                        : "用一句话说明产品和主要应用，再确认你的行业信息。"}
                    </p>
                    {research === "preparing" ? (
                      <div className="notice" role="status">
                        {assistantMode
                          ? "正在整理行业认知（演示）"
                          : "正在准备行业认知和首批企业候选（演示）"}
                      </div>
                    ) : (
                      <div className="actions">
                        <button className="btn" onClick={() => go("guide")}>
                          构建我的行业
                        </button>
                      </div>
                    )}
                  </>
                )}
              </article>
              <aside className="card">
                <h3>{assistantMode ? "本次整理范围" : "后台正在处理"}</h3>
                <p className="muted">
                  {assistantMode
                    ? "仅整理你提供的产品、应用、客户和市场信息，未填写内容保留为待补充。"
                    : "来源整理、证据核验、企业匹配和推荐排序由系统完成。"}
                </p>
                <p className="mini flow-space">
                  当前仅演示流程，不连接真实研究服务。
                </p>
              </aside>
            </section>
          )}

          {!assistantMode && page === "opportunity" && (
            <section className="card">
              <div className="top flow-compact-top">
                <div>
                  <h2>第 2 步：今天建议先处理</h2>
                  <p className="muted">
                    按近期信号、产品适配和资料完整度排列。参考分不代表成交概率。
                  </p>
                </div>
                <span className="tag orange">
                  {leads.length} 家建议优先查看
                </span>
              </div>
              <div className="metric-row">
                <div className="metric">
                  <span>有近期信号</span>
                  <b>{leads.filter((lead) => lead.signal).length}</b>
                </div>
                <div className="metric">
                  <span>高适配待核实</span>
                  <b>{leads.filter((lead) => !lead.signal).length}</b>
                </div>
                <div className="metric">
                  <span>已加入跟进</span>
                  <b>{followups.length}</b>
                </div>
              </div>
              {lastFollowed && (
                <div className="notice success" role="status">
                  已加入跟进，下一步可查看联系人、企业依据和跟进历史。
                  <div className="actions">
                    <button
                      className="btn"
                      onClick={() => contacts(lastFollowed)}
                    >
                      查看联系人
                    </button>
                    <button
                      className="btn secondary"
                      onClick={() => go("followup")}
                    >
                      查看跟进记录
                    </button>
                  </div>
                </div>
              )}
              <div className="lead">
                {leads.map((lead) => (
                  <article className="lead-item" key={lead.id}>
                    <div className="lead-head">
                      <strong>{lead.name}</strong>
                      <span
                        className={`tag ${lead.signal ? "orange" : "green"}`}
                      >
                        {lead.signal ? "优先核实" : "高适配待核实"}
                      </span>
                    </div>
                    <p>
                      <b>为什么推荐：</b>
                      {lead.reason}
                    </p>
                    <p>
                      <b>当前不确定：</b>
                      {lead.uncertainty}
                    </p>
                    <p className="mini">
                      {lead.signal ? "证据：" : ""}
                      {lead.evidence}
                    </p>
                    <div className="lead-actions">
                      <button
                        className="btn secondary"
                        onClick={() => {
                          setSelectedId(lead.id)
                          setDialog("details")
                        }}
                      >
                        查看详情
                      </button>
                      <button
                        className="btn"
                        disabled={joined(lead.id)}
                        onClick={() => follow(lead)}
                      >
                        {joined(lead.id) ? "已加入跟进" : "加入跟进"}
                      </button>
                    </div>
                  </article>
                ))}
              </div>
            </section>
          )}

          {!assistantMode && page === "followup" && (
            <section className="card">
              <div className="top flow-compact-top">
                <div>
                  <h2>第 3 步：跟进记录</h2>
                  <p className="muted">这里保存已交给销售人工处理的企业。</p>
                </div>
                <span className="tag green">已加入 {followups.length} 家</span>
              </div>
              {!followups.length ? (
                <div className="empty">
                  还没有跟进客户。回到今日商机，选择值得人工处理的企业。
                  <div className="actions">
                    <button className="btn" onClick={() => go("opportunity")}>
                      查看今日商机
                    </button>
                  </div>
                </div>
              ) : (
                <div className="lead">
                  {followups.map((item) => {
                    const lead = leads.find((entry) => entry.id === item.id)!
                    return (
                      <article className="lead-item" key={item.id}>
                        <div className="lead-head">
                          <strong>{lead.name}</strong>
                          <span className="tag orange">待跟进</span>
                        </div>
                        <p>
                          加入原因：
                          {lead.signal
                            ? "产品适配 + 近期相关信号"
                            : "高适配，采购需求待核实"}
                        </p>
                        <p className="mini">加入时间：{item.joinedAt}</p>
                        <div className="lead-actions">
                          <button
                            className="btn"
                            onClick={() => contacts(item.id)}
                          >
                            第 4 步：查看联系人
                          </button>
                          <button
                            className="btn secondary"
                            onClick={() => {
                              setSelectedId(item.id)
                              setDialog("history")
                            }}
                          >
                            查看历史
                          </button>
                        </div>
                      </article>
                    )
                  })}
                </div>
              )}
            </section>
          )}

          {!assistantMode && page === "contactsPage" && (
            <section className="grid">
              <article className="card">
                <h2>第 4 步：联系人与联系入口</h2>
                <p className="muted">
                  以下是已登记的入口，不等同于已经确认的采购负责人。
                </p>
                <div className="contact">
                  <strong>{currentLead.name}</strong>
                  {currentLead.id === "traffic" ? (
                    <div className="empty flow-space">
                      暂无已登记联系人。这不代表企业没有联系人，只表示当前示例未提供可用入口。
                      <p className="mini">建议寻找：采购 / 供应商开发职能</p>
                      <div className="actions">
                        <button
                          className="btn secondary"
                          onClick={() => setDialog("details")}
                        >
                          查看企业依据
                        </button>
                      </div>
                    </div>
                  ) : (
                    <>
                      <dl>
                        <dt>姓名</dt>
                        <dd>未确认</dd>
                        <dt>角色</dt>
                        <dd>企业公开入口 · 待核验</dd>
                        <dt>电话</dt>
                        <dd>
                          <a href="tel:01000000000">010-0000-0000</a>
                        </dd>
                        <dt>邮箱</dt>
                        <dd>
                          <a href="mailto:sales@example.com">
                            sales@example.com
                          </a>
                        </dd>
                        <dt>来源</dt>
                        <dd>企业官网 / 授权数据来源</dd>
                        <dt>更新时间</dt>
                        <dd>2026-11-05</dd>
                      </dl>
                      <div className="notice warn">
                        建议人工确认：采购职能、产品规格、供应商准入方式。
                      </div>
                      <p className="mini">
                        电话与邮箱均为演示数据，不是真实客户联系信息。
                      </p>
                    </>
                  )}
                </div>
                <div className="actions">
                  <button
                    className="btn secondary"
                    onClick={() => go("followup")}
                  >
                    返回跟进记录
                  </button>
                  <button
                    className="btn secondary"
                    onClick={() => go("opportunity")}
                  >
                    继续看今日商机
                  </button>
                </div>
              </article>
              <aside className="card">
                <h3>你现在获得了什么</h3>
                <p className="muted">
                  你已经完成从行业构建到客户推荐的销售前流程，可以由销售人工判断是否联系。
                </p>
                <div className="notice success">
                  本期流程到此结束，不自动发送消息或安排跟进。
                </div>
                <button
                  className="btn"
                  onClick={() => onNavigate?.("opportunities")}
                >
                  完成引导，进入工作台
                </button>
              </aside>
            </section>
          )}
          <p className="footer-note">
            {assistantMode
              ? "当前为本地问答演示，信息按本轮回答整理；尚未连接 AI 或真实研究服务，刷新后重置。"
              : "v1.1 原型：技术任务、来源、评分、重试和状态管理由后台处理；用户只看到可理解的提问、结果和下一步。当前为本地交互演示，示例记录不会写入业务工作台，刷新后重置。"}
          </p>
        </main>
      </div>
      {toast && active && (
        <div className="flow-toast" role="status">
          {toast}
        </div>
      )}
      {dialog && active && (
        <GuideDialog
          title={
            dialog === "knowledge"
              ? "行业认知"
              : dialog === "history"
                ? `${currentLead.name} · 跟进历史`
                : currentLead.name
          }
          onClose={() => setDialog(null)}
        >
          {dialog === "knowledge" ? (
            <>
              <div className="summary">
                {Object.entries(business).map(([key, value]) => (
                  <p key={key}>
                    <b>
                      {key === "application"
                        ? "主要应用"
                        : labels.find(([field]) => field === key)?.[1]}
                      ：
                    </b>
                    {value || "待补充"}
                  </p>
                ))}
              </div>
              <div className="notice">
                {assistantMode
                  ? "以上信息来自你在本轮对话中提供的回答，仍需人工确认。当前未连接真实研究服务，不会将未填写的信息补成确定结论。"
                  : "行业示例：反光材料；客户方向示例：防护服制造商、交通设施企业。以上为引导示例，并非对输入内容的真实研究结果。"}
              </div>
              {!assistantMode && (
                <div className="actions">
                  <button
                    className="btn"
                    onClick={() => {
                      setDialog(null)
                      go("opportunity")
                    }}
                  >
                    查看今日商机
                  </button>
                </div>
              )}
            </>
          ) : dialog === "history" ? (
            <div className="summary">
              <p>
                <b>状态：</b>待跟进
              </p>
              <p>
                <b>加入时间：</b>
                {followups.find((item) => item.id === currentLead.id)?.joinedAt}
              </p>
              <p>
                <b>加入原因：</b>
                {currentLead.reason}
              </p>
              <p>尚未记录人工联系，系统不会自动发信或外呼。</p>
            </div>
          ) : (
            <>
              <span
                className={`tag ${currentLead.signal ? "orange" : "green"}`}
              >
                {currentLead.signal ? "优先核实" : "高适配待核实"}
              </span>
              <div className="summary flow-space">
                <p>
                  <b>推荐原因：</b>
                  {currentLead.reason}
                </p>
                <p>
                  <b>当前不确定：</b>
                  {currentLead.uncertainty}
                </p>
                <p>
                  <b>资料依据：</b>
                  {currentLead.evidence}
                </p>
              </div>
              <div className="notice warn">
                适配与信号仅供开发参考，不代表已确认采购需求。当前内容为示例。
              </div>
              <div className="actions">
                {joined(currentLead.id) ? (
                  <button
                    className="btn"
                    onClick={() => {
                      setDialog(null)
                      contacts(currentLead.id)
                    }}
                  >
                    查看联系人
                  </button>
                ) : (
                  <button
                    className="btn"
                    onClick={() => {
                      follow(currentLead)
                      setDialog(null)
                    }}
                  >
                    加入跟进
                  </button>
                )}
              </div>
            </>
          )}
        </GuideDialog>
      )}
    </div>
  )
}
