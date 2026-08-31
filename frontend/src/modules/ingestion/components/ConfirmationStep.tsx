import React from 'react';
import {
  IngestionPreviewResult,
  DuplicateStrategy,
  IngestionMode,
  IngestionDatasetType,
} from '../types';
import { DATASET_TYPE_LABELS } from '../constants';
import { Button } from '../../../components/ui/button';
import { Card, CardContent } from '../../../components/ui/card';
import { Badge } from '../../../components/ui/badge';
import {
  ShieldAlert,
  CheckCircle2,
  ChevronLeft,
  Zap,
  Building2,
  Layers,
  Copy,
  Scale,
} from 'lucide-react';
import { cn } from '../../../lib/utils';

interface ConfirmationStepProps {
  preview: IngestionPreviewResult;
  datasetType: IngestionDatasetType;
  duplicateStrategy: DuplicateStrategy;
  ingestionMode: IngestionMode;
  targetOfficeName?: string | null;
  onBack: () => void;
  onExecute: () => void;
  isExecuting: boolean;
}

export const ConfirmationStep: React.FC<ConfirmationStepProps> = ({
  preview,
  datasetType,
  duplicateStrategy,
  ingestionMode,
  targetOfficeName,
  onBack,
  onExecute,
  isExecuting,
}) => {
  const isStrictBlocked = ingestionMode === 'STRICT' && preview.errorRows > 0;

  return (
    <div className="space-y-6 text-left">
      {/* Header */}
      <div>
        <h3 className="text-lg font-bold text-[#111827]">Pre-Execution Ingestion Summary</h3>
        <p className="text-xs text-[#6B7280]">
          Please review the final dataset specifications before executing database transactions.
        </p>
      </div>

      {/* Overview Card */}
      <Card className="border-gray-200 bg-white rounded-xl shadow-xs overflow-hidden">
        <div className="bg-indigo-50/60 px-5 py-3 border-b border-indigo-100 flex items-center justify-between">
          <span className="text-xs font-bold text-[#4F46E5] uppercase tracking-wider flex items-center gap-1.5">
            <Zap className="w-4 h-4 text-[#6366F1]" />
            Ingestion Specification
          </span>
          <Badge variant="outline" className="bg-white text-indigo-700 border-indigo-200 text-[10px] font-bold">
            {DATASET_TYPE_LABELS[datasetType].label}
          </Badge>
        </div>

        <CardContent className="p-5 space-y-4 text-xs">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400 flex items-center gap-1">
                <Layers className="w-3.5 h-3.5" /> Target Dataset Type
              </span>
              <p className="font-bold text-gray-900">{DATASET_TYPE_LABELS[datasetType].label}</p>
            </div>

            <div className="space-y-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400 flex items-center gap-1">
                <Building2 className="w-3.5 h-3.5" /> Responsible Office
              </span>
              <p className="font-bold text-gray-900">
                {targetOfficeName || preview.targetOfficeName || 'Auto-resolved from CSV / Authenticated Scope'}
              </p>
            </div>

            <div className="space-y-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400 flex items-center gap-1">
                <Copy className="w-3.5 h-3.5" /> Duplicate Resolution Strategy
              </span>
              <p className="font-bold text-gray-900">{duplicateStrategy}</p>
            </div>

            <div className="space-y-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400 flex items-center gap-1">
                <Scale className="w-3.5 h-3.5" /> Transaction Mode
              </span>
              <p className="font-bold text-gray-900">{ingestionMode}</p>
            </div>
          </div>

          <div className="border-t border-gray-100 pt-4">
            <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400 block mb-2">
              Row Validation Breakdown
            </span>
            <div className="grid grid-cols-4 gap-2 text-center">
              <div className="p-2.5 rounded-lg bg-gray-50 border border-gray-200">
                <span className="text-[10px] text-gray-500 block">Total Rows</span>
                <strong className="text-sm font-bold text-gray-900">{preview.totalRows.toLocaleString()}</strong>
              </div>
              <div className="p-2.5 rounded-lg bg-emerald-50 border border-emerald-200">
                <span className="text-[10px] text-emerald-700 block">Valid Rows</span>
                <strong className="text-sm font-bold text-emerald-900">{preview.validRows.toLocaleString()}</strong>
              </div>
              <div className="p-2.5 rounded-lg bg-amber-50 border border-amber-200">
                <span className="text-[10px] text-amber-700 block">Warnings</span>
                <strong className="text-sm font-bold text-amber-900">{preview.warningRows.toLocaleString()}</strong>
              </div>
              <div className="p-2.5 rounded-lg bg-red-50 border border-red-200">
                <span className="text-[10px] text-red-700 block">Errors</span>
                <strong className="text-sm font-bold text-red-900">{preview.errorRows.toLocaleString()}</strong>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Safety Notice */}
      {isStrictBlocked ? (
        <div className="flex items-start gap-3 p-4 rounded-xl bg-red-50 border border-red-200 text-red-800 text-xs">
          <ShieldAlert className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
          <div>
            <p className="font-bold text-red-900">Execution Aborted: Critical Errors Present</p>
            <p>
              Under <strong>STRICT</strong> mode, all rows must pass validation. Please return to Step 3 and enable{' '}
              <strong>TOLERANT</strong> mode or fix the source dataset.
            </p>
          </div>
        </div>
      ) : (
        <div className="flex items-center gap-3 p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>
            Ready to execute. Transactions will be logged with zero PII in the central audit ledger.
          </span>
        </div>
      )}

      {/* Navigation Buttons */}
      <div className="flex items-center justify-between pt-2">
        <Button
          type="button"
          variant="outline"
          onClick={onBack}
          disabled={isExecuting}
          className="rounded-lg text-xs font-semibold border-gray-300"
        >
          <ChevronLeft className="w-4 h-4 mr-1.5" />
          Back to Preview
        </Button>

        <Button
          type="button"
          onClick={onExecute}
          disabled={isExecuting || isStrictBlocked}
          className="bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-bold px-8 py-2 shadow-xs text-xs flex items-center gap-2"
        >
          <Zap className="w-4 h-4" />
          Execute Batch Ingestion
        </Button>
      </div>
    </div>
  );
};
