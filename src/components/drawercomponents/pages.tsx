import useStoreconfig from '@/store';
import React from 'react'

const Pages = ({ setElementsOpen }: any) => {
    const { allpages, updateAllPages, setSelectedPage, editor, updateEditor } = useStoreconfig();
    const isWindowEditMode = editor?.windowEditMode?.active;

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
        if (isWindowEditMode) return; // Block page switching during window edit
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
        <div className='w-full h-full flex flex-col gap-3'>
            <div className='flex gap-2 items-start flex-wrap'>
                {allpages.pages.map((page: any) => (
                    <div key={page.id} className='flex flex-col items-center gap-1'>
                        <button
                            className='flex flex-col items-center justify-center rounded transition-all'
                            style={{
                                width: 80,
                                height: 80,
                                background: 'var(--gray-200)',
                                border: allpages.selectedPage === page.id
                                    ? '2px solid var(--accent-primary)'
                                    : '2px solid var(--border-default)',
                                boxShadow: allpages.selectedPage === page.id ? '0 0 0 3px var(--accent-primary-border)' : 'none',
                                cursor: isWindowEditMode ? 'not-allowed' : 'pointer',
                                opacity: isWindowEditMode && allpages.selectedPage !== page.id ? 0.4 : 1,
                            }}
                            onClick={() => selectPageHandler(page.id)}
                            title={isWindowEditMode ? 'Finish editing the window before switching pages' : undefined}
                        >
                            <i className="fa-regular fa-file" style={{ fontSize: 20, color: 'var(--gray-500)', marginBottom: 4 }}></i>
                            <span style={{ fontSize: 10, fontWeight: 600, color: 'var(--gray-700)' }}>{page.name}</span>
                        </button>
                        <button
                            onClick={() => removePageHandler(page.id)}
                            className='btn btn-sm'
                            style={{ background: 'var(--gray-100)', border: '1px solid var(--border-default)', color: 'var(--gray-500)' }}
                            title="Delete page"
                        >
                            <i className="fa-solid fa-trash-can"></i>
                        </button>
                    </div>
                ))}
            </div>
            <button
                onClick={addNewPageHandler}
                className='btn btn-primary'
                style={{ alignSelf: 'flex-start' }}
            >
                <i className="fa-solid fa-plus"></i>
                Add Page
            </button>
        </div>
    )
}

export default Pages
