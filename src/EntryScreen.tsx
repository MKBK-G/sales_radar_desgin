import { Button, Heading, Icon } from "./ui"
import "./entry.css"

export default function EntryScreen({ onEnter }: { onEnter: () => void }) {
  return (
    <main className="entry-screen" aria-label="销售雷达入口">
      <div className="entry-diagonal" aria-hidden="true" />
      <section className="entry-card" aria-labelledby="entry-title">
        <div className="entry-brand" aria-label="AI Growth Engine">
          <strong>
            AI <span>Growth</span>
          </strong>
          <span>Engine</span>
        </div>
        <div className="entry-introduction">
          <div className="entry-eyebrow">SALES RADAR</div>
          <Heading level={1}>
            <span id="entry-title">登录销售雷达</span>
          </Heading>
          <p>进入行业认知与商机工作台</p>
        </div>
        <div className="entry-capabilities" aria-label="工作台功能">
          <div>
            <span>
              <Icon name="sparkles" size={15} />
            </span>
            <span>发现商机</span>
            <i />
          </div>
          <div>
            <span>
              <Icon name="grid" size={15} />
            </span>
            <span>行业研究</span>
            <i />
          </div>
          <div>
            <span>
              <Icon name="users" size={15} />
            </span>
            <span>持续跟进</span>
          </div>
        </div>
        <Button
          variant="primary"
          className="entry-enter-button"
          onClick={onEnter}
        >
          进入工作台
          <Icon name="arrow" size={15} />
        </Button>
      </section>
    </main>
  )
}
