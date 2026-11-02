import { useState } from "react"
import type { Company } from "./App"
import { Button, Heading, Icon, Input } from "./ui"

export type OpportunityProfile = {
  skillScore: number
  developmentGrade: "高" | "中" | "低"
  maturity: "S" | "A" | "B" | "C"
  maturityDescription: string
  businessSummary: string
  strategySignals: {
    label: string
    count: number
  }[]
  recommendation: string
  tags: string[]
}

export const tagGroups = [
  {
    title: "价值分层",
    tone: "purple",
    tags: ["高潜客户", "战略客户", "中潜客户", "低价值客户"],
  },
  {
    title: "业务关系",
    tone: "orange",
    tags: ["竞争对手/同行", "潜在合作伙伴", "上游供应商", "渠道商/集成商"],
  },
  {
    title: "销售阶段",
    tone: "green",
    tags: ["已联系", "需求确认中", "已成交", "已流失"],
  },
  {
    title: "特殊标记",
    tone: "red",
    tags: ["数据有误", "重点企业", "勿扰/黑名单"],
  },
  { title: "行业角色", tone: "blue", tags: ["终端用户", "设计院/科研"] },
]

const predefinedTags = tagGroups.flatMap((g) => g.tags)
function tagTone(tag: string) {
  return tagGroups.find((g) => g.tags.includes(tag))?.tone || "neutral"
}

export function createOpportunityProfile(
  company: {
    industry: string
    score: number
    result: string
  },
  index: number,
): OpportunityProfile {
  const maturity =
    company.result === "需求已确认" || company.result === "已成交"
      ? "S"
      : company.result === "已发送方案" || index === 10
        ? "A"
        : index % 3 === 0
          ? "C"
          : "B"
  const descriptions = {
    S: "已有明确需求，持续核验",
    A: "采购相关信号，待核验",
    B: "业务匹配，待确认意向",
    C: "初步线索，待补充信号",
  }
  return {
    skillScore: Math.min(99, company.score + 5),
    developmentGrade:
      company.score >= 80 ? "高" : company.score >= 65 ? "中" : "低",
    maturity,
    maturityDescription: descriptions[maturity],
    businessSummary: `主要从事${company.industry.replace(" · ", "、")}相关产品及服务，覆盖产品研发、生产与行业应用。`,
    strategySignals: [
      {
        label: index % 3 === 0 ? "应用场景" : "客户相似扩展",
        count: 18 - (index % 9),
      },
      { label: "产品链路", count: 6 - (index % 4) },
      ...(index % 2 === 0
        ? [{ label: "采购招标", count: 1 + (index % 3) }]
        : [{ label: "技术演进", count: 1 }]),
      ...(index % 4 === 0 ? [{ label: "公共信息有效", count: 1 }] : []),
    ],
    recommendation: `企业主营${company.industry}，与目标产品的行业应用及供应链场景存在关联。${
      maturity === "S"
        ? "已建立业务联系，建议围绕实际需求推进样品与报价。"
        : maturity === "A"
          ? "近期出现采购相关信号，建议优先核实采购计划、预算及决策人。"
          : "建议先核实实际业务场景和采购意向，再确定后续开发节奏。"
    }`,
    tags:
      index === 1
        ? ["高潜客户", "竞争对手/同行"]
        : index === 0
          ? ["高潜客户", "需求确认中"]
          : index === 7
            ? ["已成交", "潜在合作伙伴"]
            : index === 10
              ? ["高潜客户"]
              : [],
  }
}

export function DevelopmentScore({ company }: { company: Company }) {
  return (
    <div className="development-score">
      <span
        className={`development-grade grade-${
          company.developmentGrade === "高"
            ? "high"
            : company.developmentGrade === "中"
              ? "medium"
              : "low"
        }`}
      >
        {company.developmentGrade}
      </span>
      <span>
        Skill 评分 <strong>{company.skillScore}</strong>
      </span>
      <span>
        AI 评分 <strong className="opportunity-score">{company.score}</strong>
        <span className="score-denominator"> /100</span>
      </span>
    </div>
  )
}

export function MaturityBadge({ company }: { company: Company }) {
  return (
    <div className="maturity-cell">
      <span className={`maturity-badge maturity-${company.maturity}`}>
        {company.maturity}
      </span>
      <span>
        <strong>商机成熟度</strong>
        <span>{company.maturityDescription}</span>
      </span>
    </div>
  )
}

export function SignalChips({ company }: { company: Company }) {
  return (
    <div className="strategy-chips">
      {company.strategySignals.map((signal, i) => (
        <span key={signal.label} className={i === 2 ? "signal-highlight" : ""}>
          {signal.label}
          <span>×{signal.count}</span>
        </span>
      ))}
    </div>
  )
}

export function CompanyTags({
  company,
  onEdit,
}: {
  company: Company
  onEdit: () => void
}) {
  return (
    <div className="company-tags" aria-label={`${company.name}的人工标签`}>
      {company.tags.map((tag) => (
        <Button
          key={tag}
          variant="ghost"
          className={`customer-tag tag-${tagTone(tag)}`}
          onClick={onEdit}
        >
          {tag}
        </Button>
      ))}
      {company.tags.length === 0 && (
        <Button variant="ghost" className="empty-tags" onClick={onEdit}>
          未标注
        </Button>
      )}
    </div>
  )
}

type TagEditorProps = {
  selected: string[]
  onChange: (tags: string[]) => void
  customTags: string[]
  onAddCustom: (tag: string) => void
}
export function TagEditor({
  selected,
  onChange,
  customTags,
  onAddCustom,
}: TagEditorProps) {
  const [custom, setCustom] = useState("")
  const toggle = (tag: string) =>
    onChange(
      selected.includes(tag)
        ? selected.filter((t) => t !== tag)
        : [...selected, tag],
    )
  const addCustom = () => {
    const tag = custom.trim()
    if (!tag) return
    if (!predefinedTags.includes(tag)) onAddCustom(tag)
    if (!selected.includes(tag)) onChange([...selected, tag])
    setCustom("")
  }
  const customOptions = [
    ...new Set([
      ...customTags,
      ...selected.filter((t) => !predefinedTags.includes(t)),
    ]),
  ]
  return (
    <div className="tag-editor">
      <div className="tag-editor-intro">
        <span>可多选标签，用于客户分层与后续筛选。</span>
        <span>已选 {selected.length} 项</span>
      </div>
      {tagGroups.map((group) => (
        <section className="tag-group" key={group.title}>
          <Heading level={3}>{group.title}</Heading>
          <div>
            {group.tags.map((tag) => (
              <Button
                key={tag}
                type="button"
                variant="ghost"
                className={`tag-option tag-${group.tone} ${
                  selected.includes(tag) ? "selected" : ""
                }`}
                aria-pressed={selected.includes(tag)}
                onClick={() => toggle(tag)}
              >
                {selected.includes(tag) && <Icon name="check" size={11} />}{" "}
                {tag}
              </Button>
            ))}
          </div>
        </section>
      ))}
      {customOptions.length > 0 && (
        <section className="tag-group">
          <Heading level={3}>自定义标签</Heading>
          <div>
            {customOptions.map((tag) => (
              <Button
                key={tag}
                type="button"
                variant="ghost"
                className={`tag-option tag-neutral ${
                  selected.includes(tag) ? "selected" : ""
                }`}
                aria-pressed={selected.includes(tag)}
                onClick={() => toggle(tag)}
              >
                {selected.includes(tag) && <Icon name="check" size={11} />}{" "}
                {tag}
              </Button>
            ))}
          </div>
        </section>
      )}
      <div className="custom-tag-form">
        <label htmlFor="custom-tag">新增自定义标签</label>
        <div>
          <Input
            id="custom-tag"
            maxLength={20}
            placeholder="输入标签名，如：老客户 / 需跟进"
            value={custom}
            onChange={(e) => setCustom(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault()
                addCustom()
              }
            }}
          />
          <Button type="button" disabled={!custom.trim()} onClick={addCustom}>
            <Icon name="plus" size={14} />
            添加
          </Button>
        </div>
        <span>最多 20 个字；点击保存后同步至两个菜单和企业详情。</span>
      </div>
      {selected.length > 0 && (
        <Button
          type="button"
          variant="ghost"
          className="text-link clear-tag-selection"
          onClick={() => onChange([])}
        >
          清空已选标签
        </Button>
      )}
    </div>
  )
}
