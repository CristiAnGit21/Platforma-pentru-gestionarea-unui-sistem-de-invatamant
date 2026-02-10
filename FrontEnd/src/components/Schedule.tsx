const TodaySchedule = () => {
    <div className="bg-white rounded-x1 p-4 shadow-sm">
        <h2 className="text-xl font-semibold mb-4">Orar pentru astăzi</h2>
       <ul className="space-y-3">
              <li className="flex justify-between">
            <span> 08:00 Programrea orientata pe obiect</span>
            <span className="text-gray-500">Sala 101</span>
        </li>
        <li className="flex justify-between bg-violet-50 p-2 rounded">
            <span> 10:00 Baze de date</span>
            <span className="text-gray-500">Sala 202</span>
        </li>
        <li className="flex justify-between">
            <span> 12:00 Sisteme de operare</span>
            <span className="text-gray-500">Sala 303</span>
        </li>
       </ul>
    </div>
}
export default TodaySchedule;