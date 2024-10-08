import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'

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
    <motion.div
      whileHover={{ scale: 1.05 }}
      transition={{ type: "spring", stiffness: 300 }}
      className="bg-gray-800 p-6 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 group"
    >
      <h2 className="text-2xl font-bold mb-3 text-green-400 group-hover:text-green-300 transition-colors duration-300">{title}</h2>
      <p className="text-gray-300 mb-4 group-hover:text-gray-100 transition-colors duration-300">{description}</p>
      <div className="flex justify-between items-center mb-4">
        <motion.span 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-sm text-gray-400 group-hover:text-gray-200 transition-colors duration-300"
        >
          Type: {type}
        </motion.span>
        <motion.span 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="text-sm text-gray-400 group-hover:text-gray-200 transition-colors duration-300"
        >
          Level: {level}
        </motion.span>
      </div>
      <button
        onClick={handleMissionSelect}
        className="w-full bg-green-600 hover:bg-green-500 focus:bg-green-700 text-white font-bold py-3 px-4 rounded-lg transition duration-300 focus:outline-none focus:ring-2 focus:ring-green-400 focus:ring-opacity-50 transform hover:scale-105 active:scale-95"
        aria-label={`Start ${title} mission`}
      >
        Start Mission
      </button>
    </motion.div>
  )
}