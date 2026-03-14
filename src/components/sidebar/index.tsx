"use client"
import { Drawer } from 'antd'
import React, { useState } from 'react'
import Elements from '../drawercomponents/elements';
import Pages from '../drawercomponents/pages';
import useStoreconfig from '@/store';

const Sidebar = () => {
    const { allpages } = useStoreconfig()
    const [ElementsOpen, setElementsOpen] = useState<string | null>(null);
    return (
        <div className='w-full h-full' style={{ background: 'var(--gray-300)', borderRight: '1px solid var(--gray-200)' }}>

            <button
                className='w-full cursor-pointer py-3 flex flex-col items-center gap-1 transition-colors hover:bg-white'
                style={{ borderBottom: '1px solid var(--gray-200)', color: 'var(--gray-700)' }}
                onClick={() => setElementsOpen("Pages")}
            >
                <i className="fa-solid fa-display" style={{ fontSize: 20 }}></i>
                <span style={{ fontSize: 10, fontWeight: 600, letterSpacing: '0.04em', textTransform: 'uppercase' }}>Pages</span>
            </button>
            <button
                className={`w-full py-3 flex flex-col items-center gap-1 transition-colors ${allpages?.selectedPage === 0 ? "opacity-40 cursor-not-allowed" : "cursor-pointer hover:bg-white"}`}
                style={{ borderBottom: '1px solid var(--gray-200)', color: 'var(--gray-700)' }}
                onClick={() => setElementsOpen("Elements")}
                disabled={allpages?.selectedPage === 0}
            >
                <i className="fa-solid fa-pentagon" style={{ fontSize: 20 }}></i>
                <span style={{ fontSize: 10, fontWeight: 600, letterSpacing: '0.04em', textTransform: 'uppercase' }}>Elements</span>
            </button>


            <Drawer
                title={ElementsOpen}
                placement={'left'}
                closable={false}
                onClose={() => { setElementsOpen(null) }}
                open={ElementsOpen !== null}
                key={'left'}
                rootStyle={{
                    backgroundColor: "#ffffff01",
                    backdropFilter: "blur(0px)",
                }}
                styles={
                    {
                        mask: {
                            backgroundColor: "#ffffff01",
                            backdropFilter: "blur(0px)",
                        }
                    }
                }
            >
                {ElementsOpen === "Elements" && <Elements setElementsOpen={setElementsOpen} />}
                {ElementsOpen === "Pages" && <Pages setElementsOpen={setElementsOpen} />}
            </Drawer>

        </div>
    )
}

export default Sidebar