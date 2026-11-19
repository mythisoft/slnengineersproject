import React from 'react';
import { Shield } from 'lucide-react';

export default function TermsOfService() {
  return (
    <div className="py-16 bg-white">
      <div className="container max-w-3xl">
        <div className="flex items-center gap-2 text-sky-700 font-bold text-xs uppercase tracking-wider mb-2">
          <Shield size={16} /> Legal Terms
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 mb-6">
          Terms of Service
        </h1>
        <div className="prose prose-slate text-sm text-slate-700 space-y-5 leading-relaxed">
          <p>
            Welcome to the official website of <strong>SLN Engineers Projects Pvt. Ltd.</strong> (“Company”). By accessing or utilizing this platform, you agree to these Terms of Service.
          </p>

          <h3 className="text-lg font-bold text-slate-900 mt-6">1. Scope of Contracting Services</h3>
          <p>
            SLN Engineers Projects Pvt. Ltd. delivers specialized civil contracting services including terrace waterproofing, basement injection tanking, wet-area sealing, external elastomeric façade coatings, and structural restoration. Estimates provided through the website are non-binding until confirmed via physical on-site technical inspection.
          </p>

          <h3 className="text-lg font-bold text-slate-900 mt-6">2. Warranty Terms</h3>
          <p>
            Project warranties (ranging from 5 to 10 years depending on the contracted chemical membrane specification) are issued exclusively as signed physical or digital certificates upon complete contract execution and receipt of final settlement.
          </p>

          <h3 className="text-lg font-bold text-slate-900 mt-6">3. Customer Feedback and Reviews</h3>
          <p>
            Feedback submitted via our QR-code review feature must be factual and based on authentic customer experience. We reserve the right to moderate, flag spam, or withhold publication of offensive or non-constructive submissions.
          </p>

          <h3 className="text-lg font-bold text-slate-900 mt-6">4. Intellectual Property</h3>
          <p>
            All logos, photographic case studies, trade names, and technical content belong to SLN Engineers Projects Pvt. Ltd. and may not be reproduced without written authorization.
          </p>
        </div>
      </div>
    </div>
  );
}
