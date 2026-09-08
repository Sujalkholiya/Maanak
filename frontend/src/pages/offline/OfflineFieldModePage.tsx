import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { OfflineFieldModeView } from '../../features/offline/components/OfflineFieldModeView';
import { ROUTES } from '../../app/router/routes';

export const OfflineFieldModePage: React.FC = () => {
  const navigate = useNavigate();
  const [isOffline, setIsOffline] = useState(false);

  return (
    <OfflineFieldModeView
      isOffline={isOffline}
      onToggleOffline={() => setIsOffline((prev) => !prev)}
      onNewOfflineInspection={() => navigate(ROUTES.WORKFLOW.NEW_INSPECTION)}
    />
  );
};

export default OfflineFieldModePage;
