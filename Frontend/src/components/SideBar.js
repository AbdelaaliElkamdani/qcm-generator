import React, { useState } from "react";
import { FilePlus, History, User, ClipboardCheck, ChevronLeft, ChevronRight } from "lucide-react";

const SideBar = () => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [showHistory, setShowHistory] = useState(false);

  const toggleSidebar = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <aside className={`sidebar ${isExpanded ? "expanded" : "collapsed"}`}>
      {/* Bouton pour basculer le menu */}
      <button className="toggle-btn" onClick={toggleSidebar}>
        {isExpanded ? <ChevronLeft size={24} /> : <ChevronRight size={24} />}
      </button>

      {/* Logo */}
      <div className="logo-container">
        <div className="logo-icon">
          <img src="/genqcm.png" alt="Logo" />
        </div>
        {isExpanded && <span className="logo-text">GenQcm</span>}
      </div>

      {/* Navigation */}
      <div className="nav-links">
        <ul>
          <li>
            <FilePlus size={28} />
            {isExpanded && "Nouveau QCM"}
          </li>
          <li>
            <ClipboardCheck size={28} />
            {isExpanded && "Corriger QCM"}
          </li>
          <li onClick={() => setShowHistory(!showHistory)} className="cursor-pointer">
            <History size={28} />
            {isExpanded && "Historique"}
          </li>
        </ul>
      </div>

      {/* Historique */}
      <nav className={`history ${showHistory ? "show" : ""} scroll`}>
        {isExpanded && (
          <>
            <h3 className="history-title">Aujourd'hui</h3>
            <ul>
              <li>home</li>
              <li>new achat</li>
              <li>jhduygyuwe</li>
            </ul>

            <h3 className="history-title">20 Jours</h3>
            <ul>
              <li>home</li>
              <li>new achat</li>
              <li>jhduygyuwe</li>
            </ul>
          </>
        )}
      </nav>
    </aside>
  );
};

export default SideBar;
