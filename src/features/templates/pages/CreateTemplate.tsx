import React, { useState } from 'react';
import { PageContainer } from '../../../components/layout/PageContainer';
import { Button } from '../../../components/ui/Button';
import { Input } from '../../../components/ui/Input';
import {
  ArrowLeft,
  Smartphone,
  Plus,
  Trash2,
  Send,
  AlertCircle,
  Info,
  Sparkles,
  ShieldCheck,
  CheckCheck,
  ChevronLeft,
  Phone,
  Video,
  Layers,
  Wifi,
  CornerUpLeft,
  PhoneCall,
  ExternalLink,
  Copy,
  ShieldAlert,
  Headphones,
  Bookmark,
  CheckCircle2,
  Image as ImageIcon,
  Play,
  FileText,
  Upload,
  FolderUp,
  Link2,
  X,
  Loader2,
} from 'lucide-react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { ROUTES } from '../../../utils/constants';
import { templatesApi } from '../api';
import { uploadService } from '../../../services/uploadService';

export const CreateTemplate: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const draftId = searchParams.get('draftId') || searchParams.get('id');

  const [name, setName] = useState('');
  const [category, setCategory] = useState<'MARKETING' | 'UTILITY' | 'AUTHENTICATION'>('MARKETING');
  const [language, setLanguage] = useState('en_US');
  const [headerType, setHeaderType] = useState<'NONE' | 'TEXT' | 'IMAGE' | 'VIDEO' | 'DOCUMENT'>('NONE');
  const [headerText, setHeaderText] = useState('');
  const [headerMediaUrl, setHeaderMediaUrl] = useState('');
  const [uploadedFileName, setUploadedFileName] = useState('');
  const [uploadedFileSize, setUploadedFileSize] = useState<number | null>(null);
  const [isUploadingMedia, setIsUploadingMedia] = useState(false);
  const [mediaTab, setMediaTab] = useState<'upload' | 'url'>('upload');
  const [isDraggingFile, setIsDraggingFile] = useState(false);
  const fileInputRef = React.useRef<HTMLInputElement | null>(null);
  const [body, setBody] = useState('Hello {{1}}, your order #{{2}} has been confirmed and is scheduled for delivery on {{3}}!');
  const [footer, setFooter] = useState('Reply STOP to unsubscribe from automated notifications.');
  type ButtonType = 'QUICK_REPLY' | 'URL' | 'PHONE_NUMBER' | 'COPY_CODE' | 'OPT_OUT' | 'SUPPORT';
  interface ActionButton {
    type: ButtonType;
    text: string;
    url?: string;
    phoneNumber?: string;
    code?: string;
  }

  const [buttons, setButtons] = useState<ActionButton[]>([
    { type: 'QUICK_REPLY', text: 'Track Order' },
  ]);
  const [sampleVars, setSampleVars] = useState<{ [key: string]: string }>({
    '1': 'Alex Johnson',
    '2': 'ORD-98231',
    '3': 'Friday afternoon',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSavingDraft, setIsSavingDraft] = useState(false);
  const [draftSavedSuccess, setDraftSavedSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const formatBytes = (bytes: number): string => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`;
  };

  const processFile = async (file: File, mediaKind: 'IMAGE' | 'VIDEO' | 'DOCUMENT') => {
    const maxSizes = {
      IMAGE: 5 * 1024 * 1024,     // 5MB
      VIDEO: 16 * 1024 * 1024,    // 16MB
      DOCUMENT: 100 * 1024 * 1024 // 100MB
    };

    if (file.size > maxSizes[mediaKind]) {
      const maxMb = mediaKind === 'IMAGE' ? '5MB' : mediaKind === 'VIDEO' ? '16MB' : '100MB';
      setErrorMessage(`Selected ${mediaKind.toLowerCase()} file (${formatBytes(file.size)}) exceeds maximum allowed size of ${maxMb}.`);
      return;
    }

    setIsUploadingMedia(true);
    setErrorMessage(null);
    try {
      const result = await uploadService.uploadFile(file);
      setHeaderMediaUrl(result.url);
      setUploadedFileName(file.name);
      setUploadedFileSize(file.size);
    } catch (err: any) {
      setErrorMessage(err.message || 'Failed to upload media file.');
    } finally {
      setIsUploadingMedia(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, mediaKind: 'IMAGE' | 'VIDEO' | 'DOCUMENT') => {
    const file = e.target.files?.[0];
    if (file) {
      processFile(file, mediaKind);
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>, mediaKind: 'IMAGE' | 'VIDEO' | 'DOCUMENT') => {
    e.preventDefault();
    setIsDraggingFile(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      processFile(file, mediaKind);
    }
  };

  const handleClearMedia = () => {
    setHeaderMediaUrl('');
    setUploadedFileName('');
    setUploadedFileSize(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // Load existing draft if draftId is present
  React.useEffect(() => {
    if (draftId) {
      templatesApi.getTemplateById(draftId).then((data) => {
        if (data) {
          setName(data.name || '');
          setCategory(data.category || 'MARKETING');
          setLanguage(data.language || 'en_US');
          if (data.header) {
            setHeaderType((data.header.type as any) || 'NONE');
            setHeaderText(data.header.text || '');
            setHeaderMediaUrl(data.header.mediaUrl || '');
          }
          if (data.body) setBody(data.body);
          if (data.footer) setFooter(data.footer);
          if (data.buttons && data.buttons.length > 0) {
            setButtons(
              data.buttons.map((b: any) => ({
                type: b.type,
                text: b.text || 'Button',
                url: b.url,
                phoneNumber: b.phoneNumber || b.phone_number,
                code: b.code || (b.example && b.example[0]),
              }))
            );
          }
        }
      }).catch((err) => {
        console.error('Failed to load draft:', err);
      });
    }
  }, [draftId]);

  const handleAddButton = (type: ButtonType = 'QUICK_REPLY') => {
    if (buttons.length < 3) {
      let defaultText = 'Quick Reply';
      let defaultUrl: string | undefined = undefined;
      let defaultPhone: string | undefined = undefined;
      let defaultCode: string | undefined = undefined;

      switch (type) {
        case 'QUICK_REPLY':
          defaultText = 'Track Order';
          break;
        case 'URL':
          defaultText = 'Visit Website';
          defaultUrl = 'https://example.com/track';
          break;
        case 'PHONE_NUMBER':
          defaultText = 'Call Support';
          defaultPhone = '+15551234567';
          break;
        case 'COPY_CODE':
          defaultText = 'Copy Offer Code';
          defaultCode = 'SAVE20';
          break;
        case 'OPT_OUT':
          defaultText = 'Stop Promotions';
          break;
        case 'SUPPORT':
          defaultText = 'Talk to Agent';
          break;
      }

      setButtons([
        ...buttons,
        {
          type,
          text: defaultText,
          url: defaultUrl,
          phoneNumber: defaultPhone,
          code: defaultCode,
        },
      ]);
    }
  };

  const handleRemoveButton = (index: number) => {
    setButtons(buttons.filter((_, i) => i !== index));
  };

  const insertVariable = () => {
    const matches: string[] = body.match(/\{\{(\d+)\}\}/g) || [];
    const maxIdx = matches.reduce<number>((max, m) => {
      const num = parseInt(m.replace(/[{}]/g, ''), 10);
      return isNaN(num) ? max : Math.max(max, num);
    }, 0);
    const nextIdx = maxIdx + 1;
    setBody((prev) => `${prev} {{${nextIdx}}}`);
    setSampleVars((prev) => ({ ...prev, [String(nextIdx)]: `Value ${nextIdx}` }));
  };

  const handleSaveDraft = async () => {
    setErrorMessage(null);
    setDraftSavedSuccess(false);
    setIsSavingDraft(true);

    try {
      const sanitizedName = name.trim().toLowerCase().replace(/[^a-z0-9_]/g, '_') || `draft_template_${Date.now().toString().slice(-5)}`;

      const buildHeaderPayload = () => {
        if (headerType === 'NONE') return undefined;
        if (headerType === 'TEXT') {
          return headerText.trim() ? { type: 'TEXT' as const, text: headerText.trim() } : undefined;
        }
        return {
          type: headerType,
          mediaUrl: headerMediaUrl.trim() || undefined,
        };
      };

      await templatesApi.createTemplate({
        name: sanitizedName,
        category,
        language,
        header: buildHeaderPayload(),
        body: body.trim() || 'Draft template message body',
        footer: footer.trim() || undefined,
        buttons: buttons.length > 0 ? buttons.map(b => ({
          type: (b.type === 'OPT_OUT' || b.type === 'SUPPORT') ? 'QUICK_REPLY' : (b.type as any),
          text: b.text.trim() || 'Button',
          url: b.type === 'URL' ? b.url?.trim() : undefined,
          phoneNumber: b.type === 'PHONE_NUMBER' ? b.phoneNumber?.trim() : undefined,
          code: b.type === 'COPY_CODE' ? b.code?.trim() : undefined,
          example: b.type === 'COPY_CODE' && b.code ? [b.code.trim()] : undefined,
        })) : undefined,
        isDraft: true,
        status: 'DRAFT',
      });

      setName(sanitizedName);
      setDraftSavedSuccess(true);
      setTimeout(() => setDraftSavedSuccess(false), 6000);
    } catch (err: any) {
      setErrorMessage(err.message || 'Failed to save template as draft.');
    } finally {
      setIsSavingDraft(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setDraftSavedSuccess(false);
    setIsSubmitting(true);

    try {
      const sanitizedName = name.trim().toLowerCase().replace(/[^a-z0-9_]/g, '_');
      if (!sanitizedName) {
        throw new Error('Template name is required and must contain alphanumeric characters.');
      }

      const buildHeaderPayload = () => {
        if (headerType === 'NONE') return undefined;
        if (headerType === 'TEXT') {
          return headerText.trim() ? { type: 'TEXT' as const, text: headerText.trim() } : undefined;
        }
        return {
          type: headerType,
          mediaUrl: headerMediaUrl.trim() || undefined,
        };
      };

      await templatesApi.createTemplate({
        name: sanitizedName,
        category,
        language,
        header: buildHeaderPayload(),
        body: body.trim(),
        footer: footer.trim() || undefined,
        buttons: buttons.length > 0 ? buttons.map(b => ({
          type: (b.type === 'OPT_OUT' || b.type === 'SUPPORT') ? 'QUICK_REPLY' : (b.type as any),
          text: b.text.trim(),
          url: b.type === 'URL' ? b.url?.trim() : undefined,
          phoneNumber: b.type === 'PHONE_NUMBER' ? b.phoneNumber?.trim() : undefined,
          code: b.type === 'COPY_CODE' ? b.code?.trim() : undefined,
          example: b.type === 'COPY_CODE' && b.code ? [b.code.trim()] : undefined,
        })) : undefined,
        isDraft: false,
        status: 'PENDING',
      });

      navigate(ROUTES.TEMPLATES);
    } catch (err: any) {
      setErrorMessage(err.message || 'Failed to submit template to Meta.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Render preview body with dynamic sample variable replacements
  const previewBody = body.replace(/\{\{(\d+)\}\}/g, (_, num) => {
    return sampleVars[num] || `[Variable {{${num}}}]`;
  });

  const foundVars = Array.from(new Set(Array.from(body.matchAll(/\{\{(\d+)\}\}/g), (m) => m[1])));

  return (
    <PageContainer>
      {/* Back button */}
      <button
        onClick={() => navigate(ROUTES.TEMPLATES)}
        className="inline-flex items-center gap-2 text-xs font-bold text-[#5F7069] hover:text-[#14201C] transition-colors mb-6"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to Templates</span>
      </button>

      {draftSavedSuccess && (
        <div className="mb-6 p-4 rounded-xl bg-[#E9F9EE] border border-[#C4EBD0] text-[#006736] text-xs sm:text-sm font-bold flex items-center justify-between shadow-xs">
          <div className="flex items-center gap-2.5">
            <CheckCircle2 className="w-5 h-5 text-[#05A222] shrink-0" />
            <span>Template draft saved successfully! You can find it under the Drafts filter on the Templates page.</span>
          </div>
          <button
            onClick={() => navigate(ROUTES.TEMPLATES)}
            className="text-xs font-bold underline hover:text-[#05A222] ml-4 shrink-0"
          >
            View Drafts →
          </button>
        </div>
      )}

      {errorMessage && (
        <div className="mb-6 p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs sm:text-sm font-semibold flex items-center gap-3 shadow-xs">
          <AlertCircle className="w-5 h-5 text-rose-500 shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start">
        {/* Left Builder Form Card */}
        <div className="lg:col-span-7 bg-white p-4 sm:p-7 rounded-2xl border border-[#E2EAE6] shadow-[0_8px_30px_rgba(1,59,35,0.04)] space-y-5 sm:space-y-6">
          <div className="border-b border-[#E2EAE6] pb-4">
            <div className="flex items-center gap-2 text-xs font-bold text-[#05A222] uppercase tracking-wider mb-1">
              <Layers className="w-4 h-4" />
              <span>WhatsApp HSM Builder</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-[#14201C] tracking-tight">
              Create WhatsApp Template
            </h2>
            <p className="text-xs sm:text-sm text-[#5F7069] mt-1 font-medium">
              Submit your HSM message template to Meta WhatsApp Cloud API for automated compliance checks and instant approval.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Template Name */}
            <div>
              <label className="block text-xs sm:text-[13px] font-bold text-[#14201C] mb-1.5">
                Template Name <span className="text-[#5F7069] font-normal">(Internal Identifier)</span>
              </label>
              <Input
                value={name}
                onChange={(e) => setName(e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, '_'))}
                placeholder="e.g. order_shipment_notification_v1"
                className="text-sm font-medium"
                required
              />
              <p className="text-xs text-[#5F7069] mt-1.5 font-medium flex items-center gap-1">
                <Info className="w-3.5 h-3.5 text-[#05A222] shrink-0" /> Meta requires lowercase alphanumeric and underscore characters only.
              </p>
            </div>

            {/* Category, Language & Header Type Selection */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs sm:text-[13px] font-bold text-[#14201C] mb-1.5">
                  Category
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as 'MARKETING' | 'UTILITY' | 'AUTHENTICATION')}
                  className="w-full rounded-xl border border-[#E2EAE6] bg-white text-[#14201C] text-sm p-2.5 font-semibold focus:border-[#05A222] focus:outline-none"
                >
                  <option value="MARKETING">Marketing</option>
                  <option value="UTILITY">Utility</option>
                  <option value="AUTHENTICATION">Authentication</option>
                </select>
              </div>

              <div>
                <label className="block text-xs sm:text-[13px] font-bold text-[#14201C] mb-1.5">
                  Language
                </label>
                <select
                  value={language}
                  onChange={(e) => setLanguage(e.target.value)}
                  className="w-full rounded-xl border border-[#E2EAE6] bg-white text-[#14201C] text-sm p-2.5 font-semibold focus:border-[#05A222] focus:outline-none"
                >
                  <option value="en_US">English (US) - en_US</option>
                  <option value="en_GB">English (UK) - en_GB</option>
                  <option value="hi_IN">Hindi (India) - hi_IN</option>
                  <option value="es_ES">Spanish - es_ES</option>
                  <option value="pt_BR">Portuguese (BR) - pt_BR</option>
                  <option value="fr_FR">French - fr_FR</option>
                  <option value="de_DE">German - de_DE</option>
                  <option value="ar">Arabic - ar</option>
                </select>
              </div>

              <div>
                <label className="block text-xs sm:text-[13px] font-bold text-[#14201C] mb-1.5">
                  Header Type <span className="text-[#5F7069] font-normal">(Optional)</span>
                </label>
                <select
                  value={headerType}
                  onChange={(e) => {
                    const newType = e.target.value as 'NONE' | 'TEXT' | 'IMAGE' | 'VIDEO' | 'DOCUMENT';
                    setHeaderType(newType);
                    if (newType === 'IMAGE' && !headerMediaUrl) {
                      setHeaderMediaUrl('https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?auto=format&fit=crop&w=800&q=80');
                    } else if (newType === 'VIDEO' && !headerMediaUrl) {
                      setHeaderMediaUrl('https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4');
                    } else if (newType === 'DOCUMENT' && !headerMediaUrl) {
                      setHeaderMediaUrl('https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf');
                    }
                  }}
                  className="w-full rounded-xl border border-[#E2EAE6] bg-white text-[#14201C] text-sm p-2.5 font-semibold focus:border-[#05A222] focus:outline-none"
                >
                  <option value="NONE">None</option>
                  <option value="TEXT">Text Header</option>
                  <option value="IMAGE">📷 Image (Photo / Banner)</option>
                  <option value="VIDEO">🎥 Video (MP4)</option>
                  <option value="DOCUMENT">📄 Document (PDF)</option>
                </select>
              </div>
            </div>

            {/* Header Text (when TEXT is selected) */}
            {headerType === 'TEXT' && (
              <div>
                <label className="block text-xs sm:text-[13px] font-bold text-[#14201C] mb-1.5">
                  Header Text
                </label>
                <Input
                  value={headerText}
                  onChange={(e) => setHeaderText(e.target.value)}
                  placeholder="e.g. Order Confirmation"
                  className="text-sm font-medium"
                  maxLength={60}
                />
              </div>
            )}

            {/* Header Image Configuration */}
            {headerType === 'IMAGE' && (
              <div className="p-4 bg-[#F6FAF8] rounded-xl border border-[#C4EBD0] space-y-3.5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <ImageIcon className="w-4 h-4 text-[#05A222]" />
                    <span className="text-xs font-bold text-[#14201C]">Header Image Configuration</span>
                  </div>
                  <span className="text-[11px] font-bold text-[#006736] bg-[#E9F9EE] px-2.5 py-0.5 rounded-md border border-[#C4EBD0]">
                    JPG / PNG / WEBP • Max 5MB
                  </span>
                </div>

                {/* Tab Switcher: Upload vs URL */}
                <div className="flex items-center gap-1.5 p-1 bg-white rounded-xl border border-[#E2EAE6] w-fit">
                  <button
                    type="button"
                    onClick={() => setMediaTab('upload')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                      mediaTab === 'upload'
                        ? 'bg-[#006736] text-white shadow-2xs'
                        : 'text-[#5F7069] hover:text-[#14201C] hover:bg-[#F6FAF8]'
                    }`}
                  >
                    <Upload className="w-3.5 h-3.5" /> Upload Image File
                  </button>
                  <button
                    type="button"
                    onClick={() => setMediaTab('url')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                      mediaTab === 'url'
                        ? 'bg-[#006736] text-white shadow-2xs'
                        : 'text-[#5F7069] hover:text-[#14201C] hover:bg-[#F6FAF8]'
                    }`}
                  >
                    <Link2 className="w-3.5 h-3.5" /> Web Image URL
                  </button>
                </div>

                {mediaTab === 'upload' ? (
                  <div>
                    <input
                      type="file"
                      ref={fileInputRef}
                      accept="image/jpeg,image/png,image/webp,image/jpg"
                      onChange={(e) => handleFileChange(e, 'IMAGE')}
                      className="hidden"
                    />

                    {isUploadingMedia ? (
                      <div className="p-6 rounded-xl border-2 border-dashed border-[#05A222] bg-white text-center flex flex-col items-center justify-center gap-2">
                        <Loader2 className="w-6 h-6 text-[#05A222] animate-spin" />
                        <span className="text-xs font-bold text-[#006736]">Uploading and optimizing image...</span>
                      </div>
                    ) : headerMediaUrl ? (
                      <div className="p-3 bg-white rounded-xl border border-[#C4EBD0] flex items-center justify-between gap-3 shadow-2xs">
                        <div className="flex items-center gap-3 min-w-0">
                          <div className="w-12 h-12 rounded-lg bg-[#E2EAE6] overflow-hidden shrink-0 border border-[#C4EBD0]">
                            <img src={headerMediaUrl} alt="Preview" className="w-full h-full object-cover" />
                          </div>
                          <div className="min-w-0">
                            <p className="text-xs font-bold text-[#14201C] truncate">
                              {uploadedFileName || 'image_header.jpg'}
                            </p>
                            <div className="flex items-center gap-2 mt-0.5">
                              {uploadedFileSize && (
                                <span className="text-[10px] text-[#5F7069] font-medium">
                                  {formatBytes(uploadedFileSize)}
                                </span>
                              )}
                              <span className="inline-flex items-center gap-1 text-[10px] font-bold text-[#05A222] bg-[#E9F9EE] px-1.5 py-0.2 rounded">
                                <CheckCircle2 className="w-3 h-3" /> Ready
                              </span>
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => fileInputRef.current?.click()}
                            className="px-2.5 py-1.5 rounded-lg text-xs font-bold text-[#006736] bg-[#E9F9EE] hover:bg-[#d8f5e0] border border-[#C4EBD0] transition-colors cursor-pointer"
                          >
                            Change
                          </button>
                          <button
                            type="button"
                            onClick={handleClearMedia}
                            className="p-1.5 rounded-lg text-rose-500 hover:bg-rose-50 transition-colors cursor-pointer"
                            title="Remove image"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div
                        onDragOver={(e) => {
                          e.preventDefault();
                          setIsDraggingFile(true);
                        }}
                        onDragLeave={() => setIsDraggingFile(false)}
                        onDrop={(e) => handleDrop(e, 'IMAGE')}
                        onClick={() => fileInputRef.current?.click()}
                        className={`p-6 rounded-xl border-2 border-dashed transition-all text-center flex flex-col items-center justify-center gap-2 cursor-pointer ${
                          isDraggingFile
                            ? 'border-[#05A222] bg-[#E9F9EE]'
                            : 'border-[#C4EBD0] hover:border-[#05A222] bg-white hover:bg-[#F6FAF8]'
                        }`}
                      >
                        <div className="w-10 h-10 rounded-full bg-[#E9F9EE] text-[#05A222] flex items-center justify-center">
                          <FolderUp className="w-5 h-5" />
                        </div>
                        <div>
                          <p className="text-xs font-bold text-[#14201C]">
                            Click to browse image or drag and drop here
                          </p>
                          <p className="text-[11px] text-[#5F7069] mt-0.5">
                            Supports JPG, PNG, WEBP files up to 5MB
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <div>
                    <label className="block text-[11px] font-bold text-[#14201C] mb-1">
                      Direct Image Web URL
                    </label>
                    <Input
                      value={headerMediaUrl}
                      onChange={(e) => setHeaderMediaUrl(e.target.value)}
                      placeholder="https://example.com/banner.jpg"
                      className="text-sm font-medium bg-white"
                    />
                    <div className="flex items-center gap-2 pt-2">
                      <span className="text-[11px] text-[#5F7069] font-medium">Quick Presets:</span>
                      <button
                        type="button"
                        onClick={() => setHeaderMediaUrl('https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?auto=format&fit=crop&w=800&q=80')}
                        className="text-[11px] font-bold text-[#006736] hover:underline cursor-pointer"
                      >
                        Sale Banner
                      </button>
                      <span className="text-[#8A9993]">•</span>
                      <button
                        type="button"
                        onClick={() => setHeaderMediaUrl('https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?auto=format&fit=crop&w=800&q=80')}
                        className="text-[11px] font-bold text-[#006736] hover:underline cursor-pointer"
                      >
                        Product Showcase
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Header Video Configuration */}
            {headerType === 'VIDEO' && (
              <div className="p-4 bg-[#F6FAF8] rounded-xl border border-[#C4EBD0] space-y-3.5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Video className="w-4 h-4 text-[#05A222]" />
                    <span className="text-xs font-bold text-[#14201C]">Header Video Configuration</span>
                  </div>
                  <span className="text-[11px] font-bold text-[#006736] bg-[#E9F9EE] px-2.5 py-0.5 rounded-md border border-[#C4EBD0]">
                    MP4 / MOV • Max 16MB
                  </span>
                </div>

                {/* Tab Switcher: Upload vs URL */}
                <div className="flex items-center gap-1.5 p-1 bg-white rounded-xl border border-[#E2EAE6] w-fit">
                  <button
                    type="button"
                    onClick={() => setMediaTab('upload')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                      mediaTab === 'upload'
                        ? 'bg-[#006736] text-white shadow-2xs'
                        : 'text-[#5F7069] hover:text-[#14201C] hover:bg-[#F6FAF8]'
                    }`}
                  >
                    <Upload className="w-3.5 h-3.5" /> Upload Video File
                  </button>
                  <button
                    type="button"
                    onClick={() => setMediaTab('url')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                      mediaTab === 'url'
                        ? 'bg-[#006736] text-white shadow-2xs'
                        : 'text-[#5F7069] hover:text-[#14201C] hover:bg-[#F6FAF8]'
                    }`}
                  >
                    <Link2 className="w-3.5 h-3.5" /> Web Video URL
                  </button>
                </div>

                {mediaTab === 'upload' ? (
                  <div>
                    <input
                      type="file"
                      ref={fileInputRef}
                      accept="video/mp4,video/quicktime,video/webm"
                      onChange={(e) => handleFileChange(e, 'VIDEO')}
                      className="hidden"
                    />

                    {isUploadingMedia ? (
                      <div className="p-6 rounded-xl border-2 border-dashed border-[#05A222] bg-white text-center flex flex-col items-center justify-center gap-2">
                        <Loader2 className="w-6 h-6 text-[#05A222] animate-spin" />
                        <span className="text-xs font-bold text-[#006736]">Uploading and processing video...</span>
                      </div>
                    ) : headerMediaUrl ? (
                      <div className="p-3 bg-white rounded-xl border border-[#C4EBD0] flex items-center justify-between gap-3 shadow-2xs">
                        <div className="flex items-center gap-3 min-w-0">
                          <div className="w-12 h-12 rounded-lg bg-slate-900 text-white flex items-center justify-center shrink-0 border border-[#C4EBD0]">
                            <Video className="w-6 h-6" />
                          </div>
                          <div className="min-w-0">
                            <p className="text-xs font-bold text-[#14201C] truncate">
                              {uploadedFileName || 'demo_video.mp4'}
                            </p>
                            <div className="flex items-center gap-2 mt-0.5">
                              {uploadedFileSize && (
                                <span className="text-[10px] text-[#5F7069] font-medium">
                                  {formatBytes(uploadedFileSize)}
                                </span>
                              )}
                              <span className="inline-flex items-center gap-1 text-[10px] font-bold text-[#05A222] bg-[#E9F9EE] px-1.5 py-0.2 rounded">
                                <CheckCircle2 className="w-3 h-3" /> Ready
                              </span>
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => fileInputRef.current?.click()}
                            className="px-2.5 py-1.5 rounded-lg text-xs font-bold text-[#006736] bg-[#E9F9EE] hover:bg-[#d8f5e0] border border-[#C4EBD0] transition-colors cursor-pointer"
                          >
                            Change
                          </button>
                          <button
                            type="button"
                            onClick={handleClearMedia}
                            className="p-1.5 rounded-lg text-rose-500 hover:bg-rose-50 transition-colors cursor-pointer"
                            title="Remove video"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div
                        onDragOver={(e) => {
                          e.preventDefault();
                          setIsDraggingFile(true);
                        }}
                        onDragLeave={() => setIsDraggingFile(false)}
                        onDrop={(e) => handleDrop(e, 'VIDEO')}
                        onClick={() => fileInputRef.current?.click()}
                        className={`p-6 rounded-xl border-2 border-dashed transition-all text-center flex flex-col items-center justify-center gap-2 cursor-pointer ${
                          isDraggingFile
                            ? 'border-[#05A222] bg-[#E9F9EE]'
                            : 'border-[#C4EBD0] hover:border-[#05A222] bg-white hover:bg-[#F6FAF8]'
                        }`}
                      >
                        <div className="w-10 h-10 rounded-full bg-[#E9F9EE] text-[#05A222] flex items-center justify-center">
                          <FolderUp className="w-5 h-5" />
                        </div>
                        <div>
                          <p className="text-xs font-bold text-[#14201C]">
                            Click to browse MP4 video or drag and drop here
                          </p>
                          <p className="text-[11px] text-[#5F7069] mt-0.5">
                            Supports MP4 files up to 16MB
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <div>
                    <label className="block text-[11px] font-bold text-[#14201C] mb-1">
                      Direct Video Web URL
                    </label>
                    <Input
                      value={headerMediaUrl}
                      onChange={(e) => setHeaderMediaUrl(e.target.value)}
                      placeholder="https://example.com/demo.mp4"
                      className="text-sm font-medium bg-white"
                    />
                    <div className="flex items-center gap-2 pt-2">
                      <span className="text-[11px] text-[#5F7069] font-medium">Quick Presets:</span>
                      <button
                        type="button"
                        onClick={() => setHeaderMediaUrl('https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4')}
                        className="text-[11px] font-bold text-[#006736] hover:underline cursor-pointer"
                      >
                        Product Video
                      </button>
                      <span className="text-[#8A9993]">•</span>
                      <button
                        type="button"
                        onClick={() => setHeaderMediaUrl('https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4')}
                        className="text-[11px] font-bold text-[#006736] hover:underline cursor-pointer"
                      >
                        Teaser Video
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Header Document Configuration */}
            {headerType === 'DOCUMENT' && (
              <div className="p-4 bg-[#F6FAF8] rounded-xl border border-[#C4EBD0] space-y-3.5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <FileText className="w-4 h-4 text-[#05A222]" />
                    <span className="text-xs font-bold text-[#14201C]">Header Document Configuration</span>
                  </div>
                  <span className="text-[11px] font-bold text-[#006736] bg-[#E9F9EE] px-2.5 py-0.5 rounded-md border border-[#C4EBD0]">
                    PDF • Max 100MB
                  </span>
                </div>

                {/* Tab Switcher: Upload vs URL */}
                <div className="flex items-center gap-1.5 p-1 bg-white rounded-xl border border-[#E2EAE6] w-fit">
                  <button
                    type="button"
                    onClick={() => setMediaTab('upload')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                      mediaTab === 'upload'
                        ? 'bg-[#006736] text-white shadow-2xs'
                        : 'text-[#5F7069] hover:text-[#14201C] hover:bg-[#F6FAF8]'
                    }`}
                  >
                    <Upload className="w-3.5 h-3.5" /> Upload PDF File
                  </button>
                  <button
                    type="button"
                    onClick={() => setMediaTab('url')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                      mediaTab === 'url'
                        ? 'bg-[#006736] text-white shadow-2xs'
                        : 'text-[#5F7069] hover:text-[#14201C] hover:bg-[#F6FAF8]'
                    }`}
                  >
                    <Link2 className="w-3.5 h-3.5" /> Web Document URL
                  </button>
                </div>

                {mediaTab === 'upload' ? (
                  <div>
                    <input
                      type="file"
                      ref={fileInputRef}
                      accept="application/pdf,.pdf"
                      onChange={(e) => handleFileChange(e, 'DOCUMENT')}
                      className="hidden"
                    />

                    {isUploadingMedia ? (
                      <div className="p-6 rounded-xl border-2 border-dashed border-[#05A222] bg-white text-center flex flex-col items-center justify-center gap-2">
                        <Loader2 className="w-6 h-6 text-[#05A222] animate-spin" />
                        <span className="text-xs font-bold text-[#006736]">Uploading document...</span>
                      </div>
                    ) : headerMediaUrl ? (
                      <div className="p-3 bg-white rounded-xl border border-[#C4EBD0] flex items-center justify-between gap-3 shadow-2xs">
                        <div className="flex items-center gap-3 min-w-0">
                          <div className="w-12 h-12 rounded-lg bg-rose-50 text-rose-600 flex items-center justify-center shrink-0 border border-rose-200">
                            <FileText className="w-6 h-6" />
                          </div>
                          <div className="min-w-0">
                            <p className="text-xs font-bold text-[#14201C] truncate">
                              {uploadedFileName || 'document.pdf'}
                            </p>
                            <div className="flex items-center gap-2 mt-0.5">
                              {uploadedFileSize && (
                                <span className="text-[10px] text-[#5F7069] font-medium">
                                  {formatBytes(uploadedFileSize)}
                                </span>
                              )}
                              <span className="inline-flex items-center gap-1 text-[10px] font-bold text-[#05A222] bg-[#E9F9EE] px-1.5 py-0.2 rounded">
                                <CheckCircle2 className="w-3 h-3" /> Ready
                              </span>
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => fileInputRef.current?.click()}
                            className="px-2.5 py-1.5 rounded-lg text-xs font-bold text-[#006736] bg-[#E9F9EE] hover:bg-[#d8f5e0] border border-[#C4EBD0] transition-colors cursor-pointer"
                          >
                            Change
                          </button>
                          <button
                            type="button"
                            onClick={handleClearMedia}
                            className="p-1.5 rounded-lg text-rose-500 hover:bg-rose-50 transition-colors cursor-pointer"
                            title="Remove document"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div
                        onDragOver={(e) => {
                          e.preventDefault();
                          setIsDraggingFile(true);
                        }}
                        onDragLeave={() => setIsDraggingFile(false)}
                        onDrop={(e) => handleDrop(e, 'DOCUMENT')}
                        onClick={() => fileInputRef.current?.click()}
                        className={`p-6 rounded-xl border-2 border-dashed transition-all text-center flex flex-col items-center justify-center gap-2 cursor-pointer ${
                          isDraggingFile
                            ? 'border-[#05A222] bg-[#E9F9EE]'
                            : 'border-[#C4EBD0] hover:border-[#05A222] bg-white hover:bg-[#F6FAF8]'
                        }`}
                      >
                        <div className="w-10 h-10 rounded-full bg-[#E9F9EE] text-[#05A222] flex items-center justify-center">
                          <FolderUp className="w-5 h-5" />
                        </div>
                        <div>
                          <p className="text-xs font-bold text-[#14201C]">
                            Click to browse PDF document or drag and drop here
                          </p>
                          <p className="text-[11px] text-[#5F7069] mt-0.5">
                            Supports PDF files up to 100MB
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <div>
                    <label className="block text-[11px] font-bold text-[#14201C] mb-1">
                      Direct Document Web URL (PDF Link)
                    </label>
                    <Input
                      value={headerMediaUrl}
                      onChange={(e) => setHeaderMediaUrl(e.target.value)}
                      placeholder="https://example.com/brochure.pdf"
                      className="text-sm font-medium bg-white"
                    />
                  </div>
                )}
              </div>
            )}

            {/* Message Body */}
            <div className="border-t border-[#E2EAE6] pt-4">
              <div className="flex items-center justify-between mb-2">
                <label className="block text-xs sm:text-[13px] font-bold text-[#14201C]">
                  Message Body
                </label>
                <button
                  type="button"
                  onClick={insertVariable}
                  className="text-xs font-bold text-[#006736] hover:text-[#05A222] flex items-center gap-1.5 bg-[#E9F9EE] border border-[#C4EBD0] px-3 py-1 rounded-xl transition-colors shadow-xs cursor-pointer"
                >
                  <Sparkles className="w-3.5 h-3.5 text-[#05A222]" /> + Add Variable
                </button>
              </div>
              <textarea
                value={body}
                onChange={(e) => setBody(e.target.value)}
                rows={5}
                className="w-full rounded-xl border border-[#E2EAE6] bg-white text-[#14201C] text-sm p-3.5 focus:border-[#05A222] focus:outline-none leading-relaxed shadow-xs font-medium"
                required
              />
              <p className="text-xs text-[#5F7069] mt-1.5 font-medium">
                Insert dynamic variables like <code className="text-[#006736] bg-[#E9F9EE] px-1.5 py-0.5 rounded-md font-mono font-bold text-xs">&#123;&#123;1&#125;&#125;</code>, <code className="text-[#006736] bg-[#E9F9EE] px-1.5 py-0.5 rounded-md font-mono font-bold text-xs">&#123;&#123;2&#125;&#125;</code> for personalization.
              </p>
            </div>

            {/* Footer */}
            <div className="border-t border-[#E2EAE6] pt-4">
              <label className="block text-xs sm:text-[13px] font-bold text-[#14201C] mb-1.5">
                Footer Note <span className="text-[#5F7069] font-normal">(Optional)</span>
              </label>
              <Input
                value={footer}
                onChange={(e) => setFooter(e.target.value)}
                placeholder="e.g. Reply STOP to opt out"
                className="text-sm font-medium"
                maxLength={60}
              />
            </div>

            {/* Interactive Buttons Config */}
            <div className="border-t border-[#E2EAE6] pt-4 space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <div className="flex items-center gap-2">
                    <label className="text-xs sm:text-[13px] font-bold text-[#14201C]">
                      Interactive Action Buttons
                    </label>
                    <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-[#E9F9EE] text-[#006736] border border-[#C4EBD0]">
                      {buttons.length}/3
                    </span>
                  </div>
                  <p className="text-xs text-[#5F7069] mt-0.5">
                    Add quick replies, website URLs, phone calls, offer codes, or opt-out buttons (max 3).
                  </p>
                </div>

                {buttons.length < 3 && (
                  <div className="flex items-center gap-1.5 self-start sm:self-auto">
                    <button
                      type="button"
                      onClick={() => handleAddButton('QUICK_REPLY')}
                      className="text-xs font-bold text-[#006736] hover:text-[#05A222] bg-[#E9F9EE] hover:bg-[#d8f5e0] border border-[#C4EBD0] px-2.5 py-1.5 rounded-xl transition-all flex items-center gap-1 shadow-2xs cursor-pointer"
                    >
                      <Plus className="w-3.5 h-3.5 text-[#05A222]" /> Add Button
                    </button>
                  </div>
                )}
              </div>

              {buttons.length === 0 ? (
                <div className="p-4 rounded-xl border border-dashed border-[#C4EBD0] bg-[#F6FAF8] text-center space-y-2.5">
                  <p className="text-xs font-semibold text-[#5F7069]">
                    No action buttons added yet. Choose an option to add:
                  </p>
                  <div className="flex flex-wrap items-center justify-center gap-2">
                    <button
                      type="button"
                      onClick={() => handleAddButton('QUICK_REPLY')}
                      className="px-3 py-1.5 rounded-xl bg-white border border-[#E2EAE6] hover:border-[#05A222] text-xs font-bold text-[#14201C] hover:text-[#006736] transition-all flex items-center gap-1.5 shadow-2xs cursor-pointer"
                    >
                      <CornerUpLeft className="w-3.5 h-3.5 text-[#05A222]" /> + Quick Reply
                    </button>
                    <button
                      type="button"
                      onClick={() => handleAddButton('URL')}
                      className="px-3 py-1.5 rounded-xl bg-white border border-[#E2EAE6] hover:border-[#05A222] text-xs font-bold text-[#14201C] hover:text-[#006736] transition-all flex items-center gap-1.5 shadow-2xs cursor-pointer"
                    >
                      <ExternalLink className="w-3.5 h-3.5 text-[#05A222]" /> + Visit Website
                    </button>
                    <button
                      type="button"
                      onClick={() => handleAddButton('PHONE_NUMBER')}
                      className="px-3 py-1.5 rounded-xl bg-white border border-[#E2EAE6] hover:border-[#05A222] text-xs font-bold text-[#14201C] hover:text-[#006736] transition-all flex items-center gap-1.5 shadow-2xs cursor-pointer"
                    >
                      <PhoneCall className="w-3.5 h-3.5 text-[#05A222]" /> + Call Phone
                    </button>
                    <button
                      type="button"
                      onClick={() => handleAddButton('COPY_CODE')}
                      className="px-3 py-1.5 rounded-xl bg-white border border-[#E2EAE6] hover:border-[#05A222] text-xs font-bold text-[#14201C] hover:text-[#006736] transition-all flex items-center gap-1.5 shadow-2xs cursor-pointer"
                    >
                      <Copy className="w-3.5 h-3.5 text-[#05A222]" /> + Copy Promo Code
                    </button>
                    <button
                      type="button"
                      onClick={() => handleAddButton('OPT_OUT')}
                      className="px-3 py-1.5 rounded-xl bg-white border border-[#E2EAE6] hover:border-rose-400 text-xs font-bold text-[#14201C] hover:text-rose-600 transition-all flex items-center gap-1.5 shadow-2xs cursor-pointer"
                    >
                      <ShieldAlert className="w-3.5 h-3.5 text-rose-500" /> + Stop Promotions
                    </button>
                  </div>
                </div>
              ) : (
                <div className="space-y-3">
                  {buttons.map((btn, idx) => (
                    <div
                      key={idx}
                      className="p-3.5 sm:p-4 bg-white rounded-xl border border-[#E2EAE6] shadow-2xs hover:border-[#C4EBD0] transition-all space-y-3"
                    >
                      <div className="flex items-center justify-between border-b border-[#F0F4F2] pb-2">
                        <div className="flex items-center gap-2">
                          <span className="w-5 h-5 rounded-full bg-[#E9F9EE] text-[#006736] font-black text-[11px] flex items-center justify-center">
                            {idx + 1}
                          </span>
                          <span className="text-xs font-bold text-[#14201C]">
                            {btn.type === 'QUICK_REPLY' && '⚡ Quick Reply'}
                            {btn.type === 'URL' && '🌐 Visit Website (URL)'}
                            {btn.type === 'PHONE_NUMBER' && '📞 Call Phone Number'}
                            {btn.type === 'COPY_CODE' && '🎟️ Copy Offer Code'}
                            {btn.type === 'OPT_OUT' && '🛑 Opt-Out / Stop'}
                            {btn.type === 'SUPPORT' && '💬 Live Agent Support'}
                          </span>
                        </div>

                        <button
                          type="button"
                          onClick={() => handleRemoveButton(idx)}
                          className="p-1.5 text-rose-500 hover:bg-rose-50 rounded-lg transition-colors flex items-center gap-1 text-xs font-semibold cursor-pointer"
                          title="Remove Button"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          <span className="hidden sm:inline">Delete</span>
                        </button>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                          <label className="block text-xs font-bold text-[#14201C] mb-1.5">
                            Button Type
                          </label>
                          <select
                            value={btn.type}
                            onChange={(e) => {
                              const next = [...buttons];
                              const newType = e.target.value as ButtonType;
                              next[idx].type = newType;
                              if (newType === 'URL' && !next[idx].url) next[idx].url = 'https://';
                              if (newType === 'PHONE_NUMBER' && !next[idx].phoneNumber) next[idx].phoneNumber = '+';
                              if (newType === 'COPY_CODE') {
                                if (!next[idx].code) next[idx].code = 'OFFER50';
                                if (!next[idx].text || next[idx].text === 'Quick Reply') next[idx].text = 'Copy Offer Code';
                              }
                              if (newType === 'OPT_OUT') next[idx].text = 'Stop Promotions';
                              if (newType === 'SUPPORT') next[idx].text = 'Talk to Agent';
                              setButtons(next);
                            }}
                            className="w-full rounded-xl border border-[#E2EAE6] bg-[#F6FAF8] text-[#14201C] text-sm p-2.5 font-semibold focus:border-[#05A222] focus:bg-white focus:outline-none"
                          >
                            <option value="QUICK_REPLY">⚡ Quick Reply (Custom Text)</option>
                            <option value="URL">🌐 Visit Website (URL / CTA)</option>
                            <option value="PHONE_NUMBER">📞 Call Phone Number (Dialer)</option>
                            <option value="COPY_CODE">🎟️ Copy Offer / Coupon Code (1-Tap)</option>
                            <option value="OPT_OUT">🛑 Opt-Out / Stop (Marketing Compliance)</option>
                            <option value="SUPPORT">💬 Live Agent / Human Support</option>
                          </select>
                        </div>

                        <div>
                          <div className="flex items-center justify-between mb-1.5">
                            <label className="block text-xs font-bold text-[#14201C]">
                              Button Label
                            </label>
                            <span className="text-[11px] text-[#8A9993] font-semibold">
                              {btn.text.length}/25
                            </span>
                          </div>
                          <input
                            type="text"
                            value={btn.text}
                            maxLength={25}
                            onChange={(e) => {
                              const next = [...buttons];
                              next[idx].text = e.target.value;
                              setButtons(next);
                            }}
                            placeholder={
                              btn.type === 'QUICK_REPLY'
                                ? 'e.g. Track Order'
                                : btn.type === 'URL'
                                ? 'e.g. Visit Website'
                                : btn.type === 'PHONE_NUMBER'
                                ? 'e.g. Call Support'
                                : btn.type === 'COPY_CODE'
                                ? 'e.g. Copy Offer Code'
                                : btn.type === 'OPT_OUT'
                                ? 'e.g. Stop Promotions'
                                : 'e.g. Talk to Agent'
                            }
                            className="w-full rounded-xl border border-[#E2EAE6] bg-[#F6FAF8] text-[#14201C] text-sm p-2.5 font-medium focus:border-[#05A222] focus:bg-white focus:outline-none"
                            required
                          />
                        </div>
                      </div>

                      {btn.type === 'URL' && (
                        <div>
                          <label className="block text-xs font-bold text-[#14201C] mb-1.5">
                            Website Target URL
                          </label>
                          <input
                            type="url"
                            value={btn.url || ''}
                            onChange={(e) => {
                              const next = [...buttons];
                              next[idx].url = e.target.value;
                              setButtons(next);
                            }}
                            placeholder="https://example.com/order-tracking"
                            className="w-full rounded-xl border border-[#E2EAE6] bg-[#F6FAF8] text-[#14201C] text-sm p-2.5 font-medium focus:border-[#05A222] focus:bg-white focus:outline-none"
                            required
                          />
                          <p className="text-xs text-[#5F7069] mt-1.5 flex items-center gap-1">
                            <Info className="w-3.5 h-3.5 text-[#05A222] shrink-0" /> Full URL starting with https://. Supports static URLs or dynamic parameters.
                          </p>
                        </div>
                      )}

                      {btn.type === 'PHONE_NUMBER' && (
                        <div>
                          <label className="block text-xs font-bold text-[#14201C] mb-1.5">
                            Phone Number <span className="text-[#5F7069] font-normal">(with Country Code)</span>
                          </label>
                          <input
                            type="tel"
                            value={btn.phoneNumber || ''}
                            onChange={(e) => {
                              const next = [...buttons];
                              next[idx].phoneNumber = e.target.value;
                              setButtons(next);
                            }}
                            placeholder="+15551234567 or +919876543210"
                            className="w-full rounded-xl border border-[#E2EAE6] bg-[#F6FAF8] text-[#14201C] text-sm p-2.5 font-medium focus:border-[#05A222] focus:bg-white focus:outline-none"
                            required
                          />
                          <p className="text-xs text-[#5F7069] mt-1.5 flex items-center gap-1">
                            <Info className="w-3.5 h-3.5 text-[#05A222] shrink-0" /> Meta requires international format starting with + (e.g. +919876543210).
                          </p>
                        </div>
                      )}

                      {btn.type === 'COPY_CODE' && (
                        <div>
                          <label className="block text-xs font-bold text-[#14201C] mb-1.5">
                            Offer / Promo Code to Copy
                          </label>
                          <input
                            type="text"
                            value={btn.code || ''}
                            onChange={(e) => {
                              const next = [...buttons];
                              next[idx].code = e.target.value.toUpperCase().replace(/\s+/g, '');
                              setButtons(next);
                            }}
                            placeholder="e.g. SAVE20 or DIWALI50"
                            className="w-full rounded-xl border border-[#E2EAE6] bg-[#F6FAF8] text-[#14201C] text-sm p-2.5 font-mono font-bold focus:border-[#05A222] focus:bg-white focus:outline-none uppercase"
                            required
                          />
                          <p className="text-xs text-[#5F7069] mt-1.5 flex items-center gap-1">
                            <Info className="w-3.5 h-3.5 text-[#05A222] shrink-0" /> Tapping this button in WhatsApp automatically copies this coupon code to the user's clipboard.
                          </p>
                        </div>
                      )}

                      {btn.type === 'OPT_OUT' && (
                        <p className="text-xs text-[#5F7069] bg-[#F6FAF8] p-2.5 rounded-xl border border-[#E2EAE6] flex items-center gap-2">
                          <ShieldAlert className="w-4 h-4 text-rose-500 shrink-0" />
                          <span>Recommended for Marketing campaigns to ensure compliance with Meta WhatsApp opt-out policies.</span>
                        </p>
                      )}

                      {btn.type === 'SUPPORT' && (
                        <p className="text-xs text-[#5F7069] bg-[#F6FAF8] p-2.5 rounded-xl border border-[#E2EAE6] flex items-center gap-2">
                          <Headphones className="w-4 h-4 text-[#05A222] shrink-0" />
                          <span>Sends an instant request trigger for your team or AI bot to initiate human-agent support.</span>
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-3 mt-6 pt-2">
              <Button
                type="button"
                variant="outline"
                size="lg"
                onClick={handleSaveDraft}
                isLoading={isSavingDraft}
                leftIcon={<Bookmark className="w-4 h-4 text-[#006736]" />}
                className="w-full sm:w-1/2 border-[#C4EBD0] text-[#006736] hover:bg-[#E9F9EE] font-bold py-3.5 rounded-xl shadow-2xs cursor-pointer"
              >
                Save as Draft
              </Button>

              <Button
                type="submit"
                size="lg"
                className="w-full sm:w-1/2 bg-[#05A222] hover:bg-[#006736] text-white font-bold py-3.5 rounded-xl shadow-xs cursor-pointer"
                isLoading={isSubmitting}
                leftIcon={<Send className="w-4 h-4" />}
              >
                Submit to Meta
              </Button>
            </div>
          </form>
        </div>

        {/* Right Ultra-Realistic Modern iPhone Mockup */}
        <div className="lg:col-span-5 flex flex-col items-center lg:sticky lg:top-6 w-full mt-6 lg:mt-0">
          <div className="text-xs font-bold text-[#5F7069] uppercase tracking-wider mb-3 flex items-center gap-2">
            <Smartphone className="w-4 h-4 text-[#05A222]" />
            <span>Live WhatsApp Rendering Preview</span>
          </div>

          {/* iPhone Chassis (Refined Slim Bezel) */}
          <div className="w-full max-w-[330px] bg-[#1C1C1E] rounded-[48px] p-[10px] shadow-[0_25px_60px_-15px_rgba(0,0,0,0.35),0_0_0_1px_rgba(255,255,255,0.08)] ring-1 ring-black/40">
            {/* Screen Inner Glass */}
            <div className="bg-[#EFEAE2] rounded-[38px] min-h-[540px] flex flex-col justify-between overflow-hidden relative shadow-inner">
              {/* iOS Top Status Bar & Dynamic Island */}
              <div className="bg-[#008069] text-white pt-2.5 pb-1 px-5">
                <div className="flex items-center justify-between text-[11px] font-bold">
                  <span>9:41</span>
                  {/* Dynamic Island */}
                  <div className="w-20 h-4 bg-black rounded-full flex items-center justify-end px-1.5 gap-1">
                    <div className="w-2 h-2 rounded-full bg-[#111] ring-1 ring-slate-800" />
                  </div>
                  <div className="flex items-center gap-1.5 text-[10px]">
                    <Wifi className="w-3 h-3" />
                    <div className="w-4 h-2 border border-white rounded-[3px] p-[1px] flex items-center">
                      <div className="h-full w-full bg-white rounded-[1px]" />
                    </div>
                  </div>
                </div>

                {/* WhatsApp Chat Navigation Bar */}
                <div className="flex items-center justify-between gap-2 mt-2 pt-1 pb-1.5">
                  <div className="flex items-center gap-1.5 min-w-0">
                    <ChevronLeft className="w-5 h-5 -ml-1 text-white shrink-0" />
                    <div className="w-7 h-7 rounded-full bg-[#05A222] text-white flex items-center justify-center font-bold text-[11px] shrink-0 shadow-xs ring-1 ring-white/30">
                      W
                    </div>
                    <div className="min-w-0">
                      <div className="text-xs font-bold truncate flex items-center gap-1 text-white">
                        <span>Acme Official</span>
                        <ShieldCheck className="w-3.5 h-3.5 text-[#6AEB31] shrink-0" />
                      </div>
                      <div className="text-[9px] text-[#C4EBD0] leading-none">Official Business Account</div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2.5 text-white/90">
                    <Video className="w-4 h-4" />
                    <Phone className="w-3.5 h-3.5" />
                  </div>
                </div>
              </div>

              {/* Chat Canvas Body */}
              <div className="p-3 my-auto space-y-2">
                {/* Date Pill */}
                <div className="flex justify-center my-1">
                  <span className="bg-white/80 backdrop-blur-xs text-[#5F7069] text-[9px] font-bold px-2.5 py-0.5 rounded-md shadow-2xs uppercase tracking-wider">
                    Today
                  </span>
                </div>

                {/* WhatsApp Incoming Chat Bubble */}
                <div className="bg-white rounded-2xl rounded-tl-xs overflow-hidden shadow-xs space-y-1.5 text-xs text-[#14201C]">
                  {/* Media Header (IMAGE) */}
                  {headerType === 'IMAGE' && (
                    <div className="relative w-full aspect-video bg-[#E2EAE6] flex items-center justify-center overflow-hidden">
                      {headerMediaUrl ? (
                        <img
                          src={headerMediaUrl}
                          alt="Header Preview"
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            (e.target as HTMLElement).style.display = 'none';
                          }}
                        />
                      ) : (
                        <div className="flex flex-col items-center gap-1 text-[#5F7069]">
                          <ImageIcon className="w-8 h-8 text-[#8A9993]" />
                          <span className="text-[10px] font-semibold">Image Header Sample</span>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Media Header (VIDEO) */}
                  {headerType === 'VIDEO' && (
                    <div className="relative w-full aspect-video bg-slate-900 flex items-center justify-center overflow-hidden group">
                      {headerMediaUrl ? (
                        <video
                          src={headerMediaUrl}
                          className="w-full h-full object-cover opacity-80"
                          muted
                          playsInline
                        />
                      ) : null}
                      <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                        <div className="w-10 h-10 rounded-full bg-white/90 text-[#008069] flex items-center justify-center shadow-lg transform group-hover:scale-105 transition-transform">
                          <Play className="w-5 h-5 fill-current ml-0.5" />
                        </div>
                      </div>
                      <span className="absolute bottom-2 right-2 bg-black/70 text-white text-[9px] font-mono px-1.5 py-0.5 rounded font-bold">
                        VIDEO
                      </span>
                    </div>
                  )}

                  {/* Media Header (DOCUMENT) */}
                  {headerType === 'DOCUMENT' && (
                    <div className="p-2.5 bg-[#F6FAF8] border-b border-[#E2EAE6] flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-lg bg-rose-100 text-rose-600 flex items-center justify-center shrink-0">
                        <FileText className="w-4 h-4" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-[11px] font-bold text-[#14201C] truncate">
                          {headerMediaUrl ? headerMediaUrl.split('/').pop() || 'document.pdf' : 'document.pdf'}
                        </p>
                        <p className="text-[9px] text-[#5F7069]">PDF Document</p>
                      </div>
                    </div>
                  )}

                  {/* Content Container (padding for body and text) */}
                  <div className="p-3 pt-1 space-y-1.5">
                    {headerType === 'TEXT' && headerText && (
                      <div className="font-bold text-[#008069] text-[11px] border-b border-[#F0F2F5] pb-1">
                        {headerText}
                      </div>
                    )}
                    <div className="text-[#1F2A26] whitespace-pre-wrap leading-relaxed font-sans text-xs">
                      {previewBody}
                    </div>
                    {footer && (
                      <div className="text-[10px] text-[#8A9993] pt-0.5">
                        {footer}
                      </div>
                    )}
                    <div className="text-[9px] text-right text-[#8A9993] font-medium flex items-center justify-end gap-1">
                      <span>12:45 PM</span>
                      <CheckCheck className="w-3.5 h-3.5 text-[#53BDEB]" />
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                {buttons.length > 0 && (
                  <div className="space-y-1.5 pt-1">
                    {buttons.map((btn, idx) => (
                      <div
                        key={idx}
                        className="bg-white hover:bg-[#F6FAF8] py-2 px-3 text-center text-xs font-bold text-[#00A884] rounded-xl shadow-2xs border border-[#E2EAE6] flex items-center justify-center gap-1.5 transition-colors"
                      >
                        {btn.type === 'QUICK_REPLY' && <CornerUpLeft className="w-3.5 h-3.5 text-[#00A884] shrink-0" />}
                        {btn.type === 'URL' && <ExternalLink className="w-3.5 h-3.5 text-[#00A884] shrink-0" />}
                        {btn.type === 'PHONE_NUMBER' && <PhoneCall className="w-3.5 h-3.5 text-[#00A884] shrink-0" />}
                        {btn.type === 'COPY_CODE' && <Copy className="w-3.5 h-3.5 text-[#00A884] shrink-0" />}
                        {btn.type === 'OPT_OUT' && <ShieldAlert className="w-3.5 h-3.5 text-rose-500 shrink-0" />}
                        {btn.type === 'SUPPORT' && <Headphones className="w-3.5 h-3.5 text-[#00A884] shrink-0" />}
                        
                        <span className={btn.type === 'OPT_OUT' ? 'text-rose-600' : ''}>
                          {btn.text || 'Action Button'}
                        </span>

                        {btn.type === 'COPY_CODE' && btn.code && (
                          <span className="text-[9px] bg-[#E9F9EE] text-[#006736] font-mono px-1.5 py-0.2 rounded border border-[#C4EBD0] ml-1">
                            {btn.code}
                          </span>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Variable Test Editor inside Mockup */}
              <div className="p-2.5 bg-white/95 backdrop-blur-xs border-t border-[#E2EAE6] space-y-1.5">
                {foundVars.length > 0 ? (
                  <>
                    <div className="text-[10px] font-bold text-[#5F7069] uppercase flex items-center gap-1">
                      <Sparkles className="w-3 h-3 text-[#05A222]" />
                      <span>Test Variable Values</span>
                    </div>
                    <div className="grid grid-cols-2 gap-1.5">
                      {foundVars.map((v) => (
                        <input
                          key={v}
                          type="text"
                          placeholder={`{{${v}}}`}
                          value={sampleVars[v] || ''}
                          onChange={(e) => setSampleVars({ ...sampleVars, [v]: e.target.value })}
                          className="text-[10px] p-1.5 rounded-lg border border-[#E2EAE6] bg-[#F6FAF8] text-[#14201C] font-semibold focus:border-[#05A222] focus:bg-white focus:outline-none"
                        />
                      ))}
                    </div>
                  </>
                ) : (
                  <div className="text-[10px] text-center text-[#5F7069] font-medium py-1">
                    Verified Meta HSM Template
                  </div>
                )}
                {/* iOS Home Indicator Bar */}
                <div className="w-28 h-1 bg-black/20 rounded-full mx-auto mt-2" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </PageContainer>
  );
};
