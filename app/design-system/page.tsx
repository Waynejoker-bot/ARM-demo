import { DesignVariantGallery } from "@/components/design-system/design-variant-gallery";
import { CardWall } from "@/components/design-system/card-wall";
import { UniversalCardContainerSample } from "@/components/design-system/universal-card-container-sample";
import { Badge, PageHeader, SectionCard } from "@/components/shared/ui";
import { designSystemCardWall } from "@/lib/design-system-card-wall";
import { designDirections, designVariantCards } from "@/lib/design-system-review-content";

export default async function DesignSystemPage() {
  return (
    <div className="design-system-page-stack">
      <PageHeader
        title="设计系统"
        description="先收敛背景系统和统一卡片容器，再并列比较不同角色卡片在同一阅读语法里的成立方式。"
        supportingCopy="这一页先保留设计判断层，再接入真实手机卡片墙，让设计原则和线上阅读效果在同一路径里一起 review。"
      />

      <section className="design-review-brief" aria-labelledby="design-review-mode-heading">
        <div className="design-review-brief-topline">
          <Badge tone="info">同一页面，两层阅读</Badge>
          <Badge tone="success">一个代码库，一个公网链接</Badge>
        </div>

        <div className="design-review-brief-grid">
          <div className="design-review-brief-copy">
            <span className="design-review-brief-label">Review Mode</span>
            <h2 id="design-review-mode-heading">手机评审模式</h2>
            <p className="design-review-brief-lead">
              先看设计原则和容器语法，再向下进入真实手机卡片墙和全屏阅读态。
            </p>
          </div>

          <div className="design-review-brief-meta">
            <p>旧版的设计判断层和新版的真实线上卡片墙现在收敛到同一页。</p>
            <p>你可以在同一条路径里先比较原则，再直接 review 真实卡片内容。</p>
          </div>
        </div>
      </section>

      <SectionCard
        title="Background Directions"
        action={<Badge tone="info">视觉判断层</Badge>}
      >
        <div className="design-direction-grid">
          {designDirections.map((direction) => (
            <article key={direction.id} className={`design-direction-card ${direction.className}`}>
              <div className="design-direction-topline">
                <span>{direction.label}</span>
                <span>{direction.mood}</span>
              </div>
              <h3>{direction.title}</h3>
              <p>{direction.summary}</p>
              <div className="design-direction-material">{direction.material}</div>
            </article>
          ))}
        </div>
      </SectionCard>

      <SectionCard
        title="Universal Card Container"
        action={<Badge tone="warn">统一阅读语法</Badge>}
      >
        <UniversalCardContainerSample />
      </SectionCard>

      <SectionCard title="Card Gallery" action={<Badge tone="info">变体参考层</Badge>}>
        <DesignVariantGallery cards={designVariantCards} />
      </SectionCard>

      <CardWall categories={designSystemCardWall} />
    </div>
  );
}
