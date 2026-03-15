"use client"
import Slideview from "@/components/Slide";
import { useState } from "react";
import Topbar from "@/components/Topbar";
import Sidebar from "@/components/sidebar";
import useStoreconfig from "@/store";
import InteractionModal from "@/components/InteractionModal";
import DragDropModal from "@/components/DragDropModal";

export default function Home() {
  const { editor, allpages, exitWindowEditMode, updateAllPages } = useStoreconfig()
  const windowMode = editor?.windowEditMode;

  return (
    <div className="w-[100vw] h-[100dvh]" style={{ background: 'var(--gray-100)' }}>
      {/* topbar */}
      <div className="w-full h-[50px]">
        <Topbar />
      </div>

      {/* Window edit mode banner */}
      {windowMode?.active && (
        <div style={{
          position: 'fixed',
          top: 50,
          left: 0,
          right: 0,
          zIndex: 1000,
          background: '#1677ff',
          color: '#fff',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '8px 20px',
          fontSize: 13,
          fontWeight: 500,
          boxShadow: '0 2px 8px rgba(22,119,255,0.3)',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <i className="fa-solid fa-window-restore" style={{ fontSize: 15 }} />
            <span>Editing Window: <strong>"{windowMode.windowTitle}"</strong> — use the sidebar to add elements, drag/resize on the canvas</span>
          </div>
          <button
            onClick={() => {
              // exitWindowEditMode restores editor.elementsList to page elements
              // We need the restored elements to sync to allpages.
              // savedElements holds the page elements that will be restored.
              const restoredElements = (() => {
                const saved = editor?.windowEditMode?.savedElements || [];
                const idx = editor?.windowEditMode?.elementIndex;
                const windowEls = editor?.elementsList || [];
                if (idx === null || idx === undefined) return saved;
                const updated = [...saved];
                updated[idx] = {
                  ...updated[idx],
                  interaction: { ...updated[idx]?.interaction, windowElements: windowEls },
                };
                return updated;
              })();
              exitWindowEditMode();
              // Sync restored page elements to allpages immediately
              const updatedPages = allpages?.pages?.map((p: any) =>
                p.id === allpages?.selectedPage ? { ...p, data: restoredElements } : p
              );
              updateAllPages(updatedPages);
            }}
            style={{
              background: '#fff',
              color: '#1677ff',
              border: 'none',
              borderRadius: 6,
              padding: '5px 16px',
              fontWeight: 600,
              fontSize: 13,
              cursor: 'pointer',
            }}
          >
            Done
          </button>
        </div>
      )}

      <div className="w-full flex" style={{ height: 'calc(100dvh - 50px)', marginTop: windowMode?.active ? 40 : 0 }}>
        {/* leftsidebar */}
        <div className="w-[100px] h-full">
          <Sidebar />
        </div>
        {/* canvas */}
        {!windowMode?.active && allpages?.selectedPage === 0
          ? (
            <div className="w-[calc(100%-100px)] h-full flex flex-col items-center justify-center" style={{ background: 'var(--gray-100)' }}>
              <i className="fa-regular fa-hand-pointer" style={{ fontSize: 32, color: 'var(--gray-300)', marginBottom: 12 }}></i>
              <p style={{ color: 'var(--text-muted)', fontSize: 12, fontStyle: 'italic' }}>Select a page to edit</p>
            </div>
          )
          : (
            <div className="w-[calc(100%-100px)] h-full flex flex-col items-center justify-center" style={{ background: 'var(--gray-100)', gap: 12 }}>
              <p style={{ color: windowMode?.active ? '#1677ff' : 'var(--text-muted)', fontSize: 11, fontWeight: 500 }}>
                {windowMode?.active
                  ? `Window: "${windowMode.windowTitle}"`
                  : `Page ${allpages?.pages?.findIndex((i: any) => i?.id === allpages?.selectedPage) + 1}`
                }
              </p>
              <div className="max-w-[1000px] max-h-[600px] w-full h-full overflow-hidden" style={{
                border: windowMode?.active ? '2px solid #1677ff' : '1px solid var(--gray-300)',
                borderRadius: 6,
                boxShadow: windowMode?.active ? '0 4px 24px rgba(22,119,255,0.2)' : '0 4px 24px rgba(0,0,0,0.10)',
                background: '#fff'
              }}>
                <Slideview />
              </div>
            </div>
          )
        }
      </div>

      {/* interaction panel */}
      <InteractionModal />
      <DragDropModal />

    </div>
  );
}
