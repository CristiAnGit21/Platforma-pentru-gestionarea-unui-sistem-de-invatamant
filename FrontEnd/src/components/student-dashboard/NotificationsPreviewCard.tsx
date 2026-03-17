import SectionCard from "./SectionCard";
import type { NotificationTag, StudentNotification } from "./types";

type Props = {
    notifications: StudentNotification[];
    onOpenAll: () => void;
};

const tagStyle: Record<NotificationTag, string> = {
    Note: "bg-emerald-50 text-emerald-700 border-emerald-200",
    Alerte: "bg-amber-50 text-amber-700 border-amber-200",
    Orar: "bg-blue-50 text-blue-700 border-blue-200",
    Financiar: "bg-violet-50 text-violet-700 border-violet-200",
    Absente: "bg-red-50 text-red-700 border-red-200",
};

const NotificationsPreviewCard = ({ notifications, onOpenAll }: Props) => {
    return (
        <SectionCard title="Notificari" actionLabel="Toate ->" onAction={onOpenAll}>
            <div className="space-y-3">
                {notifications.map((notification) => (
                    <div key={`${notification.title}-${notification.time}`} className="rounded-2xl border border-gray-100 p-4">
                        <div className="flex items-start justify-between gap-3">
                            <div className="min-w-0">
                                <div className="flex items-center gap-2">
                                    <span className={`inline-flex rounded-full border px-2 py-0.5 text-xs font-semibold ${tagStyle[notification.tag]}`}>
                                        {notification.tag}
                                    </span>
                                    {notification.unread && <span className="h-2 w-2 rounded-full bg-violet-500" />}
                                </div>
                                <p className="mt-2 font-semibold text-gray-900 truncate">{notification.title}</p>
                                <p className="mt-1 text-sm text-gray-500">{notification.description}</p>
                            </div>
                            <p className="shrink-0 text-xs text-gray-400">{notification.time}</p>
                        </div>
                    </div>
                ))}
            </div>
        </SectionCard>
    );
};

export default NotificationsPreviewCard;
