// /react-app/src/components/sidebar/SidebarComponent.tsx
import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import {
  FaChartBar,
  FaInbox,
  FaUserCog,
  FaServer,
  FaFileAlt,
  FaSearch,
  FaBullhorn,
  FaWhatsapp,
  FaAngleLeft,
  FaAngleRight
} from 'react-icons/fa';
import { IconType } from 'react-icons'; // Correct import
import './SidebarStyles.css';

const SIDEBAR_ICONS = { /* ... your icons ... */ };

interface SidebarItem {
  title: string;
  path: string;
  icon: IconType; // Correct usage of IconType
  subItems?: SidebarItem[];
}

const SidebarComponent: React.FC = () => {
  const [collapsed, setCollapsed] = useState<boolean>(false);
  const sidebarItems: SidebarItem[] = [ /* ... your items ... */ ];

  const toggleCollapse = () => {
    setCollapsed(!collapsed);
  };

  return (
      <div className={`sidebar ${collapsed ? 'collapsed' : ''}`}>
        <div className="sidebar-header">
          <h3>{collapsed ? 'AD' : 'Astro Dashboard'}</h3>
          <button onClick={toggleCollapse} className="collapse-btn">
            {/* This usage is standard and should work */}
            {/*<span>{collapsed ? <FaAngleRight /> : <FaAngleLeft />}</span>*/}
          </button>
        </div>
        <nav className="sidebar-nav">
          <ul>
            {sidebarItems.map((item, index) => {
              const IconComponent = item.icon; // This is correct
              return (
                  <li key={index}>
                    <NavLink
                        to={item.path}
                        className={({ isActive }) => (isActive ? 'active' : '')}
                    >
                  <span className="icon">
                    {/*<IconComponent /> /!* This is correct *!/*/}
                  </span>
                      {!collapsed && <span className="title">{item.title}</span>}
                    </NavLink>
                  </li>
              );
            })}
          </ul>
        </nav>
      </div>
  );
};

export default SidebarComponent;
