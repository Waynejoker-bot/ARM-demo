"use client";

import { useEffect, useState } from "react";

import {
  ActionCardBody,
  ActionCardDetailSections,
  ActionCardFooter,
  ActionCardTopline,
} from "@/components/design-system/action-card";
import type { DesignVariantCard } from "@/lib/design-system-review-content";

function MobileFeedCard({
  card,
  onOpen,
}: {
  card: DesignVariantCard;
  onOpen: () => void;
}) {
  return (
    <article className={`design-mobile-feed-card ${card.className}`} aria-label={card.eyebrow}>
      <button
        type="button"
        className="design-mobile-feed-surface"
        aria-label={`查看 ${card.subject} 详情页样本`}
        onClick={onOpen}
      >
        <ActionCardTopline card={card} />
        <ActionCardBody card={card} heading={<h3>{card.subject}</h3>} />
        <ActionCardFooter
          card={card}
          actionClassName="primary-button mobile-action-button"
          actionInteractive={false}
        />
      </button>
    </article>
  );
}

function MobileDetailPage({
  card,
  onClose,
}: {
  card: DesignVariantCard;
  onClose: () => void;
}) {
  return (
    <div className="design-card-dialog-backdrop" onClick={onClose}>
      <section
        className={`design-mobile-detail-page ${card.className}`}
        role="dialog"
        aria-modal="true"
        aria-label={`${card.subject} 详情页样本`}
        onClick={(event) => event.stopPropagation()}
      >
        <div className="design-mobile-detail-header">
          <button
            type="button"
            className="ghost-button design-mobile-detail-back"
            aria-label="返回卡片列表"
            onClick={onClose}
          >
            返回
          </button>
          <span className="design-mobile-detail-page-chip">手机全屏阅读</span>
        </div>

        <div className="design-mobile-detail-scroll">
          <ActionCardTopline card={card} />
          <ActionCardBody card={card} heading={<h2>{card.subject}</h2>} />
          <ActionCardFooter card={card} />
          <ActionCardDetailSections card={card} />
        </div>
      </section>
    </div>
  );
}

function useMobileViewport() {
  const [isMobileViewport, setIsMobileViewport] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined" || typeof window.matchMedia !== "function") {
      return;
    }

    const mediaQuery = window.matchMedia("(max-width: 768px)");
    const updateMatch = () => setIsMobileViewport(mediaQuery.matches);

    updateMatch();

    if (typeof mediaQuery.addEventListener === "function") {
      mediaQuery.addEventListener("change", updateMatch);
      return () => mediaQuery.removeEventListener("change", updateMatch);
    }

    mediaQuery.addListener(updateMatch);
    return () => mediaQuery.removeListener(updateMatch);
  }, []);

  return isMobileViewport;
}

export function DesignVariantGallery({ cards }: { cards: DesignVariantCard[] }) {
  const isMobileViewport = useMobileViewport();
  const [selectedCard, setSelectedCard] = useState<DesignVariantCard | null>(null);

  useEffect(() => {
    if (!isMobileViewport && selectedCard) {
      setSelectedCard(null);
    }
  }, [isMobileViewport, selectedCard]);

  useEffect(() => {
    if (!selectedCard) {
      return;
    }

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [selectedCard]);

  return (
    <>
      <div className="design-gallery-grid">
        {cards.map((card) =>
          isMobileViewport ? (
            <MobileFeedCard key={card.eyebrow} card={card} onOpen={() => setSelectedCard(card)} />
          ) : (
            <article
              key={card.eyebrow}
              className={`design-variant-card ${card.className}`}
              aria-label={card.eyebrow}
            >
              <ActionCardTopline card={card} />
              <ActionCardBody card={card} heading={<h3>{card.subject}</h3>} />
              <ActionCardFooter card={card} />
              <div className="design-variant-detail-link">
                <span className="action-card-label">信息详情</span>
                <span>为什么判断 / 信息来源 / 证据</span>
              </div>
            </article>
          ),
        )}
      </div>

      {selectedCard ? (
        <MobileDetailPage card={selectedCard} onClose={() => setSelectedCard(null)} />
      ) : null}
    </>
  );
}
