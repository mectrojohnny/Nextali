import Header from '@/components/Header';
import Footer from '@/components/Footer';

export default function TermsPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-8 md:py-12">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6 bg-gradient-to-r from-[#803C9A] to-[#FA4B99] bg-clip-text text-transparent">
            Terms and Conditions
          </h1>

          <div className="bg-white rounded-xl shadow-lg p-6 md:p-8 space-y-8">
            <section>
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">
                1. Introduction
              </h2>
              <p className="text-gray-600">
                Welcome to Rest Revive Thrive. By accessing and using this website, you accept and agree to be bound by the terms and provision of this agreement.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">
                2. Medical Disclaimer
              </h2>
              <p className="text-gray-600">
                The information provided on this website is for general informational purposes only. It is not intended to be a substitute for professional medical advice, diagnosis, or treatment. Always seek the advice of your physician or other qualified health provider with any questions you may have regarding a medical condition.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">
                3. User Accounts
              </h2>
              <p className="text-gray-600">
                When you create an account with us, you must provide accurate and complete information. You are responsible for maintaining the confidentiality of your account and password.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">
                4. Privacy Policy
              </h2>
              <p className="text-gray-600">
                Your use of Rest Revive Thrive is also governed by our Privacy Policy. Please review our Privacy Policy, which also governs the Site and informs users of our data collection practices.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">
                5. Intellectual Property
              </h2>
              <p className="text-gray-600">
                The content on Rest Revive Thrive, including text, graphics, logos, and images, is the property of Rest Revive Thrive and is protected by copyright and other intellectual property laws.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">
                6. User Content
              </h2>
              <p className="text-gray-600">
                By posting content on our platform, you grant Rest Revive Thrive a non-exclusive, royalty-free license to use, modify, and display that content in connection with our services.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">
                7. Limitation of Liability
              </h2>
              <p className="text-gray-600">
                Rest Revive Thrive shall not be liable for any indirect, incidental, special, consequential, or punitive damages resulting from your use of or inability to use the service.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">
                8. Contact Information
              </h2>
              <p className="text-gray-600">
                If you have any questions about these Terms, please contact us at{" "}
                <a 
                  href="mailto:legal@restrevivethrive.com"
                  className="text-[#803C9A] hover:text-[#FA4B99] transition-colors"
                >
                  legal@restrevivethrive.com
                </a>
              </p>
            </section>

            <div className="text-sm text-gray-500 mt-8 pt-8 border-t border-gray-200">
              Last updated: {new Date().toLocaleDateString()}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
} 