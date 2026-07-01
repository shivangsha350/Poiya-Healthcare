import React, { useState, useEffect } from 'react';
import { api, useAdminAuth } from '../../context/AdminAuthContext';
import { BACKEND_URL } from '../../config';

export default function Settings() {
  const { showToast } = useAdminAuth();

  // Settings states
  const [settingsData, setSettingsData] = useState({
    websiteName: '',
    contactEmail: '',
    contactPhone: '',
    address: '',
    facebook: '',
    twitter: '',
    linkedin: '',
    instagram: '',
  });

  const [logoFile, setLogoFile] = useState(null);
  const [logoPreview, setLogoPreview] = useState(null);
  const [loading, setLoading] = useState(true);

  // Password reset states
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordLoading, setPasswordLoading] = useState(false);

  useEffect(() => {
    const fetchSettings = async () => {
      setLoading(true);
      try {
        const res = await api.get('/settings');
        if (res.data.success && res.data.settings) {
          const s = res.data.settings;
          setSettingsData({
            websiteName: s.websiteName || '',
            contactEmail: s.contactEmail || '',
            contactPhone: s.contactPhone || '',
            address: s.address || '',
            facebook: s.socialLinks?.facebook || '',
            twitter: s.socialLinks?.twitter || '',
            linkedin: s.socialLinks?.linkedin || '',
            instagram: s.socialLinks?.instagram || '',
          });
          setLogoPreview(s.logo ? `${BACKEND_URL}${s.logo}` : null);
        }
      } catch (err) {
        console.error('Error loading settings:', err);
        showToast('Error loading configuration', 'error');
      } finally {
        setLoading(false);
      }
    };

    fetchSettings();
    // eslint-disable-next-line
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setSettingsData((prev) => ({ ...prev, [name]: value }));
  };

  const handleLogoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setLogoFile(file);
      setLogoPreview(URL.createObjectURL(file));
    }
  };

  const handleSettingsSubmit = async (e) => {
    e.preventDefault();

    const payload = new FormData();
    payload.append('websiteName', settingsData.websiteName);
    payload.append('contactEmail', settingsData.contactEmail);
    payload.append('contactPhone', settingsData.contactPhone);
    payload.append('address', settingsData.address);
    payload.append('facebook', settingsData.facebook);
    payload.append('twitter', settingsData.twitter);
    payload.append('linkedin', settingsData.linkedin);
    payload.append('instagram', settingsData.instagram);
    if (logoFile) {
      payload.append('logo', logoFile);
    }

    try {
      const res = await api.put('/settings', payload, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      if (res.data.success) {
        showToast('Website configurations saved successfully', 'success');
        if (res.data.settings?.logo) {
          setLogoPreview(`${BACKEND_URL}${res.data.settings.logo}`);
        }
      }
    } catch (err) {
      console.error(err);
      showToast(err.response?.data?.message || 'Failed to update settings', 'error');
    }
  };

  const handlePasswordReset = async (e) => {
    e.preventDefault();
    if (!currentPassword || !newPassword) return;

    if (newPassword !== confirmPassword) {
      showToast('New passwords do not match', 'error');
      return;
    }

    setPasswordLoading(true);
    try {
      const res = await api.put('/settings/password', { currentPassword, newPassword });
      if (res.data.success) {
        showToast('Admin password changed successfully', 'success');
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
      }
    } catch (err) {
      console.error(err);
      showToast(err.response?.data?.message || 'Failed to change password', 'error');
    } finally {
      setPasswordLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="h-44 bg-white/40 dark:bg-[#0e2238]/40 border border-[#d0e8f5]/40 dark:border-slate-800/40 rounded-3xl p-6"></div>
        <div className="h-44 bg-white/40 dark:bg-[#0e2238]/40 border border-[#d0e8f5]/40 dark:border-slate-800/40 rounded-3xl p-6"></div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start animate-fadeIn">
      
      {/* Left Columns (Branding & Details Form) */}
      <div className="lg:col-span-2 space-y-6">
        <div className="rounded-3xl bg-white/70 dark:bg-[#0e2238]/60 backdrop-blur-md border border-[#d0e8f5]/40 dark:border-slate-800/40 p-6 shadow-xl">
          
          <div className="border-b border-[#d0e8f5]/40 dark:border-slate-800/40 pb-4 mb-6">
            <h3 className="text-lg font-bold font-display text-slate-800 dark:text-white">
              Website Details & Custom Branding
            </h3>
            <p className="text-xs text-textmuted">Manage company details, contact information, and logo branding.</p>
          </div>

          <form onSubmit={handleSettingsSubmit} className="space-y-5">
            
            {/* Website name */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                Website/Business Name
              </label>
              <input
                type="text"
                name="websiteName"
                value={settingsData.websiteName}
                onChange={handleInputChange}
                placeholder="MediVision Healthcare"
                className="w-full bg-slate-100/50 dark:bg-slate-900/40 border border-[#d0e8f5]/40 dark:border-slate-800/50 rounded-xl py-2.5 px-3.5 text-sm focus:outline-none focus:border-accent"
              />
            </div>

            {/* Contacts Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                  Contact Email Address
                </label>
                <input
                  type="email"
                  name="contactEmail"
                  value={settingsData.contactEmail}
                  onChange={handleInputChange}
                  placeholder="info@medivision.com"
                  className="w-full bg-slate-100/50 dark:bg-slate-900/40 border border-[#d0e8f5]/40 dark:border-slate-800/50 rounded-xl py-2.5 px-3.5 text-sm focus:outline-none focus:border-accent"
                />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                  Contact Phone Number
                </label>
                <input
                  type="text"
                  name="contactPhone"
                  value={settingsData.contactPhone}
                  onChange={handleInputChange}
                  placeholder="+1 (555) 019-2834"
                  className="w-full bg-slate-100/50 dark:bg-slate-900/40 border border-[#d0e8f5]/40 dark:border-slate-800/50 rounded-xl py-2.5 px-3.5 text-sm focus:outline-none focus:border-accent"
                />
              </div>
            </div>

            {/* Address */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                Physical Office Address
              </label>
              <input
                type="text"
                name="address"
                value={settingsData.address}
                onChange={handleInputChange}
                placeholder="123 Health Ave, Suite 100, Medical City"
                className="w-full bg-slate-100/50 dark:bg-slate-900/40 border border-[#d0e8f5]/40 dark:border-slate-800/50 rounded-xl py-2.5 px-3.5 text-sm focus:outline-none focus:border-accent"
              />
            </div>

            {/* Socials Sub-header */}
            <div className="border-t border-[#d0e8f5]/30 dark:border-slate-800/40 pt-4 mt-6">
              <h4 className="text-xs font-bold uppercase tracking-widest text-[#00B4D8] mb-4">
                Social Networks Links
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                    Facebook URL
                  </label>
                  <input
                    type="url"
                    name="facebook"
                    value={settingsData.facebook}
                    onChange={handleInputChange}
                    placeholder="https://facebook.com/..."
                    className="w-full bg-slate-100/50 dark:bg-slate-900/40 border border-[#d0e8f5]/40 dark:border-slate-800/50 rounded-xl py-2 px-3 text-sm focus:outline-none focus:border-accent"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                    Twitter / X URL
                  </label>
                  <input
                    type="url"
                    name="twitter"
                    value={settingsData.twitter}
                    onChange={handleInputChange}
                    placeholder="https://twitter.com/..."
                    className="w-full bg-slate-100/50 dark:bg-slate-900/40 border border-[#d0e8f5]/40 dark:border-slate-800/50 rounded-xl py-2 px-3 text-sm focus:outline-none focus:border-accent"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                    LinkedIn URL
                  </label>
                  <input
                    type="url"
                    name="linkedin"
                    value={settingsData.linkedin}
                    onChange={handleInputChange}
                    placeholder="https://linkedin.com/company/..."
                    className="w-full bg-slate-100/50 dark:bg-slate-900/40 border border-[#d0e8f5]/40 dark:border-slate-800/50 rounded-xl py-2 px-3 text-sm focus:outline-none focus:border-accent"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                    Instagram URL
                  </label>
                  <input
                    type="url"
                    name="instagram"
                    value={settingsData.instagram}
                    onChange={handleInputChange}
                    placeholder="https://instagram.com/..."
                    className="w-full bg-slate-100/50 dark:bg-slate-900/40 border border-[#d0e8f5]/40 dark:border-slate-800/50 rounded-xl py-2 px-3 text-sm focus:outline-none focus:border-accent"
                  />
                </div>
              </div>
            </div>

            {/* Logo File upload details */}
            <div className="border-t border-[#d0e8f5]/30 dark:border-slate-800/40 pt-4 mt-6">
              <h4 className="text-xs font-bold uppercase tracking-widest text-[#00B4D8] mb-4">
                Website Logo Update
              </h4>
              <div className="flex gap-4 items-center">
                {logoPreview && (
                  <img
                    src={logoPreview}
                    alt="Logo Preview"
                    className="w-14 h-14 rounded-xl object-contain border border-[#d0e8f5]/30 dark:border-slate-800 bg-slate-100/30 p-1"
                  />
                )}
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleLogoChange}
                  className="block w-full text-xs text-slate-500
                    file:mr-4 file:py-2 file:px-4
                    file:rounded-xl file:border-0
                    file:text-xs file:font-semibold
                    file:bg-mid/10 file:text-mid
                    hover:file:bg-mid/20 cursor-pointer"
                />
              </div>
            </div>

            {/* Save details */}
            <div className="flex justify-end pt-4 border-t border-[#d0e8f5]/30 dark:border-slate-800/40">
              <button
                type="submit"
                className="px-5 py-2.5 bg-mid hover:bg-[#005f92] text-white text-sm font-semibold rounded-xl transition cursor-pointer"
              >
                Save Configurations
              </button>
            </div>

          </form>
        </div>
      </div>

      {/* Right Column (Change Password Form) */}
      <div className="lg:col-span-1">
        <div className="rounded-3xl bg-white/70 dark:bg-[#0e2238]/60 backdrop-blur-md border border-[#d0e8f5]/40 dark:border-slate-800/40 p-6 shadow-xl">
          
          <div className="border-b border-[#d0e8f5]/40 dark:border-slate-800/40 pb-4 mb-6">
            <h3 className="text-lg font-bold font-display text-slate-800 dark:text-white">
              System Security
            </h3>
            <p className="text-xs text-textmuted">Change administrative login credentials.</p>
          </div>

          <form onSubmit={handlePasswordReset} className="space-y-4">
            
            {/* Current Password */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                Current Password
              </label>
              <input
                type="password"
                required
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-slate-100/50 dark:bg-slate-900/40 border border-[#d0e8f5]/40 dark:border-slate-800/50 rounded-xl py-2 px-3 text-sm focus:outline-none focus:border-accent"
              />
            </div>

            {/* New Password */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                New Password
              </label>
              <input
                type="password"
                required
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Min 6 characters"
                className="w-full bg-slate-100/50 dark:bg-slate-900/40 border border-[#d0e8f5]/40 dark:border-slate-800/50 rounded-xl py-2 px-3 text-sm focus:outline-none focus:border-accent"
              />
            </div>

            {/* Confirm New Password */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                Confirm Password
              </label>
              <input
                type="password"
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm password"
                className="w-full bg-slate-100/50 dark:bg-slate-900/40 border border-[#d0e8f5]/40 dark:border-slate-800/50 rounded-xl py-2 px-3 text-sm focus:outline-none focus:border-accent"
              />
            </div>

            {/* Reset CTA */}
            <button
              type="submit"
              disabled={passwordLoading}
              className="w-full bg-gradient-to-r from-[#F4A261] to-[#E76F51] text-white py-2.5 rounded-xl font-bold text-sm shadow-md hover:opacity-90 transition mt-6 cursor-pointer"
            >
              {passwordLoading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin mx-auto"></div>
              ) : (
                'Update Password'
              )}
            </button>

          </form>
        </div>
      </div>

    </div>
  );
}
