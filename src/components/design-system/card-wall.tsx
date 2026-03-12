"use client";

import { useState } from "react";

import {
  ActionCardBody,
  ActionCardDetailSections,
  ActionCardFooter,
  ActionCardTopline,
} from "@/components/design-system/action-card";
import type { DesignSystemCard, DesignSystemCardCategory } from "@/lib/design-system-card-wall";

type CardWallProps = {
  categories: DesignSystemCardCategory[];
};

function CardWallPreview({ card, onOpen }: { card: DesignSystemCard; onOpen: () => void }) {
  return (
    <button
      type="button"
      className="card-wall-preview-card"
      aria-label={`打开卡片 ${card.eyebrow} ${card.subject}`}
      onClick={onOpen}
    >
      <ActionCardTopline card={card} />
      <ActionCardBody card={card} heading={<h3>{card.subject}</h3>} />
      <ActionCardFooter
        card={card}
        actionClassName="card-wall-action-button"
        actionInteractive={false}
      />
    </button>
  );
}

function CardWallReader({ card, onClose }: { card: DesignSystemCard; onClose: () => void }) {
  return (
    <aside
      aria-label={`${card.eyebrow} ${card.subject}`}
      aria-modal="true"
      className="card-wall-reader"
      role="dialog"
    >
      <div className="card-wall-reader-panel">
        <div className="card-wall-reader-header">
          <ActionCardTopline card={card} />
          <button type="button" className="card-wall-reader-close" onClick={onClose}>
            关闭卡片
          </button>
        </div>

        <ActionCardBody card={card} heading={<h2>{card.subject}</h2>} />
        <ActionCardFooter card={card} actionClassName="card-wall-action-button" />
        <ActionCardDetailSections card={card} />
      </div>
    </aside>
  );
}

export function CardWall({ categories }: CardWallProps) {
  const [selectedCard, setSelectedCard] = useState<DesignSystemCard | null>(null);

  return (
    <>
      <section className="card-wall-page">
        <header className="card-wall-header">
          <h1>卡片墙</h1>
        </header>

        <div className="card-wall-category-list">
          {categories.map((category) => (
            <section key={category.id} className="card-wall-category">
              <div className="card-wall-category-header">
                <h2>{category.title}</h2>
              </div>

              <div className="card-wall-card-stack">
                {category.cards.map((card) => (
                  <CardWallPreview
                    key={card.id}
                    card={card}
                    onOpen={() => setSelectedCard(card)}
                  />
                ))}
              </div>
            </section>
          ))}
        </div>
      </section>

      {selectedCard ? (
        <CardWallReader card={selectedCard} onClose={() => setSelectedCard(null)} />
      ) : null}
    </>
  );
}
