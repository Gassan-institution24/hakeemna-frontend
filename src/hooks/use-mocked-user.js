import { _mock } from 'src/_mock';
import { useGetUser } from 'src/api/user';
// TO GET THE USER FROM THE AUTHCONTEXT, YOU CAN USE

// CHANGE:
// import { useMockedUser } from 'src/hooks/use-mocked-user';
// const { user } = useMockedUser();

// TO:
// import { useAuthContext } from 'src/auth/hooks';
// const { user } = useAuthContext();

// ----------------------------------------------------------------------



export function useMockedUser() {
  const { data } = useGetUser();
  const user = {
    id:`${data._id}`,
    displayName: `${data.first_name} ${data.second_name}`,
    email: `${data.email}`,
    password: 'demo1234',
    photoURL: `${data.profile_picture}`,
    phoneNumber: `${data.mobile_num1}`,
    country: 'United States',
    address: '90210 Broadway Blvd',
    state: 'California',
    city: 'San Francisco',
    zipCode: '94116',
    about: 'Praesent turpis. Phasellus viverra nulla ut metus varius laoreet. Phasellus tempus.',
    role: 'admin',
    isPublic: true,
  };

  return { user };
}
