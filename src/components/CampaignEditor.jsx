import { useState, useEffect } from 'react';
import { useStore } from '../lib/store';
import { format, addDays } from 'date-fns';
import { ConfirmDialog } from './ConfirmDialog';

export function CampaignEditor({ onClose }) {
    const { campaigns, selectedCampaignId, addCampaign, updateCampaign, removeCampaign, duplicateCampaign, selectCampaign, showToast } = useStore();

    const isEditing = !!selectedCampaignId;
    const initialData = isEditing
        ? campaigns.find(c => c.id === selectedCampaignId)
        : {
            name: 'New Campaign',
            startDate: format(new Date(), 'yyyy-MM-dd'),
            endDate: format(addDays(new Date(), 30), 'yyyy-MM-dd'),
            dailyBudget: 1000,
            targetCpi: 2.0,
            platform: 'ios',
            geo: 'US',
            color: '#6366f1'
        };

    const [formData, setFormData] = useState(initialData);
    const [errors, setErrors] = useState({});
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [isClosing, setIsClosing] = useState(false);

    useEffect(() => {
        if (isEditing) {
            const campaign = campaigns.find(c => c.id === selectedCampaignId);
            if (campaign) setFormData(campaign);
        }
    }, [selectedCampaignId, campaigns, isEditing]);

    // Keyboard shortcuts
    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.key === 'Escape') {
                handleClose();
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, []);

    const validateForm = () => {
        const newErrors = {};

        if (!formData.name || formData.name.trim() === '') {
            newErrors.name = 'Campaign name is required';
        }

        if (new Date(formData.endDate) <= new Date(formData.startDate)) {
            newErrors.endDate = 'End date must be after start date';
        }

        if (formData.dailyBudget <= 0) {
            newErrors.dailyBudget = 'Daily budget must be positive';
        }

        if (formData.targetCpi <= 0) {
            newErrors.targetCpi = 'Target CPI must be positive';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleClose = () => {
        setIsClosing(true);
        setTimeout(() => {
            onClose();
            selectCampaign(null);
        }, 150);
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        if (!validateForm()) {
            showToast('Please fix validation errors', 'error');
            return;
        }

        if (isEditing) {
            updateCampaign(selectedCampaignId, formData);
            showToast('Campaign updated successfully', 'success');
        } else {
            addCampaign({
                ...formData,
                id: crypto.randomUUID()
            });
            showToast('Campaign created successfully', 'success');
        }
        handleClose();
    };

    const handleDelete = () => {
        removeCampaign(selectedCampaignId);
        showToast('Campaign deleted', 'success');
        setShowDeleteConfirm(false);
        handleClose();
    };

    const handleDuplicate = () => {
        duplicateCampaign(selectedCampaignId);
        handleClose();
    };

    return (
        <>
            <div
                className={`fixed inset-y-0 right-0 w-96 bg-[#1a1a1a] border-l border-[#27272a] shadow-2xl p-6 overflow-y-auto z-50 ${isClosing ? 'animate-slide-out' : 'animate-slide-in'}`}
            >
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-bold text-white">
                        {isEditing ? 'Edit Campaign' : 'New Campaign'}
                    </h2>
                    <button
                        onClick={handleClose}
                        className="text-gray-400 hover:text-white transition-colors"
                    >
                        ✕
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-400 mb-1">Name</label>
                        <input
                            type="text"
                            value={formData.name}
                            onChange={e => setFormData({ ...formData, name: e.target.value })}
                            className={`w-full bg-[#0a0a0a] border ${errors.name ? 'border-red-500' : 'border-[#27272a]'} rounded-md px-3 py-2 text-white focus:outline-none focus:border-[#6366f1] transition-colors`}
                            required
                        />
                        {errors.name && <p className="text-red-400 text-xs mt-1">{errors.name}</p>}
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-400 mb-1">Start Date</label>
                            <input
                                type="date"
                                value={formData.startDate}
                                onChange={e => setFormData({ ...formData, startDate: e.target.value })}
                                className="w-full bg-[#0a0a0a] border border-[#27272a] rounded-md px-3 py-2 text-white focus:outline-none focus:border-[#6366f1] transition-colors"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-400 mb-1">End Date</label>
                            <input
                                type="date"
                                value={formData.endDate}
                                onChange={e => setFormData({ ...formData, endDate: e.target.value })}
                                className={`w-full bg-[#0a0a0a] border ${errors.endDate ? 'border-red-500' : 'border-[#27272a]'} rounded-md px-3 py-2 text-white focus:outline-none focus:border-[#6366f1] transition-colors`}
                                required
                            />
                            {errors.endDate && <p className="text-red-400 text-xs mt-1">{errors.endDate}</p>}
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-400 mb-1">Daily Budget ($)</label>
                            <input
                                type="number"
                                value={formData.dailyBudget}
                                onChange={e => setFormData({ ...formData, dailyBudget: Number(e.target.value) })}
                                className={`w-full bg-[#0a0a0a] border ${errors.dailyBudget ? 'border-red-500' : 'border-[#27272a]'} rounded-md px-3 py-2 text-white focus:outline-none focus:border-[#6366f1] transition-colors`}
                                min="0"
                                required
                            />
                            {errors.dailyBudget && <p className="text-red-400 text-xs mt-1">{errors.dailyBudget}</p>}
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-400 mb-1">Target CPI ($)</label>
                            <input
                                type="number"
                                value={formData.targetCpi}
                                onChange={e => setFormData({ ...formData, targetCpi: Number(e.target.value) })}
                                className={`w-full bg-[#0a0a0a] border ${errors.targetCpi ? 'border-red-500' : 'border-[#27272a]'} rounded-md px-3 py-2 text-white focus:outline-none focus:border-[#6366f1] transition-colors`}
                                min="0.01"
                                step="0.01"
                                required
                            />
                            {errors.targetCpi && <p className="text-red-400 text-xs mt-1">{errors.targetCpi}</p>}
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-400 mb-1">Platform</label>
                            <select
                                value={formData.platform}
                                onChange={e => setFormData({ ...formData, platform: e.target.value })}
                                className="w-full bg-[#0a0a0a] border border-[#27272a] rounded-md px-3 py-2 text-white focus:outline-none focus:border-[#6366f1] transition-colors"
                            >
                                <option value="ios">iOS</option>
                                <option value="android">Android</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-400 mb-1">Geo</label>
                            <select
                                value={formData.geo}
                                onChange={e => setFormData({ ...formData, geo: e.target.value })}
                                className="w-full bg-[#0a0a0a] border border-[#27272a] rounded-md px-3 py-2 text-white focus:outline-none focus:border-[#6366f1] transition-colors"
                            >
                                <option value="US">US</option>
                                <option value="EU">EU</option>
                                <option value="APAC">APAC</option>
                                <option value="ROW">ROW</option>
                            </select>
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-400 mb-1">Color</label>
                        <div className="flex gap-2">
                            {['#6366f1', '#10b981', '#f59e0b', '#ef4444', '#ec4899', '#8b5cf6'].map(color => (
                                <button
                                    key={color}
                                    type="button"
                                    onClick={() => setFormData({ ...formData, color })}
                                    className={`w-8 h-8 rounded-full border-2 transition-all ${formData.color === color ? 'border-white scale-110' : 'border-transparent hover:scale-105'}`}
                                    style={{ backgroundColor: color }}
                                />
                            ))}
                        </div>
                    </div>

                    <div className="pt-4 space-y-2">
                        <div className="flex gap-3">
                            <button
                                type="submit"
                                className="flex-1 bg-[#6366f1] hover:bg-[#4f46e5] text-white py-2 rounded-md font-medium transition-colors"
                            >
                                {isEditing ? 'Save Changes' : 'Create Campaign'}
                            </button>
                            {isEditing && (
                                <button
                                    type="button"
                                    onClick={handleDuplicate}
                                    className="px-4 bg-[#27272a] hover:bg-[#3f3f46] text-white rounded-md font-medium transition-colors"
                                    title="Duplicate Campaign"
                                >
                                    📋
                                </button>
                            )}
                        </div>
                        {isEditing && (
                            <button
                                type="button"
                                onClick={() => setShowDeleteConfirm(true)}
                                className="w-full bg-red-500/10 text-red-400 hover:bg-red-500/20 py-2 rounded-md font-medium transition-colors"
                            >
                                Delete Campaign
                            </button>
                        )}
                    </div>
                </form>
            </div>

            {/* Backdrop */}
            <div
                className={`fixed inset-0 bg-black/30 backdrop-blur-sm z-40 ${isClosing ? 'animate-fade-out' : 'animate-fade-in'}`}
                onClick={handleClose}
            />

            {/* Delete Confirmation */}
            {showDeleteConfirm && (
                <ConfirmDialog
                    title="Delete Campaign?"
                    message="This action cannot be undone. All campaign data and associated metrics will be removed."
                    confirmText="Delete"
                    cancelText="Cancel"
                    variant="danger"
                    onConfirm={handleDelete}
                    onCancel={() => setShowDeleteConfirm(false)}
                />
            )}
        </>
    );
}
