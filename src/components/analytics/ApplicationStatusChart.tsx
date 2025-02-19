import { Box, useColorModeValue } from '@chakra-ui/react'
import { JobApplication } from '../../types/application.types'
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts'

interface ApplicationStatusChartProps {
  applications: JobApplication[]
}

export default function ApplicationStatusChart({ applications }: ApplicationStatusChartProps) {
  const getStatusData = () => {
    const statusCount = applications.reduce((acc, app) => {
      acc[app.status] = (acc[app.status] || 0) + 1
      return acc
    }, {} as Record<string, number>)

    return Object.entries(statusCount).map(([status, count]) => ({
      name: status,
      value: count
    }))
  }

  const COLORS = {
    DRAFT: '#CBD5E0',      // gray.300
    APPLIED: '#4299E1',    // blue.400
    INTERVIEWING: '#805AD5', // purple.500
    OFFERED: '#48BB78',    // green.400
    ACCEPTED: '#38A169',   // green.500
    REJECTED: '#F56565',   // red.400
    WITHDRAWN: '#A0AEC0'   // gray.400
  }

  const data = getStatusData()

  return (
    <Box h="300px" w="100%">
      <ResponsiveContainer>
        <PieChart>
          <Pie
            data={data}
            dataKey="value"
            nameKey="name"
            cx="50%"
            cy="50%"
            outerRadius={80}
            fill="#8884d8"
            label={({ name, percent }) => 
              `${name} ${(percent * 100).toFixed(0)}%`
            }
          >
            {data.map((entry, index) => (
              <Cell 
                key={`cell-${index}`} 
                fill={COLORS[entry.name as keyof typeof COLORS]} 
              />
            ))}
          </Pie>
          <Tooltip />
          <Legend verticalAlign="bottom" height={36} />
        </PieChart>
      </ResponsiveContainer>
    </Box>
  )
} 