const Notifications = () => {
    return(
        <div className="bg-white rounded-lg shadow p-4">
            <h2 className="text-xl font-semibold mb-4">Notificări</h2>
            <ul className="space-y-3">
                <li className="flex items-start gap-3">
                    <span className="text-red-500">🔔</span>
                    <div>
                        <p className="font-medium">Evaluare nouă adăugată</p>
                        <p className="text-gray-500 text-sm">Matematică · 10 Feb 2024</p>
                    </div>
                </li>
                <li className="flex items-start gap-3">
                    <span className="text-yellow-500">⚠️</span>
                    <div>
                        <p className="font-medium">Absență înregistrată</p>
                        <p className="text-gray-500 text-sm">Fizică · 8 Feb 2024</p>
                    </div>
                </li>
                <li className="flex items-start gap-3">
                    <span className="text-green-500">✅</span>
                    <div>
                        <p className="font-medium">Proiect finalizat</p>
                        <p className="text-gray-500 text-sm">Informatica · 5 Feb 2024</p>
                    </div>
                </li>
            </ul>
        </div>
    )
}
export default Notifications;