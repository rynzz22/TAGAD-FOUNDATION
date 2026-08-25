import React, { useState } from 'react';
import {
  MessageSquare,
  Send,
  Building,
  Mail,
  Phone,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  Clock,
} from 'lucide-react';
import { publicApi } from '../../api/publicApi';

export const PublicFeedback: React.FC = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('Program Inquiry');
  const [message, setMessage] = useState('');

  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !message.trim()) {
      setErrorMessage('Please complete all required fields.');
      return;
    }

    try {
      setLoading(true);
      setErrorMessage(null);
      setSuccessMessage(null);

      const res = await publicApi.submitFeedback({
        name: name.trim(),
        email: email.trim(),
        subject,
        message: message.trim(),
      });

      setSuccessMessage(res.message || 'Your feedback has been submitted successfully to the GFPS office.');
      setName('');
      setEmail('');
      setMessage('');
    } catch (err: any) {
      console.error('Feedback submission error:', err);
      setErrorMessage(err?.response?.data?.error?.message || 'Failed to submit feedback. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10 space-y-8">
      {/* Header Banner */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 sm:p-8 shadow-sm space-y-3">
        <div className="flex items-center gap-2 text-xs font-semibold text-indigo-600 dark:text-indigo-400">
          <MessageSquare className="w-4 h-4" />
          <span>Citizen Participation & Feedback</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          GAD Citizen Desk & Inquiries
        </h1>
        <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 max-w-3xl leading-relaxed">
          Submit community suggestions, inquiries on GAD programs, or report localized gender issues to the Talibon Gender and Development Focal Point System (GFPS).
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Contact & Mandate Info (1 Col) */}
        <div className="space-y-6">
          <div className="p-6 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
            <h2 className="text-sm font-bold text-slate-900 dark:text-white border-b border-slate-100 dark:border-slate-800 pb-3">
              GFPS Focal Office
            </h2>

            <div className="space-y-3 text-xs text-slate-600 dark:text-slate-400">
              <div className="flex items-start gap-2.5">
                <Building className="w-4 h-4 text-indigo-600 shrink-0 mt-0.5" />
                <div>
                  <span className="font-semibold text-slate-900 dark:text-white block">
                    Municipal Hall of Talibon
                  </span>
                  <span>Ground Floor, Executive Building, Poblacion, Talibon, Bohol 6325</span>
                </div>
              </div>

              <div className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-indigo-600 shrink-0" />
                <span>gad.talibon@gmail.com</span>
              </div>

              <div className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-indigo-600 shrink-0" />
                <span>(038) 515-9000 / GFPS Desk</span>
              </div>

              <div className="flex items-center gap-2.5">
                <Clock className="w-4 h-4 text-indigo-600 shrink-0" />
                <span>Mon – Fri: 8:00 AM – 5:00 PM</span>
              </div>
            </div>
          </div>

          <div className="p-5 rounded-xl bg-indigo-50/60 dark:bg-indigo-950/20 border border-indigo-100 dark:border-indigo-900/30 text-xs space-y-2 text-indigo-900 dark:text-indigo-200">
            <div className="font-bold flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-indigo-600" />
              <span>Confidentiality Protected</span>
            </div>
            <p className="text-[11px] leading-relaxed text-indigo-700 dark:text-indigo-300">
              All submissions are logged in our internal audit system and routed directly to the designated GAD Focal Person for action.
            </p>
          </div>
        </div>

        {/* Feedback Form (2 Cols) */}
        <div className="md:col-span-2">
          <div className="p-6 sm:p-8 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
            <div className="border-b border-slate-100 dark:border-slate-800 pb-3">
              <h2 className="text-base font-bold text-slate-900 dark:text-white">
                Submit an Inquiry or Comment
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Please provide your contact information so our focal team can respond appropriately.
              </p>
            </div>

            {successMessage && (
              <div className="p-4 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-200 text-xs space-y-1.5 flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <div>
                  <div className="font-bold">Submission Received</div>
                  <div>{successMessage}</div>
                </div>
              </div>
            )}

            {errorMessage && (
              <div className="p-4 rounded-lg bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800 text-red-800 dark:text-red-200 text-xs space-y-1.5 flex items-start gap-2.5">
                <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
                <div>
                  <div className="font-bold">Error</div>
                  <div>{errorMessage}</div>
                </div>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label htmlFor="feedback-name" className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                    Full Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="feedback-name"
                    type="text"
                    required
                    placeholder="e.g. Maria Santos"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                <div className="space-y-1.5">
                  <label htmlFor="feedback-email" className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                    Email Address <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="feedback-email"
                    type="email"
                    required
                    placeholder="e.g. maria@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label htmlFor="feedback-category" className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                  Topic / Category <span className="text-red-500">*</span>
                </label>
                <select
                  id="feedback-category"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  className="w-full px-3 py-2 text-xs font-medium bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="Program Inquiry">Program Inquiry & Beneficiary Qualifications</option>
                  <option value="Barangay Suggestion">Barangay GAD Project Suggestion</option>
                  <option value="Gender Issue Report">Report Community Gender / VAWC Issue</option>
                  <option value="Transparency Question">Budget & Transparency Question</option>
                  <option value="General Feedback">General Comment or Commendation</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label htmlFor="feedback-message" className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                  Message / Details <span className="text-red-500">*</span>
                </label>
                <textarea
                  id="feedback-message"
                  required
                  rows={5}
                  placeholder="Please enter the details of your inquiry or feedback..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div className="pt-2 flex justify-end">
                <button
                  type="submit"
                  disabled={loading}
                  className="py-2.5 px-6 rounded-lg bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 disabled:opacity-50 text-white text-xs font-bold transition-colors flex items-center gap-2 shadow-sm"
                >
                  {loading ? (
                    <span>Submitting...</span>
                  ) : (
                    <>
                      <Send className="w-3.5 h-3.5" />
                      <span>Send Feedback</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};
