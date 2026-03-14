"use client"
import Slideview from "@/components/Slide";
import { useState } from "react";
import Topbar from "@/components/Topbar";
import Sidebar from "@/components/sidebar";
import useStoreconfig from "@/store";
import InteractionModal from "@/components/InteractionModal";
import DragDropModal from "@/components/DragDropModal";

export default function Home() {
  const { editor, allpages } = useStoreconfig()




  return (
    <div className="w-[100vw] h-[100dvh]" style={{ background: 'var(--gray-100)' }}>
      {/* topbar */}
      <div className="w-full h-[50px]">
        <Topbar />
      </div>
      <div className="w-full h-[calc(100dvh-50px)] flex">
        {/* leftsidebar */}
        <div className="w-[100px] h-full">
          <Sidebar />
        </div>
        {/* canvas */}
        {allpages?.selectedPage === 0
          ? (
            <div className="w-[calc(100%-100px)] h-full flex flex-col items-center justify-center" style={{ background: 'var(--gray-100)' }}>
              <i className="fa-regular fa-hand-pointer" style={{ fontSize: 32, color: 'var(--gray-300)', marginBottom: 12 }}></i>
              <p style={{ color: 'var(--text-muted)', fontSize: 12, fontStyle: 'italic' }}>Select a page to edit</p>
            </div>
          )
          : (
            <div className="w-[calc(100%-100px)] h-full flex flex-col items-center justify-center" style={{ background: 'var(--gray-100)', gap: 12 }}>
              <p style={{ color: 'var(--text-muted)', fontSize: 11, fontWeight: 500 }}>
                Page {allpages?.pages?.findIndex((i: any) => i?.id === allpages?.selectedPage) + 1}
              </p>
              <div className="max-w-[1000px] max-h-[600px] w-full h-full overflow-hidden" style={{ border: '1px solid var(--gray-300)', borderRadius: 6, boxShadow: '0 4px 24px rgba(0,0,0,0.10)', background: '#fff' }}>
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
