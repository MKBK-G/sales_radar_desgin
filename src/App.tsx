import { useEffect, useRef, useState } from "react"
import {
  Button,
  Heading,
  Icon,
  Input,
  Select,
  Textarea,
  type IconName,
} from "./ui"
import Opportunities from "./Opportunities"
import EntryScreen from "./EntryScreen"
import type { GuideDestination } from "./QuickStartGuide"
import QuickStartModal from "./QuickStartModal"
import "./sidebar.css"
import IndustryWorkspace from "./IndustryWorkspace"
import type { IndustryView } from "./industry-data"
import { seedGeography, type Geography, type Market } from "./regions"
import { Evaluation, StarButton } from "./CustomerControls"
import {
  CompanyTags,
  DevelopmentScore,
  MaturityBadge,
  SignalChips,
  TagEditor,
  createOpportunityProfile,
  type OpportunityProfile,
} from "./OpportunityFields"

export type Company = OpportunityProfile & {
  name: string
  short: string
  industry: string
  location: string
  status: string
  result: string
  score: number
  color: string
  customerType: "new" | "existing"
  discoveredAt: string
  followed: boolean
  joinedAt: string | null
  starred: boolean
  feedback: "positive" | "negative" | null
  rating: number | null
  geography: Geography
  scoreDelta: number
}
type RecordItem = {
  id: number
  date: string
  time: string
  person: string
  method: string
  title: string
  content: string
  next?: string
}
const initialCompanies: Company[] = [
  {
    name: "冠荣控股（广东）有限公司",
    short: "冠荣",
    industry: "新材料 · 制造业",
    location: "广东 · 广州",
    status: "跟进中",
    result: "需求已确认",
    score: 86,
    color: "purple",
  },
  {
    name: "道明光学股份有限公司",
    short: "道明",
    industry: "反光材料",
    location: "浙江 · 金华",
    status: "跟进中",
    result: "已联系",
    score: 82,
    color: "blue",
  },
  {
    name: "新乡市鑫迪防护发展有限公司",
    short: "鑫迪",
    industry: "安全防护",
    location: "河南 · 新乡",
    status: "待跟进",
    result: "已加入跟进",
    score: 90,
    color: "orange",
  },
  {
    name: "扬州顺达新材料有限公司",
    short: "顺达",
    industry: "新材料",
    location: "江苏 · 扬州",
    status: "待跟进",
    result: "已加入跟进",
    score: 76,
    color: "green",
  },
  {
    name: "新乡市艾长防护服装有限公司",
    short: "艾长",
    industry: "防护服装",
    location: "河南 · 新乡",
    status: "待跟进",
    result: "已加入跟进",
    score: 81,
    color: "purple",
  },
  {
    name: "江苏卡思迪莱服饰有限公司",
    short: "卡思",
    industry: "服装制造",
    location: "江苏 · 南京",
    status: "跟进中",
    result: "已发送方案",
    score: 85,
    color: "blue",
  },
  {
    name: "湖南新裕新材料有限公司",
    short: "新裕",
    industry: "新材料",
    location: "湖南 · 长沙",
    status: "待跟进",
    result: "已加入跟进",
    score: 73,
    color: "orange",
  },
  {
    name: "安徽亨安防护科技有限公司",
    short: "亨安",
    industry: "安全防护",
    location: "安徽 · 合肥",
    status: "已完成",
    result: "已成交",
    score: 88,
    color: "green",
  },
  {
    name: "辽宁通达科技项目管理有限公司",
    short: "通达",
    industry: "商务服务",
    location: "辽宁 · 沈阳",
    status: "跟进中",
    result: "已联系",
    score: 78,
    color: "purple",
  },
  {
    name: "佛山市荣兴商贸有限公司",
    short: "荣兴",
    industry: "批发零售",
    location: "广东 · 佛山",
    status: "已完成",
    result: "暂不推进",
    score: 62,
    color: "blue",
  },
  {
    name: "浙江星华新材料集团股份有限公司",
    short: "星华",
    industry: "反光材料",
    location: "浙江 · 杭州",
    status: "未跟进",
    result: "尚未加入跟进",
    score: 95,
    color: "purple",
  },
  {
    name: "鹤壁市反光材料有限公司",
    short: "鹤壁",
    industry: "功能性薄膜",
    location: "河南 · 鹤壁",
    status: "未跟进",
    result: "尚未加入跟进",
    score: 91,
    color: "blue",
  },
  {
    name: "青岛瑞安防护科技有限公司",
    short: "瑞安",
    industry: "安全防护",
    location: "山东 · 青岛",
    status: "未跟进",
    result: "尚未加入跟进",
    score: 87,
    color: "green",
  },
  {
    name: "苏州明辉光学科技有限公司",
    short: "明辉",
    industry: "光学材料",
    location: "江苏 · 苏州",
    status: "未跟进",
    result: "尚未加入跟进",
    score: 84,
    color: "orange",
  },
  {
    name: "3M Deutschland GmbH",
    short: "3M",
    industry: "反光材料",
    location: "德国 · 诺伊斯",
    status: "未跟进",
    result: "尚未加入跟进",
    score: 94,
    color: "purple",
  },
  {
    name: "REFLOACTIVE Sp. z o.o.",
    short: "RF",
    industry: "安全防护",
    location: "波兰 · 华沙",
    status: "待跟进",
    result: "已加入跟进",
    score: 88,
    color: "blue",
  },
  {
    name: "Safety First UK Ltd",
    short: "SF",
    industry: "安全防护",
    location: "英国 · 伯明翰",
    status: "未跟进",
    result: "尚未加入跟进",
    score: 86,
    color: "green",
  },
  {
    name: "ORAFOL Europe GmbH",
    short: "OR",
    industry: "反光材料",
    location: "德国 · 奥拉宁堡",
    status: "未跟进",
    result: "尚未加入跟进",
    score: 93,
    color: "orange",
  },
  {
    name: "Reflective Apparel Inc.",
    short: "RA",
    industry: "服装制造",
    location: "美国 · 亚特兰大",
    status: "未跟进",
    result: "尚未加入跟进",
    score: 89,
    color: "purple",
  },
  {
    name: "SafeGuard Canada Ltd",
    short: "SG",
    industry: "安全防护",
    location: "加拿大 · 多伦多",
    status: "未跟进",
    result: "尚未加入跟进",
    score: 82,
    color: "blue",
  },
  {
    name: "Nippon Safety Materials Co.",
    short: "NS",
    industry: "新材料",
    location: "日本 · 大阪",
    status: "未跟进",
    result: "尚未加入跟进",
    score: 85,
    color: "orange",
  },
  {
    name: "Seoul Reflective Co.",
    short: "SR",
    industry: "反光材料",
    location: "韩国 · 首尔",
    status: "未跟进",
    result: "尚未加入跟进",
    score: 83,
    color: "green",
  },
  {
    name: "VietSafe Workwear Co.",
    short: "VS",
    industry: "服装制造",
    location: "越南 · 胡志明市",
    status: "未跟进",
    result: "尚未加入跟进",
    score: 80,
    color: "purple",
  },
  {
    name: "AU Safety Supplies Pty Ltd",
    short: "AU",
    industry: "安全防护",
    location: "澳大利亚 · 悉尼",
    status: "未跟进",
    result: "尚未加入跟进",
    score: 78,
    color: "blue",
  },
  {
    name: "华信防护材料有限公司",
    short: "华信",
    industry: "安全防护",
    location: "省市待核实",
    status: "未跟进",
    result: "尚未加入跟进",
    score: 72,
    color: "orange",
  },
  {
    name: "Overseas Safety Trading",
    short: "OS",
    industry: "安全防护",
    location: "国家／地区待核实",
    status: "未跟进",
    result: "尚未加入跟进",
    score: 70,
    color: "green",
  },
].map(
  (c, index): Company => ({
    ...c,
    ...createOpportunityProfile(c, index),
    geography: seedGeography(c.name),
    scoreDelta: [2.5, 1.2, 0, -0.6][index % 4],
    customerType:
      index < 2 ||
      index === 10 ||
      index === 11 ||
      (index >= 14 && index % 2 === 0)
        ? "new"
        : "existing",
    discoveredAt:
      index === 10 || index === 11 || (index >= 14 && index % 2 === 0)
        ? "2025-10-27"
        : index < 2
          ? "2025-10-26"
          : `2025-10-${String(19 - (index % 7)).padStart(2, "0")}`,
    followed: c.status !== "未跟进",
    joinedAt: c.status !== "未跟进" ? "2025-10-21" : null,
    starred:
      index === 0 ||
      index === 1 ||
      index === 10 ||
      index === 14 ||
      index === 18,
    feedback: index === 1 ? "positive" : null,
    rating: index === 1 ? 8 : null,
  }),
)
const initialRecords: RecordItem[] = [
  {
    id: 3,
    date: "2025-10-26",
    time: "14:30",
    person: "张明",
    method: "电话沟通",
    title: "已确认采购需求，准备寄送样品",
    content:
      "与采购负责人张经理电话沟通，客户正在寻找反光材料供应商，预计首批采购 5,000 米。对产品耐候性和交付周期比较关注，已约定本周五前发送样品及报价。",
    next: "10月30日前寄送样品，附产品检测报告及报价方案",
  },
  {
    id: 2,
    date: "2025-10-24",
    time: "10:15",
    person: "张明",
    method: "微信沟通",
    title: "建立联系，发送产品介绍资料",
    content:
      "已添加采购负责人微信，发送公司介绍及反光材料产品手册。客户表示近期有采购计划，约定下周电话详聊。",
  },
]
const tabs = ["跟进概览", "跟进记录", "联系人", "企业信息与动态"]
const navItems: {
  label: string
  icon: IconName
}[] = [
  { label: "今日商机", icon: "navOpportunity" },
  { label: "我的行业", icon: "navIndustry" },
  { label: "跟进记录", icon: "navFollow" },
]
const contacts = [
  {
    name: "张建国",
    role: "采购经理",
    label: "关键联系人",
    phone: "138 2567 0891",
    email: "zhang.jg@example.com",
    color: "purple",
    last: "10月26日 14:30",
  },
  {
    name: "陈晓华",
    role: "技术负责人",
    label: "技术评估",
    phone: "139 0278 1632",
    email: "chen.xh@example.com",
    color: "blue",
    last: "暂无沟通记录",
  },
]

function Badge({
  children,
  tone = "purple",
}: {
  children: React.ReactNode
  tone?: string
}) {
  return <span className={`badge badge-${tone}`}>{children}</span>
}
function SectionTitle({
  icon,
  title,
  right,
}: {
  icon: IconName
  title: string
  right?: React.ReactNode
}) {
  return (
    <div className="section-title">
      <div>
        <Icon name={icon} size={17} />
        <Heading level={3}>{title}</Heading>
      </div>
      {right}
    </div>
  )
}

export default function App() {
  const [showEntry, setShowEntry] = useState(true)
  const [guideOpen, setGuideOpen] = useState(false)
  const [companies, setCompanies] = useState(initialCompanies)
  const [selected, setSelected] = useState(0)
  const [drawer, setDrawer] = useState(false)
  const [tab, setTab] = useState(0)
  const [search, setSearch] = useState("")
  const [filter, setFilter] = useState("全部客户")
  const [records, setRecords] = useState<RecordItem[]>(initialRecords)
  const [modal, setModal] =
    useState<"record" | "plan" | "cancel" | "complete" | "rating" | "tags" | null>(
      null,
    )
  const [more, setMore] = useState(false)
  const [toast, setToast] = useState("")
  const [plans, setPlans] = useState<Record<number, {
    date: string
    action: string
  }>>({})
  const nextDate = plans[selected]?.date || "2025-10-30"
  const nextAction = plans[selected]?.action || "寄送样品及报价方案"
  const [verificationByCompany, setVerificationByCompany] =
    useState<Record<number, boolean[]>>({})
  const verified =
    verificationByCompany[selected] ||
    (selected === 0 ? [true, false, false] : [false, false, false])
  const setVerified = (update: (items: boolean[]) => boolean[]) =>
    setVerificationByCompany((prev) => ({
      ...prev,
      [selected]: update(verified),
    }))
  const [showSystem, setShowSystem] = useState(false)
  const [method, setMethod] = useState("电话沟通")
  const [recordContent, setRecordContent] = useState("")
  const [recordResult, setRecordResult] = useState("需求已确认")
  const [reason, setReason] = useState("")
  const [planDate, setPlanDate] = useState(nextDate)
  const [planAction, setPlanAction] = useState(nextAction)
  const [formError, setFormError] = useState("")
  const [nav, setNav] = useState("我的行业")
  const [industryView, setIndustryView] = useState<IndustryView>("overview")
  const [industryConversationRequest, setIndustryConversationRequest] =
    useState(0)
  const [sidebarCollapsed, setSidebarCollapsed] = useState(
    () => window.matchMedia("(max-width: 700px)").matches,
  )
  const [market, setMarket] = useState<Market>("domestic")
  const [followStarredOnly, setFollowStarredOnly] = useState(false)
  const [ratingDraft, setRatingDraft] = useState<number | null>(null)
  const [tagDraft, setTagDraft] = useState<string[]>([])
  const [customTagOptions, setCustomTagOptions] = useState<string[]>([])
  const dialogRef = useRef<HTMLDivElement>(null)
  useEffect(() => {
    const media = window.matchMedia("(max-width: 700px)")
    const change = () => setSidebarCollapsed(media.matches)
    media.addEventListener("change", change)
    return () => media.removeEventListener("change", change)
  }, [])
  const company = companies[selected]
  const activeRecords = selected === 0 ? records : []
  const notify = (text: string) => setToast(text)
  const updateCompany = (patch: Partial<Company>) =>
    setCompanies((prev) =>
      prev.map((c, i) => (i === selected ? { ...c, ...patch } : c)),
    )
  const updateCompanyAt = (index: number, patch: Partial<Company>) =>
    setCompanies((prev) =>
      prev.map((c, i) => (i === index ? { ...c, ...patch } : c)),
    )
  const toggleStar = (index: number) => {
    updateCompanyAt(index, { starred: !companies[index].starred })
    notify(
      companies[index].starred
        ? "已取消重点标记，两个菜单同步更新"
        : "已标记为重点客户，两个菜单同步更新",
    )
  }
  const setFeedback = (index: number, feedback: Company["feedback"]) => {
    updateCompanyAt(index, { feedback })
    notify(
      feedback === "positive"
        ? "已点赞，人工评价已同步"
        : feedback === "negative"
          ? "已点踩，人工评价已同步"
          : "已取消评价，两个菜单同步更新",
    )
  }
  const followCompanies = (indices: number[]) => {
    const eligible = indices.filter(
      (i) => companies[i] && !companies[i].followed,
    )
    if (!eligible.length) return notify("所选企业已加入跟进，无需重复添加")
    setCompanies((prev) =>
      prev.map((c, index) =>
        eligible.includes(index) && !c.followed
          ? {
              ...c,
              followed: true,
              status: "待跟进",
              result: "已加入跟进",
              joinedAt: "2025-10-27",
            }
          : c,
      ),
    )
    notify(`已将 ${eligible.length} 家企业加入「跟进记录 · 待跟进」`)
  }
  const openRating = (index: number) => {
    setSelected(index)
    setRatingDraft(companies[index].rating)
    setFormError("")
    setModal("rating")
  }
  const openTags = (index: number) => {
    setSelected(index)
    setTagDraft([...companies[index].tags])
    setFormError("")
    setModal("tags")
  }
  const openCompany = (index: number, targetTab = 0) => {
    setSelected(index)
    setTab(targetTab)
    setDrawer(true)
    setMore(false)
  }
  const openModal = (type: typeof modal) => {
    setModal(type)
    setMore(false)
    setFormError("")
    setPlanDate(nextDate)
    setPlanAction(nextAction)
    if (type === "complete") setRecordResult("已成交")
  }
  useEffect(() => {
    const previousOverflow = document.body.style.overflow
    if (drawer || modal) document.body.style.overflow = "hidden"
    return () => {
      document.body.style.overflow = previousOverflow
    }
  }, [drawer, modal])
  useEffect(() => {
    if (!toast) return
    const timer = setTimeout(() => setToast(""), 3200)
    return () => clearTimeout(timer)
  }, [toast])
  useEffect(() => {
    if (modal) dialogRef.current?.focus()
    const keydown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        if (modal) setModal(null)
        else if (more) setMore(false)
        else setDrawer(false)
      }
      if (e.key === "Tab" && modal && dialogRef.current) {
        const focusable = dialogRef.current.querySelectorAll<HTMLElement>(
          "button, input, select, textarea",
        )
        const first = focusable[0],
          last = focusable[focusable.length - 1]
        if (
          e.shiftKey &&
          (document.activeElement === first ||
            document.activeElement === dialogRef.current)
        ) {
          e.preventDefault()
          last?.focus()
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault()
          first?.focus()
        }
      }
    }
    window.addEventListener("keydown", keydown)
    return () => window.removeEventListener("keydown", keydown)
  }, [modal, more])
  function saveModal() {
    if (modal === "record") {
      if (!recordContent.trim()) return setFormError("请填写本次沟通内容")
      if (selected === 0)
        setRecords((prev) => [
          {
            id: Date.now(),
            date: new Date().toISOString().slice(0, 10),
            time: new Date().toLocaleTimeString("zh-CN", {
              hour: "2-digit",
              minute: "2-digit",
            }),
            person: "张明",
            method,
            title: recordResult,
            content: recordContent.trim(),
          },
          ...prev,
        ])
      else
        setCompanyRecords((prev) => ({
          ...prev,
          [selected]: [
            {
              id: Date.now(),
              date: new Date().toISOString().slice(0, 10),
              time: "刚刚",
              person: "张明",
              method,
              title: recordResult,
              content: recordContent.trim(),
            },
            ...(prev[selected] || []),
          ],
        }))
      updateCompany({
        result: recordResult,
        status: "跟进中",
        followed: true,
        joinedAt: company.joinedAt || "2025-10-27",
      })
      setRecordContent("")
      setTab(1)
      notify("跟进记录已保存")
    } else if (modal === "plan") {
      if (!planDate || !planAction.trim())
        return setFormError("请填写跟进日期和计划内容")
      setPlans((prev) => ({
        ...prev,
        [selected]: { date: planDate, action: planAction.trim() },
      }))
      notify("下次跟进计划已更新")
    } else if (modal === "cancel") {
      if (!reason.trim()) return setFormError("请填写取消原因，方便后续回溯")
      updateCompany({ status: "已取消", result: reason.trim() })
      notify("已取消跟进，企业资料与历史记录仍然保留")
    } else if (modal === "complete") {
      updateCompany({ status: "已完成", result: recordResult })
      notify("本轮跟进已完成，历史记录已保留")
    } else if (modal === "rating") {
      updateCompany({ rating: ratingDraft })
      notify(
        ratingDraft === null
          ? "人工评分已清除，两个菜单同步更新"
          : `人工评分 ${ratingDraft}/10，今日商机与跟进记录已同步`,
      )
    }
    if (modal === "tags") {
      updateCompany({ tags: [...tagDraft] })
      notify("人工标签已保存，今日商机、跟进记录与企业详情已同步")
    }
    setModal(null)
  }
  const [companyRecords, setCompanyRecords] =
    useState<Record<number, RecordItem[]>>({})
  const visibleRecords =
    selected === 0 ? activeRecords : companyRecords[selected] || []
  const trackedCompanies = companies.filter((c) => c.followed)
  const filtered = companies
    .map((c, i) => ({ ...c, index: i }))
    .filter(
      (c) =>
        c.followed &&
        c.name.includes(search.trim()) &&
        (!followStarredOnly || c.starred) &&
        (filter === "全部客户" || c.status === filter),
    )

  const navigateFromGuide = (destination: GuideDestination) => {
    setGuideOpen(false)
    setDrawer(false)
    setModal(null)
    if (destination === "industry") {
      setNav("我的行业")
      setIndustryView("chat")
      setIndustryConversationRequest((prev) => prev + 1)
    } else if (destination === "opportunities") {
      setNav("今日商机")
    } else {
      setNav("跟进记录")
      setSearch("")
      setFilter(destination === "followups" ? "待跟进" : "全部客户")
      setFollowStarredOnly(false)
      if (destination === "contacts") {
        const index = companies.findIndex((item) => item.followed && item.status === "待跟进")
        const fallback = companies.findIndex((item) => item.followed)
        if (index >= 0 || fallback >= 0) openCompany(index >= 0 ? index : fallback, 2)
        else notify("还没有跟进企业，请先在今日商机中加入跟进")
      }
    }
    if (window.matchMedia("(max-width: 700px)").matches) setSidebarCollapsed(true)
  }

  if (showEntry) return <EntryScreen onEnter={() => setShowEntry(false)} />

  return (
    <>
    <div
      className={`app-shell ${sidebarCollapsed ? "sidebar-is-collapsed" : ""}`}
    >
      {!sidebarCollapsed && (
        <div
          className="sidebar-backdrop"
          aria-hidden="true"
          onClick={() => setSidebarCollapsed(true)}
        />
      )}
      <aside className="sidebar" id="main-navigation" aria-label="业务导航">
        <Button
          variant="ghost"
          className="sidebar-collapse-button"
          aria-label={sidebarCollapsed ? "展开侧栏" : "收起侧栏"}
          aria-expanded={!sidebarCollapsed}
          aria-controls="main-navigation"
          onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
        >
          <Icon
            name="chevron"
            size={14}
            className={sidebarCollapsed ? "" : "rotate"}
          />
        </Button>
        <div className="reference-sidebar-brand">
          <div className="sidebar-brand-full">
            <strong>
              AI <span>Growth</span>
              <br />
              Engine
            </strong>
            <span>销售雷达 · MVP</span>
          </div>
          <strong
            className="sidebar-brand-compact"
            aria-label="AI Growth Engine"
          >
            AI
          </strong>
        </div>
        <div className="sidebar-view-card">
          <span>当前业务视图</span>
          <strong>
            {market === "domestic"
              ? "国内市场 · 内贸获客"
              : "海外市场 · 外贸获客"}
          </strong>
        </div>
        <nav aria-label="主导航">
          {navItems.map((item) => (
            <Button
              key={item.label}
              variant="ghost"
              className={`nav-item ${nav === item.label ? "active" : ""}`}
              aria-label={item.label}
              aria-current={nav === item.label ? "page" : undefined}
              title={sidebarCollapsed ? item.label : undefined}
              onClick={() => {
                setNav(item.label)
                setDrawer(false)
                if (item.label === "我的行业") setIndustryView("overview")
                if (window.matchMedia("(max-width: 700px)").matches)
                  setSidebarCollapsed(true)
              }}
            >
              <Icon name={item.icon} size={13} />
              <span className="nav-item-label">
                {item.label}
                <small>
                  {item.label === "今日商机"
                    ? `${
                        market === "domestic" ? "国内市场" : "海外市场"
                      } · 实时信号`
                    : item.label === "我的行业"
                      ? "添加产品 · AI 自动研究"
                      : "反馈 · 结果 · 学习"}
                </small>
              </span>
            </Button>
          ))}
        </nav>
        <div className="reference-sidebar-bottom">
          <Button
            variant="ghost"
            className="sidebar-guide-button"
            aria-label="快速上手指南"
            title={sidebarCollapsed ? "快速上手指南" : undefined}
            onClick={() => {
              setDrawer(false)
              setModal(null)
              setGuideOpen(true)
            }}
          >
            <Icon name="help" size={15} />
            <span>快速上手指南</span>
          </Button>
          <Button
            variant="ghost"
            className="sidebar-describe-button"
            aria-label="描述我的产品"
            title={sidebarCollapsed ? "描述我的产品" : undefined}
            onClick={() => {
              setNav("我的行业")
              setIndustryView("chat")
              setIndustryConversationRequest((prev) => prev + 1)
              setDrawer(false)
              setModal(null)
              if (window.matchMedia("(max-width: 700px)").matches)
                setSidebarCollapsed(true)
            }}
          >
            <Icon name="plus" size={14} />
            <span>描述我的产品</span>
          </Button>
        </div>
      </aside>
      <main
        className={`main-area ${
          nav === "今日商机"
            ? "opportunity-main"
            : nav === "我的行业"
              ? "industry-main"
              : ""
        }`}
      >
        {nav === "跟进记录" && (
          <header className="topbar">
            <div>
              业务空间
              <Icon name="chevron" size={12} />
              <span>{nav}</span>
            </div>
            <div className="topbar-right">
              <span className="today">2025年10月27日，星期一</span>
              <Button
                variant="ghost"
                className="icon-button"
                aria-label="通知"
                onClick={() => notify("暂无新通知")}
              >
                <Icon name="bell" />
                <i />
              </Button>
              <span className="avatar small">张</span>
            </div>
          </header>
        )}
        <IndustryWorkspace
          conversationRequest={industryConversationRequest}
          active={nav === "我的行业"}
          suspended={guideOpen}
          market={market}
          view={industryView}
          onViewChange={setIndustryView}
          onNotify={notify}
        />
        {nav === "我的行业" ? null : nav === "今日商机" ? (
          <Opportunities
            market={market}
            onMarketChange={setMarket}
            onRefresh={() => notify("已刷新当前演示视图；尚未连接实时商机服务")}
            companies={companies.map((c, index) => ({ ...c, index }))}
            onOpen={openCompany}
            onFollow={followCompanies}
            onStar={toggleStar}
            onFeedback={setFeedback}
            onRate={openRating}
            onTags={openTags}
          />
        ) : (
          <div className="page-content">
            <div className="page-heading">
              <div>
                <div className="eyebrow">CUSTOMER RELATIONSHIP</div>
                <Heading level={1}>
                  客户跟进
                  <span className="heading-dot" />
                </Heading>
                <p>连接每一次沟通，让商机持续向前。</p>
              </div>
              <Button
                variant="primary"
                onClick={() => {
                  setNav("今日商机")
                  setDrawer(false)
                }}
              >
                <Icon name="plus" size={16} />
                添加跟进客户
              </Button>
            </div>
            <div className="stat-grid">
              {[
                {
                  title: "全部客户",
                  n: trackedCompanies.length,
                  icon: "users",
                  sub: "已加入跟进的全部企业",
                  tone: "purple",
                },
                {
                  title: "待跟进",
                  n: trackedCompanies.filter((c) => c.status === "待跟进")
                    .length,
                  icon: "clock",
                  sub: "把握首次联系的好时机",
                  tone: "orange",
                },
                {
                  title: "跟进中",
                  n: trackedCompanies.filter((c) => c.status === "跟进中")
                    .length,
                  icon: "message",
                  sub: "保持沟通，持续推进",
                  tone: "blue",
                },
                {
                  title: "已完成",
                  n: trackedCompanies.filter((c) => c.status === "已完成")
                    .length,
                  icon: "check",
                  sub: "每一次积累，都有价值",
                  tone: "green",
                },
              ].map((s) => (
                <Button
                  key={s.title}
                  variant="ghost"
                  className={`stat-card ${
                    filter === s.title ? "selected" : ""
                  }`}
                  onClick={() => setFilter(s.title)}
                >
                  <div className="stat-top">
                    <span>{s.title}</span>
                    <span className={`stat-icon ${s.tone}`}>
                      <Icon name={s.icon as IconName} size={18} />
                    </span>
                  </div>
                  <strong>
                    {s.n}
                    <span>家</span>
                  </strong>
                  <div className="stat-caption">{s.sub}</div>
                </Button>
              ))}
            </div>
            <div className="customer-panel">
              <div className="list-title">
                <Heading level={2}>
                  跟进客户<span>{trackedCompanies.length}</span>
                </Heading>
                <Button
                  variant="ghost"
                  onClick={() => {
                    setFilter("全部客户")
                    setSearch("")
                    setFollowStarredOnly(false)
                    notify("已刷新客户列表")
                  }}
                >
                  <Icon name="history" size={15} />
                  刷新列表
                </Button>
              </div>
              <div className="list-toolbar">
                <div className="filter-tabs">
                  {["全部客户", "待跟进", "跟进中", "已完成"].map((item) => (
                    <Button
                      key={item}
                      variant="ghost"
                      className={filter === item ? "current" : ""}
                      onClick={() => setFilter(item)}
                    >
                      {item}
                    </Button>
                  ))}
                </div>
                <Button
                  variant="ghost"
                  className={`priority-filter ${
                    followStarredOnly ? "enabled" : ""
                  }`}
                  aria-pressed={followStarredOnly}
                  onClick={() => setFollowStarredOnly(!followStarredOnly)}
                >
                  <Icon name="star" size={14} />
                  只看重点
                </Button>
                <div className="search-box">
                  <Icon name="search" size={16} />
                  <Input
                    aria-label="搜索企业名称"
                    placeholder="搜索企业名称"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                  />
                </div>
              </div>
              <div className="table-wrap">
                <table className="customer-table">
                  <thead>
                    <tr>
                      <th>企业名称</th>
                      <th>
                        AI 开发评分 <Icon name="sparkles" size={12} />
                      </th>
                      <th>人工评价 / 评分</th>
                      <th>人工标签</th>
                      <th>跟进状态</th>
                      <th>最新结果</th>
                      <th>最近跟进</th>
                      <th>负责人</th>
                      <th>操作</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filtered.map((c) => (
                      <tr
                        key={c.name}
                        data-company={c.name}
                        className={
                          drawer && selected === c.index ? "selected-row" : ""
                        }
                      >
                        <td>
                          <div className="opportunity-company-cell">
                            <Button
                              className="company-link"
                              variant="ghost"
                              onClick={() => openCompany(c.index)}
                            >
                              <span className={`company-avatar ${c.color}`}>
                                {c.short.slice(0, 1)}
                              </span>
                              <span>
                                <strong>{c.name}</strong>
                                <span className="company-meta">
                                  {c.location}
                                  <i /> {c.industry}
                                </span>
                              </span>
                            </Button>
                            <StarButton
                              company={c}
                              onToggle={() => toggleStar(c.index)}
                            />
                          </div>
                        </td>
                        <td>
                          <strong className="score-number">{c.score}</strong>
                          <span className="score-denominator"> /100</span>
                        </td>
                        <td>
                          <Evaluation
                            company={c}
                            onFeedback={(feedback) =>
                              setFeedback(c.index, feedback)
                            }
                            onRate={() => openRating(c.index)}
                          />
                        </td>
                        <td>
                          <CompanyTags
                            company={c}
                            onEdit={() => openTags(c.index)}
                          />
                        </td>
                        <td>
                          <Badge
                            tone={
                              c.status === "跟进中"
                                ? "purple"
                                : c.status === "待跟进"
                                  ? "orange"
                                  : c.status === "已取消"
                                    ? "neutral"
                                    : "green"
                            }
                          >
                            <i />
                            {c.status}
                          </Badge>
                        </td>
                        <td>{c.result}</td>
                        <td className="muted">
                          {c.joinedAt === "2025-10-27"
                            ? "尚未跟进"
                            : `10-${26 - c.index} 14:30`}
                        </td>
                        <td>
                          <span className="table-person">张</span>张明
                        </td>
                        <td>
                          <Button
                            variant="ghost"
                            className="text-link"
                            onClick={() => openCompany(c.index)}
                          >
                            查看详情
                            <Icon name="chevron" size={13} />
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {!filtered.length && (
                  <div className="empty-state">
                    <Icon name="search" size={28} />
                    <Heading level={3}>没有找到匹配的企业</Heading>
                    <p>试试其他企业名称，或切换筛选条件。</p>
                    <Button
                      onClick={() => {
                        setSearch("")
                        setFilter("全部客户")
                        setFollowStarredOnly(false)
                      }}
                    >
                      清除筛选
                    </Button>
                  </div>
                )}
              </div>
              <div className="table-footer">
                <span>共 {filtered.length} 家企业</span>
                <div>
                  <span>全部结果</span>
                  <Button variant="ghost" aria-label="上一页" disabled>
                    <Icon name="chevron" className="rotate" size={14} />
                  </Button>
                  <Button className="page-number">1</Button>
                  <Button variant="ghost" aria-label="下一页" disabled>
                    <Icon name="chevron" size={14} />
                  </Button>
                </div>
              </div>
            </div>
            <div className="page-note">
              <Icon name="target" size={14} />
              每一次用心的跟进，都是下一次合作的开始。
            </div>
          </div>
        )}
      </main>

      {drawer && (
        <>
          <div className="drawer-backdrop" onClick={() => setDrawer(false)} />
          <aside className="detail-drawer" aria-label="企业跟进详情">
            <div className="drawer-header">
              <div className="drawer-breadcrumb">
                <span>
                  <Icon name="briefcase" size={14} />
                  企业跟进详情
                </span>
                <div>
                  <span className="autosaved">
                    <span />
                    已同步
                  </span>
                  <Button
                    variant="ghost"
                    className="icon-button close-button"
                    aria-label="关闭详情"
                    onClick={() => setDrawer(false)}
                  >
                    <Icon name="close" size={20} />
                  </Button>
                </div>
              </div>
              <div className="company-hero">
                <div className={`company-symbol ${company.color}`}>
                  <Icon name="building" size={26} />
                </div>
                <div>
                  <Heading level={2}>{company.name}</Heading>
                  <div className="hero-meta">
                    <span>{company.location}</span>
                    <i />
                    <span>{company.industry}</span>
                    <Badge tone="neutral">存续</Badge>
                  </div>
                </div>
                <StarButton
                  company={company}
                  onToggle={() => toggleStar(selected)}
                />
              </div>
              <div className="company-status">
                <Badge
                  tone={
                    company.status === "跟进中"
                      ? "purple"
                      : company.status === "待跟进"
                        ? "orange"
                        : !company.followed || company.status === "已取消"
                          ? "neutral"
                          : "green"
                  }
                >
                  <i />
                  {company.status}
                </Badge>
                <span className="status-divider" />
                <span className="muted">当前结果</span>
                <span>{company.result}</span>
                <span className="owner-label">
                  负责人<span className="avatar tiny">张</span>
                  <strong>张明</strong>
                </span>
              </div>
              <div className="detail-evaluation">
                <span>人工评价</span>
                <Evaluation
                  company={company}
                  onFeedback={(feedback) => setFeedback(selected, feedback)}
                  onRate={() => openRating(selected)}
                />
                <span className="evaluation-sync">
                  <Icon name="check" size={11} />
                  两个菜单同步
                </span>
              </div>
              <div className="detail-tag-line">
                <span>人工标签</span>
                <CompanyTags
                  company={company}
                  onEdit={() => openTags(selected)}
                />
                <Button
                  variant="ghost"
                  className="text-link"
                  onClick={() => openTags(selected)}
                >
                  编辑标注
                </Button>
              </div>
              <div className="header-dates">
                <span>
                  <Icon name="clock" size={13} />
                  最近跟进：
                  {visibleRecords.length
                    ? `${visibleRecords[0].date.slice(5)} ${visibleRecords[0].time}`
                    : "暂无记录"}
                </span>
                <span>
                  <Icon name="calendar" size={13} />
                  {company.joinedAt
                    ? `加入跟进：${company.joinedAt}`
                    : `首次发现：${company.discoveredAt}`}
                </span>
              </div>
            </div>
            <div
              className="detail-tabs"
              role="tablist"
              aria-label="企业详情分类"
            >
              {tabs.map((t, i) => (
                <Button
                  key={t}
                  variant="ghost"
                  role="tab"
                  aria-selected={tab === i}
                  aria-controls={`detail-panel-${i}`}
                  id={`detail-tab-${i}`}
                  className={tab === i ? "selected" : ""}
                  onClick={() => setTab(i)}
                  onKeyDown={(e) => {
                    if (e.key === "ArrowRight" || e.key === "ArrowLeft") {
                      const next = (i + (e.key === "ArrowRight" ? 1 : 3)) % 4
                      setTab(next)
                      document.getElementById(`detail-tab-${next}`)?.focus()
                    }
                  }}
                >
                  {t}
                  {i === 1 && <span>{visibleRecords.length}</span>}
                  {i === 2 && <span>2</span>}
                </Button>
              ))}
            </div>
            <div
              className="detail-body"
              id={`detail-panel-${tab}`}
              role="tabpanel"
              aria-labelledby={`detail-tab-${tab}`}
            >
              {tab === 0 && (
                <>
                  <div className="summary-card">
                    <div className="summary-header">
                      <span className="summary-label">
                        <span className="live-dot" />
                        最新跟进结论
                      </span>
                      <span>{visibleRecords[0]?.date || "暂无跟进"}</span>
                    </div>
                    <Heading level={3}>
                      {visibleRecords[0]?.title ||
                        "尚未记录沟通，开始第一次跟进"}
                    </Heading>
                    <p>
                      {visibleRecords[0]?.content ||
                        "记录与客户的第一次沟通，明确需求和下一步行动。企业资料与动态可以在其他页签查看。"}
                    </p>
                    <div className="summary-tags">
                      <span>
                        <Icon name="target" size={13} />
                        客户意向
                        <Badge tone="green">
                          {visibleRecords.length ? "较高" : "待判断"}
                        </Badge>
                      </span>
                      <span>
                        <Icon name="briefcase" size={13} />
                        预计需求
                        <strong>
                          {visibleRecords.length
                            ? "反光材料 · 5,000 米"
                            : "待确认"}
                        </strong>
                      </span>
                    </div>
                  </div>
                  <section className="plan-section">
                    <SectionTitle
                      icon="calendar"
                      title="下一步行动"
                      right={
                        <Button
                          variant="ghost"
                          className="text-link"
                          onClick={() => openModal("plan")}
                        >
                          编辑计划
                          <Icon name="chevron" size={13} />
                        </Button>
                      }
                    />
                    <div className="plan-card">
                      <div className="plan-date">
                        <strong>{nextDate.slice(8)}</strong>
                        <span>{Number(nextDate.slice(5, 7))}月</span>
                      </div>
                      <div className="plan-content">
                        <strong>{nextAction}</strong>
                        <p>附产品检测报告，重点说明耐候性及交付周期</p>
                        <div>
                          <span className="avatar micro">张</span>张明负责
                          <span className="plan-time">
                            <Icon name="clock" size={12} />
                            计划日期 {nextDate}
                          </span>
                        </div>
                      </div>
                      <Badge tone="blue">待执行</Badge>
                    </div>
                  </section>
                  <section className="verification-section">
                    <SectionTitle
                      icon="check"
                      title="待核实事项"
                      right={
                        <span className="section-count">
                          {verified.filter(Boolean).length} / 3 已核实
                        </span>
                      }
                    />
                    <div className="verification-list">
                      {[
                        {
                          title: "确认客户实际采购需求",
                          sub: "预计首批采购反光材料 5,000 米",
                        },
                        {
                          title: "确认预算范围与采购时间",
                          sub: "待报价后进一步沟通",
                        },
                        {
                          title: "确认最终采购决策人",
                          sub: "当前对接人为采购经理",
                        },
                      ].map((v, i) => (
                        <Button
                          variant="ghost"
                          key={v.title}
                          className={`verify-item ${
                            verified[i] ? "verified" : ""
                          }`}
                          aria-pressed={verified[i]}
                          onClick={() =>
                            setVerified((prev) =>
                              prev.map((item, n) => (n === i ? !item : item)),
                            )
                          }
                        >
                          <span className="checkbox">
                            {verified[i] && <Icon name="check" size={12} />}
                          </span>
                          <span className="verify-content">
                            <strong>{v.title}</strong>
                            <span>{v.sub}</span>
                          </span>
                          <span className="verify-status">
                            {verified[i] ? "已核实" : "待核实"}
                          </span>
                        </Button>
                      ))}
                    </div>
                  </section>
                  <section className="insight-section">
                    <SectionTitle
                      icon="sparkles"
                      title="企业开发洞察"
                      right={<span className="ai-label">AI 辅助分析</span>}
                    />
                    <div className="insight-card">
                      <div className="insight-score">
                        <div className="score-ring">
                          <strong>{company.score}</strong>
                          <span>开发评分</span>
                        </div>
                        <Badge tone="purple">值得重点跟进</Badge>
                      </div>
                      <div className="insight-content">
                        <strong>需求匹配度高，建议加快样品验证</strong>
                        <p>
                          企业近期拓展新材料业务，与我方产品具有较高匹配度。已建立采购端联系，建议以样品测试为切入点推进合作。
                        </p>
                        <Button
                          variant="ghost"
                          className="text-link"
                          onClick={() => setTab(3)}
                        >
                          查看完整企业分析
                          <Icon name="arrow" size={14} />
                        </Button>
                      </div>
                    </div>
                    <div className="insight-footnote">
                      <Icon name="clock" size={12} />
                      企业数据更新于 10月27日 09:00<span>AI 分析仅供参考</span>
                    </div>
                  </section>
                  <section className="recent-news">
                    <SectionTitle
                      icon="chart"
                      title="近期企业动态"
                      right={
                        <Button
                          variant="ghost"
                          className="text-link"
                          onClick={() => setTab(3)}
                        >
                          查看全部
                          <Icon name="chevron" size={13} />
                        </Button>
                      }
                    />
                    <div className="news-line">
                      <span className="news-dot" />
                      <Badge tone="blue">招聘信号</Badge>
                      <span>新增材料研发工程师岗位，持续布局新材料业务</span>
                      <time>10-25</time>
                    </div>
                  </section>
                </>
              )}
              {tab === 1 && (
                <>
                  <div className="tab-intro">
                    <div>
                      <Heading level={3}>每一次沟通，都有迹可循</Heading>
                      <p>记录业务进展，也为下一次跟进提供方向。</p>
                    </div>
                    <Button onClick={() => openModal("record")}>
                      <Icon name="plus" size={15} />
                      新增记录
                    </Button>
                  </div>
                  <div className="timeline-toolbar">
                    <span>
                      共 <strong>{visibleRecords.length}</strong> 条业务跟进
                    </span>
                    <Button
                      variant="ghost"
                      className={showSystem ? "text-link" : ""}
                      onClick={() => setShowSystem(!showSystem)}
                    >
                      <span
                        className={`checkbox ${showSystem ? "checked" : ""}`}
                      >
                        {showSystem && <Icon name="check" size={11} />}
                      </span>
                      显示系统操作
                    </Button>
                  </div>
                  <div className="timeline">
                    {visibleRecords.map((r, index) => (
                      <article className="timeline-item" key={r.id}>
                        <span
                          className={`timeline-point ${
                            index === 0 ? "latest" : ""
                          }`}
                        />
                        <div className="timeline-date">
                          {r.date}
                          <span>{r.time}</span>
                          {index === 0 && <Badge>最近</Badge>}
                        </div>
                        <div className="record-card">
                          <div className="record-top">
                            <span className="avatar tiny">张</span>
                            <strong>{r.person}</strong>
                            <span className="muted">与 张建国</span>
                            <Badge tone="neutral">{r.method}</Badge>
                          </div>
                          <Heading level={3}>{r.title}</Heading>
                          <p>{r.content}</p>
                          {r.id === 2 && (
                            <div className="attachment">
                              <Icon name="file" size={18} />
                              <span>
                                反光材料产品手册.pdf
                                <span>产品资料 · 2.4 MB</span>
                              </span>
                              <Badge tone="neutral">已发送</Badge>
                            </div>
                          )}
                          {r.next && (
                            <div className="record-next">
                              <Icon name="arrow" size={14} />
                              <span>下一步：{r.next}</span>
                            </div>
                          )}
                        </div>
                      </article>
                    ))}
                    {showSystem && company.joinedAt && (
                      <article className="timeline-item system-item">
                        <span className="timeline-point" />
                        <div className="timeline-date">
                          {company.joinedAt}
                          <span>09:18</span>
                        </div>
                        <div className="system-log">
                          <span className="avatar tiny">张</span>张明
                          将企业加入跟进<Badge tone="neutral">系统记录</Badge>
                        </div>
                      </article>
                    )}
                    {!visibleRecords.length && (
                      <div className="empty-state">
                        <Icon name="message" size={30} />
                        <Heading level={3}>还没有业务跟进记录</Heading>
                        <p>从第一次沟通开始，积累与客户的每一步进展。</p>
                        <Button
                          onClick={() => openModal("record")}
                          variant="primary"
                        >
                          记录第一次沟通
                        </Button>
                      </div>
                    )}
                  </div>
                </>
              )}
              {tab === 2 && (
                <>
                  <div className="tab-intro">
                    <div>
                      <Heading level={3}>找到对的人，让沟通更有效</Heading>
                      <p>共 2 位联系人，联系方式为设计演示数据。</p>
                    </div>
                    <Badge tone="neutral">企业联系人</Badge>
                  </div>
                  {contacts.map((c, i) => (
                    <article className="contact-card" key={c.name}>
                      <div className="contact-top">
                        <span className={`contact-avatar ${c.color}`}>
                          {c.name.slice(0, 1)}
                        </span>
                        <div>
                          <div>
                            <Heading level={3}>{c.name}</Heading>
                            <Badge tone={i === 0 ? "purple" : "blue"}>
                              {c.label}
                            </Badge>
                          </div>
                          <p>
                            {c.role} · {company.name}
                          </p>
                        </div>
                        <Badge tone="green">已核实</Badge>
                      </div>
                      <div className="contact-details">
                        <div>
                          <Icon name="phone" size={16} />
                          <span>{c.phone}</span>
                          <Button
                            variant="ghost"
                            className="text-link"
                            onClick={() => {
                              navigator.clipboard
                                ?.writeText(c.phone.replace(/ /g, ""))
                                .then(() => notify("电话号码已复制"))
                                .catch(() =>
                                  notify("当前环境无法复制，请手动复制号码"),
                                )
                            }}
                          >
                            复制
                          </Button>
                        </div>
                        <div>
                          <Icon name="mail" size={16} />
                          <span>{c.email}</span>
                        </div>
                      </div>
                      <div className="contact-bottom">
                        <span>
                          <Icon name="clock" size={13} />
                          最近联系：{c.last}
                        </span>
                        <Button onClick={() => openModal("record")}>
                          <Icon name="plus" size={14} />
                          记录沟通
                        </Button>
                      </div>
                    </article>
                  ))}
                  <div className="info-notice">
                    <Icon name="help" size={16} />
                    <span>联系人信息仅用于业务沟通，请妥善保护个人信息。</span>
                  </div>
                </>
              )}
              {tab === 3 && (
                <>
                  <section className="opportunity-detail-section">
                    <SectionTitle
                      icon="target"
                      title="商机研判信息"
                      right={<Badge tone="neutral">演示数据</Badge>}
                    />
                    <div className="opportunity-detail-metrics">
                      <div>
                        <span>开发评级与评分</span>
                        <DevelopmentScore company={company} />
                      </div>
                      <div>
                        <span>商机成熟度</span>
                        <MaturityBadge company={company} />
                      </div>
                    </div>
                    <div className="opportunity-detail-signals">
                      <Heading level={3}>策略明细</Heading>
                      <SignalChips company={company} />
                    </div>
                    <div className="opportunity-detail-reason">
                      <Heading level={3}>推荐理由</Heading>
                      <p>{company.recommendation}</p>
                    </div>
                  </section>
                  <div className="data-note">
                    <Icon name="history" size={14} />
                    <span>企业数据更新于 2025-10-27 09:00</span>
                    <Badge tone="neutral">演示数据</Badge>
                  </div>
                  <section className="enterprise-section">
                    <SectionTitle icon="building" title="企业基本信息" />
                    <div className="enterprise-grid">
                      {[
                        ["企业名称", company.name],
                        ["经营状态", "存续（在营、开业、在册）"],
                        ["所属行业", company.industry],
                        ["所在地区", company.location],
                        ["法定代表人", "王志强"],
                        ["注册资本", "5,000 万元人民币"],
                        ["成立日期", "2016-08-18"],
                        ["企业规模", "100–499 人"],
                      ].map(([label, value]) => (
                        <div key={label}>
                          <span>{label}</span>
                          <strong>{value}</strong>
                        </div>
                      ))}
                    </div>
                  </section>
                  <section className="enterprise-section">
                    <SectionTitle
                      icon="sparkles"
                      title="综合开发研判"
                      right={<Badge>AI 分析</Badge>}
                    />
                    <div className="analysis-banner">
                      <div className="analysis-score">
                        {company.score}
                        <span>/ 100</span>
                      </div>
                      <div>
                        <strong>产品匹配度高，具备持续开发潜力</strong>
                        <p>结合经营情况、近期动态与实际沟通，建议重点跟进。</p>
                      </div>
                    </div>
                    <div className="analysis-factors">
                      {[
                        [
                          "需求匹配",
                          "反光材料采购需求明确，与现有产品线匹配度高。",
                        ],
                        [
                          "采购时机",
                          "近期新增材料研发岗位，业务扩展可能带来采购机会。",
                        ],
                        [
                          "需关注风险",
                          "采购预算和最终决策链尚未确认，建议报价前核实。",
                        ],
                      ].map(([title, content], i) => (
                        <div key={title}>
                          <span
                            className={`factor-icon ${
                              i === 2 ? "orange" : "purple"
                            }`}
                          >
                            <Icon name={i === 2 ? "help" : "check"} size={14} />
                          </span>
                          <div>
                            <strong>{title}</strong>
                            <p>{content}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </section>
                  <section className="enterprise-section">
                    <SectionTitle
                      icon="chart"
                      title="近期动态"
                      right={<span className="section-count">近 30 天</span>}
                    />
                    {[
                      {
                        tag: "招聘信号",
                        title: "新增材料研发工程师等 3 个岗位",
                        text: "重点招聘高分子材料研发、工艺工程等岗位，可能处于业务扩展阶段。",
                        source: "公开招聘信息",
                        date: "2025-10-25",
                        tone: "blue",
                      },
                      {
                        tag: "经营动态",
                        title: "新材料相关业务持续拓展",
                        text: "企业公开业务介绍新增反光材料及功能性薄膜相关产品方向。",
                        source: "企业公开资料",
                        date: "2025-10-22",
                        tone: "purple",
                      },
                    ].map((n) => (
                      <article className="dynamic-card" key={n.title}>
                        <div>
                          <Badge tone={n.tone}>{n.tag}</Badge>
                          <time>{n.date}</time>
                        </div>
                        <Heading level={3}>{n.title}</Heading>
                        <p>{n.text}</p>
                        <span className="dynamic-source">
                          <Icon name="file" size={12} />
                          来源：{n.source}
                          <span>示例信息</span>
                        </span>
                      </article>
                    ))}
                  </section>
                  <div className="info-notice">
                    <Icon name="help" size={16} />
                    <span>
                      企业动态与业务跟进独立更新，公开信息请以实际核实结果为准。
                    </span>
                  </div>
                </>
              )}
            </div>
            <footer className="drawer-footer">
              <div className="more-container">
                <Button
                  variant="ghost"
                  className={more ? "more-open" : ""}
                  onClick={() => setMore(!more)}
                  aria-expanded={more}
                >
                  <Icon name="more" size={19} />
                  <span>更多操作</span>
                </Button>
                {more && (
                  <div className="more-menu">
                    {!company.followed ? (
                      <div className="unfollowed-hint">
                        加入跟进后可管理跟进流程
                      </div>
                    ) : company.status !== "已完成" &&
                      company.status !== "已取消" ? (
                      <>
                        <Button
                          variant="ghost"
                          onClick={() => openModal("complete")}
                        >
                          <Icon name="check" size={16} />
                          完成本轮跟进
                        </Button>
                        <div className="menu-divider" />
                        <Button
                          variant="ghost"
                          className="danger-text"
                          onClick={() => openModal("cancel")}
                        >
                          <Icon name="logout" size={16} />
                          取消跟进
                        </Button>
                        <p>历史记录和企业资料将保留</p>
                      </>
                    ) : (
                      <Button
                        variant="ghost"
                        onClick={() => {
                          updateCompany({
                            status: "待跟进",
                            result: "重新跟进",
                          })
                          setMore(false)
                          notify("已重新加入跟进")
                        }}
                      >
                        <Icon name="history" size={16} />
                        重新跟进
                      </Button>
                    )}
                  </div>
                )}
              </div>
              <div>
                {!company.followed ? (
                  <Button
                    variant="primary"
                    onClick={() => followCompanies([selected])}
                  >
                    <Icon name="plus" size={17} />
                    一键跟进
                  </Button>
                ) : (
                  <>
                    <Button onClick={() => openModal("plan")}>
                      <Icon name="calendar" size={16} />
                      设置下次跟进
                    </Button>
                    <Button
                      variant="primary"
                      onClick={() => openModal("record")}
                    >
                      <Icon name="plus" size={17} />
                      新增跟进记录
                    </Button>
                  </>
                )}
              </div>
            </footer>
          </aside>
        </>
      )}
      {toast && (
        <div className="toast" role="status">
          <span>
            <Icon name="check" size={15} />
          </span>
          {toast}
        </div>
      )}
      {modal && (
        <div className="modal-backdrop" onClick={() => setModal(null)}>
          <div
            className={`modal ${modal === "tags" ? "tag-modal" : ""}`}
            role="dialog"
            aria-modal="true"
            aria-labelledby="modal-title"
            tabIndex={-1}
            ref={dialogRef}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="modal-heading">
              <div>
                <Heading level={2} className="modal-title">
                  <span id="modal-title">
                    {
                      {
                        record: "新增跟进记录",
                        plan: "设置下次跟进",
                        cancel: "取消企业跟进",
                        complete: "完成本轮跟进",
                        rating: "企业人工评分",
                        tags: "选择人工标签",
                      }[modal]
                    }
                  </span>
                </Heading>
                <p>{company.name}</p>
              </div>
              <Button
                variant="ghost"
                className="icon-button"
                aria-label="关闭弹窗"
                onClick={() => setModal(null)}
              >
                <Icon name="close" />
              </Button>
            </div>
            <form
              onSubmit={(e) => {
                e.preventDefault()
                saveModal()
              }}
            >
              {modal === "record" && (
                <>
                  <div className="form-row">
                    <label>
                      沟通方式
                      <Select
                        value={method}
                        onChange={(e) => setMethod(e.target.value)}
                      >
                        {["电话沟通", "微信沟通", "邮件沟通", "线下拜访"].map(
                          (m) => (
                            <option key={m}>{m}</option>
                          ),
                        )}
                      </Select>
                    </label>
                    <label>
                      沟通对象
                      <Select>
                        {contacts.map((c) => (
                          <option key={c.name}>
                            {c.name} · {c.role}
                          </option>
                        ))}
                      </Select>
                    </label>
                  </div>
                  <label>
                    本次沟通内容 <span className="required">*</span>
                    <Textarea
                      autoFocus
                      placeholder="记录客户需求、沟通结论、当前阻碍等…"
                      value={recordContent}
                      onChange={(e) => setRecordContent(e.target.value)}
                    />
                  </label>
                  <label>
                    当前跟进结果
                    <Select
                      value={recordResult}
                      onChange={(e) => setRecordResult(e.target.value)}
                    >
                      {[
                        "已联系",
                        "需求已确认",
                        "已发送方案",
                        "已报价",
                        "样品验证中",
                        "已成交",
                        "暂不推进",
                      ].map((r) => (
                        <option key={r}>{r}</option>
                      ))}
                    </Select>
                  </label>
                  <div className="info-notice">
                    <Icon name="help" size={15} />
                    保存后将同步更新企业的当前结果。
                  </div>
                </>
              )}
              {modal === "plan" && (
                <>
                  <label>
                    计划跟进日期 <span className="required">*</span>
                    <Input
                      type="date"
                      value={planDate}
                      onChange={(e) => setPlanDate(e.target.value)}
                    />
                  </label>
                  <label>
                    下一步行动 <span className="required">*</span>
                    <Textarea
                      value={planAction}
                      onChange={(e) => setPlanAction(e.target.value)}
                      placeholder="例如：寄送样品并确认客户的测试安排"
                    />
                  </label>
                  <label>
                    负责人
                    <Input value="张明" readOnly />
                  </label>
                </>
              )}
              {modal === "cancel" && (
                <>
                  <div className="warning-notice">
                    <Icon name="help" size={19} />
                    <div>
                      <strong>取消跟进，不会删除企业</strong>
                      <p>
                        企业资料、联系人与全部历史记录仍会保留，后续可以重新加入跟进。
                      </p>
                    </div>
                  </div>
                  <label>
                    取消原因 <span className="required">*</span>
                    <Textarea
                      value={reason}
                      onChange={(e) => setReason(e.target.value)}
                      placeholder="例如：当前暂无采购需求，半年后再联系"
                    />
                  </label>
                </>
              )}
              {modal === "complete" && (
                <>
                  <div className="info-notice">
                    <Icon name="help" size={16} />
                    完成代表本轮跟进结束，不一定表示成交。
                  </div>
                  <label>
                    最终跟进结果
                    <Select
                      value={recordResult}
                      onChange={(e) => setRecordResult(e.target.value)}
                    >
                      {[
                        "已成交",
                        "暂不推进",
                        "无采购需求",
                        "客户明确拒绝",
                        "其他结果",
                      ].map((r) => (
                        <option key={r}>{r}</option>
                      ))}
                    </Select>
                  </label>
                </>
              )}
              {modal === "rating" && (
                <div className="rating-editor">
                  <p>结合实际了解，为企业的开发价值评分。</p>
                  <div className="rating-preview">
                    <strong>{ratingDraft ?? "—"}</strong>
                    <span>/ 10</span>
                  </div>
                  <div
                    className="rating-options"
                    role="group"
                    aria-label="选择人工评分"
                  >
                    {Array.from({ length: 10 }, (_, i) => i + 1).map((n) => (
                      <Button
                        key={n}
                        type="button"
                        aria-pressed={ratingDraft === n}
                        className={ratingDraft === n ? "selected" : ""}
                        onClick={() => setRatingDraft(n)}
                      >
                        {n}
                      </Button>
                    ))}
                  </div>
                  <div className="rating-scale">
                    <span>开发价值较低</span>
                    <span>开发价值较高</span>
                  </div>
                  <Button
                    type="button"
                    variant="ghost"
                    className="text-link"
                    onClick={() => setRatingDraft(null)}
                  >
                    清除人工评分
                  </Button>
                  <div className="info-notice">
                    <Icon name="history" size={15} />
                    <span>
                      今日商机、跟进记录和企业详情共用同一份人工评分。点赞／点踩独立记录，不修改
                      AI 开发评分。
                    </span>
                  </div>
                </div>
              )}
              {modal === "tags" && (
                <TagEditor
                  selected={tagDraft}
                  onChange={setTagDraft}
                  customTags={customTagOptions}
                  onAddCustom={(tag) =>
                    setCustomTagOptions((prev) =>
                      prev.includes(tag) ? prev : [...prev, tag],
                    )
                  }
                />
              )}
              {formError && (
                <div className="form-error" role="alert">
                  {formError}
                </div>
              )}
              <div className="modal-footer">
                <span>设计预览 · 数据仅保存在当前页面</span>
                <Button type="button" onClick={() => setModal(null)}>
                  返回
                </Button>
                <Button
                  type="submit"
                  variant={modal === "cancel" ? "danger" : "primary"}
                >
                  {modal === "cancel" ? "确认取消跟进" : "保存"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
        <QuickStartModal
          open={guideOpen}
          onDismiss={() => setGuideOpen(false)}
          onNavigate={navigateFromGuide}
        />
    </>
  )
}
