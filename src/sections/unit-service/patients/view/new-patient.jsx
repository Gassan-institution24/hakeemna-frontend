import { useState } from 'react';

// import { Tab, Tabs } from '@mui/material';
import Container from '@mui/material/Container';

import { paths } from 'src/routes/paths';

import { useTranslate } from 'src/locales';

// import { useSettingsContext } from 'src/components/settings';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';

// import TableNewEditForm from './table-new-edit-form';
import TableManyNewForm from '../new-patient/add-many-patients';

// ----------------------------------------------------------------------

export default function TableCreateView() {
  // const settings = useSettingsContext();
  const { t } = useTranslate()
  const [currentTab, setCurrentTab] = useState('many');
  // const handleChangeTab = useCallback((event, newValue) => {
  //   setCurrentTab(newValue);
  // }, []);
  // const TABS = [
  //   {
  //     value: 'many',
  //     label: 'Add many',
  //   },
  //   {
  //     value: 'one',
  //     label: 'Add one',
  //   },
  // ];
  return (
    <Container maxWidth="xl">
      <CustomBreadcrumbs
        heading={t("add new patients")} /// edit
        links={[
          {
            name: t('dashboard'),
            href: paths.superadmin.root,
          },
          {
            name: t('patients'),
            href: paths.superadmin.tables.list,
          },
          { name: (t('new')) },
        ]}
        sx={{
          mb: { xs: 3, md: 5 },
        }}
      />

      {/* <Tabs
        value={currentTab}
        onChange={handleChangeTab}
        sx={{
          mb: { xs: 3, md: 5 },
        }}
      >
        {TABS.map((tab, idx) => (
          <Tab key={idx} label={tab.label} value={tab.value} />
        ))}
      </Tabs> */}
      {currentTab === 'many' && <TableManyNewForm />}
      {/* {currentTab === 'one' && <TableNewEditForm />} */}
    </Container>
  );
}
