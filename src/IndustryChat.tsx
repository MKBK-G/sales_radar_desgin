import {
  useEffect,
  useRef,
  useState,
  type ChangeEvent,
  type ReactNode,
} from "react"
import { Button, Heading, Icon, Input, Textarea } from "./ui"
import {
  exampleConversations,
  industries,
  makeDemoReply,
  type ChatAttachment,
  type ChatMessage,
  type Conversation,
  type Industry,
} from "./industry-data"
import type { Market } from "./regions"

type Props = {
  active: boolean
  industry?: Industry
  market: Market
  newChatRequest: number
  onBack: () => void
  onNotify: (text: string) => void
}
function inlineText(text: string): ReactNode {
  return text
    .split(/(\*\*[^*]+\*\*)/g)
    .map((part, i) =>
      part.startsWith("**") ? (
        <strong key={i}>{part.slice(2, -2)}</strong>
      ) : (
        part
      ),
    )
}
function MessageContent({ content }: { content: string }) {
  return (
    <div className="chat-markdown">
      {content.split("\n").map((line, i) =>
        line.startsWith("### ") ? (
          <Heading key={i} level={3}>
            {line.slice(4)}
          </Heading>
        ) : line.startsWith("- ") ? (
          <div key={i} className="chat-list-line">
            <span />
            {inlineText(line.slice(2))}
          </div>
        ) : line ? (
          <p key={i}>{inlineText(line)}</p>
        ) : (
          <div key={i} className="chat-paragraph-gap" />
        ),
      )}
    </div>
  )
}
export default function IndustryChat({
  active,
  industry,
  market,
  newChatRequest,
  onBack,
  onNotify,
}: Props) {
  const [conversations, setConversations] =
    useState<Conversation[]>(exampleConversations)
  const [currentId, setCurrentId] = useState<string | null>(null)
  const [draft, setDraft] = useState("")
  const [historyOpen, setHistoryOpen] = useState(
    () => window.matchMedia("(min-width: 1000px)").matches,
  )
  const [historySearch, setHistorySearch] = useState(false)
  const [historyQuery, setHistoryQuery] = useState("")
  const [files, setFiles] = useState<ChatAttachment[]>([])
  const [generation, setGeneration] = useState<{
    id: string
    conversationId: string
    content: string
  } | null>(null)
  const fileInput = useRef<HTMLInputElement>(null)
  const input = useRef<HTMLTextAreaElement>(null)
  const scrollArea = useRef<HTMLDivElement>(null)
  const timer = useRef<ReturnType<typeof setInterval> | null>(null)
  const current = conversations.find((c) => c.id === currentId)
  const currentIndustry = current
    ? industries.find((i) => i.id === current.industryId)
    : industry
  const messages = current?.messages || []
  const isGenerating = generation !== null
  const visibleConversations = conversations.filter((c) =>
    `${c.title} ${c.messages.map((m) => m.content).join(" ")}`
      .toLowerCase()
      .includes(historyQuery.trim().toLowerCase()),
  )
  const stop = () => {
    if (timer.current) clearInterval(timer.current)
    timer.current = null
    if (generation)
      setConversations((prev) =>
        prev.map((c) =>
          c.id === generation.conversationId
            ? {
                ...c,
                messages: c.messages.map((m) =>
                  m.id === generation.id
                    ? {
                        ...m,
                        stopped: true,
                        content: m.content || "已停止本次演示回复。",
                      }
                    : m,
                ),
              }
            : c,
        ),
      )
    setGeneration(null)
  }
  const newConversation = () => {
    stop()
    setCurrentId(null)
    setDraft("")
    setFiles([])
    setHistoryQuery("")
    if (window.innerWidth < 1000) setHistoryOpen(false)
    requestAnimationFrame(() => input.current?.focus())
  }
  useEffect(() => {
    if (newChatRequest > 0) newConversation()
  }, [newChatRequest])
  useEffect(() => {
    const media = window.matchMedia("(min-width: 1000px)")
    const change = () => setHistoryOpen(media.matches)
    media.addEventListener("change", change)
    return () => media.removeEventListener("change", change)
  }, [])
  useEffect(() => {
    if (!generation) return
    let length = 0
    timer.current = setInterval(() => {
      length = Math.min(length + 24, generation.content.length)
      const text = generation.content.slice(0, length)
      setConversations((prev) =>
        prev.map((c) =>
          c.id === generation.conversationId
            ? {
                ...c,
                messages: c.messages.map((m) =>
                  m.id === generation.id ? { ...m, content: text } : m,
                ),
              }
            : c,
        ),
      )
      if (length >= generation.content.length) {
        if (timer.current) clearInterval(timer.current)
        timer.current = null
        setGeneration(null)
      }
    }, 25)
    return () => {
      if (timer.current) clearInterval(timer.current)
      timer.current = null
    }
  }, [generation])
  useEffect(() => {
    if (!active && generation) stop()
  }, [active])
  useEffect(() => {
    if (active && scrollArea.current)
      scrollArea.current.scrollTop = scrollArea.current.scrollHeight
  }, [messages, active])
  function sendMessage() {
    const text = draft.trim()
    if (!text || isGenerating) return
    const conversationId = currentId || `conversation-${Date.now()}`
    const user: ChatMessage = {
      id: `user-${Date.now()}`,
      role: "user",
      content: text,
      attachments: files.length ? files : undefined,
    }
    const reply = makeDemoReply(
      text,
      currentIndustry,
      currentIndustry?.market || market,
      files,
    )
    const assistant: ChatMessage = {
      id: `assistant-${Date.now()}`,
      role: "assistant",
      content: "",
    }
    if (currentId)
      setConversations((prev) =>
        prev.map((c) =>
          c.id === currentId
            ? { ...c, messages: [...c.messages, user, assistant] }
            : c,
        ),
      )
    else {
      setConversations((prev) => [
        {
          id: conversationId,
          title: text.slice(0, 22),
          industryId: industry?.id || null,
          messages: [user, assistant],
        },
        ...prev,
      ])
      setCurrentId(conversationId)
    }
    setDraft("")
    setFiles([])
    setGeneration({ id: assistant.id, conversationId, content: reply.content })
    requestAnimationFrame(() => input.current?.focus())
  }
  const regenerate = (message: ChatMessage) => {
    if (!current || isGenerating) return
    const index = current.messages.findIndex((m) => m.id === message.id)
    const user = current.messages
      .slice(0, index)
      .reverse()
      .find((m) => m.role === "user")
    if (!user) return
    const reply = makeDemoReply(
      user.content,
      currentIndustry,
      currentIndustry?.market || market,
      user.attachments || [],
    )
    setConversations((prev) =>
      prev.map((c) =>
        c.id === currentId
          ? {
              ...c,
              messages: c.messages.map((m) =>
                m.id === message.id
                  ? {
                      ...m,
                      content: "",
                      stopped: false,
                    }
                  : m,
              ),
            }
          : c,
      ),
    )
    setGeneration({
      id: message.id,
      conversationId: current.id,
      content: reply.content,
    })
  }
  const feedback = (messageId: string, value: "positive" | "negative") =>
    setConversations((prev) =>
      prev.map((c) =>
        c.id === currentId
          ? {
              ...c,
              messages: c.messages.map((m) =>
                m.id === messageId
                  ? { ...m, feedback: m.feedback === value ? null : value }
                  : m,
              ),
            }
          : c,
      ),
    )
  async function attach(event: ChangeEvent<HTMLInputElement>) {
    const selected = Array.from(event.target.files || [])
    const allowed = selected.filter((file) => file.size <= 5 * 1024 * 1024)
    if (allowed.length !== selected.length) onNotify("单个附件不能超过 5 MB")
    const next = [
      ...files,
      ...allowed.map((file, i) => ({
        id: `file-${Date.now()}-${i}`,
        name: file.name,
        size: file.size,
      })),
    ].slice(0, 3)
    setFiles(next)
    if (files.length + allowed.length > 3) onNotify("每条消息最多选择 3 个附件")
    event.target.value = ""
  }
  const composer = (
    <div className="chat-composer-container">
      <div className="chat-composer">
        {files.length > 0 && (
          <div className="chat-attachments">
            {files.map((f) => (
              <div key={f.id}>
                <Icon name="file" size={17} />
                <span>
                  {f.name}
                  <small>
                    {Math.max(1, Math.round(f.size / 1024))} KB · 本地预览
                  </small>
                </span>
                <Button
                  variant="ghost"
                  aria-label={`移除附件：${f.name}`}
                  onClick={() =>
                    setFiles((prev) => prev.filter((item) => item.id !== f.id))
                  }
                >
                  <Icon name="close" size={12} />
                </Button>
              </div>
            ))}
          </div>
        )}
        <Textarea
          ref={input}
          aria-label="描述你的产品和业务"
          placeholder="介绍你的产品、应用场景或目标客户，知道多少先说多少…"
          rows={messages.length ? 2 : 3}
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={(e) => {
            if (
              e.key === "Enter" &&
              !e.shiftKey &&
              !e.nativeEvent.isComposing
            ) {
              e.preventDefault()
              sendMessage()
            }
          }}
        />
        <div className="chat-composer-toolbar">
          <div>
            <Button
              variant="ghost"
              className="chat-attach-button"
              aria-label="选择本地附件"
              title="仅展示附件，不上传或解析内容"
              disabled={isGenerating}
              onClick={() => fileInput.current?.click()}
            >
              <Icon name="paperclip" size={19} />
            </Button>
            {isGenerating ? (
              <Button
                className="chat-send-button stop"
                aria-label="停止演示回复"
                onClick={stop}
              >
                <Icon name="stop" size={15} />
              </Button>
            ) : (
              <Button
                className="chat-send-button"
                aria-label="发送消息"
                disabled={!draft.trim()}
                onClick={sendMessage}
              >
                <Icon name="send" size={18} />
              </Button>
            )}
          </div>
        </div>
        <Input
          ref={fileInput}
          type="file"
          multiple
          accept=".txt,.md,.csv,.pdf,.doc,.docx,.xls,.xlsx,.png,.jpg,.jpeg"
          hidden
          onChange={attach}
        />
      </div>
    </div>
  )
  return (
    <div
      className={`industry-chat ${
        historyOpen ? "history-visible" : "history-hidden"
      }`}
    >
      {historyOpen && (
        <>
          <div
            className="chat-history-backdrop"
            onClick={() => setHistoryOpen(false)}
          />
          <aside className="chat-history-panel" aria-label="历史对话">
            <div className="chat-history-brand">
              <div>
                行业研究助手<small>你的业务思考伙伴</small>
              </div>
              <Button
                variant="ghost"
                className="icon-button"
                aria-label="收起历史对话"
                onClick={() => setHistoryOpen(false)}
              >
                <Icon name="panel" size={16} />
              </Button>
            </div>
            <Button
              variant="ghost"
              className="new-chat-button"
              onClick={newConversation}
            >
              <Icon name="plus" size={16} />
              开启新对话
            </Button>
            <div className="chat-history-label">
              <span>历史对话</span>
              <Button
                variant="ghost"
                className="icon-button"
                aria-label="搜索历史对话"
                aria-expanded={historySearch}
                onClick={() => setHistorySearch(!historySearch)}
              >
                <Icon name="search" size={14} />
              </Button>
            </div>
            {historySearch && (
              <div className="chat-history-search">
                <Input
                  aria-label="搜索对话内容"
                  placeholder="搜索对话…"
                  value={historyQuery}
                  onChange={(e) => setHistoryQuery(e.target.value)}
                />
              </div>
            )}
            <div className="chat-history-list">
              {[false, true].map((example) => {
                const group = visibleConversations.filter(
                  (c) => !!c.example === example,
                )
                return group.length > 0 ? (
                  <div key={String(example)}>
                    <div className="chat-history-group">
                      {example ? "示例对话" : "今天"}
                    </div>
                    {group.map((c) => (
                      <div
                        key={c.id}
                        className={`chat-history-item ${
                          currentId === c.id ? "selected" : ""
                        }`}
                      >
                        <Button
                          variant="ghost"
                          onClick={() => {
                            setCurrentId(c.id)
                            setDraft("")
                            setFiles([])
                            if (window.innerWidth < 1000) setHistoryOpen(false)
                          }}
                        >
                          {c.title}
                        </Button>
                        <Button
                          variant="ghost"
                          aria-label={`删除对话：${c.title}`}
                          className="delete-chat"
                          onClick={() => {
                            if (generation?.conversationId === c.id) stop()
                            setConversations((prev) =>
                              prev.filter((item) => item.id !== c.id),
                            )
                            if (currentId === c.id) setCurrentId(null)
                          }}
                        >
                          <Icon name="trash" size={13} />
                        </Button>
                      </div>
                    ))}
                  </div>
                ) : null
              })}
              {!visibleConversations.length && (
                <p className="chat-history-empty">没有找到匹配的对话</p>
              )}
            </div>
            <div className="chat-history-footer">
              <Icon name="file" size={15} />
              <span>
                行业认知，来自每一次沟通
                <small>示例内容不代表实际研究结果</small>
              </span>
            </div>
          </aside>
        </>
      )}
      <section
        className={`industry-chat-main ${
          messages.length ? "has-messages" : "empty"
        }`}
        aria-label="行业助手聊天界面"
      >
        <header className="chat-topbar">
          <div>
            {!historyOpen && (
              <Button
                variant="ghost"
                className="icon-button"
                aria-label="展开历史对话"
                onClick={() => setHistoryOpen(true)}
              >
                <Icon name="panel" size={19} />
              </Button>
            )}
            <Button variant="ghost" className="chat-back" onClick={onBack}>
              <Icon name="arrow" className="rotate" size={15} />
              我的行业
            </Button>
            <span className="chat-header-divider" />
            <span className="chat-header-title">行业研究助手</span>
          </div>
          <div>
            <span
              className="chat-context-badge"
              title={current?.title || "新会话"}
              aria-label={`当前会话：${current?.title || "新会话"}`}
            >
              {current?.title || "新会话"}
            </span>
            <span className="chat-preview-badge">界面演示</span>
          </div>
        </header>
        {messages.length === 0 ? (
          <div className="chat-empty-stage">
            <div className="chat-welcome">
              <div className="chat-welcome-title">
                <Heading level={1}>你好，聊聊你的产品和业务</Heading>
              </div>
              <p>从一句话开始，逐步梳理产品、市场和目标客户。</p>
            </div>
            {composer}
            <div className="chat-suggestions">
              {[
                {
                  icon: "briefcase" as const,
                  label: "介绍我的产品",
                  text: `我们主要生产${industry?.shortName || "工业产品"}，想梳理产品定位和目标客户。`,
                },
                {
                  icon: "users" as const,
                  label: "梳理目标客户",
                  text: `${industry?.shortName || "我们的产品"}应该优先开发哪些客户？`,
                },
                {
                  icon: "grid" as const,
                  label: "寻找应用场景",
                  text: `帮我梳理${industry?.shortName || "产品"}的主要应用场景。`,
                },
                {
                  icon: "globe" as const,
                  label: "讨论目标市场",
                  text: `如何选择${industry?.shortName || "产品"}的目标市场和开发地区？`,
                },
              ].map((s) => (
                <Button
                  key={s.label}
                  variant="ghost"
                  onClick={() => {
                    setDraft(s.text)
                    input.current?.focus()
                  }}
                >
                  <Icon name={s.icon} size={14} />
                  {s.label}
                  <Icon name="arrow" size={12} />
                </Button>
              ))}
            </div>
          </div>
        ) : (
          <>
            <div className="chat-thread-scroll" ref={scrollArea}>
              <div
                className="chat-thread"
                role="log"
                aria-label="对话消息"
                aria-live="polite"
              >
                {current?.example && (
                  <div className="example-conversation-notice">
                    <Icon name="help" size={13} />
                    这是一段示例对话，内容仅用于界面演示。
                  </div>
                )}
                {messages.map((message, index) => (
                  <article
                    key={message.id}
                    className={`chat-message ${message.role}`}
                  >
                    <div className="chat-message-avatar">
                      {message.role === "assistant" ? (
                        <Icon name="sparkles" size={21} />
                      ) : (
                        <span>张</span>
                      )}
                    </div>
                    <div className="chat-message-content">
                      {message.role === "assistant" && (
                        <div className="chat-assistant-label">
                          行业研究助手<span>演示回复</span>
                        </div>
                      )}
                      {message.attachments && (
                        <div className="message-attachments">
                          {message.attachments.map((f) => (
                            <span key={f.id}>
                              <Icon name="file" size={13} />
                              {f.name}
                            </span>
                          ))}
                        </div>
                      )}
                      {message.content ? (
                        <MessageContent content={message.content} />
                      ) : (
                        <div className="demo-typing">
                          <span />
                          <span />
                          <span />
                          <span>正在生成演示回复</span>
                        </div>
                      )}
                      {message.stopped && (
                        <span className="chat-stopped">已停止生成</span>
                      )}
                      {message.role === "assistant" &&
                        generation?.id !== message.id && (
                          <div className="chat-message-actions">
                            <Button
                              variant="ghost"
                              aria-label="复制回复"
                              onClick={async () => {
                                try {
                                  if (!navigator.clipboard)
                                    throw new Error("unavailable")
                                  await navigator.clipboard.writeText(
                                    message.content,
                                  )
                                  onNotify("回复已复制")
                                } catch {
                                  onNotify("当前环境无法复制，请手动选择文本")
                                }
                              }}
                            >
                              <Icon name="copy" size={15} />
                            </Button>
                            <Button
                              variant="ghost"
                              aria-label="认可回复"
                              aria-pressed={message.feedback === "positive"}
                              className={
                                message.feedback === "positive"
                                  ? "selected"
                                  : ""
                              }
                              onClick={() => feedback(message.id, "positive")}
                            >
                              <Icon name="thumbUp" size={15} />
                            </Button>
                            <Button
                              variant="ghost"
                              aria-label="不认可回复"
                              aria-pressed={message.feedback === "negative"}
                              className={
                                message.feedback === "negative"
                                  ? "selected"
                                  : ""
                              }
                              onClick={() => feedback(message.id, "negative")}
                            >
                              <Icon name="thumbDown" size={15} />
                            </Button>
                            {index === messages.length - 1 && (
                              <Button
                                variant="ghost"
                                aria-label="重新生成演示回复"
                                disabled={isGenerating}
                                onClick={() => regenerate(message)}
                              >
                                <Icon name="history" size={15} />
                              </Button>
                            )}
                          </div>
                        )}
                    </div>
                  </article>
                ))}
              </div>
            </div>
            <div className="chat-bottom-composer">{composer}</div>
          </>
        )}
      </section>
    </div>
  )
}
