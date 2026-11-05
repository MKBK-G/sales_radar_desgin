import QuickStartGuide from "./QuickStartGuide"
import type { Industry } from "./industry-data"
import type { Market } from "./regions"

type Props = {
  active: boolean
  industry?: Industry
  market: Market
  newChatRequest: number
  onBack: () => void
}

export default function IndustryChat({
  active,
  industry,
  market,
  newChatRequest,
  onBack,
}: Props) {
  const initialMarket = industry?.market || market
  return (
    <QuickStartGuide
      key={`${industry?.id || "new"}-${newChatRequest}`}
      mode="assistant"
      conversationName={
        industry ? `${industry.shortName} · 业务对话` : undefined
      }
      initialMarket={initialMarket === "overseas" ? "海外市场" : "国内市场"}
      active={active}
      onDismiss={onBack}
    />
  )
}
