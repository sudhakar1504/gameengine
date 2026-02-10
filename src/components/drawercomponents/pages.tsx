import useStoreconfig from '@/store';
import React from 'react'

const Pages = ({ setElementsOpen }: any) => {
    const { allpages, updateAllPages, setSelectedPage, editor, updateEditor } = useStoreconfig();

    const addNewPageHandler = () => {
        updateAllPages([
            ...allpages.pages,
            {
                id: Date.now(),
                name: "Page " + (allpages.pages.length + 1),
                data: []
            }
        ])
    }
    const removePageHandler = (id: number) => {
        updateAllPages(allpages.pages.filter((page: any) => page.id !== id))
    }

    const selectPageHandler = (id: number) => {
        let duplicateAllpages = [...allpages.pages]
        let findIndex = duplicateAllpages.findIndex((page: any) => page.id === allpages.selectedPage)
        duplicateAllpages[findIndex] = {
            ...duplicateAllpages[findIndex],
            data: editor?.elementsList
        }
        updateAllPages(duplicateAllpages)
        setSelectedPage(id)
        let findCurrentPageIndex = duplicateAllpages.findIndex((page: any) => page.id === id)

        updateEditor(duplicateAllpages[findCurrentPageIndex].data)
        setElementsOpen(null)
    }

    return (
        <div className='w-full h-full'>

            <button onClick={addNewPageHandler} className='cursor-pointer rounded-md bg-blue-400 text-white font-bold px-2 py-1 my-2'>Add Page</button>

            <div className=' flex  gap-2 items-start flex-wrap'>
                {allpages.pages.map((page: any) => (
                    <div key={page.id} className='flex flex-col items-center'>
                        <button className={`w-[80px] h-[80px] cursor-pointer rounded-md bg-gray-400 ${allpages.selectedPage === page.id ? "border-2 border-green-500" : ""}`} onClick={() => selectPageHandler(page.id)}>
                            <p className='text-white font-bold'> {page.name}</p>
                        </button>
                        <button onClick={() => removePageHandler(page.id)} className='cursor-pointer rounded-md bg-red-400 text-white font-bold px-2 py-1 my-1'><i className="fa-solid fa-trash-can"></i></button>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default Pages