"use client";
import { useState, useRef } from "react";

export default function DragDropUpload({
  onUpload,
  accept = "image/*",
  label = "Drop image here or click to browse",
  previewUrl,
}: {
  onUpload: (dataUrl: string, file: File) => void | Promise<void>;
  accept?: string;
  label?: string;
  previewUrl?: string;
}) {
  const [drag, setDrag] = useState(false);
  const [preview, setPreview] = useState(previewUrl || "");
  const [uploading, setUploading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFile = async (file: File) => {
    if (!file) return;
    setUploading(true);
    const url = await new Promise<string>((resolve) => {
      const rd = new FileReader();
      rd.onload = () => resolve(rd.result as string);
      rd.readAsDataURL(file);
    });
    setPreview(url);
    await onUpload(url, file);
    setUploading(false);
  };

  return (
    <div
      onDragOver={(e) => { e.preventDefault(); setDrag(true) }}
      onDragLeave={() => setDrag(false)}
      onDrop={(e) => { e.preventDefault(); setDrag(false); const f = e.dataTransfer.files?.[0]; if (f) handleFile(f) }}
      onClick={() => inputRef.current?.click()}
      className={`border-2 border-dashed rounded-lg p-4 text-center cursor-pointer transition-colors ${drag ? "border-primary-500 bg-primary-50" : "border-gray-300 hover:border-gray-400"} ${uploading ? "pointer-events-none opacity-60" : ""}`}
    >
      <input ref={inputRef} type="file" accept={accept} className="hidden" onChange={(e) => { const f = e.target.files?.[0]; if (f) handleFile(f) }} />
      {uploading ? (
        <div className="flex items-center justify-center gap-2 text-sm text-gray-500">
          <div className="animate-spin w-4 h-4 border-2 border-primary-500 border-t-transparent rounded-full" />
          Uploading...
        </div>
      ) : preview ? (
        <div className="relative inline-block">
          <img src={preview} alt="Preview" className="max-h-32 mx-auto rounded object-contain" />
          <p className="text-xs text-gray-400 mt-1">Click or drag to replace</p>
        </div>
      ) : (
        <div className="text-sm text-gray-500">
          <p className="text-2xl mb-1">📁</p>
          <p>{label}</p>
        </div>
      )}
    </div>
  );
}
