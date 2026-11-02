import { useEffect, useRef, useState } from "react"
import type { Company } from "./App"
import { Button, Heading, Icon, Input } from "./ui"
import {
  countries,
  domesticGroups,
  emptyRegion,
  matchesRegion,
  overseasGroups,
  provinces,
  provinceScopeLabel,
  regionLabel,
  toggleRegion,
  type Market,
  type RegionSelection,
} from "./regions"

type Props = {
  market: Market
  companies: Company[]
  value: RegionSelection
  onChange: (value: RegionSelection) => void
}
export default function RegionFilter({
  market,
  companies,
  value,
  onChange,
}: Props) {
  const [open, setOpen] = useState(false)
  const groups = market === "domestic" ? domesticGroups : overseasGroups
  const options = market === "domestic" ? provinces : countries
  const count = (selection: RegionSelection) =>
    companies.filter((c) => matchesRegion(c.geography, selection)).length
  const hotCodes =
    market === "domestic"
      ? ["44", "33", "32", "37", "41", "31", "11", "51"]
      : ["US", "DE", "GB", "JP", "VN", "CA", "AU", "PL"]
  const hot =
    value.group === "all"
      ? hotCodes
          .map((code) => options.find((o) => o.id === code)!)
          .filter(Boolean)
      : options.filter((o) => o.group === value.group)
  const active = value.ids.length > 0 || value.group !== "all"
  const select = (id: string) =>
    onChange({ group: "all", ids: toggleRegion(value.ids, id) })
  return (
    <section className="region-section" aria-label="按地区分类企业">
      <div className="region-section-heading">
        <div>
          <span className="region-heading-icon">
            <Icon name="pin" size={18} />
          </span>
          <Heading level={2}>按地区找企业</Heading>
          <span className="region-scope">
            {market === "domestic"
              ? "国内市场 · 省市筛选"
              : "海外市场 · 国家／地区筛选"}
          </span>
        </div>
        <span className="region-match-count">
          当前地区 <strong>{count(value)}</strong> 家企业
        </span>
      </div>
      <div className="region-line">
        <span className="region-line-label">
          {market === "domestic" ? "所属大区" : "所属大洲"}
        </span>
        <div className="region-group-options">
          <Button
            variant="ghost"
            className={!active ? "selected" : ""}
            onClick={() => onChange(emptyRegion)}
          >
            全部<span>{companies.length}</span>
          </Button>
          {groups.map((group) => (
            <Button
              key={group}
              variant="ghost"
              className={value.group === group ? "selected" : ""}
              onClick={() => onChange({ group, ids: [] })}
            >
              {group}
              <span>{count({ group, ids: [] })}</span>
            </Button>
          ))}
        </div>
      </div>
      <div className="region-line province-shortcuts">
        <span className="region-line-label">
          {value.group === "all"
            ? "常用地区"
            : market === "domestic"
              ? "选择省份"
              : "选择国家"}
        </span>
        <div className="region-shortcut-options">
          {hot.map((o) => {
            const id = `${
              market === "domestic" ? "province" : "country"
            }:${o.id}`
            return (
              <Button
                key={id}
                variant="ghost"
                aria-pressed={value.ids.includes(id)}
                className={value.ids.includes(id) ? "selected" : ""}
                onClick={() => select(id)}
              >
                {o.label}
                <span>{count({ group: "all", ids: [id] })}</span>
                {value.ids.includes(id) && <Icon name="check" size={12} />}
              </Button>
            )
          })}
          <Button
            variant="ghost"
            className="more-regions"
            onClick={() => setOpen(true)}
          >
            {market === "domestic" ? "更多省市" : "更多国家／地区"}
            <Icon name="chevron" size={12} />
          </Button>
          <Button
            variant="ghost"
            className={`unknown-region ${
              value.ids.includes("unknown") ? "selected" : ""
            }`}
            onClick={() => select("unknown")}
          >
            地区未知<span>{count({ group: "all", ids: ["unknown"] })}</span>
          </Button>
        </div>
      </div>
      {active && (
        <div className="region-selected-strip">
          <span>已选地区</span>
          {value.group !== "all" && (
            <Button variant="ghost" onClick={() => onChange(emptyRegion)}>
              {value.group}
              <Icon name="close" size={11} />
            </Button>
          )}
          {value.ids.map((id) => (
            <Button
              key={id}
              variant="ghost"
              onClick={() =>
                onChange({
                  group: "all",
                  ids: value.ids.filter((v) => v !== id),
                })
              }
            >
              {regionLabel(id)}
              <Icon name="close" size={11} />
            </Button>
          ))}
          <Button
            variant="ghost"
            className="clear-region"
            onClick={() => onChange(emptyRegion)}
          >
            清除地区
          </Button>
        </div>
      )}
      <div className="region-footnote">
        <Icon name="help" size={12} />
        <span>
          按企业所在地筛选；多个地区取并集，与行业、评分及标签条件交叉筛选。地区及企业均为演示数据。
        </span>
      </div>
      {open && (
        <RegionPicker
          market={market}
          companies={companies}
          value={value}
          onClose={() => setOpen(false)}
          onApply={(next) => {
            onChange(next)
            setOpen(false)
          }}
        />
      )}
    </section>
  )
}

type PickerProps = Props & {
  onClose: () => void
  onApply: (value: RegionSelection) => void
}
function RegionPicker({
  market,
  companies,
  value,
  onClose,
  onApply,
}: Omit<PickerProps, "onChange">) {
  const [draft, setDraft] = useState(
    value.ids.length
      ? value.ids
      : value.group !== "all"
        ? (market === "domestic" ? provinces : countries)
            .filter((o) => o.group === value.group)
            .map(
              (o) =>
                `${market === "domestic" ? "province" : "country"}:${o.id}`,
            )
        : [],
  )
  const [browse, setBrowse] = useState(
    market === "domestic"
      ? value.ids.find((id) => id.startsWith("province:"))?.split(":")[1] ||
          provinces.find((p) => p.group === value.group)?.id ||
          "44"
      : value.group !== "all"
        ? value.group
        : "欧洲",
  )
  const [search, setSearch] = useState("")
  const dialog = useRef<HTMLDivElement>(null)
  const domestic = market === "domestic"
  const q = search.trim().toLowerCase()
  const province = provinces.find((p) => p.id === browse) || provinces[0]
  const cities = province.cities || []
  const wholeProvince = draft.includes(`province:${province.id}`)
  const matchingProvinces = provinces.filter(
    (p) =>
      !q || `${p.label} ${p.cities?.map((c) => c.label).join(" ")}`.includes(q),
  )
  const matchingCountries = countries.filter((c) =>
    q
      ? `${c.label} ${c.english}`.toLowerCase().includes(q)
      : c.group === browse,
  )
  const matchingCities = q
    ? provinces.flatMap((p) =>
        (p.cities || [])
          .filter((c) => `${p.label}${c.label}`.includes(q))
          .map((c) => ({ ...c, province: p })),
      )
    : cities.map((c) => ({ ...c, province }))
  const count = (id: string) =>
    companies.filter((c) =>
      matchesRegion(c.geography, { group: "all", ids: [id] }),
    ).length
  const toggle = (id: string) => setDraft((prev) => toggleRegion(prev, id))
  useEffect(() => {
    const previous = document.activeElement as HTMLElement | null
    const overflow = document.body.style.overflow
    document.body.style.overflow = "hidden"
    dialog.current?.focus()
    const key = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.stopImmediatePropagation()
        onClose()
      }
      if (e.key === "Tab") {
        const nodes = dialog.current?.querySelectorAll<HTMLElement>(
          "button:not(:disabled), input",
        )
        if (!nodes?.length) return
        const first = nodes[0],
          last = nodes[nodes.length - 1]
        if (
          e.shiftKey &&
          (document.activeElement === first ||
            document.activeElement === dialog.current)
        ) {
          e.preventDefault()
          last.focus()
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault()
          first.focus()
        }
      }
    }
    window.addEventListener("keydown", key, true)
    return () => {
      document.body.style.overflow = overflow
      previous?.focus()
      window.removeEventListener("keydown", key, true)
    }
  }, [onClose])
  return (
    <div className="modal-backdrop region-picker-backdrop" onClick={onClose}>
      <div
        className="region-picker"
        role="dialog"
        aria-modal="true"
        aria-labelledby="region-picker-title"
        tabIndex={-1}
        ref={dialog}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="region-picker-heading">
          <div>
            <Heading level={2}>
              <span id="region-picker-title">
                {domestic ? "选择省份与城市" : "选择国家／地区"}
              </span>
            </Heading>
            <p>
              {domestic
                ? "支持跨省多选，也可以按城市精细选择。"
                : "按大洲浏览，支持跨国家、跨大洲多选。"}
            </p>
          </div>
          <Button
            variant="ghost"
            className="icon-button"
            aria-label="关闭地区选择"
            onClick={onClose}
          >
            <Icon name="close" size={19} />
          </Button>
        </div>
        <div className="region-picker-search">
          <Icon name="search" size={16} />
          <Input
            aria-label="搜索地区"
            placeholder={
              domestic
                ? "搜索省份或城市，如：广东、杭州"
                : "搜索国家中文名或英文名，如：德国、Germany"
            }
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="region-picker-columns">
          <div className="region-picker-rail">
            <div className="region-picker-column-label">
              {domestic ? "省份 / 地区" : "大洲"}
            </div>
            {domestic
              ? matchingProvinces.map((p) => (
                  <Button
                    key={p.id}
                    variant="ghost"
                    className={browse === p.id && !q ? "active" : ""}
                    onClick={() => {
                      setBrowse(p.id)
                      setSearch("")
                    }}
                  >
                    {p.label}
                    <span>{count(`province:${p.id}`)}</span>
                    {draft.some(
                      (id) =>
                        id === `province:${p.id}` ||
                        p.cities?.some((c) => id === `city:${c.code}`),
                    ) && <i />}
                    <Icon name="chevron" size={11} />
                  </Button>
                ))
              : overseasGroups.map((group) => (
                  <Button
                    key={group}
                    variant="ghost"
                    className={browse === group && !q ? "active" : ""}
                    onClick={() => {
                      setBrowse(group)
                      setSearch("")
                    }}
                  >
                    {group}
                    <span>
                      {
                        companies.filter((c) =>
                          matchesRegion(c.geography, { group, ids: [] }),
                        ).length
                      }
                    </span>
                    <Icon name="chevron" size={11} />
                  </Button>
                ))}
          </div>
          <div className="region-picker-results">
            <div className="region-picker-column-label">
              {q
                ? "搜索结果"
                : domestic
                  ? `${province.label} · 城市`
                  : `${browse} · 国家／地区`}
            </div>
            {domestic && !q && (
              <Button
                variant="ghost"
                className={`region-whole-province ${
                  wholeProvince ? "checked" : ""
                }`}
                role="checkbox"
                aria-checked={wholeProvince}
                onClick={() => toggle(`province:${province.id}`)}
              >
                <span className={`checkbox ${wholeProvince ? "checked" : ""}`}>
                  {wholeProvince && <Icon name="check" size={11} />}
                </span>
                选择{provinceScopeLabel(province)}
                <span>{count(`province:${province.id}`)} 家企业</span>
              </Button>
            )}
            {domestic &&
              q &&
              matchingProvinces
                .filter((p) => p.label.includes(q))
                .map((p) => (
                  <Button
                    key={p.id}
                    variant="ghost"
                    className="region-whole-province"
                    role="checkbox"
                    aria-checked={draft.includes(`province:${p.id}`)}
                    onClick={() => toggle(`province:${p.id}`)}
                  >
                    <span
                      className={`checkbox ${
                        draft.includes(`province:${p.id}`) ? "checked" : ""
                      }`}
                    >
                      {draft.includes(`province:${p.id}`) && (
                        <Icon name="check" size={11} />
                      )}
                    </span>
                    {provinceScopeLabel(p)}
                    <span>{count(`province:${p.id}`)} 家</span>
                  </Button>
                ))}
            <div className="region-picker-grid">
              {domestic
                ? matchingCities.map((c) => {
                    const checked =
                      draft.includes(`city:${c.code}`) ||
                      draft.includes(`province:${c.province.id}`)
                    const disabled = draft.includes(`province:${c.province.id}`)
                    return (
                      <Button
                        key={c.code}
                        variant="ghost"
                        className={checked ? "checked" : ""}
                        role="checkbox"
                        aria-checked={checked}
                        disabled={disabled}
                        onClick={() => toggle(`city:${c.code}`)}
                      >
                        <span
                          className={`checkbox ${checked ? "checked" : ""}`}
                        >
                          {checked && <Icon name="check" size={11} />}
                        </span>
                        <span>
                          {q ? `${c.province.label} · ` : ""}
                          {c.label}
                        </span>
                        <span>{count(`city:${c.code}`)}</span>
                      </Button>
                    )
                  })
                : matchingCountries.map((c) => {
                    const checked = draft.includes(`country:${c.id}`)
                    return (
                      <Button
                        key={c.id}
                        variant="ghost"
                        className={checked ? "checked" : ""}
                        role="checkbox"
                        aria-checked={checked}
                        onClick={() => toggle(`country:${c.id}`)}
                      >
                        <span
                          className={`checkbox ${checked ? "checked" : ""}`}
                        >
                          {checked && <Icon name="check" size={11} />}
                        </span>
                        <span>
                          {c.label}
                          <span className="country-english">
                            {c.english?.replace(" USA", "").replace(" UK", "")}
                          </span>
                        </span>
                        <span>{count(`country:${c.id}`)}</span>
                      </Button>
                    )
                  })}
            </div>
            {(domestic
              ? matchingCities.length === 0 &&
                (!q || matchingProvinces.length === 0)
              : matchingCountries.length === 0) && (
              <div className="region-picker-empty">
                {q
                  ? "没有匹配的地区，请调整关键词。"
                  : "此地区暂无城市级演示数据，可选择全部地区。"}
              </div>
            )}
            <p className="region-picker-hint">
              {domestic && wholeProvince
                ? "已选择全部地区。取消全选后，可以单独选择城市。"
                : "数量仅统计当前市场、当前监测行业中的演示企业；0 表示暂无示例记录。"}
            </p>
          </div>
        </div>
        <div className="region-picker-selection">
          <div>
            <span>已选 {draft.length} 项</span>
            <Button variant="ghost" onClick={() => setDraft([])}>
              清空
            </Button>
          </div>
          <div>
            {draft.length ? (
              draft.map((id) => (
                <Button
                  key={id}
                  variant="ghost"
                  onClick={() =>
                    setDraft((prev) => prev.filter((v) => v !== id))
                  }
                >
                  {regionLabel(id)}
                  <Icon name="close" size={11} />
                </Button>
              ))
            ) : (
              <span className="region-none-selected">
                暂未选择，确定后查看当前市场的全部地区。
              </span>
            )}
          </div>
        </div>
        <div className="region-picker-footer">
          <Button
            variant="ghost"
            className="picker-unknown"
            role="checkbox"
            aria-checked={draft.includes("unknown")}
            onClick={() => toggle("unknown")}
          >
            <span
              className={`checkbox ${
                draft.includes("unknown") ? "checked" : ""
              }`}
            >
              {draft.includes("unknown") && <Icon name="check" size={11} />}
            </span>
            地区未知<span>({count("unknown")})</span>
          </Button>
          <div>
            <Button onClick={onClose}>取消</Button>
            <Button
              variant="primary"
              onClick={() => onApply({ group: "all", ids: draft })}
            >
              确定筛选
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
