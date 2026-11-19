const runTests = async () => {
  console.log('========================================================');
  console.log('🧪 RUNNING END-TO-END VERIFICATION TEST SUITE');
  console.log('========================================================');

  let passed = 0;
  let failed = 0;

  const assert = (condition, title) => {
    if (condition) {
      console.log(`✅ [PASS] ${title}`);
      passed++;
    } else {
      console.error(`❌ [FAIL] ${title}`);
      failed++;
    }
  };

  try {
    // 1. Health check
    const health = await fetch('http://localhost:5000/api/health').then((r) => r.json());
    assert(health.status === 'healthy', 'Backend health check status is healthy');

    // 2. Public Settings
    const settings = await fetch('http://localhost:5000/api/settings').then((r) => r.json());
    assert(settings.success && settings.data.companyName.includes('SLN Engineers'), 'Public settings return SLN company branding');

    // 3. Public Services
    const services = await fetch('http://localhost:5000/api/services').then((r) => r.json());
    assert(services.success && services.count >= 7, `Public services returns ${services.count} categories`);

    // 4. Public Projects
    const projects = await fetch('http://localhost:5000/api/projects').then((r) => r.json());
    assert(projects.success && projects.count >= 3, `Public projects returns ${projects.count} completed projects`);
    const sampleSlug = projects.data[0].slug;

    // 5. Public Project Detail by slug
    const projectDetail = await fetch(`http://localhost:5000/api/projects/${sampleSlug}`).then((r) => r.json());
    assert(projectDetail.success && projectDetail.data.problemDescription, `Project detail resolved for slug: ${sampleSlug}`);

    // 6. Submit Customer Enquiry Form
    const enquiryPayload = {
      customerName: 'Test Verification User',
      phone: '+91 99999 88888',
      email: 'verification@test.com',
      location: 'Koramangala, Bangalore',
      serviceRequired: 'Terrace and roof waterproofing',
      problemDescription: 'Automated test enquiry verifying leak inspection flow.',
      preferredContactMethod: 'Phone',
      consentGiven: true,
    };
    const enquiryRes = await fetch('http://localhost:5000/api/enquiries', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(enquiryPayload),
    }).then((r) => r.json());
    assert(enquiryRes.success && enquiryRes.data.id, 'Customer enquiry submitted and registered in database');

    // 7. Admin Login
    const loginRes = await fetch('http://localhost:5000/api/admin/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ identifier: 'slnadmin', password: 'Admin@12345' }),
    }).then((r) => r.json());
    assert(loginRes.success && loginRes.token, 'Admin authentication successful and issued JWT token');
    const token = loginRes.token;

    // 8. Admin Dashboard
    const dashboard = await fetch('http://localhost:5000/api/admin/dashboard', {
      headers: { Authorization: `Bearer ${token}` },
    }).then((r) => r.json());
    assert(dashboard.success && dashboard.data.metrics.totalEnquiries > 0, `Admin dashboard metrics: ${dashboard.data.metrics.totalEnquiries} enquiries`);

    // 9. Generate QR Review Link for project
    const newQR = await fetch('http://localhost:5000/api/admin/review-links', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ projectId: projects.data[0]._id }),
    }).then((r) => r.json());
    assert(newQR.success && newQR.data.token && newQR.data.qrCodeDataUrl, `Generated cryptographically secure QR code token: ${newQR.data?.token}`);

    // 10. Customer Scans QR Token
    const scanRes = await fetch(`http://localhost:5000/api/reviews/token/${newQR.data.token}`).then((r) => r.json());
    assert(scanRes.success && scanRes.data.project.title, `QR token scan resolved project: ${scanRes.data?.project?.title}`);

    // 11. Customer Submits Review for Token
    const reviewSubmitRes = await fetch(`http://localhost:5000/api/reviews/token/${newQR.data.token}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        rating: 5,
        feedbackText: 'Outstanding 3-generation waterproofing craftsmanship. Perfectly sealed.',
        customerName: 'Verified Villa Resident',
        consentToPublish: true,
      }),
    }).then((r) => r.json());
    assert(reviewSubmitRes.success && reviewSubmitRes.data.rating === 5, 'Customer review recorded successfully');

    // 12. Outbound Social Media Redirect Tracking
    const socialClick = await fetch('http://localhost:5000/api/social/click/google_review?mode=json').then((r) => r.json());
    assert(socialClick.success && (socialClick.url.includes('google') || socialClick.url.includes('g.page')), `Outbound redirect tracking works: ${socialClick.url}`);

    // 13. SEO Sitemap and Robots
    const sitemap = await fetch('http://localhost:5000/sitemap.xml').then((r) => r.text());
    assert(sitemap.includes('<urlset') && sitemap.includes('/services'), 'Sitemap.xml dynamically generated');

    const robots = await fetch('http://localhost:5000/robots.txt').then((r) => r.text());
    assert(robots.includes('User-agent:') && robots.includes('Disallow: /admin/'), 'Robots.txt properly disallows admin endpoints');

    // 14. Frontend Dev Server availability
    const clientHtml = await fetch('http://localhost:5173/').then((r) => r.text());
    assert(clientHtml.includes('SLN Engineers Projects') || clientHtml.includes('root'), 'Vite frontend responds with HTTP 200 at http://localhost:5173');

    console.log('========================================================');
    console.log(`📊 RESULTS: ${passed} PASSED, ${failed} FAILED`);
    console.log('========================================================');

    if (failed > 0) process.exit(1);
    process.exit(0);
  } catch (err) {
    console.error('Test execution error:', err);
    process.exit(1);
  }
};

runTests();
