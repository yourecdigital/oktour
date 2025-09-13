import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import styled from 'styled-components';
import AdminLayout from './AdminLayout';
import ToursEditor from './ToursEditor';
import HotelsEditor from './HotelsEditor';
import ForeignEditor from './ForeignEditor';
import CruisesEditor from './CruisesEditor';
import PromotionsEditor from './PromotionsEditor';
import ServicesEditor from './ServicesEditor';

const ContentArea = styled.div`
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.95) 0%, rgba(255, 255, 255, 0.98) 100%);
  border-radius: 16px;
  box-shadow: 0 8px 32px rgba(205, 164, 52, 0.2);
  min-height: 600px;
  backdrop-filter: blur(20px);
  border: 2px solid rgba(205, 164, 52, 0.3);
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 4px;
    background: linear-gradient(90deg, #90ccec, #CDA434, #7CFC00);
    border-radius: 16px 16px 0 0;
  }
`;

type AdminSection = 'tours' | 'hotels' | 'foreign' | 'cruises' | 'promotions' | 'services';

const AdminDashboard: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  
  const sectionParam = searchParams.get('section') as AdminSection;
  const [activeSection, setActiveSection] = useState<AdminSection>(sectionParam || 'tours');

  useEffect(() => {
    const adminToken = localStorage.getItem('adminToken');
    if (!adminToken) {
      navigate('/admin/login');
    }
  }, [navigate]);

  useEffect(() => {
    if (sectionParam && sectionParam !== activeSection) {
      setActiveSection(sectionParam);
    }
  }, [sectionParam, activeSection]);

  // handleLogout теперь обрабатывается в AdminLayout

  const renderContent = () => {
    switch (activeSection) {
      case 'tours':
        return <ToursEditor />;
      case 'hotels':
        return <HotelsEditor />;
      case 'foreign':
        return <ForeignEditor />;
      case 'cruises':
        return <CruisesEditor />;
      case 'promotions':
        return <PromotionsEditor />;
      case 'services':
        return <ServicesEditor />;
      default:
        return <ToursEditor />;
    }
  };

  return (
    <AdminLayout>
      <ContentArea>
        {renderContent()}
      </ContentArea>
    </AdminLayout>
  );
};

export default AdminDashboard;

