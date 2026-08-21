import React from 'react'
import StatsCards from './_components/StatsCards'
import RevenueChartCard from './_components/RevenueChartCard'
import ApprovalsAndJobListings from './_components/ApprovalsAndJobListings'

const page = () => {
  return (
    <div>
        <StatsCards/>
        <RevenueChartCard/>
        <ApprovalsAndJobListings/>
        
    </div>
  )
}

export default page