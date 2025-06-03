import { useTranslation } from 'react-i18next';
import { Shield, Eye, Lock, Users, FileText, Mail, Phone } from 'lucide-react';

export default function PrivacyPolicyPage() {
  const { t } = useTranslation();

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50">
      <div className="container mx-auto px-4 py-12 max-w-4xl">
        {/* Header Section */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-3 bg-blue-50 text-blue-600 px-6 py-3 rounded-full text-lg font-medium mb-6">
            <Shield className="w-6 h-6" />
            {t('privacy.title')}
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            {t('privacy.heading')}
          </h1>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            {t('privacy.description')}
          </p>
          <p className="text-sm text-gray-500 mt-4">
            {t('privacy.lastUpdated')}: {new Date().toLocaleDateString('vi-VN')}
          </p>
        </div>

        {/* Content Sections */}
        <div className="space-y-8">
          {/* Information We Collect */}
          <section className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-3 bg-blue-50 rounded-xl">
                <Eye className="w-6 h-6 text-blue-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900">
                {t('privacy.informationWeCollect.title')}
              </h2>
            </div>
            <div className="prose prose-blue max-w-none">
              <h3 className="text-lg font-semibold text-gray-800 mb-3">
                {t('privacy.informationWeCollect.personalInfo.title')}
              </h3>
              <ul className="text-gray-600 space-y-2 mb-6">
                <li>• {t('privacy.informationWeCollect.personalInfo.name')}</li>
                <li>• {t('privacy.informationWeCollect.personalInfo.email')}</li>
                <li>• {t('privacy.informationWeCollect.personalInfo.phone')}</li>
                <li>• {t('privacy.informationWeCollect.personalInfo.address')}</li>
                <li>• {t('privacy.informationWeCollect.personalInfo.paymentInfo')}</li>
              </ul>

              <h3 className="text-lg font-semibold text-gray-800 mb-3">
                {t('privacy.informationWeCollect.automaticInfo.title')}
              </h3>
              <ul className="text-gray-600 space-y-2">
                <li>• {t('privacy.informationWeCollect.automaticInfo.ipAddress')}</li>
                <li>• {t('privacy.informationWeCollect.automaticInfo.browserInfo')}</li>
                <li>• {t('privacy.informationWeCollect.automaticInfo.deviceInfo')}</li>
                <li>• {t('privacy.informationWeCollect.automaticInfo.usageData')}</li>
              </ul>
            </div>
          </section>

          {/* How We Use Information */}
          <section className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-3 bg-green-50 rounded-xl">
                <Users className="w-6 h-6 text-green-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900">
                {t('privacy.howWeUseInfo.title')}
              </h2>
            </div>
            <div className="prose prose-green max-w-none">
              <ul className="text-gray-600 space-y-2">
                <li>• {t('privacy.howWeUseInfo.provideServices')}</li>
                <li>• {t('privacy.howWeUseInfo.processTransactions')}</li>
                <li>• {t('privacy.howWeUseInfo.customerSupport')}</li>
                <li>• {t('privacy.howWeUseInfo.improveServices')}</li>
                <li>• {t('privacy.howWeUseInfo.sendUpdates')}</li>
                <li>• {t('privacy.howWeUseInfo.preventFraud')}</li>
                <li>• {t('privacy.howWeUseInfo.marketingCommunications')}</li>
              </ul>
            </div>
          </section>

          {/* Information Sharing */}
          <section className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-3 bg-yellow-50 rounded-xl">
                <Lock className="w-6 h-6 text-yellow-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900">
                {t('privacy.informationSharing.title')}
              </h2>
            </div>
            <div className="prose prose-yellow max-w-none">
              <p className="text-gray-600 mb-4">
                {t('privacy.informationSharing.description')}
              </p>
              <ul className="text-gray-600 space-y-2">
                <li>• {t('privacy.informationSharing.serviceProviders')}</li>
                <li>• {t('privacy.informationSharing.businessTransfers')}</li>
                <li>• {t('privacy.informationSharing.legalRequirements')}</li>
                <li>• {t('privacy.informationSharing.yourConsent')}</li>
              </ul>
            </div>
          </section>

          {/* Data Security */}
          <section className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-3 bg-purple-50 rounded-xl">
                <Shield className="w-6 h-6 text-purple-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900">
                {t('privacy.dataSecurity.title')}
              </h2>
            </div>
            <div className="prose prose-purple max-w-none">
              <p className="text-gray-600 mb-4">
                {t('privacy.dataSecurity.description')}
              </p>
              <ul className="text-gray-600 space-y-2">
                <li>• {t('privacy.dataSecurity.encryption')}</li>
                <li>• {t('privacy.dataSecurity.secureServers')}</li>
                <li>• {t('privacy.dataSecurity.accessControls')}</li>
                <li>• {t('privacy.dataSecurity.regularAudits')}</li>
              </ul>
            </div>
          </section>

          {/* Your Rights */}
          <section className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-3 bg-indigo-50 rounded-xl">
                <FileText className="w-6 h-6 text-indigo-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900">
                {t('privacy.yourRights.title')}
              </h2>
            </div>
            <div className="prose prose-indigo max-w-none">
              <ul className="text-gray-600 space-y-2">
                <li>• {t('privacy.yourRights.accessData')}</li>
                <li>• {t('privacy.yourRights.correctData')}</li>
                <li>• {t('privacy.yourRights.deleteData')}</li>
                <li>• {t('privacy.yourRights.portData')}</li>
                <li>• {t('privacy.yourRights.restrictProcessing')}</li>
                <li>• {t('privacy.yourRights.optOutMarketing')}</li>
              </ul>
            </div>
          </section>

          {/* Cookies */}
          <section className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-3 bg-orange-50 rounded-xl">
                <Eye className="w-6 h-6 text-orange-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900">
                {t('privacy.cookies.title')}
              </h2>
            </div>
            <div className="prose prose-orange max-w-none">
              <p className="text-gray-600 mb-4">
                {t('privacy.cookies.description')}
              </p>
              <p className="text-gray-600">
                {t('privacy.cookies.control')}
              </p>
            </div>
          </section>

          {/* Contact Information */}
          <section className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-8 border border-blue-200">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                {t('privacy.contact.title')}
              </h2>
              <p className="text-gray-600 mb-6">
                {t('privacy.contact.description')}
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex items-center justify-center gap-3">
                  <Mail className="w-5 h-5 text-blue-600" />
                  <span className="text-gray-700">support@alohamarket.com</span>
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
