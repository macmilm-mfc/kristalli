import { Timeline } from './Timeline';

export function CampaignPlanner() {
    return (
        <div className="space-y-6">
            <div className="bg-[#1a1a1a] rounded-xl border border-[#27272a] p-6">
                <h3 className="text-xl font-bold text-white mb-4">Campaign Planner</h3>
                <p className="text-gray-400 mb-6">
                    Drag campaigns to reschedule them. Click on a campaign to edit its details.
                </p>
                <Timeline />
            </div>
        </div>
    );
}
