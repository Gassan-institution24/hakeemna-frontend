import { useParams } from 'react-router';

import Container from '@mui/material/Container';

import { paths } from 'src/routes/paths';

import { useTranslate } from 'src/locales';
import { useGetAppointment } from 'src/api';

// import { useSettingsContext } from 'src/components/settings';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';

import TableNewEditForm from '../table-new-edit-form';

// ----------------------------------------------------------------------

export default function TableEditView() {
  const { id } = useParams();
  const { t } = useTranslate();
  const { data } = useGetAppointment(id, { populate: 'all' });
  return (
    <Container maxWidth="xl">
      <CustomBreadcrumbs
        heading={t('appointments')}
        links={[
          {
            name: t('dashboard'),
            href: paths.employee.root,
          },
          {
            name: t('appointments'),
            href: paths.employee.appointments.root,
          },
          { name: t('edit') },
        ]}
        sx={{
          mb: { xs: 3, md: 5 },
        }}
      />
      {data && <TableNewEditForm currentTable={data} />}
    </Container>
  );
}
