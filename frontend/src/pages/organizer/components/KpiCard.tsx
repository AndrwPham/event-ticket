import { FC, ReactNode } from "react";

interface KpiCardProps {
    title: string;
    value: string | number;
    icon: ReactNode;
    color: string;
}

const KpiCard: FC<KpiCardProps> = ({ title, value, icon, color }) => {
    return (
        <div className="bg-white p-6 rounded-lg shadow-md flex items-center gap-6">
            <div
                className={`w-12 h-12 rounded-full flex items-center justify-center ${color}`}
            >
                {icon}
            </div>
            <div>
                <p className="text-sm text-gray-500 font-medium">{title}</p>
                <p className="text-2xl font-bold text-gray-800">{value}</p>
            </div>
        </div>
    );
};

export default KpiCard;