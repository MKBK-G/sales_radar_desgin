import { useState } from "react"
import type { Company } from "./App"
import { Evaluation, StarButton } from "./CustomerControls"
import { Button, Heading, Icon, Input, Select } from "./ui"
import {
  CompanyTags,
  DevelopmentScore,
  MaturityBadge,
  SignalChips,
} from "./OpportunityFields"
import RegionFilter from "./RegionFilter"
import {
  emptyRegion,
  matchesRegion,
  regionLabel,
  type Market,
  type RegionSelection,
} from "./regions"

type Row = Company & { index: number }
type Props = {
  market: Market
  onMarketChange: (market: Market) => void
  onRefresh: () => void
  companies: Row[]
  onOpen: (index: number, tab?: number) => void
  onFollow: (indices: number[]) => void
  onStar: (index: number) => void
  onFeedback: (index: number, feedback: Company["feedback"]) => void
  onRate: (index: number) => void
  onTags: (index: number) => void
}

export default function Opportunities({
  market,
  onMarketChange,
  onRefresh,
  companies,
  onOpen,
  onFollow,
  onStar,
  onFeedback,
  onRate,
  onTags,
}: Props) {
  const [customerType, setCustomerType] = useState("all")
  const [query, setQuery] = useState("")
  const [starredOnly, setStarredOnly] = useState(false)
  const [status, setStatus] = useState("all")
  const [sort, setSort] = useState("skill")
  const [industry, setIndustry] = useState("all")
  const [scoreMode, setScoreMode] = useState("incremental")
  const [refreshed, setRefreshed] = useState(false)
  const [highPotentialOnly, setHighPotentialOnly] = useState(false)
  const [signalTab, setSignalTab] = useState("purchase")
  const [regions, setRegions] = useState<Record<Market, RegionSelection>>({
    domestic: emptyRegion,
    overseas: emptyRegion,
  })
  const region = regions[market]
  const marketCompanies = companies.filter(
    (c) =>
      c.geography.market === market &&
      (industry === "all" || c.industry.includes(industry)),
  )
  const [selection, setSelection] = useState<number[]>([])
  const [grade, setGrade] = useState("all")
  const [maturity, setMaturity] = useState("all")
  const [signal, setSignal] = useState("all")
  const [tag, setTag] = useState("all")
  const allTags = [...new Set(marketCompanies.flatMap((c) => c.tags))]
  const allSignals = [
    ...new Set(
      marketCompanies.flatMap((c) => c.strategySignals.map((s) => s.label)),
    ),
  ]
  const todayCompanies = marketCompanies.filter(
    (c) => c.discoveredAt === "2025-10-27",
  )
  const newSignalCount = todayCompanies.reduce(
    (total, c) => total + c.strategySignals.length,
    0,
  )
  const changeRegion = (value: RegionSelection) => {
    setRegions((prev) => ({ ...prev, [market]: value }))
    setSelection([])
  }
  const rows = marketCompanies
    .filter(
      (c) =>
        (customerType === "all" || c.customerType === customerType) &&
        matchesRegion(c.geography, region) &&
        (!highPotentialOnly || c.score >= 85) &&
        c.name.includes(query.trim()) &&
        (grade === "all" || c.developmentGrade === grade) &&
        (maturity === "all" || c.maturity === maturity) &&
        (signal === "all" ||
          c.strategySignals.some((s) => s.label === signal)) &&
        (tag === "all" ||
          (tag === "untagged" ? c.tags.length === 0 : c.tags.includes(tag))) &&
        (!starredOnly || c.starred) &&
        (status === "all" ||
          (status === "unfollowed"
            ? !c.followed
            : status === "pending"
              ? c.followed && c.status === "待跟进"
              : c.followed)),
    )
    .sort((a, b) => {
      if (sort === "score") return b.score - a.score
      if (sort === "skill") return b.skillScore - a.skillScore
      if (sort === "manual") return (b.rating ?? -1) - (a.rating ?? -1)
      if (sort === "maturity")
        return (
          ["S", "A", "B", "C"].indexOf(a.maturity) -
          ["S", "A", "B", "C"].indexOf(b.maturity)
        )
      return b.discoveredAt.localeCompare(a.discoveredAt) || b.index - a.index
    })
  const eligible = rows.filter((c) => !c.followed).map((c) => c.index)
  const allSelected =
    eligible.length > 0 && eligible.every((i) => selection.includes(i))
  const starred = marketCompanies.filter((c) => c.starred)
  const resetSelection = () => setSelection([])
  const filtersActive =
    customerType !== "all" ||
    query ||
    starredOnly ||
    status !== "all" ||
    grade !== "all" ||
    maturity !== "all" ||
    signal !== "all" ||
    tag !== "all" ||
    highPotentialOnly ||
    region.ids.length > 0 ||
    region.group !== "all"
  const resetCustomerFilters = () => {
    setCustomerType("all")
    setQuery("")
    setStarredOnly(false)
    setStatus("all")
    setGrade("all")
    setMaturity("all")
    setSignal("all")
    setTag("all")
    setHighPotentialOnly(false)
    resetSelection()
  }
  const clearFilters = () => {
    resetCustomerFilters()
    changeRegion(emptyRegion)
  }
  const changeMarket = (next: Market) => {
    if (next === market) return
    resetCustomerFilters()
    onMarketChange(next)
  }
  const signals = marketCompanies
    .filter((c) => matchesRegion(c.geography, region))
    .filter((c) =>
      signalTab === "purchase"
        ? c.strategySignals.some((s) => s.label === "采购招标")
        : !c.strategySignals.some((s) => s.label === "采购招标"),
    )
    .slice(0, 5)

  return (
    <div className="page-content opportunities-page">
      <div className="page-heading opportunity-heading">
        <div>
          <div className="eyebrow">OPPORTUNITY RADAR</div>
          <Heading level={1}>
            今日商机
            <span className="heading-dot" />
          </Heading>
          <p>实时监测潜在客户，采购动态与跟进任务。</p>
        </div>
        <div className="reference-top-controls">
          <div className="monitor-industry">
            <i />
            <Select
              aria-label="监测行业"
              value={industry}
              onChange={(e) => {
                setIndustry(e.target.value)
                resetCustomerFilters()
              }}
            >
              <option value="all">监测行业</option>
              <option value="反光材料">反光材料</option>
              <option value="安全防护">安全防护</option>
              <option value="新材料">新材料</option>
              <option value="服装制造">服装制造</option>
            </Select>
          </div>
          <div className="market-switch" role="group" aria-label="选择监测市场">
            <Button
              variant="ghost"
              aria-pressed={market === "domestic"}
              className={market === "domestic" ? "active" : ""}
              onClick={() => changeMarket("domestic")}
            >
              国内市场
            </Button>
            <Button
              variant="ghost"
              aria-pressed={market === "overseas"}
              className={market === "overseas" ? "active" : ""}
              onClick={() => changeMarket("overseas")}
            >
              海外市场
            </Button>
          </div>
          <Select
            aria-label="评分口径"
            value={scoreMode}
            onChange={(e) => setScoreMode(e.target.value)}
          >
            <option value="incremental">增量评分</option>
            <option value="full">全量评分</option>
          </Select>
          <Select
            aria-label="顶部评分排序"
            value={sort}
            onChange={(e) => setSort(e.target.value)}
          >
            <option value="skill">Skill评分（默认）</option>
            <option value="score">AI评分优先</option>
            <option value="manual">人工评分优先</option>
            <option value="maturity">商机成熟度优先</option>
            <option value="latest">最新发现优先</option>
          </Select>
          <Button
            variant="primary"
            className="refresh-opportunities"
            onClick={() => {
              setRefreshed(true)
              resetSelection()
              onRefresh()
            }}
          >
            <Icon name="history" size={14} />
            刷新商机
          </Button>
        </div>
      </div>
      <div className="stat-grid opportunity-stats">
        {[
          {
            label: "新增企业",
            value: marketCompanies.length,
            icon: "sparkles" as const,
            tone: "purple",
            note: `较昨日新增 ${todayCompanies.length} 家`,
            action: () => {
              resetCustomerFilters()
              changeRegion(emptyRegion)
            },
          },
          {
            label: "高潜客户",
            value: marketCompanies.filter((c) => c.score >= 85).length,
            icon: "users" as const,
            tone: "blue",
            note: `较昨日新增 ${todayCompanies.filter((c) => c.score >= 85).length} 家`,
            action: () => {
              setHighPotentialOnly(!highPotentialOnly)
              resetSelection()
            },
          },
          {
            label: "新信号",
            value: newSignalCount,
            icon: "chart" as const,
            tone: "orange",
            note: `较昨日新增 ${newSignalCount} 条`,
            action: () => {
              setSignal("采购招标")
              resetSelection()
            },
          },
          {
            label: "待跟进",
            value: marketCompanies.filter(
              (c) => c.followed && c.status === "待跟进",
            ).length,
            icon: "clock" as const,
            tone: "green",
            note: `较昨日新增 ${todayCompanies.filter((c) => c.status === "待跟进").length} 家`,
            action: () => {
              setStatus("pending")
              resetSelection()
            },
          },
        ].map((s) => (
          <Button
            key={s.label}
            variant="ghost"
            className={`stat-card ${
              s.label === "新增企业" ? "reference-stat-primary" : ""
            }`}
            onClick={s.action}
          >
            <div className="stat-top">
              <span>{s.label}</span>
              <span className={`stat-icon ${s.tone}`}>
                <Icon name={s.icon} size={18} />
              </span>
            </div>
            <strong>
              {s.value}
              <span>家</span>
            </strong>
            <div className="stat-caption">{s.note}</div>
          </Button>
        ))}
      </div>

      <section className="priority-section">
        <div className="priority-heading">
          <div>
            <span className="priority-symbol">
              <Icon name="star" size={15} />
            </span>
            <Heading level={2}>我的关注</Heading>
            <span className="priority-subtitle">
              已标记的重点客户，优先关注
            </span>
          </div>
          <Button
            variant="ghost"
            className="text-link"
            onClick={() => {
              setStarredOnly(!starredOnly)
              resetSelection()
            }}
          >
            {starredOnly ? "查看全部客户" : `查看全部 ${starred.length} 家`}
            <Icon name="arrow" size={14} />
          </Button>
        </div>
        <div className="priority-cards">
          {starred.slice(0, 3).map((c) => (
            <article className="priority-card" key={c.index}>
              <div className="priority-card-top">
                <span className={`company-avatar ${c.color}`}>
                  {c.short.slice(0, 1)}
                </span>
                <div>
                  <Button
                    variant="ghost"
                    className="priority-company"
                    onClick={() => onOpen(c.index)}
                  >
                    {c.name}
                  </Button>
                  <span>
                    {c.location} · {c.industry}
                  </span>
                </div>
                <StarButton company={c} onToggle={() => onStar(c.index)} />
              </div>
              <div className="priority-card-bottom">
                <span
                  className={`mini-status ${c.followed ? "following" : ""}`}
                >
                  <i />
                  {c.followed ? c.status : "未加入跟进"}
                </span>
                <span>
                  {c.feedback === "positive"
                    ? "已点赞 · "
                    : c.feedback === "negative"
                      ? "已点踩 · "
                      : ""}
                  {c.rating !== null
                    ? `人工评分 ${c.rating}/10`
                    : `AI 开发评分 ${c.score}`}
                </span>
              </div>
            </article>
          ))}
          {!starred.length && (
            <div className="priority-empty">
              <Icon name="star" size={20} />
              <span>点击企业旁的星号，将重点客户固定在这里。</span>
            </div>
          )}
        </div>
      </section>

      <RegionFilter
        market={market}
        companies={marketCompanies}
        value={region}
        onChange={changeRegion}
      />
      <div className="opportunity-content-grid">
        <div className="opportunity-leads-column">
          <section className="customer-panel opportunity-panel">
            <div className="list-title">
              <div className="leads-title">
                <Heading level={2}>
                  客户线索<span>{rows.length}</span>
                </Heading>
                <span>从发现到跟进，一步到位</span>
              </div>
              <span className="sync-hint">
                <Icon name="check" size={12} />
                评价与星标同步至跟进记录
              </span>
            </div>
            <div className="opportunity-toolbar">
              <div
                className="customer-type-tabs"
                role="tablist"
                aria-label="客户新旧筛选"
              >
                {[
                  { id: "all", label: "全部客户" },
                  { id: "new", label: "最新客户" },
                  { id: "existing", label: "老客户" },
                ].map((t) => (
                  <Button
                    key={t.id}
                    variant="ghost"
                    role="tab"
                    aria-selected={customerType === t.id}
                    className={customerType === t.id ? "active" : ""}
                    onClick={() => {
                      setCustomerType(t.id)
                      resetSelection()
                    }}
                  >
                    {t.label}
                    <span>
                      {
                        marketCompanies.filter(
                          (c) => t.id === "all" || c.customerType === t.id,
                        ).length
                      }
                    </span>
                  </Button>
                ))}
              </div>
              <div className="lead-search search-box">
                <Icon name="search" size={15} />
                <Input
                  aria-label="搜索商机企业"
                  placeholder="搜索企业名称"
                  value={query}
                  onChange={(e) => {
                    setQuery(e.target.value)
                    resetSelection()
                  }}
                />
              </div>
            </div>
            <div className="opportunity-filters">
              <div className="filter-left">
                <Button
                  variant="ghost"
                  className={`priority-filter ${starredOnly ? "enabled" : ""}`}
                  aria-pressed={starredOnly}
                  onClick={() => {
                    setStarredOnly(!starredOnly)
                    resetSelection()
                  }}
                >
                  <Icon name="star" size={14} />
                  只看重点
                </Button>
                <Select
                  aria-label="商机跟进状态"
                  value={status}
                  onChange={(e) => {
                    setStatus(e.target.value)
                    resetSelection()
                  }}
                >
                  <option value="all">全部跟进状态</option>
                  <option value="unfollowed">未加入跟进</option>
                  <option value="followed">已加入跟进</option>
                  <option value="pending">待跟进</option>
                </Select>
                <Select
                  aria-label="商机排序"
                  value={sort}
                  onChange={(e) => setSort(e.target.value)}
                >
                  <option value="latest">最新发现优先</option>
                  <option value="score">AI 开发评分优先</option>
                  <option value="skill">Skill 评分从高到低</option>
                  <option value="maturity">商机成熟度优先</option>
                  <option value="manual">人工评分从高到低</option>
                </Select>
                {filtersActive && (
                  <Button
                    variant="ghost"
                    className="clear-filters"
                    onClick={clearFilters}
                  >
                    重置
                  </Button>
                )}
              </div>
              <Button
                variant="primary"
                className="batch-follow"
                disabled={!selection.length}
                onClick={() => {
                  onFollow(selection)
                  resetSelection()
                }}
              >
                <Icon name="plus" size={15} />
                {selection.length
                  ? `一键跟进（${selection.length}）`
                  : "一键跟进"}
              </Button>
            </div>
            <div className="original-field-filters">
              <label>
                开发评级
                <Select
                  aria-label="筛选开发评级"
                  value={grade}
                  onChange={(e) => {
                    setGrade(e.target.value)
                    resetSelection()
                  }}
                >
                  <option value="all">全部评级</option>
                  {["高", "中", "低"].map((v) => (
                    <option key={v}>{v}</option>
                  ))}
                </Select>
              </label>
              <label>
                商机成熟度
                <Select
                  aria-label="筛选商机成熟度"
                  value={maturity}
                  onChange={(e) => {
                    setMaturity(e.target.value)
                    resetSelection()
                  }}
                >
                  <option value="all">全部成熟度</option>
                  <option value="S">S · 明确需求</option>
                  <option value="A">A · 采购相关信号</option>
                  <option value="B">B · 业务匹配</option>
                  <option value="C">C · 初步线索</option>
                </Select>
              </label>
              <label>
                策略信号
                <Select
                  aria-label="筛选策略信号"
                  value={signal}
                  onChange={(e) => {
                    setSignal(e.target.value)
                    resetSelection()
                  }}
                >
                  <option value="all">全部信号</option>
                  {allSignals.map((s) => (
                    <option key={s}>{s}</option>
                  ))}
                </Select>
              </label>
              <label>
                人工标签
                <Select
                  aria-label="筛选人工标签"
                  value={tag}
                  onChange={(e) => {
                    setTag(e.target.value)
                    resetSelection()
                  }}
                >
                  <option value="all">全部标签</option>
                  <option value="untagged">未标注</option>
                  {allTags.map((t) => (
                    <option key={t}>{t}</option>
                  ))}
                </Select>
              </label>
            </div>
            <div className="location-result-context">
              <span>
                <Icon name="pin" size={12} />
                {market === "domestic" ? "国内市场" : "海外市场"}
                <i />
                {region.ids.length
                  ? region.ids.map(regionLabel).join("、")
                  : region.group === "all"
                    ? "全部地区"
                    : region.group}
                <i />共 {rows.length} 家
              </span>
              {highPotentialOnly && (
                <Button
                  variant="ghost"
                  onClick={() => setHighPotentialOnly(false)}
                >
                  高潜客户 · AI评分≥85
                  <Icon name="close" size={11} />
                </Button>
              )}
              <span>
                {scoreMode === "incremental" ? "增量评分" : "全量评分"} ·{" "}
                {refreshed ? "刚刚刷新演示视图" : "10月27日 09:00 更新"}
              </span>
            </div>
            <div className="customer-type-note">
              <Icon name="help" size={13} />
              <span>
                最新客户：近 7
                天首次发现；老客户：此前已收录。客户新旧与是否跟进独立判断。
              </span>
            </div>
            <div className="table-wrap">
              <table className="customer-table opportunity-table retained-fields-table">
                <thead>
                  <tr>
                    <th className="selection-cell">
                      <Button
                        variant="ghost"
                        className="selection-toggle"
                        role="checkbox"
                        aria-checked={allSelected}
                        aria-label="选择当前页所有未跟进企业"
                        disabled={!eligible.length}
                        onClick={() =>
                          setSelection(allSelected ? [] : eligible)
                        }
                      >
                        <span
                          className={`checkbox ${allSelected ? "checked" : ""}`}
                        >
                          {allSelected ? (
                            <Icon name="check" size={11} />
                          ) : selection.length > 0 ? (
                            <span className="checkbox-dash" />
                          ) : null}
                        </span>
                      </Button>
                    </th>
                    <th className="retained-company-heading">
                      企业 / 主要业务
                    </th>
                    <th>客户类型</th>
                    <th className="development-heading">
                      开发评级 / 评分
                      <Icon name="sparkles" size={12} />
                    </th>
                    <th className="maturity-heading">商机成熟度</th>
                    <th className="strategy-heading">策略明细</th>
                    <th className="recommendation-heading">推荐理由</th>
                    <th>跟进状态</th>
                    <th>人工评价 / 评分</th>
                    <th className="tags-heading">人工标签</th>
                    <th>发现时间</th>
                    <th className="retained-actions-heading">操作</th>
                  </tr>
                </thead>
                <tbody>
                  {rows.map((c) => (
                    <tr
                      key={c.index}
                      className={
                        selection.includes(c.index) ? "selection-row" : ""
                      }
                      data-company={c.name}
                    >
                      <td className="selection-cell">
                        <Button
                          variant="ghost"
                          className="selection-toggle"
                          role="checkbox"
                          aria-checked={selection.includes(c.index)}
                          aria-label={`选择企业：${c.name}`}
                          disabled={c.followed}
                          onClick={() =>
                            setSelection((prev) =>
                              prev.includes(c.index)
                                ? prev.filter((i) => i !== c.index)
                                : [...prev, c.index],
                            )
                          }
                        >
                          <span
                            className={`checkbox ${
                              selection.includes(c.index) ? "checked" : ""
                            }`}
                          >
                            {selection.includes(c.index) && (
                              <Icon name="check" size={11} />
                            )}
                          </span>
                        </Button>
                      </td>
                      <td className="retained-company-cell">
                        <div className="opportunity-company-cell">
                          <div>
                            <Button
                              className="company-link"
                              variant="ghost"
                              onClick={() => onOpen(c.index)}
                            >
                              <span className={`company-avatar ${c.color}`}>
                                {c.short.slice(0, 1)}
                              </span>
                              <span>
                                <strong>{c.name}</strong>
                                <span className="company-meta">
                                  {c.location}
                                  <i />
                                  {c.industry}
                                </span>
                              </span>
                            </Button>
                          </div>
                          <StarButton
                            company={c}
                            onToggle={() => onStar(c.index)}
                          />
                        </div>
                        <p
                          className="business-summary"
                          title={c.businessSummary}
                        >
                          {c.businessSummary}
                        </p>
                      </td>
                      <td>
                        <span
                          className={`customer-type-badge ${
                            c.customerType === "new" ? "new-customer" : ""
                          }`}
                        >
                          {c.customerType === "new" && <span />}
                          {c.customerType === "new" ? "最新客户" : "老客户"}
                        </span>
                      </td>
                      <td>
                        <DevelopmentScore company={c} />
                        {scoreMode === "incremental" && (
                          <span
                            className={`score-increment ${
                              c.scoreDelta < 0 ? "declining" : ""
                            }`}
                          >
                            较昨日 {c.scoreDelta > 0 ? "+" : ""}
                            {c.scoreDelta.toFixed(1)}
                          </span>
                        )}
                      </td>
                      <td>
                        <MaturityBadge company={c} />
                      </td>
                      <td className="strategy-cell">
                        <SignalChips company={c} />
                      </td>
                      <td className="recommendation-cell">
                        <p title={c.recommendation}>{c.recommendation}</p>
                        <Button
                          variant="ghost"
                          className="text-link"
                          onClick={() => onOpen(c.index, 3)}
                        >
                          查看依据
                          <Icon name="chevron" size={11} />
                        </Button>
                      </td>
                      <td>
                        <span
                          className={`mini-status ${
                            c.followed ? "following" : ""
                          } ${c.status === "待跟进" ? "pending" : ""}`}
                        >
                          <i />
                          {c.followed ? c.status : "未加入跟进"}
                        </span>
                      </td>
                      <td>
                        <Evaluation
                          company={c}
                          onFeedback={(feedback) =>
                            onFeedback(c.index, feedback)
                          }
                          onRate={() => onRate(c.index)}
                        />
                      </td>
                      <td className="retained-tags-cell">
                        <CompanyTags
                          company={c}
                          onEdit={() => onTags(c.index)}
                        />
                      </td>
                      <td>
                        <span className="discovery-date">
                          {c.discoveredAt.slice(5)}
                        </span>
                        {c.customerType === "new" && (
                          <span className="discovery-note">
                            {c.discoveredAt === "2025-10-27"
                              ? "今日发现"
                              : "近期发现"}
                          </span>
                        )}
                      </td>
                      <td className="retained-actions-cell">
                        <div className="retained-row-actions">
                          <Button
                            variant={c.followed ? "ghost" : "default"}
                            className={
                              c.followed
                                ? "text-link view-follow"
                                : "row-follow"
                            }
                            onClick={() =>
                              c.followed ? onOpen(c.index) : onFollow([c.index])
                            }
                          >
                            <Icon
                              name={c.followed ? "chevron" : "plus"}
                              size={13}
                            />
                            {c.followed ? "查看跟进" : "一键跟进"}
                          </Button>
                          <Button
                            variant="ghost"
                            className="annotate-button"
                            onClick={() => onTags(c.index)}
                          >
                            <Icon name="plus" size={12} />
                            标注
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {!rows.length && (
                <div className="empty-state">
                  <Icon name="search" size={28} />
                  <Heading level={3}>暂无符合条件的客户</Heading>
                  <p>试试调整客户类型、星标或跟进状态。</p>
                  <Button onClick={clearFilters}>清除筛选</Button>
                </div>
              )}
            </div>
            <div className="table-footer">
              <span>
                共 {rows.length} 家企业
                {selection.length > 0 && ` · 已选择 ${selection.length} 家`}
              </span>
              <span>设计预览 · 演示数据 · 当前页展示全部结果</span>
            </div>
          </section>
          <div className="complete-fields-hint">
            <Icon name="arrow" size={13} />
            横向滚动可查看全部字段，企业与操作列固定显示。
          </div>
        </div>
        <aside className="live-signals-panel">
          <div className="live-signals-heading">
            <Heading level={2}>实时信号</Heading>
            <span>
              <i />
              DEMO
            </span>
          </div>
          <div className="live-signals-tabs">
            <Button
              variant="ghost"
              className={signalTab === "purchase" ? "active" : ""}
              onClick={() => setSignalTab("purchase")}
            >
              采购
            </Button>
            <Button
              variant="ghost"
              className={signalTab === "recruitment" ? "active" : ""}
              onClick={() => setSignalTab("recruitment")}
            >
              招聘
            </Button>
          </div>
          <p className="live-signal-scope">
            <Icon name="pin" size={11} />
            随当前市场与地区切换
          </p>
          {signals.length ? (
            signals.map((c) => (
              <article className="live-signal-card" key={c.index}>
                <div>
                  <span>
                    {signalTab === "purchase" ? "采购线索" : "招聘动态"}
                  </span>
                  <span>示例</span>
                </div>
                <Button variant="ghost" onClick={() => onOpen(c.index, 3)}>
                  {c.name}
                </Button>
                <p>{c.location}</p>
                <p>
                  {signalTab === "purchase"
                    ? "材料相关采购信号，待进一步核实。"
                    : "相关岗位招聘动态，建议关注业务扩展。"}{" "}
                </p>
                <div className="live-signal-bottom">
                  <span>AI评分 {c.score}/100</span>
                  <time>10-27</time>
                </div>
              </article>
            ))
          ) : (
            <div className="signals-empty">
              <Icon name="chart" size={25} />
              <p>当前地区暂无示例信号</p>
              <span>可调整地区或切换信号类型。</span>
            </div>
          )}
          <div className="live-signals-note">
            仅演示信号布局，非实时抓取数据。
          </div>
        </aside>
      </div>
      <div className="opportunity-bottom-note">
        <Icon name="target" size={14} />
        <span>
          一键跟进后，企业将进入「跟进记录 → 待跟进」，不会自动变为跟进中。
        </span>
      </div>
    </div>
  )
}
