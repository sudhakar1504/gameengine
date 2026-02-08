import { Collapse, Modal, Button } from 'antd';
import React, { useState } from 'react'
import { defaultImageConfig, defaultTextConfig, defaultAudioConfig, defaultAnimationConfig } from '@/utils/config/defaults';
import { audioList } from '@/utils/config/audioList';

const Elements = ({ setData, setElementsOpen }: any) => {
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

    const imgData = [
        {
            id: 1,
            text: 'Image',
            type: 'image',
            src: "https://img.genially.com/59e059d30b9c21060cb4c2ec/8f293231-acf4-48b4-85ac-62466e7f4480.gif",
            icon: <i className="fa-solid fa-image"></i>
        },
        {
            id: 2,
            text: 'Image',
            type: 'image',
            src: "https://img.genially.com/59e059d30b9c21060cb4c2ec/a44f666b-78b0-44e1-99dd-3707fdb746ad.png",
            icon: <i className="fa-solid fa-image"></i>
        },
        {
            id: 3,
            text: 'Image',
            type: 'image',
            src: "https://img.genially.com/59e059d30b9c21060cb4c2ec/55672a47-a339-4d75-8da5-ff60a57b4823.png",
            icon: <i className="fa-solid fa-image"></i>
        },
        {
            id: 4,
            text: 'Image',
            type: 'image',
            src: "https://img.genially.com/59e059d30b9c21060cb4c2ec/6ebf8e4a-04db-47d1-99c0-43dd4cc56037.png",
            icon: <i className="fa-solid fa-image"></i>
        },
        {
            id: 5,
            text: 'Image',
            type: 'image',
            src: "https://img.genially.com/59e059d30b9c21060cb4c2ec/52abb919-f9dc-492e-a26e-6febeb8b449f.png",
            icon: <i className="fa-solid fa-image"></i>
        },
        {
            id: 6,
            text: 'Image',
            type: 'image',
            src: "https://img.genially.com/59e059d30b9c21060cb4c2ec/1b59dd84-f376-442c-99ca-e6aeff607277.png",
            icon: <i className="fa-solid fa-image"></i>
        },
        {
            id: 7,
            text: 'Image',
            type: 'image',
            src: "https://img.genially.com/59e059d30b9c21060cb4c2ec/d3ab05ef-215f-48a2-8df2-ee6fc8d5635a.png",
            icon: <i className="fa-solid fa-image"></i>
        }
    ];

    const bgData = [
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
                            return [...prevData, {
                                ...elementData['text'],
                                id: Date.now().toString(),
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
            children: <div className='flex flex-wrap gap-2'>
                {imgData.map((element: any) => (
                    <button onClick={() => {
                        setData((prevData: any) => {
                            return [...prevData, {
                                ...elementData['image'],
                                id: Date.now().toString(),
                                src: element.src,
                            }]
                        })
                        setElementsOpen(null)

                    }} key={element.id} className='w-[80px] h-[80px] rounded-md bg-gray-200 flex items-center justify-center cursor-pointer'>
                        <img src={element.src} className='w-full h-full object-contain' alt="" />
                    </button>
                ))}
            </div>,
        },
        {
            key: '3',
            label: 'Background',
            children: <div className='flex flex-wrap gap-2'>
                {bgData.map((element: any) => (
                    <button onClick={() => {

                        setData((prevData: any) => {
                            let bg = prevData.filter((item: any) => item.type === 'bg');
                            if (bg.length > 0) {
                                return prevData.map((item: any) => {
                                    if (item.type === 'bg') {
                                        return {
                                            ...item,
                                            src: element.src,
                                        }
                                    }
                                    return item
                                })
                            } else {
                                return [...prevData, {
                                    id: Date.now().toString(),
                                    type: "bg",
                                    src: element.src
                                }]
                            }
                        })
                        setElementsOpen(null)

                    }} key={element.id} className='w-[80px] h-[80px] rounded-md bg-gray-200 flex items-center justify-center cursor-pointer'>
                        <img src={element.src} className='w-full h-full object-contain' alt="" />
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
        </div>
    )
}

export default Elements