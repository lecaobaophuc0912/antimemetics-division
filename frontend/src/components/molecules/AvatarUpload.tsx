import React, { useState, useRef, useEffect } from 'react';
import { Avatar } from '../atoms/Avatar';
import { Button } from '../atoms/Button';
import { useAvatar } from '../../hooks/useAvatar';
import { authService } from '../../services';

export interface AvatarUploadProps {
    currentAvatarUrl?: string | null;
    onAvatarUpdate: (newAvatarUrl: string) => void;
    userName?: string;
    userEmail?: string;
    className?: string;
}

export const AvatarUpload: React.FC<AvatarUploadProps> = ({
    currentAvatarUrl,
    onAvatarUpdate,
    userName,
    userEmail,
    className = '',
}) => {
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const [isUploading, setIsUploading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [uploadMode, setUploadMode] = useState<'binary' | 'file'>('binary');
    const fileInputRef = useRef<HTMLInputElement>(null);

    const avatarSource = useAvatar({ avatarUrl: currentAvatarUrl });

    useEffect(() => {
        if (!selectedFile) {
            setPreviewUrl(null);
            return;
        }
        const url = URL.createObjectURL(selectedFile);
        setPreviewUrl(url);
        return () => URL.revokeObjectURL(url);
    }, [selectedFile]);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0] || null;
        if (!file) return;

        if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) {
            setError('Invalid file type. Only JPG, PNG, WEBP allowed.');
            return;
        }

        const maxSize = uploadMode === 'binary' ? 1 * 1024 * 1024 : 2 * 1024 * 1024; // 1MB for binary, 2MB for file
        if (file.size > maxSize) {
            setError(`File too large. Max ${maxSize / (1024 * 1024)}MB for ${uploadMode} storage.`);
            return;
        }

        setError(null);
        setSelectedFile(file);
    };

    const triggerChooseFile = () => {
        fileInputRef.current?.click();
    };

    const handleUpload = async () => {
        if (!selectedFile) return;

        setIsUploading(true);
        setError(null);

        try {
            let response;

            if (uploadMode === 'binary') {
                response = await authService.uploadAvatarBinary(selectedFile);
            } else {
                response = await authService.uploadAvatarFile(selectedFile);
            }

            const data = response.data;
            onAvatarUpdate(data.avatarUrl);
            setSelectedFile(null);
            setPreviewUrl(null);
        } catch (err: any) {
            setError(err.response?.data?.message || err.message || 'Upload failed');
        } finally {
            setIsUploading(false);
        }
    };

    const clearSelection = () => {
        setSelectedFile(null);
        setPreviewUrl(null);
        setError(null);
    };

    const getUploadModeDescription = () => {
        if (uploadMode === 'binary') {
            return 'Stored directly in database (max 1MB, optimized)';
        }
        return 'Stored as file on server (max 2MB, original quality)';
    };

    return (
        <div className={`bg-black/40 rounded-lg p-4 border border-green-500/20 ${className}`}>
            <div className="flex items-center gap-6">
                {/* Current avatar */}
                <div className="flex flex-col items-center gap-2">
                    <Avatar
                        src={avatarSource.displaySrc}
                        alt="avatar"
                        size="xl"
                        className="border border-green-500/40"
                        defaultText={userName || userEmail || 'N/A'}
                    />
                    <span className="text-xs text-gray-400 text-center">
                        Current
                    </span>
                </div>

                {/* Upload controls */}
                <div className="flex-1 space-y-4">
                    {/* Upload mode selector */}
                    <div className="flex items-center gap-3">
                        <label className="text-sm text-green-300">Storage Mode:</label>
                        <div className="flex rounded-lg border border-green-500/30 overflow-hidden">
                            <button
                                type="button"
                                onClick={() => setUploadMode('binary')}
                                className={`px-3 py-1 text-xs font-medium transition-colors ${uploadMode === 'binary'
                                    ? 'bg-green-600 text-white'
                                    : 'bg-transparent text-green-300 hover:bg-green-900/50'
                                    }`}
                            >
                                Binary
                            </button>
                            <button
                                type="button"
                                onClick={() => setUploadMode('file')}
                                className={`px-3 py-1 text-xs font-medium transition-colors ${uploadMode === 'file'
                                    ? 'bg-green-600 text-white'
                                    : 'bg-transparent text-green-300 hover:bg-green-900/50'
                                    }`}
                            >
                                File
                            </button>
                        </div>
                        <span className="text-xs text-gray-400">
                            {getUploadModeDescription()}
                        </span>
                    </div>

                    {/* File selection */}
                    <div className="flex items-center gap-3">
                        <input
                            ref={fileInputRef}
                            type="file"
                            accept="image/png,image/jpeg,image/webp"
                            onChange={handleFileChange}
                            className="hidden"
                        />
                        <Button
                            onClick={triggerChooseFile}
                            variant="secondary"
                            size="sm"
                        >
                            Choose Image
                        </Button>
                        <span className="text-xs text-green-300 truncate max-w-[200px]">
                            {selectedFile ? selectedFile.name : 'JPG, PNG, WEBP'}
                        </span>
                        {selectedFile && (
                            <Button
                                onClick={clearSelection}
                                variant="ghost"
                                size="sm"
                                className="text-red-400 hover:text-red-300"
                            >
                                Clear
                            </Button>
                        )}
                    </div>

                    {/* Preview */}
                    {previewUrl && (
                        <div className="flex items-center gap-3">
                            <span className="text-xs text-gray-400">Preview:</span>
                            <Avatar
                                src={previewUrl}
                                alt="preview"
                                size="lg"
                                className="border border-green-500/30"
                                defaultText="Preview"
                            />
                        </div>
                    )}

                    {/* Error display */}
                    {error && (
                        <div className="text-red-400 text-sm bg-red-900/20 px-3 py-2 rounded border border-red-500/30">
                            {error}
                        </div>
                    )}

                    {/* Upload button */}
                    <Button
                        onClick={handleUpload}
                        disabled={!selectedFile || isUploading}
                        className="w-full"
                    >
                        {isUploading ? 'Uploading...' : `Upload as ${uploadMode === 'binary' ? 'Binary' : 'File'}`}
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default AvatarUpload;
