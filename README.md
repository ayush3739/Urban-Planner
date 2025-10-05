# 🌍 NASA Urban Air Quality Simulator

Real-time air quality monitoring and disaster alert system powered by NASA satellite data.

**Live Demo**: [https://github.com/ayush3739/Urban-Planner](https://github.com/ayush3739/Urban-Planner)

## Features

- **Global Air Quality Monitor**: Track air quality across 29 major cities worldwide
- **1,000+ Monitoring Stations**: Real-time data from OpenAQ network
- **NASA Satellite Integration**: Fire detection, temperature analysis, and environmental monitoring
- **Interactive Dashboards**: City-specific insights with historical trends
- **Smart Recommendations**: Personalized health and safety guidance
- **Disaster Alerts**: Real-time notifications for fires, floods, storms, and heatwaves

## Tech Stack

- Next.js 15 with App Router
- TypeScript
- Tailwind CSS
- shadcn/ui Components
- Leaflet.js for Maps
- Recharts for Data Visualization

## Data Sources

- **NASA POWER**: Temperature and meteorological data
- **NASA FIRMS**: Active fire detection via VIIRS satellite
- **OpenAQ**: Global air quality measurements
- **Google Maps**: Geocoding and visualization

## Getting Started

1. Clone the repository:
```bash
git clone https://github.com/ayush3739/Urban-Planner.git
cd Urban-Planner
```

2. Install dependencies:
```bash
npm install
3. Run the development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000)

## Project Structure

```
app/
├── api/              # API routes for data fetching
├── dashboard/        # City dashboards and visualizations
├── global-monitor/   # Global air quality overview
├── alerts/           # Disaster alerts and warnings
└── recommendations/  # Health and safety guidance

components/
├── ui/              # Reusable UI components
├── dashboard/       # Dashboard widgets
└── charts/          # Data visualization components
```

## Performance

- First load: 2-5 seconds
- Cached loads: <100ms
- 1,000+ monitoring stations
- Real-time NASA satellite data

## License

MIT License - feel free to use this project for your own purposes.

## Acknowledgments

- NASA for satellite data APIs
- OpenAQ for air quality measurements
- Next.js and Vercel teams

---

**Made by FutureFrame**
