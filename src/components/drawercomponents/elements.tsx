import { Collapse, Modal, Button } from 'antd';
import React, { useState } from 'react'
import { defaultImageConfig, defaultTextConfig, defaultAudioConfig, defaultAnimationConfig } from '@/utils/config/defaults';
import { audioList } from '@/utils/config/audioList';
import { imageList } from '@/utils/config/imageList';
import ImageGallery from '../ImageGallery';
import { bgList } from '@/utils/config/bgList';
import useStoreconfig from '@/store';

const Elements = ({ setElementsOpen }: any) => {
    const { editor, updateEditor } = useStoreconfig();
    const [imageGalleryOpen, setImageGalleryOpen] = useState(false);
    const elementData: any = {
        text: {
            "type": "text",
            "text": "Hello World",
            "coords": {
                "x": 40,
                "y": 40,
                "angle": 0,
                "width": 20,
                "height": 20,
                "zIndex": 1
            },
            "font": defaultTextConfig,
            "animations": defaultAnimationConfig
        },
        image: {
            "type": "img",
            "coords": {
                "x": 40,
                "y": 40,
                "angle": 0,
                "width": 20,
                "height": 20,
                "zIndex": 1
            },
            "filter": {
                opacity: 100,
                brightness: 100,
                contrast: 100,
                saturate: 100,
                blur: 0
            },
            "transform": {
                flipX: false,
                flipY: false
            },
            "animations": defaultAnimationConfig
        },
        audio: {
            "type": "audio",
            "coords": {
                "x": 10,
                "y": 10,
                "angle": 0,
                "width": 10,
                "height": 10,
                "zIndex": 1
            },
            "audio": defaultAudioConfig,
            "animations": defaultAnimationConfig
        }
    }

    const [audioModalOpen, setAudioModalOpen] = useState(false);
    const [selectedAudioItem, setSelectedAudioItem] = useState<any>(null);

    const handleSelectFromGallery = (src: string) => {
        let duplicate = [...editor?.elementsList]
        const maxZIndex = Math.max(...duplicate.map((i: any) => i.zIndex || 1), 0);
        const newZIndex = maxZIndex + 1;
        duplicate.push({
            ...elementData['image'],
            id: Date.now().toString(),
            src: src,
            zIndex: newZIndex
        })
        updateEditor(duplicate);
        setImageGalleryOpen(false);
        setElementsOpen(null);
    }

    const handleAddAudio = (loop: boolean) => {
        if (!selectedAudioItem) return;

        let duplicate = [...editor?.elementsList]
        duplicate.push({
            ...elementData['audio'],
            id: Date.now().toString(),
            src: selectedAudioItem.src,
            audio: {
                ...defaultAudioConfig,
                loop: loop
            }
        })
        updateEditor(duplicate);
        setAudioModalOpen(false);
        setElementsOpen(null);
    }

    const textHandler = () => {
        let duplicate = [...editor?.elementsList]
        const maxZIndex = Math.max(...duplicate.map((i: any) => i.zIndex || 1), 0);
        const newZIndex = maxZIndex + 1;
        duplicate.push({
            ...elementData['text'],
            id: Date.now().toString(),
            zIndex: newZIndex
        })
        updateEditor(duplicate);
        setElementsOpen(null);
    }
    const imageHandler = (src: string) => {
        let duplicate = [...editor?.elementsList]
        const maxZIndex = Math.max(...duplicate.map((i: any) => i.zIndex || 1), 0);
        const newZIndex = maxZIndex + 1;
        duplicate.push({
            ...elementData['image'],
            id: Date.now().toString(),
            src: src,
            zIndex: newZIndex
        })
        updateEditor(duplicate);
        setElementsOpen(null);
    }


    const bgHandler = (src: string) => {
        let duplicate = [...editor?.elementsList]
        let findBg = duplicate?.filter((item: any) => item?.type == 'bg');
        if (findBg.length > 0) {
            duplicate = duplicate?.map((item: any) => item?.type == 'bg' ? { ...item, src: src } : item);
        } else {
            duplicate.push({
                type: 'bg',
                src: src,
                id: Date.now().toString(),
                zIndex: 0
            })
        }
        updateEditor(duplicate);
        setElementsOpen(null);
    }


    const textData = [
        {
            id: 1,
            text: 'Text',
            type: 'text',
            icon: <i className="fa-solid fa-font"></i>
        }
    ];

    const items = [
        {
            key: '1',
            label: 'Text',
            children: <div>
                {textData.map((element: any) => (
                    <button onClick={textHandler} key={element.id} className='w-[80px] h-[50px] rounded-md bg-gray-200 flex items-center justify-center cursor-pointer'>
                        {element.icon}
                        {element.text}
                    </button>
                ))}
            </div>,
        },
        {
            key: '2',
            label: 'Image',
            children: <div className='flex flex-col gap-4'>
                <div className='flex justify-between items-center bg-gray-50 p-2 rounded-lg border border-dashed border-gray-300'>
                    <span className='text-xs text-gray-500 font-medium'>Recommended Images</span>
                    <Button
                        type="primary"
                        size="small"
                        onClick={() => setImageGalleryOpen(true)}
                        className='text-[10px] h-6'
                    >
                        View All
                    </Button>
                </div>
                <div className='flex flex-wrap gap-2'>
                    {imageList.map((element: any) => (
                        <button onClick={() => imageHandler(element.src)} key={element.id} className='w-[80px] h-[80px] rounded-md bg-gray-200 flex items-center justify-center cursor-pointer'>
                            <img loading='lazy' src={element.src} className='w-full h-full object-contain' alt="" />
                        </button>
                    ))}
                </div>
            </div>,
        },
        {
            key: '3',
            label: 'Background',
            children: <div className='flex flex-wrap gap-2'>
                {bgList.map((element: any) => (
                    <button onClick={() => {
                        bgHandler(element.Image);

                    }} key={element.id} className='w-[80px] h-[80px] rounded-md bg-gray-200 flex items-center justify-center cursor-pointer'>
                        <img loading='lazy' src={element.Image} className='w-full h-full object-contain' alt="" />
                    </button>
                ))}
            </div>,
        },
        {
            key: '4',
            label: 'Audio',
            children: <div className='flex flex-col gap-2'>
                {audioList.map((audio: any) => (
                    <button onClick={() => {
                        setSelectedAudioItem(audio);
                        setAudioModalOpen(true);
                    }} key={audio.id} className='w-full h-10 rounded-md bg-gray-100 flex items-center px-4 cursor-pointer hover:bg-gray-200'>
                        <i className="fa-solid fa-music mr-2 text-gray-500"></i>
                        <span className="text-sm">{audio.name}</span>
                    </button>
                ))}
            </div>,
        }
    ];
    return (
        <div className='w-full h-full'>
            <Collapse accordion items={items} defaultActiveKey={['1']} />

            <Modal
                title="Audio Options"
                open={audioModalOpen}
                onCancel={() => setAudioModalOpen(false)}
                footer={null}
            >
                <div className="flex flex-col gap-4 py-4">
                    <p>How should this audio play?</p>
                    <div className="flex gap-4 justify-center">
                        <Button onClick={() => handleAddAudio(false)} size="large">
                            One-time
                        </Button>
                        <Button onClick={() => handleAddAudio(true)} type="primary" size="large">
                            Loop
                        </Button>
                    </div>
                </div>
            </Modal>

            <ImageGallery
                open={imageGalleryOpen}
                onClose={() => setImageGalleryOpen(false)}
                onSelect={handleSelectFromGallery}
            />
        </div>
    )
}

export default Elements