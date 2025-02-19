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

interface SalaryRangeChartProps {
  applications: JobApplication[]
}

interface SalaryData {
  range: string
  count: number
  averageSuccess: number
}

export default function SalaryRangeChart({ applications }: SalaryRangeChartProps) {
  const getSalaryRangeData = () => {
    const ranges = [
      { min: 0, max: 50000, label: '0-50k' },
      { min: 50000, max: 75000, label: '50-75k' },
      { min: 75000, max: 100000, label: '75-100k' },
      { min: 100000, max: 125000, label: '100-125k' },
      { min: 125000, max: 150000, label: '125-150k' },
      { min: 150000, max: 200000, label: '150-200k' },
      { min: 200000, max: Infinity, label: '200k+' }
    ]

    const rangeData = ranges.map(range => ({
      range: range.label,
      count: 0,
      successful: 0
    }))

    applications.forEach(app => {
      if (!app.salaryMin && !app.salaryMax) return

      const avgSalary = app.salaryMin && app.salaryMax
        ? (app.salaryMin + app.salaryMax) / 2
        : app.salaryMin || app.salaryMax || 0

      const rangeIndex = ranges.findIndex(range => 
        avgSalary >= range.min && avgSalary < range.max
      )

      if (rangeIndex !== -1) {
        rangeData[rangeIndex].count++
        if (['OFFERED', 'ACCEPTED'].includes(app.status)) {
          rangeData[rangeIndex].successful++
        }
      }
    })

    return rangeData
      .map(data => ({
        ...data,
        averageSuccess: data.count > 0 
          ? (data.successful / data.count) * 100 
          : 0
      }))
      .filter(data => data.count > 0)
  }

  const data = getSalaryRangeData()

  return (
    <Box 
      h="400px" 
      w="100%" 
      minH="400px"
      minW="300px"
      position="relative"
    >
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis 
            dataKey="range" 
            tick={{ fontSize: 12 }}
          />
          <YAxis yAxisId="left" />
          <YAxis 
            yAxisId="right" 
            orientation="right"
            tickFormatter={(value) => `${value}%`}
          />
          <Tooltip 
            formatter={(value: number, name: string) => {
              return name === 'averageSuccess' 
                ? `${value.toFixed(1)}%` 
                : value
            }}
          />
          <Legend />
          <Bar 
            yAxisId="left"
            dataKey="count" 
            fill="#4299E1" 
            name="Number of Applications"
          />
          <Bar 
            yAxisId="right"
            dataKey="averageSuccess" 
            fill="#48BB78" 
            name="Success Rate"
          />
        </BarChart>
      </ResponsiveContainer>
    </Box>
  )
} 