import React from 'react';
import TextPanel from './TextPanel';
import ImagePanel from './ImagePanel';
import AudioPanel from './AudioPanel';

const Topbar = ({ selectedItem, Data, setData }: { selectedItem: any, Data: any, setData: any }) => {
    const item = Data.find((i: any) => i.id === selectedItem);

    return (
        <div className='w-full h-full bg-gray-100 border-b border-gray-300 flex items-center px-4 shadow-sm py-2'>
            {!item && <div className="text-gray-400 text-xs italic">Select an element to edit</div>}

            {item && (
                <div className='w-full bg-transparent flex flex-col'>
                    {item.type === 'text' && <TextPanel item={item} setData={setData} id={selectedItem} />}
                    {item.type === 'img' && <ImagePanel item={item} setData={setData} id={selectedItem} />}
                    {item.type === 'audio' && <AudioPanel item={item} setData={setData} id={selectedItem} />}
                </div>
            )}
        </div>
    );
};

export default Topbar;