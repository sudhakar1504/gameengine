import React from 'react'

const Pages = ({ Allpages, SelectedPage, setSelectedPage, setElementsOpen, Data, setData, setAllpages }: any) => {
    return (
        <div className='w-full h-full'>

            <button onClick={() => {
                setAllpages((prevData: any) => {
                    const newData = [...prevData];
                    newData.push({
                        id: Date.now(),
                        name: "Page " + (newData.length + 1),
                        data: []
                    });
                    return newData;
                });
            }} className='cursor-pointer rounded-md bg-blue-400 text-white font-bold px-2 py-1 my-2'>Add Page</button>

            <div className=' flex  gap-2 items-start flex-wrap'>
                {Allpages.map((page: any) => (
                    <div key={page.id} className='flex flex-col items-center'>
                        <button className={`w-[80px] h-[80px] cursor-pointer rounded-md bg-gray-400 ${SelectedPage === page.id ? "border-2 border-green-500" : ""}`} onClick={() => {

                            setAllpages((prevData: any) => {
                                const newData = [...prevData];
                                const index = newData.findIndex((item: any) => item.id === SelectedPage);
                                newData[index] = {
                                    ...newData[index],
                                    data: Data
                                };
                                return newData;
                            });

                            setSelectedPage(page.id)
                            setData(() => {
                                return page.data
                            })
                            setElementsOpen(null)
                        }}>
                            <p className='text-white font-bold'> {page.name}</p>
                        </button>
                        <button onClick={() => {
                            setAllpages((prevData: any) => {
                                const newData = [...prevData];
                                const index = newData.findIndex((item: any) => item.id === page.id);
                                newData.splice(index, 1);
                                return newData;
                            });
                        }} className='cursor-pointer rounded-md bg-red-400 text-white font-bold px-2 py-1 my-1'><i className="fa-solid fa-trash-can"></i></button>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default Pages