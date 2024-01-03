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
  const {id,emid}= params

  const employeeData = useGetEmployee(emid).data
  const data = useMemo(() => {
    const unitServicesItems = [
      
      {
        subheader: t('control panel'),
        items: [
          {
            title: t('appointments'),
            path: paths.unitservice.departments.employees.appointments(id,emid),
            icon: <Iconify icon="teenyicons:appointments-solid" />,
          },
          {
            title: t('appointment Configuration'),
            path: paths.unitservice.departments.employees.appointmentconfig(id,emid),
            icon: <Iconify icon="fluent:content-settings-16-regular" />,
          },
          {
            title: t('Accounting'),
            path: paths.unitservice.departments.employees.accounting(id,emid),
            icon: <Iconify icon="fa6-solid:file-invoice-dollar" />,
          },
          {
            title: t('feedback'),
            path: paths.unitservice.departments.employees.feedback(id,emid),
            icon: <Iconify icon="healthicons:world-care" />,
          },
          {
            title: t('attendece'),
            path: paths.unitservice.departments.employees.attendence(id,emid),
            icon: <Iconify icon="fluent-mdl2:time-entry" />,
          },
          {
            title: t('offers'),
            path: paths.unitservice.departments.employees.offers(id,emid),
            icon: <Iconify icon="eos-icons:activate-subscriptions" />,
          },
          {
            title: t('activities'),
            path: paths.unitservice.departments.employees.activities.root(id,emid),
            icon: <Iconify icon="ic:baseline-security" />,
          },
          {
            title: t('access control list'),
            path: paths.unitservice.departments.employees.acl(id,emid),
            icon: <Iconify icon="eos-icons:activate-subscriptions" />,
          },
          
      
        ],
      },
      {
        items: [
          {
            title: t(`${employeeData?.first_name} ${employeeData?.family_name}`),
            path: paths.unitservice.departments.employees.info(id,emid),
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
  }, [t, user, router,id,emid,employeeData]);

  return data;
}
