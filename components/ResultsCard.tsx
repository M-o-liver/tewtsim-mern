'use client'

import React from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'

interface Result {
  _id: string
  fragO: string
  story: string
  analysis: string
  username: string
  missionId: {
    _id: string
    title: string
  } | null
}

const ResultsCard: React.FC<{ result: Result }> = ({ result }) => {
  const router = useRouter()

  const truncate = (str: string, n: number) => {
    if (str && str.length > n) {
      return (
        <span>
          {str.slice(0, n - 1)}
          <span className="text-green-400 cursor-pointer" title={str}>
            ...
          </span>
        </span>
      )
    }
    return str
  }

  const handleClick = () => {
    router.push(`/results?id=${result._id}`)
  }

  return (
    <motion.div
      onClick={handleClick}
      className="bg-gray-800 p-6 rounded-lg mb-4 shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer hover:bg-gray-700"
      whileHover={{ scale: 1.03 }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <motion.h2
        className="text-2xl font-bold mb-3 text-green-400"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        {result.missionId ? result.missionId.title : 'Untitled Mission'}
      </motion.h2>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
      >
        <p className="mb-2">
          <strong className="text-gray-300">Frag-O:</strong> {truncate(result.fragO, 100)}
        </p>
        <p className="mb-2">
          <strong className="text-gray-300">Story:</strong> {truncate(result.story, 100)}
        </p>
        <p className="mb-2">
          <strong className="text-gray-300">Analysis:</strong> {truncate(result.analysis, 100)}
        </p>
      </motion.div>
      <motion.p
        className="text-gray-400 mt-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
      >
        Submitted by: <span className="font-semibold text-green-400">{result.username}</span>
      </motion.p>
    </motion.div>
  )
}

export default ResultsCard