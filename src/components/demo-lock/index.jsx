import { useState, useEffect, useCallback } from 'react';

import Alert from '@mui/material/Alert';
import Dialog from '@mui/material/Dialog';
import Button from '@mui/material/Button';
import DialogTitle from '@mui/material/DialogTitle';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';

import { useTranslate } from 'src/locales';

// ----------------------------------------------------------------------

/**
 * The "not available for demo" popup.
 *
 * Billing and insurance claims stay *visible* to a demo account — a trial should show what the
 * product does — but cannot be opened, because both reach real external systems (the national
 * billing system, the insurer's claim gateway) that a trial must never touch.
 *
 * The trigger lives in the navigation config while the dialog is mounted once in the header, and
 * the two are wired together with a window event rather than shared React state. The navigation
 * is rendered by three separate layouts (vertical, mini and horizontal), so this gives all three
 * the behaviour without threading a callback down through every nav component.
 */
export const DEMO_LOCKED_EVENT = 'hakeemna:demo-locked';

/**
 * Use as a nav item's onClick to block it. Takes the click event and stops it, so the router
 * link it is attached to does not follow through.
 */
export const notifyDemoLocked = (event) => {
  if (event) event.preventDefault();
  window.dispatchEvent(new CustomEvent(DEMO_LOCKED_EVENT));
};

export default function DemoLockedDialog() {
  const { t } = useTranslate();

  const [open, setOpen] = useState(false);

  const onClose = useCallback(() => setOpen(false), []);

  useEffect(() => {
    const onLocked = () => setOpen(true);

    window.addEventListener(DEMO_LOCKED_EVENT, onLocked);
    return () => window.removeEventListener(DEMO_LOCKED_EVENT, onLocked);
  }, []);

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="xs">
      <DialogTitle>{t('not available for demo')}</DialogTitle>

      <DialogContent>
        <Alert severity="info" sx={{ mt: 1 }}>
          {t('this feature is not available in the demo account')}
        </Alert>
      </DialogContent>

      <DialogActions>
        <Button variant="contained" onClick={onClose}>
          {t('close')}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
