import React, { useEffect, useState } from 'react';
import { useAuthContext } from 'src/auth/hooks';
import FormDialog from '../other/_examples/mui/dialog-view/form-dialog';
import ComponentBlock from '../other/_examples/mui/dialog-view';

export default function OldMedicalReports() {
  const { user } = useAuthContext();
  return <FormDialog />;
}
