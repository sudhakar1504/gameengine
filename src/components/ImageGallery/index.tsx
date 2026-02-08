import React, { useState } from 'react';
import { Modal } from 'antd';
import { imageGalleryData } from '@/utils/config/imageGallery';

interface ImageGalleryProps {
    open: boolean;
    onClose: () => void;
    onSelect: (src: string) => void;
}

const ImageGallery = ({ open, onClose, onSelect }: ImageGalleryProps) => {
    const [activeCategory, setActiveCategory] = useState(imageGalleryData[0].category);

    const activeImages = imageGalleryData.find(cat => cat.category === activeCategory)?.images || [];

    return (
        <Modal
            title="Image Gallery"
            open={open}
            onCancel={onClose}
            width={1000}
            footer={null}
            centered
            styles={{
                body: { height: '70vh', padding: 0 }
            }}
        >
            <div className="flex h-full border-t">
                {/* Sidebar */}
                <div className="w-64 border-r bg-gray-50 overflow-y-auto">
                    {imageGalleryData.map((cat) => (
                        <div
                            key={cat.category}
                            onClick={() => setActiveCategory(cat.category)}
                            className={`px-6 py-4 cursor-pointer transition-colors duration-200 border-l-4 ${activeCategory === cat.category
                                ? "bg-white border-blue-500 text-blue-600 font-semibold"
                                : "border-transparent text-gray-600 hover:bg-gray-100"
                                }`}
                        >
                            {cat.category}
                        </div>
                    ))}
                </div>

                {/* Content Area */}
                <div className="flex-1 p-6 overflow-y-auto bg-gray-50">
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                        {activeImages.map((image: any, index: number) => (
                            <div
                                key={`${index}_${image?.Id}`}
                                onClick={() => onSelect(image?.Image)}
                                className="aspect-square bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow duration-200 cursor-pointer overflow-hidden border border-gray-100 group"
                            >
                                <div className="w-full h-full p-2 flex items-center justify-center relative">
                                    <img
                                        loading="lazy"
                                        src={image?.Image}
                                        alt={`Gallery ${index}`}
                                        className="max-w-full max-h-full object-contain group-hover:scale-110 transition-transform duration-300"
                                    />
                                    <div className="absolute inset-0 bg-blue-500/0 group-hover:bg-blue-500/10 transition-colors duration-200 flex items-center justify-center">
                                        <div className="bg-blue-500 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transform translate-y-4 group-hover:translate-y-0 transition-all duration-300">
                                            <i className="fa-solid fa-plus"></i>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </Modal>
    );
};

export default ImageGallery;
