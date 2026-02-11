"use client"
import Slideview from "@/components/Slide";
import { useEffect, useState } from "react";
import Topbar from "@/components/Topbar";
import Sidebar from "@/components/sidebar";
import { useRouter } from "next/navigation";
import Preview from "@/components/Preview";
import useStoreconfig from "@/store";

export default function Home() {
  const router = useRouter();
  const { editor, allpages, updateAllPages } = useStoreconfig()
  // pages
  const [Allpages, setAllpages] = useState([
    {
      id: 1,
      name: "page 1",
      data: [

      ],
    },
    {
      id: 2,
      name: "page 2",
      data: [],
    },
    {
      id: 3,
      name: "page 3",
      data: [],
    },
  ]);
  const [SelectedPage, setSelectedPage] = useState(1);
  const [isPreview, setIsPreview] = useState(false);


  const saveCurrentData = () => {
    updateAllPages(allpages?.pages?.map((i: any) => {
      if (i.id === allpages?.selectedPage) {
        return {
          ...i,
          data: editor?.elementsList
        };
      }
      return i;
    }));
  };

  const enterPreview = () => {
    saveCurrentData();
    router.push("/preview");
  };



  return (
    <div className="w-[100vw] h-[100dvh]">
      {/* topbar */}
      <div className="w-full h-[50px]">
        <Topbar />
      </div>
      <div className="w-full h-[calc(100dvh-50px)]  flex">
        {/* leftsidebar */}
        <div className="w-[100px] h-full border-r border-gray-300">
          <Sidebar />
        </div>
        {/* canvas */}
        {allpages?.selectedPage === 0 ? <div className="w-[calc(100%-100px)] h-full  flex flex-col items-center justify-center bg-gray-200">
          <p className="text-gray-400 text-xs italic">Select a page to edit</p>
        </div> : <div className="w-[calc(100%-100px)] h-full  flex flex-col items-center justify-center bg-gray-200">
          <p className="text-gray-400 text-xs italic">Page {allpages?.pages?.findIndex((i: any) => i?.id === allpages?.selectedPage) + 1}</p>
          <div className="max-w-[1000px] max-h-[600px] w-full h-full border-2 border-gray-300 bg-white overflow-hidden shadow-xl">
            <Slideview />
          </div>
          <button
            className="mt-4 px-8 py-2 bg-blue-600 text-white rounded-full font-bold shadow-lg hover:bg-blue-700 transition-all transform hover:scale-105 active:scale-95 flex items-center gap-2"
            onClick={() => {
              console.log("save", editor);
            }}
          >
            <i className="fa-solid fa-play"></i>
            Save
          </button>
          <button
            className="mt-4 px-8 py-2 bg-blue-600 text-white rounded-full font-bold shadow-lg hover:bg-blue-700 transition-all transform hover:scale-105 active:scale-95 flex items-center gap-2"
            onClick={enterPreview}
          >
            <i className="fa-solid fa-play"></i>
            Preview
          </button>
        </div>}
      </div>
    </div>
  );
}
