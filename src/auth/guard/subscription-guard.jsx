import { useCallback } from 'react';

import { useAuthContext } from '../hooks';

// ----------------------------------------------------------------------

export function useSubscriptionGuard() {
  const { user } = useAuthContext();

  const hasFeature = useCallback(
    (feature) => {
      // Superadmin bypasses subscription checks entirely
      if (user?.role === 'superadmin') return true;

      const eng = user?.employee?.employee_engagements?.[user?.employee?.selected_engagement];
      const subscriptions = eng?.unit_service?.subscriptions || [];
      const active = subscriptions.filter((s) => s.status === 'active');

      // No active subscription = backward compat, allow all
      if (active.length === 0) return true;

      const allFeatures = active.flatMap((s) => s.features || []);
      // Active subscription with empty features array = backward compat, allow all
      if (allFeatures.length === 0) return true;

      return allFeatures.includes(feature);
    },
    [user]
  );

  return { hasFeature };
}
