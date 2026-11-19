import React from 'react';
import { Shield } from 'lucide-react';

export default function PrivacyPolicy() {
  return (
    <div className="py-16 bg-white">
      <div className="container max-w-3xl">
        <div className="flex items-center gap-2 text-sky-700 font-bold text-xs uppercase tracking-wider mb-2">
          <Shield size={16} /> Legal & Privacy Notice
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 mb-6">
          Privacy Policy
        </h1>
        <div className="prose prose-slate text-sm text-slate-700 space-y-5 leading-relaxed">
          <p>
            <strong>SLN Engineers Projects Pvt. Ltd.</strong> (“we”, “our”, or “us”) respects the privacy of our customers and website visitors. This Privacy Policy details how we handle information submitted through our official website and customer review QR codes.
          </p>

          <h3 className="text-lg font-bold text-slate-900 mt-6">1. Information We Collect</h3>
          <p>
            When you submit an enquiry form or request an on-site inspection, we collect your name, phone number, location, and details regarding structural moisture problems. We collect this strictly to assess your property and provide an engineering proposal.
          </p>

          <h3 className="text-lg font-bold text-slate-900 mt-6">2. QR-Code Feedback & Review Data</h3>
          <p>
            When scanning a unique project QR code, we record the project token, submitted 1–5 star rating, and your written feedback. We do not harvest extraneous tracking cookies or private hardware identifiers. If you consent to public display, your review may appear on our verified reviews page.
          </p>

          <h3 className="text-lg font-bold text-slate-900 mt-6">3. External Links & Google Reviews</h3>
          <p>
            Our website provides direct links to our Google Business Profile and social platforms. When you navigate to external services (like Google), your activity is governed by their respective privacy terms. We do not automatically scrape or submit reviews to external platforms.
          </p>

          <h3 className="text-lg font-bold text-slate-900 mt-6">4. Data Security</h3>
          <p>
            We implement industry-standard database indexing, encrypted connections (HTTPS), administrative role-based access control, and rate limiting to prevent unauthorized access.
          </p>

          <h3 className="text-lg font-bold text-slate-900 mt-6">5. Contact Information</h3>
          <p>
            For any queries regarding your data or to request removal of an enquiry or feedback entry, contact us at <code>privacy@slnengineers.com</code> or call our helpline at <code>+91 89776 68777</code>.
          </p>
        </div>
      </div>
    </div>
  );
}
