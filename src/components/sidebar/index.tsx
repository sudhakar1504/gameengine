"use client"
import { Drawer } from 'antd'
import React, { useState } from 'react'
import Elements from '../drawercomponents/elements';
import Pages from '../drawercomponents/pages';

const Sidebar = ({ Allpages, SelectedPage, setSelectedPage, Data, setData, setAllpages }: any) => {
    const [ElementsOpen, setElementsOpen] = useState<string | null>(null);
    return (
        <div className='w-full h-full'>
            <button className='w-full cursor-pointer border-b-2 border-gray-200 py-2' onClick={() => setElementsOpen("Elements")}>
                <p className='text-3xl'><i className="fa-solid fa-pentagon"></i></p>
                <p className='text-xs font-semibold'>Elements</p>
            </button>
            <button className='w-full cursor-pointer border-b-2 border-gray-200 py-2' onClick={() => setElementsOpen("Pages")}>
                <p className='text-3xl'><i className="fa-solid fa-display"></i></p>
                <p className='text-xs font-semibold'>Pages</p>
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
                {ElementsOpen === "Elements" && <Elements setData={setData} setElementsOpen={setElementsOpen} />}
                {ElementsOpen === "Pages" && <Pages Allpages={Allpages} SelectedPage={SelectedPage} setSelectedPage={setSelectedPage} setElementsOpen={setElementsOpen} Data={Data} setData={setData} setAllpages={setAllpages} />}
            </Drawer>

        </div>
    )
}

export default Sidebar