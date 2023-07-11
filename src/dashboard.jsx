import './dashboard.css';

import cmulogo from './image/cmulogo.png';

export default function Dashboard() {
  return (
    <div className='framenavbar'>
      <div className="navbar">
        <img className="cmulogo" src={cmulogo} alt="CMU Logo" />
        <div className='innernavbar'>
          {/* Inner Navbar Content */}
        </div>
      </div>
    </div>
  );
}
