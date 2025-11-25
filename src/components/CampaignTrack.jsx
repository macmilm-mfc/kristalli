import { differenceInDays, parseISO, startOfDay } from 'date-fns';

export function CampaignTrack({ campaign, startDate, onUpdate, onSelect }) {
    const campaignStart = parseISO(campaign.startDate);
    const campaignEnd = parseISO(campaign.endDate);
    const timelineStart = startOfDay(startDate);

    const startOffset = differenceInDays(campaignStart, timelineStart);
    const duration = differenceInDays(campaignEnd, campaignStart) + 1;

    // 1 day = 20px width
    const PIXELS_PER_DAY = 20;

    const leftPos = startOffset * PIXELS_PER_DAY;
    const widthPx = duration * PIXELS_PER_DAY;

    // Debug logging
    console.log('CampaignTrack render:', {
        name: campaign.name,
        startOffset,
        duration,
        leftPos,
        widthPx,
        color: campaign.color
    });

    return (
        <div
            onClick={onSelect}
            className="absolute h-12 rounded-lg flex items-center px-3 text-sm font-medium shadow-lg cursor-pointer hover:opacity-90 transition-opacity"
            style={{
                left: `${leftPos}px`,
                width: `${widthPx}px`,
                backgroundColor: campaign.color,
                color: '#fff',
                top: 0,
                minWidth: '40px', // Ensure visibility even for short campaigns
            }}
        >
            <div className="truncate font-semibold">
                {campaign.name}
            </div>
        </div>
    );
}
