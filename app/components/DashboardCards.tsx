import { ChevronLeft, ChevronRight } from 'lucide-react';

export default function DashboardCards() {
  const cards = [
    {
      title: 'Samples Received',
      today: '0',
      period: 'September: 179',
      bgColor: 'bg-blue-100',
      textColor: 'text-blue-800'
    },
    {
      title: 'Plan / Draft',
      today: '0',
      period: 'Pending: 256',
      bgColor: 'bg-green-100',
      textColor: 'text-green-800'
    },
    {
      title: 'Samples / Reports',
      today: '0',
      period: 'September: 77',
      pending: 'Pending: 291',
      bgColor: 'bg-red-100',
      textColor: 'text-red-800'
    }
  ];

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-4">
        <button className="p-2 hover:bg-gray-100 rounded-full">
          <ChevronLeft className="w-5 h-5 text-gray-400" />
        </button>
        <button className="p-2 hover:bg-gray-100 rounded-full">
          <ChevronRight className="w-5 h-5 text-gray-400" />
        </button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {cards.map((card, index) => (
          <div key={index} className={`${card.bgColor} rounded-lg p-6`}>
            <h3 className={`font-semibold text-lg ${card.textColor} mb-4`}>
              {card.title}
            </h3>
            <div className={`space-y-2 ${card.textColor}`}>
              <p className="text-sm">Today: {card.today}</p>
              <p className="text-sm">{card.period}</p>
              {card.pending && (
                <p className="text-sm">{card.pending}</p>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
