import React from 'react';
import { Shield, Lock, FileText, Mail, Phone, Globe } from 'lucide-react';

const PrivacyPolicy = () => {
    return (
        <div className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
                {/* Header */}
                <div className="bg-gradient-to-r from-[#7B4BFF] to-[#A07BFF] px-8 py-10 text-white">
                    <div className="flex items-center gap-3 mb-4">
                        <Shield className="w-8 h-8 opacity-80" />
                        <h1 className="text-3xl font-bold">Privacy Policy</h1>
                    </div>
                    <p className="text-purple-100">Last Updated: January 2025</p>
                </div>

                {/* Content */}
                <div className="p-8 sm:p-12 space-y-10">

                    {/* Introduction */}
                    <div className="prose max-w-none text-slate-600">
                        <p className="text-lg leading-relaxed">
                            Welcome to Vizoraa. We are committed to protecting your privacy and ensuring the security of your personal information. This Privacy Policy explains how we collect, use, store, and protect your data when you use our digital visiting card services.
                        </p>
                        <p className="mt-4">
                            By using our services, you agree to the collection and use of information in accordance with this policy.
                        </p>
                    </div>

                    {/* Section 1 */}
                    <section>
                        <h2 className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-2">
                            <span className="bg-purple-100 text-[#7B4BFF] w-8 h-8 rounded-lg flex items-center justify-center text-sm">1</span>
                            Information We Collect
                        </h2>
                        <div className="space-y-4 text-slate-600 pl-10">
                            <h3 className="font-semibold text-slate-800">Personal Information</h3>
                            <p>When you create a digital visiting card or register for our services, we may collect:</p>
                            <ul className="list-disc pl-5 title-list space-y-1">
                                <li>Full name</li>
                                <li>Email address</li>
                                <li>Phone number</li>
                                <li>Company name and occupation</li>
                                <li>Business address and location</li>
                                <li>Profile picture and other uploaded images</li>
                                <li>Social media links and website URLs</li>
                                <li>Date of birth (optional)</li>
                            </ul>

                            <h3 className="font-semibold text-slate-800 mt-4">Payment Information</h3>
                            <p>For premium features and services, we collect payment information including credit/debit card details or other payment method information. All payment processing is handled securely through trusted third-party payment processors.</p>

                            <h3 className="font-semibold text-slate-800 mt-4">Usage Data</h3>
                            <p>We automatically collect information about how you interact with our services, including IP address, browser type, device information, pages visited, and time spent on our platform.</p>
                        </div>
                    </section>

                    {/* Section 2 */}
                    <section>
                        <h2 className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-2">
                            <span className="bg-purple-100 text-[#7B4BFF] w-8 h-8 rounded-lg flex items-center justify-center text-sm">2</span>
                            How We Use Your Information
                        </h2>
                        <div className="text-slate-600 pl-10">
                            <p className="mb-3">We use your information to:</p>
                            <ul className="list-disc pl-5 space-y-2">
                                <li>Create and manage your digital visiting cards</li>
                                <li>Provide, maintain, and improve our services</li>
                                <li>Process payments and manage subscriptions</li>
                                <li>Send you important updates, notifications, and service announcements</li>
                                <li>Respond to your inquiries and provide customer support</li>
                                <li>Analyze usage patterns to enhance user experience</li>
                                <li>Prevent fraud and ensure platform security</li>
                                <li>Comply with legal obligations</li>
                            </ul>
                        </div>
                    </section>

                    {/* Section 3 */}
                    <section>
                        <h2 className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-2">
                            <span className="bg-purple-100 text-[#7B4BFF] w-8 h-8 rounded-lg flex items-center justify-center text-sm">3</span>
                            Data Protection & Security
                        </h2>
                        <div className="text-slate-600 pl-10">
                            <p className="mb-3">We take the security of your personal information seriously and implement industry-standard security measures to protect your data:</p>
                            <ul className="list-disc pl-5 space-y-2 mb-4">
                                <li>Encryption of data in transit and at rest using SSL/TLS protocols</li>
                                <li>Secure cloud storage with access controls and authentication</li>
                                <li>Regular security audits and vulnerability assessments</li>
                                <li>Limited employee access to personal information on a need-to-know basis</li>
                                <li>Secure payment processing through PCI-DSS compliant payment gateways</li>
                            </ul>
                            <div className="bg-amber-50 border border-amber-100 rounded-lg p-4 text-sm text-amber-800 flex gap-3">
                                <Lock className="w-5 h-5 flex-shrink-0" />
                                <p>While we strive to protect your information, no method of transmission over the internet is 100% secure. We cannot guarantee absolute security but continuously work to enhance our security measures.</p>
                            </div>
                        </div>
                    </section>

                    {/* Section 4 */}
                    <section>
                        <h2 className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-2">
                            <span className="bg-purple-100 text-[#7B4BFF] w-8 h-8 rounded-lg flex items-center justify-center text-sm">4</span>
                            Refund Policy
                        </h2>
                        <div className="text-slate-600 pl-10 space-y-4">
                            <p>We want you to be completely satisfied with our services. Our refund policy is as follows:</p>
                            <div className="bg-slate-50 rounded-xl p-5 border border-slate-100">
                                <h4 className="font-semibold text-slate-800 mb-3">Refund Eligibility:</h4>
                                <ul className="space-y-3">
                                    <li className="flex gap-2 text-sm">
                                        <span className="font-medium text-slate-900 min-w-32">Request Window:</span>
                                        <span>You may request a refund within 2-3 working days of payment</span>
                                    </li>
                                    <li className="flex gap-2 text-sm">
                                        <span className="font-medium text-slate-900 min-w-32">Processing Time:</span>
                                        <span>Approved refunds will be processed and credited back to your original payment method within 1 week (7 working days)</span>
                                    </li>
                                    <li className="flex gap-2 text-sm">
                                        <span className="font-medium text-slate-900 min-w-32">Eligibility Criteria:</span>
                                        <span>Refunds are available for premium subscriptions and paid services, subject to verification</span>
                                    </li>
                                </ul>
                            </div>
                            <p className="text-sm">
                                To request a refund, please contact our support team at <a href="mailto:digicraftoffical@gmail.com" className="text-[#7B4BFF] hover:underline">digicraftoffical@gmail.com</a> with your order details and reason for the refund. We will review your request and respond within 24-48 hours.
                            </p>
                            <p className="text-sm italic text-slate-500">
                                Note: Refunds may not be available for services that have been fully utilized or for violations of our Terms of Service.
                            </p>
                        </div>
                    </section>

                    {/* Section 5 */}
                    <section>
                        <h2 className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-2">
                            <span className="bg-purple-100 text-[#7B4BFF] w-8 h-8 rounded-lg flex items-center justify-center text-sm">5</span>
                            Cookies & Tracking Technologies
                        </h2>
                        <div className="text-slate-600 pl-10">
                            <p className="mb-4">We use cookies and similar tracking technologies to enhance your experience on our platform:</p>
                            <div className="grid sm:grid-cols-3 gap-4 mb-4">
                                <div className="p-4 bg-slate-50 rounded-lg border border-slate-100">
                                    <h4 className="font-semibold text-slate-900 mb-1">Essential Cookies</h4>
                                    <p className="text-sm">Required for basic website functionality and security</p>
                                </div>
                                <div className="p-4 bg-slate-50 rounded-lg border border-slate-100">
                                    <h4 className="font-semibold text-slate-900 mb-1">Performance Cookies</h4>
                                    <p className="text-sm">Help us understand how visitors interact with our website</p>
                                </div>
                                <div className="p-4 bg-slate-50 rounded-lg border border-slate-100">
                                    <h4 className="font-semibold text-slate-900 mb-1">Functional Cookies</h4>
                                    <p className="text-sm">Remember your preferences and settings</p>
                                </div>
                            </div>
                            <p className="text-sm">You can control cookie preferences through your browser settings. However, disabling certain cookies may affect the functionality of our services.</p>
                        </div>
                    </section>

                    {/* Section 6 */}
                    <section>
                        <h2 className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-2">
                            <span className="bg-purple-100 text-[#7B4BFF] w-8 h-8 rounded-lg flex items-center justify-center text-sm">6</span>
                            Third-Party Services
                        </h2>
                        <div className="text-slate-600 pl-10">
                            <p className="mb-3">We use trusted third-party services to provide and improve our platform:</p>
                            <ul className="list-disc pl-5 space-y-1 mb-3">
                                <li><span className="font-medium text-slate-800">Cloud Hosting:</span> Secure data storage and infrastructure management</li>
                                <li><span className="font-medium text-slate-800">Payment Processors:</span> Secure payment processing and transaction management</li>
                                <li><span className="font-medium text-slate-800">Analytics Tools:</span> Website performance and user behavior analysis</li>
                                <li><span className="font-medium text-slate-800">Email Services:</span> Transactional and marketing communications</li>
                            </ul>
                            <p className="text-sm">These third parties have access to your information only to perform specific tasks on our behalf and are obligated to maintain confidentiality.</p>
                        </div>
                    </section>

                    {/* Section 7 */}
                    <section>
                        <h2 className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-2">
                            <span className="bg-purple-100 text-[#7B4BFF] w-8 h-8 rounded-lg flex items-center justify-center text-sm">7</span>
                            Data Sharing & Disclosure
                        </h2>
                        <div className="text-slate-600 pl-10">
                            <p className="mb-3">We do not sell, trade, or rent your personal information to third parties. We may share your information only in the following circumstances:</p>
                            <ul className="list-disc pl-5 space-y-2">
                                <li>With your explicit consent</li>
                                <li>To comply with legal obligations or court orders</li>
                                <li>To protect our rights, property, or safety and that of our users</li>
                                <li>In connection with a business merger, acquisition, or asset sale (with prior notice)</li>
                                <li>With service providers who assist in our operations (under strict confidentiality agreements)</li>
                            </ul>
                        </div>
                    </section>

                    {/* Section 8 */}
                    <section>
                        <h2 className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-2">
                            <span className="bg-purple-100 text-[#7B4BFF] w-8 h-8 rounded-lg flex items-center justify-center text-sm">8</span>
                            Your Rights & Choices
                        </h2>
                        <div className="text-slate-600 pl-10">
                            <p className="mb-3">You have the right to:</p>
                            <div className="grid sm:grid-cols-2 gap-3 mb-4">
                                <div className="flex items-start gap-2">
                                    <div className="w-1.5 h-1.5 rounded-full bg-[#7B4BFF] mt-2"></div>
                                    <div><span className="font-medium text-slate-800">Access:</span> Request a copy of your personal data</div>
                                </div>
                                <div className="flex items-start gap-2">
                                    <div className="w-1.5 h-1.5 rounded-full bg-[#7B4BFF] mt-2"></div>
                                    <div><span className="font-medium text-slate-800">Update:</span> Correct inaccurate or incomplete information</div>
                                </div>
                                <div className="flex items-start gap-2">
                                    <div className="w-1.5 h-1.5 rounded-full bg-[#7B4BFF] mt-2"></div>
                                    <div><span className="font-medium text-slate-800">Delete:</span> Request deletion of your account and associated data</div>
                                </div>
                                <div className="flex items-start gap-2">
                                    <div className="w-1.5 h-1.5 rounded-full bg-[#7B4BFF] mt-2"></div>
                                    <div><span className="font-medium text-slate-800">Restrict:</span> Limit how we use your data</div>
                                </div>
                                <div className="flex items-start gap-2">
                                    <div className="w-1.5 h-1.5 rounded-full bg-[#7B4BFF] mt-2"></div>
                                    <div><span className="font-medium text-slate-800">Portability:</span> Receive your data in a structured format</div>
                                </div>
                                <div className="flex items-start gap-2">
                                    <div className="w-1.5 h-1.5 rounded-full bg-[#7B4BFF] mt-2"></div>
                                    <div><span className="font-medium text-slate-800">Withdraw Consent:</span> Opt-out of marketing communications</div>
                                </div>
                            </div>
                            <p className="text-sm">To exercise any of these rights, please contact us using the details provided below.</p>
                        </div>
                    </section>

                    {/* Section 9-12 */}
                    <section className="space-y-8">
                        <div>
                            <h2 className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-2">
                                <span className="bg-purple-100 text-[#7B4BFF] w-8 h-8 rounded-lg flex items-center justify-center text-sm">9</span>
                                Data Retention
                            </h2>
                            <div className="text-slate-600 pl-10">
                                <p>We retain your personal information only for as long as necessary to fulfill the purposes outlined in this policy, unless a longer retention period is required or permitted by law. When you delete your account, we will delete or anonymize your personal data, except where we need to retain it for legal or legitimate business purposes.</p>
                            </div>
                        </div>

                        <div>
                            <h2 className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-2">
                                <span className="bg-purple-100 text-[#7B4BFF] w-8 h-8 rounded-lg flex items-center justify-center text-sm">10</span>
                                Children's Privacy
                            </h2>
                            <div className="text-slate-600 pl-10">
                                <p>Our services are not intended for individuals under the age of 18. We do not knowingly collect personal information from children. If you believe we have inadvertently collected information from a child, please contact us immediately, and we will take steps to delete such information.</p>
                            </div>
                        </div>

                        <div>
                            <h2 className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-2">
                                <span className="bg-purple-100 text-[#7B4BFF] w-8 h-8 rounded-lg flex items-center justify-center text-sm">11</span>
                                Changes to This Policy
                            </h2>
                            <div className="text-slate-600 pl-10">
                                <p>We may update this Privacy Policy from time to time to reflect changes in our practices or legal requirements. We will notify you of any significant changes by posting the new policy on this page and updating the "Last Updated" date. We encourage you to review this policy periodically.</p>
                            </div>
                        </div>

                        <div>
                            <h2 className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-2">
                                <span className="bg-purple-100 text-[#7B4BFF] w-8 h-8 rounded-lg flex items-center justify-center text-sm">12</span>
                                Your Consent
                            </h2>
                            <div className="text-slate-600 pl-10">
                                <p>By using Vizoraa and our digital visiting card services, you acknowledge that you have read, understood, and agree to be bound by this Privacy Policy. If you do not agree with any part of this policy, please discontinue use of our services immediately.</p>
                            </div>
                        </div>
                    </section>

                    {/* Contact Section */}
                    <section className="bg-slate-50 rounded-2xl p-8 border border-slate-100">
                        <h2 className="text-2xl font-bold text-slate-900 mb-6">Contact Us</h2>
                        <p className="text-slate-600 mb-8">
                            If you have any questions, concerns, or requests regarding this Privacy Policy or our data practices, please don't hesitate to contact us:
                        </p>

                        <div className="grid md:grid-cols-2 gap-6">
                            <a href="mailto:vizoraa.app@gmail.com" className="flex items-start gap-4 p-4 bg-white rounded-xl shadow-sm border border-slate-100 hover:border-[#7B4BFF] transition-colors group">
                                <div className="w-10 h-10 rounded-full bg-purple-50 flex items-center justify-center text-[#7B4BFF] group-hover:bg-[#7B4BFF] group-hover:text-white transition-colors">
                                    <Mail className="w-5 h-5" />
                                </div>
                                <div>
                                    <h3 className="font-semibold text-slate-900">Email</h3>
                                    <p className="text-slate-500 text-sm">vizoraa.app@gmail.com</p>
                                </div>
                            </a>

                            <a href="tel:+917900127488" className="flex items-start gap-4 p-4 bg-white rounded-xl shadow-sm border border-slate-100 hover:border-[#7B4BFF] transition-colors group">
                                <div className="w-10 h-10 rounded-full bg-purple-50 flex items-center justify-center text-[#7B4BFF] group-hover:bg-[#7B4BFF] group-hover:text-white transition-colors">
                                    <Phone className="w-5 h-5" />
                                </div>
                                <div>
                                    <h3 className="font-semibold text-slate-900">Phone</h3>
                                    <p className="text-slate-500 text-sm">+91 79001 27488</p>
                                </div>
                            </a>

                            <a href="https://vizoraa.netlify.app" target="_blank" rel="noreferrer" className="flex items-start gap-4 p-4 bg-white rounded-xl shadow-sm border border-slate-100 hover:border-[#7B4BFF] transition-colors group">
                                <div className="w-10 h-10 rounded-full bg-purple-50 flex items-center justify-center text-[#7B4BFF] group-hover:bg-[#7B4BFF] group-hover:text-white transition-colors">
                                    <Globe className="w-5 h-5" />
                                </div>
                                <div>
                                    <h3 className="font-semibold text-slate-900">Website</h3>
                                    <p className="text-slate-500 text-sm">https://vizoraa.netlify.app</p>
                                </div>
                            </a>

                            <div className="flex items-start gap-4 p-4 bg-white rounded-xl shadow-sm border border-slate-100">
                                <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-blue-500">
                                    <FileText className="w-5 h-5" />
                                </div>
                                <div>
                                    <h3 className="font-semibold text-slate-900">Response Time</h3>
                                    <p className="text-slate-500 text-sm">We aim to respond within 24-48 business hours.</p>
                                </div>
                            </div>
                        </div>

                        <div className="mt-8 pt-8 border-t border-slate-200 text-center text-slate-500 text-sm">
                            This Privacy Policy is effective as of January 2025 and governs the use of Vizoraa services.
                            <br />
                            Thank you for trusting us with your information. Your privacy is our priority.
                        </div>
                    </section>

                </div>
            </div>
        </div>
    );
};

export default PrivacyPolicy;
