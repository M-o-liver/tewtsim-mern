import { useRouter } from 'next/navigation'

interface MissionCardProps {
  id: string
  title: string
  description: string
  type: string
  level: string
}

export default function MissionCard({ id, title, description, type, level }: MissionCardProps) {
  const router = useRouter()

  const handleMissionSelect = () => {
    router.push(`/mission/${id}`)
  }

  return (
    <div className="bg-gray-800 p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-semibold mb-2">{title}</h2>
      <p className="text-gray-400 mb-4">{description}</p>
      <div className="flex justify-between items-center mb-4">
        <span className="text-sm text-gray-500">Type: {type}</span>
        <span className="text-sm text-gray-500">Level: {level}</span>
      </div>
      <button
        onClick={handleMissionSelect}
        className="w-full bg-green-700 hover:bg-green-600 text-white font-bold py-2 px-4 rounded transition duration-300"
      >
        Start Mission
      </button>
    </div>
  )
}