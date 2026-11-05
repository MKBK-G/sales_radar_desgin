import { useEffect, useRef, useState } from "react"
import { Button, Heading, Icon, Input } from "./ui"
import { industries, type Industry, type IndustryView } from "./industry-data"
import IndustryChat from "./IndustryChat"
import type { Market } from "./regions"
import "./industry.css"

type Props = {
  conversationRequest?: number
  active: boolean
  market: Market
  view: IndustryView
  onViewChange: (view: IndustryView) => void
  onNotify: (text: string) => void
}
export default function IndustryWorkspace({
  conversationRequest = 0,
  active,
  market,
  view,
  onViewChange,
  onNotify,
}: Props) {
  const [selectedId, setSelectedId] = useState("reflective")
  const [chatIndustryId, setChatIndustryId] = useState<string | null>(
    "reflective",
  )
  const [newChatRequest, setNewChatRequest] = useState(0)
  const [search, setSearch] = useState("")
  const [knowledge, setKnowledge] = useState<Industry | null>(null)
  const [knowledgeTab, setKnowledgeTab] = useState(0)
  const dialog = useRef<HTMLDivElement>(null)
  const selected = industries.find((i) => i.id === selectedId) || industries[0]
  const filtered = industries.filter((i) =>
    `${i.name} ${i.description}`
      .toLowerCase()
      .includes(search.trim().toLowerCase()),
  )
  const startChat = (id: string | null = selectedId) => {
    setChatIndustryId(id)
    setKnowledge(null)
    setNewChatRequest((prev) => prev + 1)
    onViewChange("chat")
  }
  useEffect(() => {
    if (conversationRequest > 0) startChat(null)
  }, [conversationRequest])
  useEffect(() => {
    if (!active) setKnowledge(null)
  }, [active])
  useEffect(() => {
    if (!active || !knowledge) return
    const previous = document.activeElement as HTMLElement | null
    const overflow = document.body.style.overflow
    document.body.style.overflow = "hidden"
    dialog.current?.focus()
    const key = (e: KeyboardEvent) => {
      if (e.key === "Escape") setKnowledge(null)
      if (e.key === "Tab") {
        const nodes = dialog.current?.querySelectorAll<HTMLElement>(
          "button:not(:disabled)",
        )
        if (!nodes?.length) return
        if (
          e.shiftKey &&
          (document.activeElement === nodes[0] ||
            document.activeElement === dialog.current)
        ) {
          e.preventDefault()
          nodes[nodes.length - 1].focus()
        } else if (
          !e.shiftKey &&
          document.activeElement === nodes[nodes.length - 1]
        ) {
          e.preventDefault()
          nodes[0].focus()
        }
      }
    }
    window.addEventListener("keydown", key)
    return () => {
      document.body.style.overflow = overflow
      previous?.focus()
      window.removeEventListener("keydown", key)
    }
  }, [active, knowledge])
  return (
    <div className="industry-workspace" hidden={!active}>
      <div
        className="industry-overview industry-view"
        hidden={view !== "overview"}
      >
        <header className="industry-page-heading">
          <div>
            <div className="eyebrow">AI B2B GROWTH ENGINE</div>
            <Heading level={1}>行业空间</Heading>
            <p>描述产品后，AI 自动研究行业并准备首批商机。</p>
          </div>
          <Button variant="primary" onClick={() => startChat(null)}>
            <Icon name="plus" size={16} />
            描述我的产品
          </Button>
        </header>
        <div className="industry-preview-notice">
          <Icon name="help" size={15} />
          <span>
            当前为交互演示：行业认知与对话内容均为示例，未连接真实研究服务。
          </span>
          <span>演示环境</span>
        </div>
        <div className="industry-workflow" aria-label="行业研究流程">
          {["描述产品", "AI 研究与验证", "查看行业认知", "筛选客户与反馈"].map(
            (step, i) => (
              <div key={step}>
                <span className={i === 0 ? "current" : ""}>
                  <span>{i + 1}</span>
                  {step}
                </span>
                {i < 3 && <Icon name="arrow" size={15} />}
              </div>
            ),
          )}
        </div>
        <div className="industry-stat-grid">
          {[
            {
              label: "行业 / 产品总数",
              value: industries.length,
              sub: "逐步沉淀你的研究资产",
              icon: "grid" as const,
              tone: "purple",
            },
            {
              label: "有可用认知",
              value: industries.length,
              sub: "已有保存的行业认知示例",
              icon: "file" as const,
              tone: "green",
            },
            {
              label: "研究进行中",
              value: 0,
              sub: "当前没有执行中的研究任务",
              icon: "clock" as const,
              tone: "blue",
            },
            {
              label: "研究需处理",
              value: industries.filter((i) => i.researchStatus === "failed")
                .length,
              sub: "最近研究任务失败，认知仍可查看",
              icon: "help" as const,
              tone: "orange",
            },
          ].map((item) => (
            <article className="industry-stat" key={item.label}>
              <div>
                <span>{item.label}</span>
                <span className={`industry-stat-icon ${item.tone}`}>
                  <Icon name={item.icon} size={17} />
                </span>
              </div>
              <strong>{item.value}</strong>
              <p>{item.sub}</p>
            </article>
          ))}
        </div>
        <div className="industry-overview-grid">
          <section className="industry-list-panel">
            <div className="industry-list-heading">
              <div>
                <Heading level={2}>我的行业</Heading>
                <span>{industries.length} 个行业</span>
              </div>
              <div className="industry-list-search">
                <Icon name="search" size={15} />
                <Input
                  aria-label="搜索产品或行业"
                  placeholder="搜索产品 / 行业"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
            </div>
            <div className="industry-table-scroll">
              <table className="industry-table">
                <thead>
                  <tr>
                    <th>产品 / 行业</th>
                    <th>市场范围</th>
                    <th>最近研究</th>
                    <th>行业认知</th>
                    <th>最近更新</th>
                    <th>关键应用场景</th>
                    <th>操作</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((item) => (
                    <tr
                      key={item.id}
                      className={selectedId === item.id ? "selected" : ""}
                      data-industry={item.id}
                    >
                      <td>
                        <Button
                          variant="ghost"
                          className="industry-name-button"
                          aria-label={`选择行业：${item.name}`}
                          aria-pressed={selectedId === item.id}
                          onClick={() => setSelectedId(item.id)}
                        >
                          <span
                            className={`industry-row-icon ${
                              item.id === "printing"
                                ? "blue"
                                : item.id === "fabric"
                                  ? "orange"
                                  : "purple"
                            }`}
                          >
                            <Icon
                              name={
                                item.id === "printing" ? "grid" : "briefcase"
                              }
                              size={18}
                            />
                          </span>
                          <span>
                            <strong>{item.name}</strong>
                            <span>{item.description}</span>
                          </span>
                        </Button>
                      </td>
                      <td>
                        <span className="industry-market-tag">
                          {item.market === "domestic" ? "国内市场" : "海外市场"}
                        </span>
                      </td>
                      <td>
                        <span
                          className={`industry-status-tag ${
                            item.researchStatus === "failed"
                              ? "warning"
                              : "success"
                          }`}
                        >
                          <i />
                          {item.researchStatus === "failed"
                            ? "任务失败"
                            : "研究完成"}
                        </span>
                      </td>
                      <td>
                        <span className="industry-available">
                          <Icon name="check" size={12} />
                          可查看
                        </span>
                      </td>
                      <td>
                        <time>{item.updatedAt}</time>
                      </td>
                      <td>
                        <span
                          className="industry-applications-preview"
                          title={item.applications.join("、")}
                        >
                          {item.applications.join("、")}
                        </span>
                      </td>
                      <td>
                        <Button
                          className="industry-knowledge-button"
                          onClick={() => {
                            setKnowledge(item)
                            setKnowledgeTab(0)
                          }}
                        >
                          查看行业认知
                          <Icon name="arrow" size={13} />
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {filtered.length === 0 && (
                <div className="industry-empty">
                  <Icon name="search" size={26} />
                  <Heading level={3}>没有找到匹配的行业</Heading>
                  <p>调整关键词，或从一句话开始描述新的产品。</p>
                  <Button onClick={() => setSearch("")}>清除搜索</Button>
                </div>
              )}
            </div>
            <div className="industry-list-footer">
              <span>
                <Icon name="pin" size={12} />
                当前选择：{selected.shortName}
              </span>
              <span>行业认知与最近任务状态分别保留</span>
            </div>
          </section>
          <aside className="industry-conversation-card">
            <span className="industry-conversation-icon">
              <Icon name="message" size={24} />
            </span>
            <div className="industry-card-eyebrow">
              START WITH A CONVERSATION
            </div>
            <Heading level={2}>从一句话开始</Heading>
            <p>描述你们擅长的产品，逐步明确应用场景、目标客户和市场方向。</p>
            <div className="industry-conversation-topics">
              <span>
                <Icon name="check" size={12} />
                说清产品与业务优势
              </span>
              <span>
                <Icon name="check" size={12} />
                梳理行业与目标客户
              </span>
              <span>
                <Icon name="check" size={12} />
                补充信息，完善研究方向
              </span>
            </div>
            <Button variant="primary" onClick={() => startChat()}>
              业务对话
              <Icon name="arrow" size={15} />
            </Button>
            <div className="industry-conversation-context">
              <span>本次对话将围绕</span>
              <strong>{selected.shortName}</strong>
              <span>
                {selected.market === "domestic" ? "国内市场" : "海外市场"}
              </span>
            </div>
          </aside>
        </div>
        <p className="industry-overview-footnote">
          <Icon name="file" size={13} />
          研究不是一次性的报告，而是持续积累的业务认知。
        </p>
      </div>
      <div
        className="industry-view industry-chat-host"
        hidden={view !== "chat"}
      >
        <IndustryChat
          active={active && view === "chat"}
          industry={industries.find((i) => i.id === chatIndustryId)}
          market={market}
          newChatRequest={newChatRequest}
          onBack={() => onViewChange("overview")}
          onNotify={onNotify}
        />
      </div>
      {knowledge && active && view === "overview" && (
        <div className="knowledge-backdrop" onClick={() => setKnowledge(null)}>
          <section
            className="knowledge-drawer"
            role="dialog"
            aria-modal="true"
            aria-labelledby="industry-knowledge-title"
            tabIndex={-1}
            ref={dialog}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="knowledge-heading">
              <div>
                <span>
                  <Icon name="file" size={14} />
                  行业认知 · 示例
                </span>
                <Heading level={2}>
                  <span id="industry-knowledge-title">{knowledge.name}</span>
                </Heading>
                <p>
                  {knowledge.market === "domestic" ? "国内市场" : "海外市场"}
                  <i />
                  最近认知更新 {knowledge.updatedAt}
                </p>
              </div>
              <Button
                variant="ghost"
                className="icon-button"
                aria-label="关闭行业认知"
                onClick={() => setKnowledge(null)}
              >
                <Icon name="close" size={20} />
              </Button>
            </div>
            {knowledge.researchStatus === "failed" && (
              <div className="knowledge-warning">
                <Icon name="help" size={16} />
                <p>
                  最近一次研究任务失败。以下为已保存的认知示例，不代表失败任务已恢复。
                </p>
              </div>
            )}
            <div
              className="knowledge-tabs"
              role="tablist"
              aria-label="行业认知分类"
            >
              {["行业概览", "客户画像", "应用场景"].map((label, index) => (
                <Button
                  key={label}
                  variant="ghost"
                  role="tab"
                  aria-selected={knowledgeTab === index}
                  className={knowledgeTab === index ? "selected" : ""}
                  onClick={() => setKnowledgeTab(index)}
                >
                  {label}
                </Button>
              ))}
            </div>
            <div className="knowledge-body" role="tabpanel">
              {knowledgeTab === 0 ? (
                <>
                  <div className="knowledge-summary">
                    <Icon name="sparkles" size={20} />
                    <div>
                      <Heading level={3}>先理解产品，再明确开发方向</Heading>
                      <p>{knowledge.description}</p>
                    </div>
                  </div>
                  <Heading level={3}>建议关注的开发方向</Heading>
                  <div className="knowledge-directions">
                    {knowledge.opportunities.map((text, i) => (
                      <article key={text}>
                        <span>0{i + 1}</span>
                        <div>
                          <strong>{text}</strong>
                          <p>
                            实际研究需结合产品资料、已有客户和可靠来源进一步核实。
                          </p>
                        </div>
                      </article>
                    ))}
                  </div>
                </>
              ) : knowledgeTab === 1 ? (
                <>
                  <Heading level={3}>目标客户类型</Heading>
                  <p className="knowledge-intro">
                    按应用需求区分客户，采购意向与具体联系人仍需核实。
                  </p>
                  {knowledge.customers.map((name, i) => (
                    <article className="knowledge-customer" key={name}>
                      <span className="purple">
                        <Icon name="building" size={20} />
                      </span>
                      <div>
                        <Heading level={3}>{name}</Heading>
                        <p>
                          {
                            [
                              "重点确认产品规格与质量要求",
                              "进一步了解采购流程与决策角色",
                              "核实使用环境与服务支持需求",
                              "确认渠道覆盖和订单模式",
                            ][i % 4]
                          }
                        </p>
                      </div>
                    </article>
                  ))}
                </>
              ) : (
                <>
                  <Heading level={3}>关键应用场景</Heading>
                  <p className="knowledge-intro">
                    从使用场景反推性能要求与目标客户。
                  </p>
                  <div className="knowledge-application-grid">
                    {knowledge.applications.map((name, i) => (
                      <article key={name}>
                        <span>场景 {String(i + 1).padStart(2, "0")}</span>
                        <Heading level={3}>{name}</Heading>
                        <p>需进一步确认实际用途、加工条件和验收标准。</p>
                      </article>
                    ))}
                  </div>
                </>
              )}
              <div className="knowledge-data-note">
                <Icon name="help" size={14} />
                <span>
                  此处为静态认知示例，未执行真实研究、引用核验或客户推荐。
                </span>
              </div>
            </div>
            <footer className="knowledge-footer">
              <Button onClick={() => setKnowledge(null)}>关闭</Button>
              <Button variant="primary" onClick={() => startChat(knowledge.id)}>
                <Icon name="message" size={15} />
                围绕该行业对话
              </Button>
            </footer>
          </section>
        </div>
      )}
    </div>
  )
}
