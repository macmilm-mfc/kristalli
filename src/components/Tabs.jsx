export function Tabs({ tabs, activeTab, onTabChange }) {
    return (
        <div className="flex space-x-1 bg-[#1a1a1a] p-1 rounded-lg border border-[#27272a] mb-6 w-fit">
            {tabs.map((tab) => (
                <button
                    key={tab.id}
                    onClick={() => onTabChange(tab.id)}
                    className={`
                        px-4 py-2 rounded-md text-sm font-medium transition-all duration-200
                        ${activeTab === tab.id
                            ? 'bg-[#6366f1] text-white shadow-lg'
                            : 'text-gray-400 hover:text-white hover:bg-[#27272a]'
                        }
                    `}
                >
                    {tab.label}
                </button>
            ))}
        </div>
    );
}
