export type Market = "domestic" | "overseas"
export type Geography = {
  market: Market
  countryCode: string | null
  provinceCode?: string
  cityCode?: string
}
export type RegionOption = {
  id: string
  label: string
  group: string
  english?: string
  cities?: {
    code: string
    label: string
  }[]
}
export type RegionSelection = {
  group: string
  ids: string[]
}
export const emptyRegion: RegionSelection = { group: "all", ids: [] }
export const domesticGroups = [
  "华东",
  "华南",
  "华北",
  "华中",
  "西南",
  "西北",
  "东北",
  "港澳台",
]
export const overseasGroups = [
  "亚洲",
  "欧洲",
  "北美洲",
  "南美洲",
  "大洋洲",
  "非洲",
]
export const provinces: RegionOption[] = [
  {
    id: "11",
    label: "北京",
    group: "华北",
    cities: [{ code: "110100", label: "北京市" }],
  },
  {
    id: "12",
    label: "天津",
    group: "华北",
    cities: [{ code: "120100", label: "天津市" }],
  },
  {
    id: "13",
    label: "河北",
    group: "华北",
    cities: [
      { code: "130100", label: "石家庄" },
      { code: "130200", label: "唐山" },
    ],
  },
  {
    id: "14",
    label: "山西",
    group: "华北",
    cities: [{ code: "140100", label: "太原" }],
  },
  {
    id: "15",
    label: "内蒙古",
    group: "华北",
    cities: [{ code: "150100", label: "呼和浩特" }],
  },
  {
    id: "21",
    label: "辽宁",
    group: "东北",
    cities: [
      { code: "210100", label: "沈阳" },
      { code: "210200", label: "大连" },
    ],
  },
  {
    id: "22",
    label: "吉林",
    group: "东北",
    cities: [{ code: "220100", label: "长春" }],
  },
  {
    id: "23",
    label: "黑龙江",
    group: "东北",
    cities: [{ code: "230100", label: "哈尔滨" }],
  },
  {
    id: "31",
    label: "上海",
    group: "华东",
    cities: [{ code: "310100", label: "上海市" }],
  },
  {
    id: "32",
    label: "江苏",
    group: "华东",
    cities: [
      { code: "320100", label: "南京" },
      { code: "320500", label: "苏州" },
      { code: "321000", label: "扬州" },
      { code: "320200", label: "无锡" },
    ],
  },
  {
    id: "33",
    label: "浙江",
    group: "华东",
    cities: [
      { code: "330100", label: "杭州" },
      { code: "330200", label: "宁波" },
      { code: "330700", label: "金华" },
      { code: "330300", label: "温州" },
    ],
  },
  {
    id: "34",
    label: "安徽",
    group: "华东",
    cities: [
      { code: "340100", label: "合肥" },
      { code: "340200", label: "芜湖" },
    ],
  },
  {
    id: "35",
    label: "福建",
    group: "华东",
    cities: [
      { code: "350100", label: "福州" },
      { code: "350200", label: "厦门" },
    ],
  },
  {
    id: "36",
    label: "江西",
    group: "华东",
    cities: [{ code: "360100", label: "南昌" }],
  },
  {
    id: "37",
    label: "山东",
    group: "华东",
    cities: [
      { code: "370100", label: "济南" },
      { code: "370200", label: "青岛" },
    ],
  },
  {
    id: "41",
    label: "河南",
    group: "华中",
    cities: [
      { code: "410100", label: "郑州" },
      { code: "410600", label: "鹤壁" },
      { code: "410700", label: "新乡" },
    ],
  },
  {
    id: "42",
    label: "湖北",
    group: "华中",
    cities: [{ code: "420100", label: "武汉" }],
  },
  {
    id: "43",
    label: "湖南",
    group: "华中",
    cities: [{ code: "430100", label: "长沙" }],
  },
  {
    id: "44",
    label: "广东",
    group: "华南",
    cities: [
      { code: "440100", label: "广州" },
      { code: "440300", label: "深圳" },
      { code: "440600", label: "佛山" },
      { code: "441900", label: "东莞" },
    ],
  },
  {
    id: "45",
    label: "广西",
    group: "华南",
    cities: [{ code: "450100", label: "南宁" }],
  },
  {
    id: "46",
    label: "海南",
    group: "华南",
    cities: [{ code: "460100", label: "海口" }],
  },
  {
    id: "50",
    label: "重庆",
    group: "西南",
    cities: [{ code: "500100", label: "重庆市" }],
  },
  {
    id: "51",
    label: "四川",
    group: "西南",
    cities: [{ code: "510100", label: "成都" }],
  },
  {
    id: "52",
    label: "贵州",
    group: "西南",
    cities: [{ code: "520100", label: "贵阳" }],
  },
  {
    id: "53",
    label: "云南",
    group: "西南",
    cities: [{ code: "530100", label: "昆明" }],
  },
  {
    id: "54",
    label: "西藏",
    group: "西南",
    cities: [{ code: "540100", label: "拉萨" }],
  },
  {
    id: "61",
    label: "陕西",
    group: "西北",
    cities: [{ code: "610100", label: "西安" }],
  },
  {
    id: "62",
    label: "甘肃",
    group: "西北",
    cities: [{ code: "620100", label: "兰州" }],
  },
  {
    id: "63",
    label: "青海",
    group: "西北",
    cities: [{ code: "630100", label: "西宁" }],
  },
  {
    id: "64",
    label: "宁夏",
    group: "西北",
    cities: [{ code: "640100", label: "银川" }],
  },
  {
    id: "65",
    label: "新疆",
    group: "西北",
    cities: [{ code: "650100", label: "乌鲁木齐" }],
  },
  {
    id: "71",
    label: "台湾",
    group: "港澳台",
    cities: [{ code: "710100", label: "台北" }],
  },
  { id: "81", label: "香港", group: "港澳台" },
  { id: "82", label: "澳门", group: "港澳台" },
]
export const countries: RegionOption[] = [
  { id: "US", label: "美国", english: "United States USA", group: "北美洲" },
  { id: "CA", label: "加拿大", english: "Canada", group: "北美洲" },
  { id: "MX", label: "墨西哥", english: "Mexico", group: "北美洲" },
  { id: "DE", label: "德国", english: "Germany", group: "欧洲" },
  { id: "GB", label: "英国", english: "United Kingdom UK", group: "欧洲" },
  { id: "FR", label: "法国", english: "France", group: "欧洲" },
  { id: "PL", label: "波兰", english: "Poland", group: "欧洲" },
  { id: "IT", label: "意大利", english: "Italy", group: "欧洲" },
  { id: "ES", label: "西班牙", english: "Spain", group: "欧洲" },
  { id: "NL", label: "荷兰", english: "Netherlands", group: "欧洲" },
  { id: "JP", label: "日本", english: "Japan", group: "亚洲" },
  { id: "KR", label: "韩国", english: "South Korea", group: "亚洲" },
  { id: "VN", label: "越南", english: "Vietnam", group: "亚洲" },
  { id: "TH", label: "泰国", english: "Thailand", group: "亚洲" },
  { id: "SG", label: "新加坡", english: "Singapore", group: "亚洲" },
  { id: "MY", label: "马来西亚", english: "Malaysia", group: "亚洲" },
  { id: "IN", label: "印度", english: "India", group: "亚洲" },
  {
    id: "AE",
    label: "阿联酋",
    english: "United Arab Emirates UAE",
    group: "亚洲",
  },
  { id: "AU", label: "澳大利亚", english: "Australia", group: "大洋洲" },
  { id: "NZ", label: "新西兰", english: "New Zealand", group: "大洋洲" },
  { id: "BR", label: "巴西", english: "Brazil", group: "南美洲" },
  { id: "CL", label: "智利", english: "Chile", group: "南美洲" },
  { id: "ZA", label: "南非", english: "South Africa", group: "非洲" },
  { id: "EG", label: "埃及", english: "Egypt", group: "非洲" },
]

const seedLocations: Record<string, Geography> = {
  "冠荣控股（广东）有限公司": {
    market: "domestic",
    countryCode: "CN",
    provinceCode: "44",
    cityCode: "440100",
  },
  道明光学股份有限公司: {
    market: "domestic",
    countryCode: "CN",
    provinceCode: "33",
    cityCode: "330700",
  },
  新乡市鑫迪防护发展有限公司: {
    market: "domestic",
    countryCode: "CN",
    provinceCode: "41",
    cityCode: "410700",
  },
  扬州顺达新材料有限公司: {
    market: "domestic",
    countryCode: "CN",
    provinceCode: "32",
    cityCode: "321000",
  },
  新乡市艾长防护服装有限公司: {
    market: "domestic",
    countryCode: "CN",
    provinceCode: "41",
    cityCode: "410700",
  },
  江苏卡思迪莱服饰有限公司: {
    market: "domestic",
    countryCode: "CN",
    provinceCode: "32",
    cityCode: "320100",
  },
  湖南新裕新材料有限公司: {
    market: "domestic",
    countryCode: "CN",
    provinceCode: "43",
    cityCode: "430100",
  },
  安徽亨安防护科技有限公司: {
    market: "domestic",
    countryCode: "CN",
    provinceCode: "34",
    cityCode: "340100",
  },
  辽宁通达科技项目管理有限公司: {
    market: "domestic",
    countryCode: "CN",
    provinceCode: "21",
    cityCode: "210100",
  },
  佛山市荣兴商贸有限公司: {
    market: "domestic",
    countryCode: "CN",
    provinceCode: "44",
    cityCode: "440600",
  },
  浙江星华新材料集团股份有限公司: {
    market: "domestic",
    countryCode: "CN",
    provinceCode: "33",
    cityCode: "330100",
  },
  鹤壁市反光材料有限公司: {
    market: "domestic",
    countryCode: "CN",
    provinceCode: "41",
    cityCode: "410600",
  },
  青岛瑞安防护科技有限公司: {
    market: "domestic",
    countryCode: "CN",
    provinceCode: "37",
    cityCode: "370200",
  },
  苏州明辉光学科技有限公司: {
    market: "domestic",
    countryCode: "CN",
    provinceCode: "32",
    cityCode: "320500",
  },
  "3M Deutschland GmbH": { market: "overseas", countryCode: "DE" },
  "REFLOACTIVE Sp. z o.o.": { market: "overseas", countryCode: "PL" },
  "Safety First UK Ltd": { market: "overseas", countryCode: "GB" },
  "ORAFOL Europe GmbH": { market: "overseas", countryCode: "DE" },
  "Reflective Apparel Inc.": { market: "overseas", countryCode: "US" },
  "SafeGuard Canada Ltd": { market: "overseas", countryCode: "CA" },
  "Nippon Safety Materials Co.": { market: "overseas", countryCode: "JP" },
  "Seoul Reflective Co.": { market: "overseas", countryCode: "KR" },
  "VietSafe Workwear Co.": { market: "overseas", countryCode: "VN" },
  "AU Safety Supplies Pty Ltd": { market: "overseas", countryCode: "AU" },
  华信防护材料有限公司: { market: "domestic", countryCode: "CN" },
  "Overseas Safety Trading": { market: "overseas", countryCode: null },
}
export function seedGeography(name: string): Geography {
  return seedLocations[name] || { market: "overseas", countryCode: null }
}
export function regionUnknown(geo: Geography) {
  return geo.market === "domestic" ? !geo.provinceCode : !geo.countryCode
}
export function matchesRegion(
  geo: Geography,
  selection: RegionSelection,
): boolean {
  if (selection.ids.length) {
    return selection.ids.some((id) =>
      id === "unknown"
        ? regionUnknown(geo)
        : id === `province:${geo.provinceCode}` ||
          id === `city:${geo.cityCode}` ||
          id === `country:${geo.countryCode}`,
    )
  }
  if (selection.group === "all") return true
  return (
    (geo.market === "domestic"
      ? provinces.find((p) => p.id === geo.provinceCode)
      : countries.find((c) => c.id === geo.countryCode)
    )?.group === selection.group
  )
}
export function provinceScopeLabel(province: RegionOption) {
  return `${province.label}${
    ["11", "12", "31", "50"].includes(province.id)
      ? "全市"
      : ["81", "82"].includes(province.id)
        ? "全域"
        : "全省"
  }`
}
export function regionLabel(id: string) {
  if (id === "unknown") return "地区未知"
  const [type, code] = id.split(":")
  if (type === "province")
    return provinceScopeLabel(
      provinces.find((p) => p.id === code) || {
        id: code,
        label: code,
        group: "",
      },
    )
  if (type === "country")
    return countries.find((c) => c.id === code)?.label || code
  const province = provinces.find((p) => p.cities?.some((c) => c.code === code))
  return `${province?.label || ""} · ${province?.cities?.find((c) => c.code === code)?.label || code}`
}
export function toggleRegion(ids: string[], id: string): string[] {
  if (ids.includes(id)) return ids.filter((v) => v !== id)
  if (id.startsWith("province:")) {
    const province = provinces.find((p) => `province:${p.id}` === id)
    return [
      ...ids.filter(
        (v) => !province?.cities?.some((c) => v === `city:${c.code}`),
      ),
      id,
    ]
  }
  if (id.startsWith("city:")) {
    const parent = provinces.find((p) =>
      p.cities?.some((c) => `city:${c.code}` === id),
    )
    return [...ids.filter((v) => v !== `province:${parent?.id}`), id]
  }
  return [...ids, id]
}
