import { useTranslation } from 'react-i18next';
import { FileText, Scale, UserCheck, AlertTriangle, CreditCard, Shield, Mail, Phone } from 'lucide-react';

export default function TermsOfServicePage() {
  const { t } = useTranslation();

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50">
      <div className="container mx-auto px-4 py-12 max-w-4xl">
        {/* Header Section */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-3 bg-blue-50 text-blue-600 px-6 py-3 rounded-full text-lg font-medium mb-6">
            <Scale className="w-6 h-6" />
            {t('terms.title')}
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            {t('terms.heading')}
          </h1>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            {t('terms.description')}
          </p>
          <p className="text-sm text-gray-500 mt-4">
            {t('terms.lastUpdated')}: {new Date().toLocaleDateString('vi-VN')}
          </p>
        </div>

        {/* Content Sections */}
        <div className="space-y-8">
          {/* Acceptance of Terms */}
          <section className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-3 bg-blue-50 rounded-xl">
                <UserCheck className="w-6 h-6 text-blue-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900">
                {t('terms.acceptance.title')}
              </h2>
            </div>
            <div className="prose prose-blue max-w-none">
              <p className="text-gray-600 mb-4">
                {t('terms.acceptance.description')}
              </p>
              <p className="text-gray-600">
                {t('terms.acceptance.agreement')}
              </p>
            </div>
          </section>

          {/* Description of Service */}
          <section className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-3 bg-green-50 rounded-xl">
                <FileText className="w-6 h-6 text-green-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900">
                {t('terms.serviceDescription.title')}
              </h2>
            </div>
            <div className="prose prose-green max-w-none">
              <p className="text-gray-600 mb-4">
                {t('terms.serviceDescription.description')}
              </p>
              <ul className="text-gray-600 space-y-2">
                <li>• {t('terms.serviceDescription.marketplace')}</li>
                <li>• {t('terms.serviceDescription.userAccounts')}</li>
                <li>• {t('terms.serviceDescription.transactions')}</li>
                <li>• {t('terms.serviceDescription.customerSupport')}</li>
              </ul>
            </div>
          </section>

          {/* User Accounts */}
          <section className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-3 bg-purple-50 rounded-xl">
                <UserCheck className="w-6 h-6 text-purple-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900">
                {t('terms.userAccounts.title')}
              </h2>
            </div>
            <div className="prose prose-purple max-w-none">
              <p className="text-gray-600 mb-4">
                {t('terms.userAccounts.description')}
              </p>
              <ul className="text-gray-600 space-y-2">
                <li>• {t('terms.userAccounts.accurateInfo')}</li>
                <li>• {t('terms.userAccounts.securePassword')}</li>
                <li>• {t('terms.userAccounts.responsibleUse')}</li>
                <li>• {t('terms.userAccounts.notifyChanges')}</li>
              </ul>
            </div>
          </section>

          {/* User Conduct */}
          <section className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-3 bg-yellow-50 rounded-xl">
                <AlertTriangle className="w-6 h-6 text-yellow-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900">
                {t('terms.userConduct.title')}
              </h2>
            </div>
            <div className="prose prose-yellow max-w-none">
              <p className="text-gray-600 mb-4">
                {t('terms.userConduct.description')}
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-3">
                    {t('terms.userConduct.prohibited.title')}
                  </h3>
                  <ul className="text-gray-600 space-y-2">
                    <li>• {t('terms.userConduct.prohibited.illegalActivities')}</li>
                    <li>• {t('terms.userConduct.prohibited.fraudulentBehavior')}</li>
                    <li>• {t('terms.userConduct.prohibited.harassment')}</li>
                    <li>• {t('terms.userConduct.prohibited.spamming')}</li>
                    <li>• {t('terms.userConduct.prohibited.copyrightViolation')}</li>
                  </ul>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-3">
                    {t('terms.userConduct.required.title')}
                  </h3>
                  <ul className="text-gray-600 space-y-2">
                    <li>• {t('terms.userConduct.required.respectOthers')}</li>
                    <li>• {t('terms.userConduct.required.accurateListing')}</li>
                    <li>• {t('terms.userConduct.required.promptCommunication')}</li>
                    <li>• {t('terms.userConduct.required.completeTransactions')}</li>
                    <li>• {t('terms.userConduct.required.followLaws')}</li>
                  </ul>
                </div>
              </div>
            </div>
          </section>

          {/* Payment Terms */}
          <section className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-3 bg-emerald-50 rounded-xl">
                <CreditCard className="w-6 h-6 text-emerald-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900">
                {t('terms.paymentTerms.title')}
              </h2>
            </div>
            <div className="prose prose-emerald max-w-none">
              <ul className="text-gray-600 space-y-2">
                <li>• {t('terms.paymentTerms.securePayment')}</li>
                <li>• {t('terms.paymentTerms.acceptedMethods')}</li>
                <li>• {t('terms.paymentTerms.feesAndCharges')}</li>
                <li>• {t('terms.paymentTerms.refundPolicy')}</li>
                <li>• {t('terms.paymentTerms.disputeResolution')}</li>
              </ul>
            </div>
          </section>

          {/* Intellectual Property */}
          <section className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-3 bg-indigo-50 rounded-xl">
                <Shield className="w-6 h-6 text-indigo-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900">
                {t('terms.intellectualProperty.title')}
              </h2>
            </div>
            <div className="prose prose-indigo max-w-none">
              <p className="text-gray-600 mb-4">
                {t('terms.intellectualProperty.description')}
              </p>
              <ul className="text-gray-600 space-y-2">
                <li>• {t('terms.intellectualProperty.ownersRights')}</li>
                <li>• {t('terms.intellectualProperty.userContent')}</li>
                <li>• {t('terms.intellectualProperty.respectRights')}</li>
                <li>• {t('terms.intellectualProperty.reportViolations')}</li>
              </ul>
            </div>
          </section>

          {/* Limitation of Liability */}
          <section className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-3 bg-red-50 rounded-xl">
                <AlertTriangle className="w-6 h-6 text-red-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900">
                {t('terms.limitationOfLiability.title')}
              </h2>
            </div>
            <div className="prose prose-red max-w-none">
              <p className="text-gray-600 mb-4">
                {t('terms.limitationOfLiability.description')}
              </p>
              <ul className="text-gray-600 space-y-2">
                <li>• {t('terms.limitationOfLiability.noWarranty')}</li>
                <li>• {t('terms.limitationOfLiability.userRisk')}</li>
                <li>• {t('terms.limitationOfLiability.indirectDamages')}</li>
                <li>• {t('terms.limitationOfLiability.maximumLiability')}</li>
              </ul>
            </div>
          </section>

          {/* Termination */}
          <section className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-3 bg-orange-50 rounded-xl">
                <AlertTriangle className="w-6 h-6 text-orange-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900">
                {t('terms.termination.title')}
              </h2>
            </div>
            <div className="prose prose-orange max-w-none">
              <p className="text-gray-600 mb-4">
                {t('terms.termination.description')}
              </p>
              <ul className="text-gray-600 space-y-2">
                <li>• {t('terms.termination.immediateTermination')}</li>
                <li>• {t('terms.termination.suspendServices')}</li>
                <li>• {t('terms.termination.userTermination')}</li>
                <li>• {t('terms.termination.dataRetention')}</li>
              </ul>
            </div>
          </section>

          {/* Changes to Terms */}
          <section className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-3 bg-cyan-50 rounded-xl">
                <FileText className="w-6 h-6 text-cyan-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900">
                {t('terms.changesToTerms.title')}
              </h2>
            </div>
            <div className="prose prose-cyan max-w-none">
              <p className="text-gray-600 mb-4">
                {t('terms.changesToTerms.description')}
              </p>
              <p className="text-gray-600">
                {t('terms.changesToTerms.notification')}
              </p>
            </div>
          </section>

          {/* Contact Information */}
          <section className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-8 border border-blue-200">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                {t('terms.contact.title')}
              </h2>
              <p className="text-gray-600 mb-6">
                {t('terms.contact.description')}
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex items-center justify-center gap-3">
                  <Mail className="w-5 h-5 text-blue-600" />
                  <span className="text-gray-700">legal@alohamarket.com</span>
                </div>
                <div className="flex items-center justify-center gap-3">
                  <Phone className="w-5 h-5 text-blue-600" />
                  <span className="text-gray-700">+84 (0) 123 456 789</span>
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
