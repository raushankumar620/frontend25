import React, { useState } from 'react';
import { X, Download, FileSpreadsheet, Check, Loader2 } from 'lucide-react';
import { Button } from '../../../components/ui/Button';
import { analyticsService } from '../../../services/analyticsService';

interface CSVExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  dateRange: string;
}

export const CSVExportModal: React.FC<CSVExportModalProps> = ({ isOpen, onClose, dateRange }) => {
  const [selectedType, setSelectedType] = useState<'overview' | 'messages' | 'agents' | 'campaigns' | 'ai'>('overview');
  const [isExporting, setIsExporting] = useState(false);
  const [success, setSuccess] = useState(false);

  if (!isOpen) return null;

  const exportOptions = [
    {
      id: 'overview',
      title: 'Executive KPI Summary',
      description: 'Overall delivery rates, conversation resolution SLAs, AI containment metrics, and audience opt-ins.',
    },
    {
      id: 'messages',
      title: 'Message Timeseries & Funnel',
      description: 'Daily aggregated log of sent, delivered, read, inbound replies, and failed messages.',
    },
    {
      id: 'agents',
      title: 'Agent Performance Leaderboard',
      description: 'Agent-by-agent resolution rates, assigned tickets, and closed conversations.',
    },
    {
      id: 'campaigns',
      title: 'Campaign Delivery & ROI',
      description: 'Broadcast campaigns recipient counts, delivery success rates, and open rates.',
    },
    {
      id: 'ai',
      title: 'AI Deflection & Escalations',
      description: 'AI session deflection rates, containment percentages, and human handoff trigger counts.',
    },
  ];

  const handleDownload = async () => {
    try {
      setIsExporting(true);
      await analyticsService.exportCsv(selectedType);
      setSuccess(true);
      setTimeout(() => {
        setSuccess(false);
        onClose();
      }, 1200);
    } catch (error) {
      console.error('Export failed', error);
      alert('Failed to export CSV. Please try again.');
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#14201C]/50 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white border border-[#E2EAE6] rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl space-y-0">
        {/* Header */}
        <div className="p-6 border-b border-[#E2EAE6] flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-[#E9F9EE] text-[#05A222] flex items-center justify-center border border-[#C4EBD0]">
              <FileSpreadsheet className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-[#14201C]">Export Analytics Data</h3>
              <p className="text-xs text-[#5F7069]">Download raw CSV report for your organization</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-[#5F7069] hover:text-[#14201C] hover:bg-[#F6FAF8] transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4">
          <div className="text-xs font-bold text-[#5F7069] uppercase tracking-wider">
            Select Dataset ({dateRange.toUpperCase()} range)
          </div>

          <div className="space-y-2.5">
            {exportOptions.map((opt) => {
              const isSelected = selectedType === opt.id;
              return (
                <div
                  key={opt.id}
                  onClick={() => setSelectedType(opt.id as any)}
                  className={`p-3.5 rounded-xl border cursor-pointer transition-all flex items-start justify-between gap-3 ${
                    isSelected
                      ? 'border-[#05A222] bg-[#E9F9EE]/50 shadow-xs'
                      : 'border-[#E2EAE6] bg-white hover:border-[#05A222]/30 hover:bg-[#F6FAF8]'
                  }`}
                >
                  <div>
                    <div className={`text-sm font-bold ${isSelected ? 'text-[#006736]' : 'text-[#14201C]'}`}>
                      {opt.title}
                    </div>
                    <div className="text-xs text-[#5F7069] mt-0.5 leading-relaxed">
                      {opt.description}
                    </div>
                  </div>
                  <div
                    className={`w-5 h-5 rounded-full border flex items-center justify-center shrink-0 mt-0.5 ${
                      isSelected
                        ? 'border-[#05A222] bg-[#05A222] text-white'
                        : 'border-[#E2EAE6] bg-white'
                    }`}
                  >
                    {isSelected && <Check className="w-3 h-3 stroke-[3]" />}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 bg-[#F6FAF8] border-t border-[#E2EAE6] flex items-center justify-end gap-3">
          <Button variant="outline" size="md" onClick={onClose} disabled={isExporting}>
            Cancel
          </Button>
          <Button
            variant="primary"
            size="md"
            onClick={handleDownload}
            disabled={isExporting}
            leftIcon={
              isExporting ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : success ? (
                <Check className="w-4 h-4" />
              ) : (
                <Download className="w-4 h-4" />
              )
            }
          >
            {isExporting ? 'Generating CSV...' : success ? 'Downloaded!' : 'Download CSV'}
          </Button>
        </div>
      </div>
    </div>
  );
};
