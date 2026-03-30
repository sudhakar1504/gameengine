import { Collapse, Modal, Button } from 'antd';
import React, { useState, useRef } from 'react'
import { defaultImageConfig, defaultTextConfig, defaultAudioConfig, defaultAnimationConfig, defaultInteractionConfig } from '@/utils/config/defaults';
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
            "interaction": defaultInteractionConfig,
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
            "interaction": defaultInteractionConfig,
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
            "interaction": defaultInteractionConfig,
            "animations": defaultAnimationConfig
        }
    }

    const [audioModalOpen, setAudioModalOpen] = useState(false);
    const [selectedAudioItem, setSelectedAudioItem] = useState<any>(null);

    const imageUploadRef = useRef<HTMLInputElement>(null);
    const bgUploadRef = useRef<HTMLInputElement>(null);
    const audioUploadRef = useRef<HTMLInputElement>(null);

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = () => {
            imageHandler(reader.result as string);
        };
        reader.readAsDataURL(file);
        e.target.value = '';
    };

    const handleBgUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = () => {
            bgHandler(reader.result as string);
        };
        reader.readAsDataURL(file);
        e.target.value = '';
    };

    const handleAudioUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = () => {
            setSelectedAudioItem({ name: file.name, src: reader.result as string });
            setAudioModalOpen(true);
        };
        reader.readAsDataURL(file);
        e.target.value = '';
    };

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
            children: <div className="flex flex-wrap gap-2 pt-1">
                {textData.map((element: any) => (
                    <button
                        onClick={textHandler}
                        key={element.id}
                        className='flex flex-col items-center justify-center gap-1 cursor-pointer transition-colors'
                        style={{ width: 80, height: 56, background: 'var(--gray-100)', border: '1px solid var(--border-default)', borderRadius: 6 }}
                        onMouseEnter={e => (e.currentTarget.style.background = 'var(--gray-200)')}
                        onMouseLeave={e => (e.currentTarget.style.background = 'var(--gray-100)')}
                    >
                        <span style={{ fontSize: 16, color: 'var(--gray-600)' }}>{element.icon}</span>
                        <span style={{ fontSize: 10, fontWeight: 600, color: 'var(--gray-700)' }}>{element.text}</span>
                    </button>
                ))}
            </div>,
        },
        {
            key: '2',
            label: 'Image',
            children: <div className='flex flex-col gap-3 pt-1'>
                <div className='flex justify-between items-center p-2 rounded' style={{ background: 'var(--gray-50)', border: '1px dashed var(--gray-300)' }}>
                    <span style={{ fontSize: 10, color: 'var(--text-secondary)', fontWeight: 500 }}>Recommended Images</span>
                    <div className='flex gap-1'>
                        <Button
                            size="small"
                            onClick={() => imageUploadRef.current?.click()}
                            className='text-[10px] h-6'
                            icon={<i className="fa-solid fa-upload" style={{ fontSize: 10 }} />}
                        >
                            Upload
                        </Button>
                        <Button
                            type="primary"
                            size="small"
                            onClick={() => setImageGalleryOpen(true)}
                            className='text-[10px] h-6'
                        >
                            View All
                        </Button>
                    </div>
                </div>
                <input ref={imageUploadRef} type="file" accept="image/*" style={{ display: 'none' }} onChange={handleImageUpload} />
                <div className='flex flex-wrap gap-2'>
                    {imageList.map((element: any) => (
                        <button
                            onClick={() => imageHandler(element.src)}
                            key={element.id}
                            className='cursor-pointer overflow-hidden transition-all'
                            style={{ width: 80, height: 80, background: 'var(--gray-100)', border: '1px solid var(--border-default)', borderRadius: 6 }}
                            onMouseEnter={e => (e.currentTarget.style.borderColor = 'var(--accent-primary)')}
                            onMouseLeave={e => (e.currentTarget.style.borderColor = 'var(--border-default)')}
                        >
                            <img loading='lazy' src={element.src} className='w-full h-full object-contain' alt="" />
                        </button>
                    ))}
                </div>
            </div>,
        },
        {
            key: '3',
            label: 'Background',
            children: <div className='flex flex-col gap-3 pt-1'>
                <div className='flex justify-between items-center p-2 rounded' style={{ background: 'var(--gray-50)', border: '1px dashed var(--gray-300)' }}>
                    <span style={{ fontSize: 10, color: 'var(--text-secondary)', fontWeight: 500 }}>Or upload your own</span>
                    <Button
                        size="small"
                        onClick={() => bgUploadRef.current?.click()}
                        className='text-[10px] h-6'
                        icon={<i className="fa-solid fa-upload" style={{ fontSize: 10 }} />}
                    >
                        Upload
                    </Button>
                </div>
                <input ref={bgUploadRef} type="file" accept="image/*" style={{ display: 'none' }} onChange={handleBgUpload} />
                <div className='flex flex-wrap gap-2'>
                    {bgList.map((element: any) => (
                        <button
                            onClick={() => bgHandler(element.Image)}
                            key={element.id}
                            className='cursor-pointer overflow-hidden transition-all'
                            style={{ width: 80, height: 80, background: 'var(--gray-100)', border: '1px solid var(--border-default)', borderRadius: 6 }}
                            onMouseEnter={e => (e.currentTarget.style.borderColor = 'var(--accent-primary)')}
                            onMouseLeave={e => (e.currentTarget.style.borderColor = 'var(--border-default)')}
                        >
                            <img loading='lazy' src={element.Image} className='w-full h-full object-contain' alt="" />
                        </button>
                    ))}
                </div>
            </div>,
        },
        {
            key: '4',
            label: 'Audio',
            children: <div className='flex flex-col gap-1.5 pt-1'>
                <div className='flex justify-between items-center p-2 rounded' style={{ background: 'var(--gray-50)', border: '1px dashed var(--gray-300)' }}>
                    <span style={{ fontSize: 10, color: 'var(--text-secondary)', fontWeight: 500 }}>Upload audio file</span>
                    <Button
                        size="small"
                        onClick={() => audioUploadRef.current?.click()}
                        className='text-[10px] h-6'
                        icon={<i className="fa-solid fa-upload" style={{ fontSize: 10 }} />}
                    >
                        Upload
                    </Button>
                </div>
                <input ref={audioUploadRef} type="file" accept="audio/*" style={{ display: 'none' }} onChange={handleAudioUpload} />
                {audioList.map((audio: any) => (
                    <button
                        onClick={() => {
                            setSelectedAudioItem(audio);
                            setAudioModalOpen(true);
                        }}
                        key={audio.id}
                        className='w-full flex items-center gap-2 px-3 cursor-pointer transition-colors'
                        style={{ height: 36, background: 'var(--gray-50)', border: '1px solid var(--border-default)', borderRadius: 6, textAlign: 'left' }}
                        onMouseEnter={e => (e.currentTarget.style.background = 'var(--gray-100)')}
                        onMouseLeave={e => (e.currentTarget.style.background = 'var(--gray-50)')}
                    >
                        <i className="fa-solid fa-music" style={{ color: 'var(--gray-400)', fontSize: 12 }}></i>
                        <span style={{ fontSize: 11, color: 'var(--text-primary)' }}>{audio.name}</span>
                    </button>
                ))}
            </div>,
        }
    ];
    return (
        <div className='w-full h-full'>
            <Collapse accordion items={items} defaultActiveKey={['1']} />

            <Modal
                title={`Audio Options${selectedAudioItem ? ` — ${selectedAudioItem.name}` : ''}`}
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