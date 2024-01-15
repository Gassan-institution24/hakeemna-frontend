import { useMemo, useCallback } from 'react';

import { paths } from 'src/routes/paths';
import { useTranslate } from 'src/locales';
import { useAuthContext } from 'src/auth/hooks';
import { useRouter,useParams } from 'src/routes/hooks';

import Iconify from 'src/components/iconify';
import { useGetEmployee } from 'src/api/tables';


// ----------------------------------------------------------------------

export function useNavData() {
  const params = useParams()
  const router = useRouter();
  const { t } = useTranslate();
  const { user } = useAuthContext();
  const {id}= params

  const employeeData = useGetEmployee(id).data
  const data = useMemo(() => {
    const unitServicesItems = [
      
      {
        subheader: t('control panel'),
        items: [
          {
            title: t('appointments'),
            path: paths.unitservice.employees.appointments(id),
            icon: <Iconify icon="teenyicons:appointments-solid" />,
          },
          {
            title: t('appointment Configuration'),
            path: paths.unitservice.employees.appointmentconfig.root(id),
            icon: <Iconify icon="fluent:content-settings-16-regular" />,
          },
          {
            title: t('Accounting'),
            path: paths.unitservice.employees.accounting(id),
            icon: <Iconify icon="fa6-solid:file-invoice-dollar" />,
          },
          {
            title: t('feedback'),
            path: paths.unitservice.employees.feedback(id),
            icon: <Iconify icon="healthicons:world-care" />,
          },
          {
            title: t('attendece'),
            path: paths.unitservice.employees.attendence(id),
            icon: <Iconify icon="fluent-mdl2:time-entry" />,
          },
          {
            title: t('offers'),
            path: paths.unitservice.employees.offers(id),
            icon: <Iconify icon="eos-icons:activate-subscriptions" />,
          },
          // {
          //   title: t('activities'),
          //   path: paths.unitservice.employees.activities.root(id),
          //   icon: <Iconify icon="ic:baseline-security" />,
          // },
          // {
          //   title: t('access control list'),
          //   path: paths.unitservice.employees.acl(id),
          //   icon: <Iconify icon="eos-icons:activate-subscriptions" />,
          // },
          
      
        ],
      },
      {
        items: [
          {
            title: t(`${employeeData?.first_name} ${employeeData?.family_name}`),
            path: paths.unitservice.employees.info(id),
            icon: <Iconify icon="fluent:person-info-20-filled" />,
          },
        ]
      },
    ];


    if (!user) {
      router.replace('/');
    }
    
    if (user?.role === 'admin') {
      return [...unitServicesItems];
    }
    return [...unitServicesItems];
  }, [t, user, router,id,employeeData]);

  return data;
}
