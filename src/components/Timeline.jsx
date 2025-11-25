import { useRef } from 'react';
import { addDays, format, startOfDay } from 'date-fns';
import { CampaignTrack } from './CampaignTrack';
import { useStore } from '../lib/store';

export function Timeline() {
    const { campaigns, updateCampaign, selectCampaign } = useStore();
    const containerRef = useRef(null);

    // Timeline starts today for now
    const timelineStart = startOfDay(new Date());
    const daysToShow = 90; // Show 3 months
    const PIXELS_PER_DAY = 20;

    const handleCampaignMove = (id, daysMoved) => {
        const campaign = campaigns.find(c => c.id === id);
        if (!campaign) return;

        const newStart = addDays(new Date(campaign.startDate), daysMoved);
        const newEnd = addDays(new Date(campaign.endDate), daysMoved);

        updateCampaign(id, {
            startDate: format(newStart, 'yyyy-MM-dd'),
            endDate: format(newEnd, 'yyyy-MM-dd')
        });
    };

    return (
        <div className="w-full overflow-x-auto bg-[#1a1a1a] border border-[#27272a] rounded-xl p-4">
            <div className="mb-4 flex justify-between items-center">
                <h3 className="text-xl font-bold text-white">Campaign Timeline</h3>
                <span className="text-sm text-gray-400">Drag to reschedule</span>
            </div>

            <div
                ref={containerRef}
                className="relative"
                style={{
                    width: daysToShow * PIXELS_PER_DAY,
                    height: campaigns.length * 60 + 40
                }}
            >
                {/* Grid Lines */}
                {Array.from({ length: daysToShow }).map((_, i) => (
                    <div
                        key={i}
                        className="absolute top-0 bottom-0 border-l border-[#27272a]"
                        style={{ left: i * PIXELS_PER_DAY }}
                    >
                        {i % 7 === 0 && (
                            <span className="absolute -top-6 text-[10px] text-gray-500 whitespace-nowrap">
                                {format(addDays(timelineStart, i), 'MMM d')}
                            </span>
                        )}
                    </div>
                ))}

                {/* Campaign Tracks */}
                {campaigns.map((campaign, index) => (
                    <div
                        key={campaign.id}
                        className="absolute w-full"
                        style={{ top: index * 60 }} // Stack vertically
                    >
                        <CampaignTrack
                            campaign={campaign}
                            startDate={timelineStart}
                            onUpdate={(daysMoved) => handleCampaignMove(campaign.id, daysMoved)}
                            onSelect={() => selectCampaign(campaign.id)}
                        />
                    </div>
                ))}
            </div>
        </div>
    );
}
