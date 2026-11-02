import type { Company } from "./App"
import { Button, Icon } from "./ui"

type StarButtonProps = {
  company: Company
  onToggle: () => void
}
export function StarButton({ company, onToggle }: StarButtonProps) {
  const label = `${company.starred ? "取消" : "标记"}重点客户：${company.name}`
  return (
    <Button
      variant="ghost"
      className={`star-button ${company.starred ? "is-starred" : ""}`}
      aria-label={label}
      title={label}
      aria-pressed={company.starred}
      onClick={onToggle}
    >
      <Icon name="star" size={17} />
    </Button>
  )
}

type EvaluationProps = {
  company: Company
  onFeedback: (feedback: Company["feedback"]) => void
  onRate: () => void
}
export function Evaluation({ company, onFeedback, onRate }: EvaluationProps) {
  return (
    <div className="evaluation" aria-label={`${company.name}的人工评价`}>
      <Button
        variant="ghost"
        className={`feedback-button ${
          company.feedback === "positive" ? "positive-selected" : ""
        }`}
        aria-pressed={company.feedback === "positive"}
        aria-label={`点赞：${company.name}`}
        title="匹配，值得开发；再次点击可取消"
        onClick={() =>
          onFeedback(company.feedback === "positive" ? null : "positive")
        }
      >
        <Icon name="thumbUp" size={15} />
      </Button>
      <Button
        variant="ghost"
        className={`feedback-button ${
          company.feedback === "negative" ? "negative-selected" : ""
        }`}
        aria-pressed={company.feedback === "negative"}
        aria-label={`点踩：${company.name}`}
        title="不匹配；再次点击可取消"
        onClick={() =>
          onFeedback(company.feedback === "negative" ? null : "negative")
        }
      >
        <Icon name="thumbDown" size={15} />
      </Button>
      <Button
        variant="ghost"
        className={`rating-trigger ${
          company.rating !== null ? "has-rating" : ""
        }`}
        aria-label={`人工评分：${company.name}`}
        onClick={onRate}
      >
        {company.rating !== null ? (
          <>
            <strong>{company.rating}</strong>
            <span>/10</span>
          </>
        ) : (
          "评分"
        )}
      </Button>
    </div>
  )
}
