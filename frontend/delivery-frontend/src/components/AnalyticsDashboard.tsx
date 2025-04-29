// src/pages/AnalyticsPage.tsx
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

type DeliveryStatus = "Assigned" | "Pending" | "In Transit" | "Delivered";
interface Delivery  { _id: string; driverId?: string; status: DeliveryStatus; createdAt: string; }
interface Driver    { _id: string; name: string; }
interface Summary   { total: number; completed: number; pending: number; inTransit: number; successRate: string; }
interface StatusData{ name: string; value: number; }
interface TrendData { date: string; count: number; }
interface DriverData{ driver: string; count: number; }

export default function AnalyticsPage() {
  const navigate = useNavigate();
  const [summary, setSummary]         = useState<Summary>({ total:0, completed:0, pending:0, inTransit:0, successRate:'0%' });
  const [statusData, setStatusData]   = useState<StatusData[]>([]);
  const [trendData, setTrendData]     = useState<TrendData[]>([]);
  const [driverData, setDriverData]   = useState<DriverData[]>([]);

  useEffect(() => {
    async function fetchStats() {
      try {
        const [delRes, drvRes] = await Promise.all([
          axios.get<Delivery[]>('/api/delivery'),
          axios.get<Driver[]>  ('/api/drivers'),
        ]);
        const deliveries = delRes.data;
        const drivers    = drvRes.data;

        const total     = deliveries.length;
        const completed = deliveries.filter(d => d.status==='Delivered').length;
        const pending   = deliveries.filter(d => d.status==='Pending').length;
        const inTransit = deliveries.filter(d => d.status==='In Transit').length;

        setSummary({
          total, completed, pending, inTransit,
          successRate: total ? `${Math.round((completed/total)*100)}%` : '0%'
        });

        setStatusData([
          { name:'Delivered',  value: completed },
          { name:'In Transit', value: inTransit },
          { name:'Pending',    value: pending }
        ]);

        const byDate: Record<string, number> = {};
        deliveries.forEach(d => {
          const day = d.createdAt.slice(0,10);
          byDate[day] = (byDate[day]||0) + 1;
        });
        setTrendData(Object.entries(byDate).map(([date,count])=>({ date, count })));

        const countMap: Record<string,number> = {};
        deliveries.forEach(d => {
          if (d.status==='Delivered' && d.driverId) {
            countMap[d.driverId] = (countMap[d.driverId]||0) + 1;
          }
        });
        setDriverData(drivers.map(dr=>({
          driver: dr.name,
          count:  countMap[dr._id]||0
        })));

      } catch(err) {
        console.error('Analytics fetch error:', err);
      }
    }
    fetchStats();
  }, []);

  const COLORS = ['#28a745','#ffc107','#dc3545'];

  return (
    <div style={container}>
      <header style={header}>
        <button onClick={()=>navigate('/')} style={backBtn}>← Dashboard</button>
        <h1 style={headerTitle}>📊 Analytics</h1>
      </header>

      <main style={main}>
        {/* summary cards */}
        <div style={cardRow}>
          {[
            { label:'Total Deliveries', value:summary.total },
            { label:'Completed',        value:summary.completed },
            { label:'Pending',          value:summary.pending },
            { label:'In Transit',       value:summary.inTransit },
            { label:'Success Rate',     value:summary.successRate }
          ].map((c,i)=>
            <div key={i} style={statCard}>
              <h4 style={statLabel}>{c.label}</h4>
              <p style={statValue}>{c.value}</p>
            </div>
          )}
        </div>

        {/* charts */}
        <div style={chartRow}>
          <ResponsiveContainer width="30%" height={280}>
            <PieChart>
              <Pie data={statusData} dataKey="value" nameKey="name" innerRadius={50} outerRadius={90} label>
                {statusData.map((_,i)=><Cell key={i} fill={COLORS[i]}/>)}
              </Pie>
              <ReTooltip/>
              <ReLegend verticalAlign="bottom" height={36}/>
            </PieChart>
          </ResponsiveContainer>

          <ResponsiveContainer width="70%" height={280}>
            <LineChart data={trendData}>
              <XAxis dataKey="date"/>
              <YAxis/>
              <ReTooltip/>
              <Line type="monotone" dataKey="count" stroke="#0288d1" strokeWidth={2}/>
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* driver utilization */}
        <section style={{ marginTop:40 }}>
          <h2>Driver Utilization</h2>
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={driverData} margin={{ bottom:50, top:10 }}>
              <XAxis dataKey="driver" angle={-45} textAnchor="end" interval={0} height={60}/>
              <YAxis/>
              <ReTooltip/>
              <Bar dataKey="count" fill="#28a745"/>
            </BarChart>
          </ResponsiveContainer>
        </section>
      </main>

      <footer style={footer}>© 2025 Delivery Dashboard</footer>
    </div>
  );
}

// --- Layout ---
const container: React.CSSProperties = {
  display: "flex", flexDirection: "column", minHeight: "100vh", fontFamily: "Arial, sans-serif"
};
const header:    React.CSSProperties = {
  display:"flex", alignItems:"center", background:"#e1f5fe", padding:"12px 24px", gap:16
};
const backBtn:   React.CSSProperties = {
  background:"#6c757d", color:"#fff", border:"none", padding:"8px 12px", borderRadius:4, cursor:"pointer"
};
const headerTitle: React.CSSProperties = { margin:0, color:"#01579b" };
const main:      React.CSSProperties = { flex:1, padding:24, background:"#fafafa" };
const footer:    React.CSSProperties = {
  background:"#e1f5fe", padding:"12px", textAlign:"center"
};

// stats
const cardRow:   React.CSSProperties = { display:"flex", gap:20, flexWrap:"wrap", marginBottom:40 };
const statCard:  React.CSSProperties = {
  flex:1, minWidth:140, background:"#fff", padding:20, borderRadius:8, boxShadow:"0 2px 8px rgba(0,0,0,0.1)"
};
const statLabel: React.CSSProperties = { margin:0, color:"#555" };
const statValue: React.CSSProperties = { margin:"8px 0 0", fontSize:24, fontWeight:"bold" };

// charts
const chartRow:  React.CSSProperties = { display:"flex", gap:40, flexWrap:"wrap" };
