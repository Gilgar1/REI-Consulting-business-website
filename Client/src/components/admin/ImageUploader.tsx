import React, { useState, useRef } from 'react';
import { supabase } from '../../supabaseClient';
import { UploadCloud, X, Image as ImageIcon, Loader2, CheckCircle2, AlertCircle } from 'lucide-react';
import { Button } from '../ui/button';

interface ImageUploaderProps {
  value?: string;
  currentUrl?: string | null;
  onChange?: (url: string) => void;
  onUploaded?: (url: string) => void;
  table: string; // e.g., 'properties' | 'articles'
  label?: string;
  disabled?: boolean;
}

export function ImageUploader({
  value,
  currentUrl,
  onChange,
  onUploaded,
  table,
  label = 'Featured Image / Photo',
  disabled = false,
}: ImageUploaderProps) {
  const currentValue = currentUrl !== undefined ? (currentUrl || '') : (value || '');
  const triggerChange = (url: string) => {
    onChange?.(url);
    onUploaded?.(url);
  };
  const [isDragging, setIsDragging] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [manualInput, setManualInput] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = async (file: File) => {
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      setError('Please select a valid image file (PNG, JPG, WEBP, etc.)');
      return;
    }

    // Limit size to 10MB
    if (file.size > 10 * 1024 * 1024) {
      setError('Image file must be under 10MB');
      return;
    }

    try {
      setUploading(true);
      setError(null);

      const uuid = typeof crypto !== 'undefined' && crypto.randomUUID ? crypto.randomUUID() : Math.random().toString(36).substring(2);
      const sanitizedName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_');
      const filePath = `${table}/${uuid}-${sanitizedName}`;

      const { data, error: uploadError } = await supabase.storage
        .from('media')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false,
        });

      if (uploadError) {
        throw uploadError;
      }

      const { data: urlData } = supabase.storage
        .from('media')
        .getPublicUrl(data.path);

      if (urlData?.publicUrl) {
        triggerChange(urlData.publicUrl);
      } else {
        throw new Error('Could not retrieve public URL for uploaded file.');
      }
    } catch (err: any) {
      console.error('Upload failed:', err);
      setError(err.message || 'Image upload failed. Please ensure the "media" storage bucket exists and is public.');
    } finally {
      setUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    if (!disabled && !uploading) {
      setIsDragging(true);
    }
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (disabled || uploading) return;

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFileUpload(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      handleFileUpload(e.target.files[0]);
    }
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <label className="text-sm font-medium text-slate-700">{label}</label>
        <button
          type="button"
          onClick={() => setManualInput(!manualInput)}
          className="text-xs text-accent hover:underline focus:outline-none"
        >
          {manualInput ? 'Switch to file upload' : 'Enter image URL manually'}
        </button>
      </div>

      {manualInput ? (
        <div className="flex gap-2">
          <input
            type="url"
            value={currentValue}
            onChange={(e) => triggerChange(e.target.value)}
            placeholder="https://images.unsplash.com/..."
            className="flex-1 px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-accent"
          />
          {currentValue && (
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => triggerChange('')}
            >
              Clear
            </Button>
          )}
        </div>
      ) : currentValue ? (
        /* Preview state */
        <div className="relative rounded-xl border border-slate-200 overflow-hidden bg-slate-50 group">
          <img
            src={currentValue}
            alt="Uploaded preview"
            className="w-full h-48 object-cover transition-transform group-hover:scale-105 duration-300"
            onError={(e) => {
              (e.target as HTMLImageElement).src = 'https://via.placeholder.com/600x300?text=Invalid+Image+URL';
            }}
          />
          <div className="absolute inset-0 bg-slate-900/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
            <Button
              type="button"
              variant="secondary"
              size="sm"
              className="bg-white/90 hover:bg-white text-slate-800"
              onClick={() => fileInputRef.current?.click()}
              disabled={uploading}
            >
              Replace
            </Button>
            <Button
              type="button"
              variant="destructive"
              size="sm"
              onClick={() => triggerChange('')}
              disabled={uploading}
            >
              Remove
            </Button>
          </div>
          <div className="absolute bottom-2 left-2 bg-slate-900/70 backdrop-blur-sm text-white text-xs px-2.5 py-1 rounded-md flex items-center gap-1.5 truncate max-w-[90%]">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
            <span className="truncate">{currentValue}</span>
          </div>
        </div>
      ) : (
        /* Drag & Drop Upload Zone */
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => !uploading && !disabled && fileInputRef.current?.click()}
          className={`border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-all duration-200 ${
            isDragging
              ? 'border-accent bg-amber-50/50'
              : 'border-slate-200 hover:border-slate-400 bg-slate-50/50 hover:bg-slate-50'
          } ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            disabled={disabled || uploading}
            className="hidden"
          />

          {uploading ? (
            <div className="py-4 flex flex-col items-center justify-center space-y-2">
              <Loader2 className="w-8 h-8 animate-spin text-accent" />
              <p className="text-sm font-medium text-slate-700">Uploading to Supabase Storage...</p>
              <p className="text-xs text-slate-400">media/{table}/...</p>
            </div>
          ) : (
            <div className="py-2 flex flex-col items-center justify-center space-y-2">
              <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center text-slate-500">
                <UploadCloud className="w-6 h-6" />
              </div>
              <div>
                <p className="text-sm font-semibold text-slate-700">
                  Click to upload or drag and drop
                </p>
                <p className="text-xs text-slate-500 mt-0.5">
                  PNG, JPG, WEBP up to 10MB (Saved to Supabase media bucket)
                </p>
              </div>
            </div>
          )}
        </div>
      )}

      {error && (
        <div className="flex items-start gap-2 p-2.5 rounded-lg bg-red-50 text-red-700 text-xs border border-red-200">
          <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-red-500" />
          <span>{error}</span>
        </div>
      )}
    </div>
  );
}
