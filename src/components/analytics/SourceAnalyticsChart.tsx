import { Box } from '@chakra-ui/react'
import { JobApplication } from '../../types/application.types'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts'

interface SourceAnalyticsChartProps {
  applications: JobApplication[]
}

interface SourceData {
  source: string
  total: number
  successful: number
  pending: number
  rejected: number
  successRate: number
}

export default function SourceAnalyticsChart({ applications }: SourceAnalyticsChartProps) {
  const getSourceData = () => {
    const sourceMap = new Map<string, SourceData>()

    applications.forEach(app => {
      const source = app.source || 'Other'
      const currentData = sourceMap.get(source) || {
        source,
        total: 0,
        successful: 0,
        pending: 0,
        rejected: 0,
        successRate: 0
      }

      currentData.total++

      if (['OFFERED', 'ACCEPTED'].includes(app.status)) {
        currentData.successful++
      } else if (['APPLIED', 'INTERVIEWING'].includes(app.status)) {
        currentData.pending++
      } else if (app.status === 'REJECTED') {
        currentData.rejected++
      }

      currentData.successRate = (currentData.successful / currentData.total) * 100

      sourceMap.set(source, currentData)
    })

    return Array.from(sourceMap.values())
      .sort((a, b) => b.total - a.total)
      .slice(0, 10) // Show top 10 sources
  }

  const data = getSourceData()

  return (
    <Box h="400px" w="100%">
      <ResponsiveContainer>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis 
            dataKey="source" 
            tick={{ fontSize: 12 }}
            interval={0}
            angle={-45}
            textAnchor="end"
          />
          <YAxis yAxisId="left" />
          <YAxis 
            yAxisId="right" 
            orientation="right"
            tickFormatter={(value) => `${value}%`}
          />
          <Tooltip 
            formatter={(value: number, name: string) => {
              return name === 'successRate' 
                ? `${value.toFixed(1)}%` 
                : value
            }}
          />
          <Legend />
          <Bar 
            yAxisId="left"
            dataKey="total" 
            fill="#4A5568" 
            name="Total"
          />
          <Bar 
            yAxisId="left"
            dataKey="successful" 
            fill="#48BB78" 
            name="Successful"
          />
          <Bar 
            yAxisId="left"
            dataKey="pending" 
            fill="#4299E1" 
            name="Pending"
          />
          <Bar 
            yAxisId="left"
            dataKey="rejected" 
            fill="#F56565" 
            name="Rejected"
          />
          <Bar 
            yAxisId="right"
            dataKey="successRate" 
            fill="#805AD5" 
            name="Success Rate"
          />
        </BarChart>
      </ResponsiveContainer>
    </Box>
  )
} 