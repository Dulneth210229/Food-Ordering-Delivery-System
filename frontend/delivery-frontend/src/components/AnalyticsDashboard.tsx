// src/components/AnalyticsDashboard.tsx

import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip as ReTooltip,
  PieChart,
  Pie,
  Cell,
  Legend as ReLegend,
  BarChart,
  Bar
} from "recharts";

// Data interfaces
type DeliveryStatus = "Assigned" | "Pending" | "In Transit" | "Delivered";
interface Delivery {
  _id: string;
  driverId?: string;
  status: DeliveryStatus;
  createdAt: string;
}
interface Driver { _id: string; name: string; }
interface Summary {
  total: number;
  completed: number;
  pending: number;
  inTransit: number;
  successRate: string;
}
interface StatusData { name: string; value: number; }
interface TrendData  { date: string; count: number; }
interface DriverData { driver: string; count: number; }

export default function AnalyticsDashboard() {
  const navigate = useNavigate();

  const [summary, setSummary]       = useState<Summary>({ total:0, completed:0, pending:0, inTransit:0, successRate:"0%" });
  const [statusData, setStatusData] = useState<StatusData[]>([]);
  const [trendData, setTrendData]   = useState<TrendData[]>([]);
  const [driverData, setDriverData] = useState<DriverData[]>([]);

  useEffect(() => {
    async function fetchStats() {
      try {
        const [delRes, drvRes] = await Promise.all([
          axios.get<Delivery[]>('/api/delivery'),
          axios.get<Driver[]>('/api/drivers')
        ]);
        const deliveries = delRes.data;
        const drivers    = drvRes.data;

        const total     = deliveries.length;
        const completed = deliveries.filter(d => d.status === 'Delivered').length;
        const pending   = deliveries.filter(d => d.status === 'Pending').length;
        const inTransit = deliveries.filter(d => d.status === 'In Transit').length;

        setSummary({
          total,
          completed,
          pending,
          inTransit,
          successRate: total ? `${Math.round((completed/total)*100)}%` : '0%'
        });

        setStatusData([
          { name: 'Delivered',  value: completed },
          { name: 'In Transit', value: inTransit },
          { name: 'Pending',    value: pending }
        ]);

        // Trend by day
        const byDate: Record<string, number> = {};
        deliveries.forEach(d => {
          const day = d.createdAt.slice(0,10);
          byDate[day] = (byDate[day] || 0) + 1;
        });
        setTrendData(
          Object.entries(byDate).map(([date, count]) => ({ date, count }))
        );

        // Driver utilization: include all drivers
        const countMap: Record<string, number> = {};
        deliveries.forEach(d => {
          if (d.status === 'Delivered' && d.driverId) {
            countMap[d.driverId] = (countMap[d.driverId] || 0) + 1;
          }
        });
        const utilization = drivers.map(dr => ({
          driver: dr.name,
          count: countMap[dr._id] || 0
        }));
        setDriverData(utilization);

      } catch (err) {
        console.error('Analytics fetch error:', err);
      }
    }
    fetchStats();
  }, []);

  const COLORS = ['#28a745','#ffc107','#dc3545'];

  return (
    <div style={{ padding:20, fontFamily:'Arial, sans-serif' }}>
      <button
        onClick={() => navigate(-1)}
        style={{ marginBottom:20, padding:'8px 16px', background:'#6c757d', color:'#fff', border:'none', borderRadius:4, cursor:'pointer' }}
      >
        ← Back to Dashboard
      </button>

      {/* Summary cards */}
      <div style={{ display:'flex', gap:20, marginBottom:40 }}>
        {[
          { label:'Total Deliveries', value: summary.total },
          { label:'Completed',        value: summary.completed },
          { label:'Pending',          value: summary.pending },
          { label:'In Transit',       value: summary.inTransit },
          { label:'Success Rate',     value: summary.successRate }
        ].map((card,i) => (
          <div key={i} style={{ flex:1, padding:20, background:'#fff', borderRadius:8, boxShadow:'0 2px 8px rgba(0,0,0,0.1)' }}>
            <h4 style={{ margin:0, color:'#555' }}>{card.label}</h4>
            <p style={{ fontSize:24, fontWeight:'bold', margin:'8px 0 0' }}>{card.value}</p>
          </div>
        ))}
      </div>

      {/* Charts */}
      <div style={{ display:'flex', gap:40, marginBottom:40 }}>
        <ResponsiveContainer width='30%' height={300}>
          <PieChart>
            <Pie data={statusData} dataKey='value' nameKey='name' innerRadius={60} outerRadius={100} label>
              {statusData.map((_,idx) => <Cell key={idx} fill={COLORS[idx]} />)}
            </Pie>
            <ReTooltip />
            <ReLegend verticalAlign='bottom' height={36} />
          </PieChart>
        </ResponsiveContainer>

        <ResponsiveContainer width='70%' height={300}>
          <LineChart data={trendData}>
            <XAxis dataKey='date' />
            <YAxis />
            <ReTooltip />
            <Line type='monotone' dataKey='count' stroke='#007bff' strokeWidth={2} />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Driver utilization */}
      <div>
        <h3>Driver Utilization</h3>
        <ResponsiveContainer width='100%' height={300}>
          <BarChart data={driverData} margin={{ top:20, right:30, left:20, bottom:50 }}>
            <XAxis dataKey='driver' angle={-45} textAnchor='end' interval={0} height={60} />
            <YAxis />
            <ReTooltip />
            <Bar dataKey='count' fill='#28a745' />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
