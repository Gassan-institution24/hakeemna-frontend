import Container from '@mui/material/Container';

import { paths } from 'src/routes/paths';

// import { useSettingsContext } from 'src/components/settings';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';

import TableNewEditForm from './table-new-edit-form';

// ----------------------------------------------------------------------

export default function TableCreateView() {
  // const settings = useSettingsContext();
  // const [currentTab, setCurrentTab] = useState('many');
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
        heading="Create a new Insurance type"
        links={[
          {
            name: 'dashboard',
            href: paths.superadmin.root,
          },
          {
            name: 'Tables',
            href: paths.superadmin.tables.list,
          },
          {
            name: 'Insurance types',
            href: paths.superadmin.tables.insuranceTypes.root,
          },
          { name: 'New Insurance Company' },
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
      <TableNewEditForm />
      {/* {currentTab === 'many' && <TableManyNewForm />} */}
    </Container>
  );
}
