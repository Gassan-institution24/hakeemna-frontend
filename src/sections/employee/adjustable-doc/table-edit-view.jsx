import Container from '@mui/material/Container';

import { paths } from 'src/routes/paths';
import { useParams } from 'src/routes/hooks';

// import { useSettingsContext } from 'src/components/settings';
import { useTranslate } from 'src/locales';
import { useGetAdjustabledDocument } from 'src/api/adjustabledocument';

import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';

import TableNewEditForm from './table-new-edit-form';

// ----------------------------------------------------------------------

export default function TableEditView() {
  // const settings = useSettingsContext();
  const params = useParams();
  const { id } = params;
  const { adjustabledocument } = useGetAdjustabledDocument(id);

  const { t } = useTranslate();

  return (
    <Container maxWidth="lg">
      <CustomBreadcrumbs
        heading={t('update adjustable document')}
        links={[
          {
            name: t('dashboard'),
            href: paths.employee.root,
          },
          {
            name: t('adjustable documents'),
            href: paths.employee.documents.adjustable.root,
          },
          { name: t('update') },
        ]}
        sx={{
          mb: { xs: 3, md: 5 },
        }}
      />
      {adjustabledocument && <TableNewEditForm currentRow={adjustabledocument} />}
    </Container>
  );
}
