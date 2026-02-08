import { Collapse, Modal, Button } from 'antd';
import React, { useState } from 'react'
import { defaultImageConfig, defaultTextConfig, defaultAudioConfig, defaultAnimationConfig } from '@/utils/config/defaults';
import { audioList } from '@/utils/config/audioList';
import { imageList } from '@/utils/config/imageList';
import ImageGallery from '../ImageGallery';
import { bgList } from '@/utils/config/bgList';

const Elements = ({ setData, setElementsOpen }: any) => {
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
        setData((prevData: any) => {
            const maxZIndex = Math.max(...prevData.map((i: any) => i.zIndex || 1), 0);
            const newZIndex = maxZIndex + 1;
            return [...prevData, {
                ...elementData['image'],
                id: Date.now().toString(),
                src: src,
                zIndex: newZIndex
            }]
        });
        setImageGalleryOpen(false);
        setElementsOpen(null);
    }

    const handleAddAudio = (loop: boolean) => {
        if (!selectedAudioItem) return;

        setData((prevData: any) => {
            return [...prevData, {
                ...elementData['audio'],
                id: Date.now().toString(),
                src: selectedAudioItem.src,
                audio: {
                    ...defaultAudioConfig,
                    loop: loop
                }
            }]
        });
        setAudioModalOpen(false);
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



    const bgDatas = [
        {
            id: 1,
            text: 'Image',
            type: 'image',
            src: "https://img.genially.com/59e059d30b9c21060cb4c2ec/05a18a44-7a91-4506-9eb9-8af50a620a24.jpeg",
            icon: <i className="fa-solid fa-image"></i>
        }
    ];

    const items = [
        {
            key: '1',
            label: 'Text',
            children: <div>
                {textData.map((element: any) => (
                    <button onClick={() => {
                        setData((prevData: any) => {
                            const maxZIndex = Math.max(...prevData.map((i: any) => i.zIndex || 1));
                            const newZIndex = maxZIndex + 1;
                            return [...prevData, {
                                ...elementData['text'],
                                id: Date.now().toString(),
                                zIndex: newZIndex
                            }]
                        })
                        setElementsOpen(null)

                    }} key={element.id} className='w-[80px] h-[50px] rounded-md bg-gray-200 flex items-center justify-center cursor-pointer'>
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
                        <button onClick={() => {
                            setData((prevData: any) => {
                                const maxZIndex = Math.max(...prevData.map((i: any) => i.zIndex || 1));
                                const newZIndex = maxZIndex + 1;
                                return [...prevData, {
                                    ...elementData['image'],
                                    id: Date.now().toString(),
                                    src: element.src,
                                    zIndex: newZIndex
                                }]
                            })
                            setElementsOpen(null)

                        }} key={element.id} className='w-[80px] h-[80px] rounded-md bg-gray-200 flex items-center justify-center cursor-pointer'>
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

                        setData((prevData: any) => {
                            let bg = prevData.filter((item: any) => item.type === 'bg');
                            const maxZIndex = Math.max(...prevData.map((i: any) => i.zIndex || 1));
                            const newZIndex = maxZIndex + 1;
                            if (bg.length > 0) {
                                return prevData.map((item: any) => {
                                    if (item.type === 'bg') {
                                        return {
                                            ...item,
                                            src: element.Image,
                                            zIndex: newZIndex
                                        }
                                    }
                                    return item
                                })
                            } else {
                                return [...prevData, {
                                    id: Date.now().toString(),
                                    type: "bg",
                                    src: element.Image,
                                    zIndex: newZIndex
                                }]
                            }
                        })
                        setElementsOpen(null)

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