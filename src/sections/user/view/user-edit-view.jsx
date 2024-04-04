// import PropTypes from 'prop-types';

// import Container from '@mui/material/Container';

// import { paths } from 'src/routes/paths';

// import { useSettingsContext } from 'src/components/settings';
// import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';

// // import UserNewEditForm from '../user-new-edit-form';

// // ----------------------------------------------------------------------

// export default function UserEditView({ id }) {
//   const settings = useSettingsContext();

//   const currentUser = _userList.find((user) => user.id === id);

//   return (
//     <Container maxWidth='xl'>
//       <CustomBreadcrumbs
//         heading="Edit"
//         links={[
//           {
//             name: 'Dashboard',
//             href: paths.dashboard.root,
//           },
//           {
//             name: 'User',
//             href: paths.dashboard.user.root,
//           },
//           { name: currentUser?.name },
//         ]}
//         sx={{
//           mb: { xs: 3, md: 5 },
//         }}
//       />

//       {/* <UserNewEditForm currentUser={currentUser} /> */}
//     </Container>
//   );
// }

// UserEditView.propTypes = {
//   id: PropTypes.string,
// };
