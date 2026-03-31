// src/admin/EditableElements.tsx
import React, { useState } from 'react';
import type {ChangeEvent} from 'react';
import imageCompression from 'browser-image-compression';

// Описываем пропсы для текста
interface EditableTextProps {
  value: string;
  onSave: (newValue: string) => void;
  tagName?: 'h1' | 'h2' | 'p' | 'span' | 'div';
  className?: string;
}

export const EditableText: React.FC<EditableTextProps> = ({ 
  value, 
  onSave, 
  tagName: Tag = 'p', 
  className 
}) => {
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [currentValue, setCurrentValue] = useState<string>(value);

  const handleBlur = (): void => {
    setIsEditing(false);
    if (currentValue !== value) {
      onSave(currentValue);
    }
  };

  if (isEditing) {
    return (
      <textarea
        autoFocus
        className={`${className} w-full border-2 border-orange-500 bg-white/20 outline-none p-2 rounded`}
        value={currentValue}
        onChange={(e: ChangeEvent<HTMLTextAreaElement>) => setCurrentValue(e.target.value)}
        onBlur={handleBlur}
      />
    );
  }

  return (
    <Tag 
      className={`${className} hover:ring-2 hover:ring-orange-400 hover:ring-dashed cursor-pointer transition-all`} 
      onClick={() => setIsEditing(true)}
    >
      {currentValue}
    </Tag>
  );
};

// Описываем пропсы для картинок
interface EditableImageProps {
  src: string;
  onSave: (base64: string) => void;
  className?: string;
}

export const EditableImage: React.FC<EditableImageProps> = ({ src, onSave, className }) => {
  const handleFileChange = async (e: ChangeEvent<HTMLInputElement>): Promise<void> => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const options = { maxSizeMB: 1, maxWidthOrHeight: 1920, useWebWorker: true };
      const compressedFile = await imageCompression(file, options);
      
      const reader = new FileReader();
      reader.readAsDataURL(compressedFile);
      reader.onloadend = () => {
        onSave(reader.result as string);
      };
    } catch (error) {
      console.error("Ошибка сжатия:", error);
    }
  };

  return (
    <div className="relative group cursor-pointer w-full h-full">
      <img src={src} className={className} alt="Editable" />
      <label className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity">
        <span className="text-white font-bold bg-[#8f4e00] px-4 py-2 rounded">Сменить фото</span>
        <input type="file" className="hidden" onChange={handleFileChange} accept="image/*" />
      </label>
    </div>
  );
};
