import React from 'react'

export const StatCard = ({title,value,unit,icon}) => {
  return (
    <div className="card border border-base-300 bg-base-100 shadow-sm">
    <div className="card-body">

  <div className="flex items-center justify-between">
    <p className='text-sm font-medium text-base-content/60'>{title}</p>
   <span className="text-2xl">{icon}</span>
  </div>
<div className="flex items-baseline gap-2">
      <h2 className="text-3xl font-bold">{value}</h2>
      <span className="text-sm text-base-content/60">{unit}</span>
    </div>
    </div>
    </div>
  )
}
