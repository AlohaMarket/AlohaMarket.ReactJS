import { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import toast from 'react-hot-toast';
import { authApi } from '@/apis/auth';
import { useApp } from '@/contexts';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import { IMAGE_CONFIG } from '@/constants'; // Import the config

interface ProfileImageUploadModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function ProfileImageUploadModal({ isOpen, onClose }: ProfileImageUploadModalProps) {
    const { t } = useTranslation();
    const { user, setUser } = useApp();

    const [isUploading, setIsUploading] = useState(false);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    // Reset state when modal opens/closes
    useEffect(() => {
        if (!isOpen) {
            setSelectedFile(null);
            setPreviewUrl(null);
        } else if (user?.avatarUrl) {
            // Show current avatar as preview when modal opens
            setPreviewUrl(user.avatarUrl);
        }
    }, [isOpen, user?.avatarUrl]);

    // Handle file selection
    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // Validate file type using IMAGE_CONFIG
        if (!IMAGE_CONFIG.allowedTypes.some(type => file.type.startsWith(type.split('/')[0]))) {
            toast.error(t('profile.imageTypeError', {
                allowedTypes: IMAGE_CONFIG.allowedTypes.join(', ')
            }));
            return;
        }

        // Validate file size using IMAGE_CONFIG
        if (file.size > IMAGE_CONFIG.maxSize) {
            toast.error(t('profile.imageSizeError', {
                maxSize: (IMAGE_CONFIG.maxSize / (1024 * 1024)) + 'MB'
            }));
            return;
        }

        setSelectedFile(file);

        // Create preview URL
        const reader = new FileReader();
        reader.onload = () => {
            setPreviewUrl(reader.result as string);
        };
        reader.readAsDataURL(file);
    };

    // Trigger file input when clicking on the avatar or upload button
    const triggerFileInput = () => {
        fileInputRef.current?.click();
    };

    // Handle upload submission
    const handleUpload = async () => {
        if (!selectedFile) return;
        setIsUploading(true);

        try {
            // Create FormData with the file
            const formData = new FormData();
            formData.append('file', selectedFile);

            // Log for debugging
            console.log('Uploading file:', selectedFile.name, selectedFile.type, selectedFile.size);

            // Use a try-catch specifically for the API call
            const response = await authApi.uploadAvatar(formData);

            if (response.data) {
                setUser(response.data);
                toast.success(t('profile.avatarUpdateSuccess'));
                onClose();
            }
        } catch (error: any) {
            console.error('Upload error details:', error);
            // More specific error message
            const errorMsg = error.message || t('profile.avatarUpdateError');
            toast.error(errorMsg);
        } finally {
            setIsUploading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
                <div className="p-6">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-xl font-semibold text-gray-800">
                            {t('profile.updateAvatar')}
                        </h2>
                        <button
                            onClick={onClose}
                            className="text-gray-500 hover:text-gray-700"
                        >
                            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd"></path>
                            </svg>
                        </button>
                    </div>

                    {/* Avatar Preview */}
                    <div className="flex flex-col items-center mb-6">
                        <div
                            className="w-32 h-32 rounded-full border-2 border-dashed border-gray-300 flex items-center justify-center mb-2 cursor-pointer hover:border-yellow-400 overflow-hidden"
                            onClick={triggerFileInput}
                        >
                            {previewUrl ? (
                                <img
                                    src={previewUrl}
                                    alt={t('profile.avatar')}
                                    className="w-full h-full object-cover"
                                />
                            ) : (
                                <img
                                    src={IMAGE_CONFIG.placeholder}
                                    alt={t('profile.avatar')}
                                    className="w-16 h-16 object-cover opacity-50"
                                />
                            )}
                        </div>
                        <p className="text-sm text-gray-500">{t('profile.clickToSelect')}</p>
                        <input
                            ref={fileInputRef}
                            type="file"
                            accept={IMAGE_CONFIG.allowedTypes.join(',')}
                            className="hidden"
                            onChange={handleFileChange}
                            aria-label={t('profile.selectAvatar')}
                        />
                    </div>

                    {/* File Upload Guidelines - Updated with dynamic values */}
                    <div className="bg-gray-50 rounded-lg p-3 mb-4">
                        <h3 className="text-sm font-medium text-gray-700 mb-1">{t('profile.uploadGuidelines')}</h3>
                        <ul className="text-xs text-gray-500 list-disc pl-4 space-y-1">
                            <li>
                                {t('profile.fileTypeInfo', {
                                    types: IMAGE_CONFIG.allowedTypes
                                        .map(type => type.replace('image/', ''))
                                        .join(', ')
                                })}
                            </li>
                            <li>
                                {t('profile.fileSizeInfo', {
                                    maxSize: (IMAGE_CONFIG.maxSize / (1024 * 1024)) + 'MB'
                                })}
                            </li>
                            <li>{t('profile.imageQualityInfo')}</li>
                        </ul>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex justify-between">

                        {/* Right side: Cancel and Upload buttons */}
                        <div className="flex space-x-2">
                            <button
                                onClick={onClose}
                                disabled={isUploading}
                                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {t('common.cancel')}
                            </button>
                            <button
                                onClick={handleUpload}
                                disabled={!selectedFile || isUploading}
                                className={`px-4 py-2 bg-yellow-500 text-white rounded-md hover:bg-yellow-600 disabled:opacity-50 disabled:cursor-not-allowed`}
                            >
                                {isUploading ? (
                                    <div className="flex items-center">
                                        <LoadingSpinner size="sm" className="mr-2" />
                                        {t('common.uploading')}
                                    </div>
                                ) : (
                                    t('common.upload')
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}