import { Box } from '@chakra-ui/react'
import { JobApplication } from '../../types/application.types'
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts'

interface ApplicationTimelineChartProps {
  applications: JobApplication[]
}

interface TimelineData {
  date: string
  total: number
  active: number
  offered: number
  rejected: number
}

export default function ApplicationTimelineChart({ applications }: ApplicationTimelineChartProps) {
  const getTimelineData = () => {
    // Sort applications by date
    const sortedApps = [...applications].sort(
      (a, b) => new Date(a.applicationDate).getTime() - new Date(b.applicationDate).getTime()
    )

    if (sortedApps.length === 0) return []

    // Create a map of dates and their counts
    const timelineMap = new Map<string, TimelineData>()
    let runningTotal = 0
    let runningActive = 0
    let runningOffered = 0
    let runningRejected = 0

    sortedApps.forEach(app => {
      const date = new Date(app.applicationDate).toLocaleDateString()
      runningTotal++

      if (['APPLIED', 'INTERVIEWING'].includes(app.status)) {
        runningActive++
      } else if (['OFFERED', 'ACCEPTED'].includes(app.status)) {
        runningOffered++
      } else if (app.status === 'REJECTED') {
        runningRejected++
      }

      timelineMap.set(date, {
        date,
        total: runningTotal,
        active: runningActive,
        offered: runningOffered,
        rejected: runningRejected
      })
    })

    return Array.from(timelineMap.values())
  }

  const data = getTimelineData()

  return (
    <Box h="400px" w="100%">
      <ResponsiveContainer>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis 
            dataKey="date" 
            tick={{ fontSize: 12 }}
            interval="preserveStartEnd"
          />
          <YAxis />
          <Tooltip />
          <Legend />
          <Line
            type="monotone"
            dataKey="total"
            stroke="#4A5568"
            name="Total Applications"
          />
          <Line
            type="monotone"
            dataKey="active"
            stroke="#4299E1"
            name="Active"
          />
          <Line
            type="monotone"
            dataKey="offered"
            stroke="#48BB78"
            name="Offered"
          />
          <Line
            type="monotone"
            dataKey="rejected"
            stroke="#F56565"
            name="Rejected"
          />
        </LineChart>
      </ResponsiveContainer>
    </Box>
  )
} 