import React, { useMemo } from 'react';
import TextPanel from './TextPanel';
import ImagePanel from './ImagePanel';
import AudioPanel from './AudioPanel';
import useStoreconfig from '@/store';

const Topbar = () => {
    const { editor } = useStoreconfig()
    const item = useMemo(() => {
        return editor?.elementsList?.find((i: any) => i.id === editor?.selectedElementId);
    }, [editor?.elementsList]);
    // const { user, setUser } = useStoreconfig();

    return (
        <div className='w-full h-full bg-gray-100 border-b border-gray-300 flex items-center px-4 shadow-sm py-2'>
            {!item && <div className="text-gray-400 text-xs italic">Select an element to edit</div>}
            {/* display user name */}
            {/* <div className="text-gray-400 text-xs italic">User: {user.name}</div> */}
            {/* save user data */}
            {/* <button onClick={() => {
                // store user detail in redux
                setUser({ name: "lavadass", email: "[EMAIL_ADDRESS]", id: "123" });
            }}>Save</button> */}

            {item && (
                <div className='w-full bg-transparent flex flex-col'>
                    {item.type === 'text' && <TextPanel item={item} />}
                    {item.type === 'img' && <ImagePanel item={item} />}
                    {item.type === 'audio' && <AudioPanel item={item} />}
                </div>
            )}
        </div>
    );
};

export default Topbar;