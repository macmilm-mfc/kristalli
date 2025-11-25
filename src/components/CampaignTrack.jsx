import { motion } from 'framer-motion';
import { differenceInDays, parseISO, startOfDay } from 'date-fns';

export function CampaignTrack({ campaign, startDate, onUpdate, onSelect }) {
    const campaignStart = parseISO(campaign.startDate);
    const campaignEnd = parseISO(campaign.endDate);
    const timelineStart = startOfDay(startDate);

    const startOffset = differenceInDays(campaignStart, timelineStart);
    const duration = differenceInDays(campaignEnd, campaignStart) + 1;

    // 1 day = 20px width
    const PIXELS_PER_DAY = 20;

    return (
        <motion.div
            drag="x"
            dragMomentum={false}
            onDragEnd={(event, info) => {
                const daysMoved = Math.round(info.offset.x / PIXELS_PER_DAY);
                if (daysMoved !== 0) {
                    onUpdate(daysMoved);
                }
            }}
            onClick={(e) => {
                // Prevent click when dragging
                if (Math.abs(e.movementX) < 2) {
                    onSelect();
                }
            }}
            className="absolute h-12 rounded-lg flex items-center px-3 text-sm font-medium shadow-lg cursor-grab active:cursor-grabbing"
            style={{
                left: startOffset * PIXELS_PER_DAY,
                width: duration * PIXELS_PER_DAY,
                backgroundColor: campaign.color,
                color: '#fff',
                top: 0
            }}
            whileHover={{ scale: 1.02, zIndex: 10 }}
            whileTap={{ scale: 0.98 }}
        >
            <div className="truncate">
                {campaign.name}
            </div>
        </motion.div>
    );
}
