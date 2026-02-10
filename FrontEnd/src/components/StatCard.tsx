type Props = {
    title: string;
    value: string;
};

const StatCard = ({ title, value }: Props) => (
    <div className="bg-white rounded-xl p-4 shadow-sm">
        <p className="text-gray-500 text-sm">{title}</p>
        <p className="text-2xl font-semibold mt-2">{value}</p>
    </div>
);

export default StatCard;
