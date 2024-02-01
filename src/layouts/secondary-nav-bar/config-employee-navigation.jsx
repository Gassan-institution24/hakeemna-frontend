import { useMemo, useCallback } from 'react';

import { paths } from 'src/routes/paths';
import { useTranslate } from 'src/locales';
import { useAuthContext } from 'src/auth/hooks';
import { useRouter, useParams } from 'src/routes/hooks';

import Iconify from 'src/components/iconify';
import ACLGuard from 'src/auth/guard/acl-guard';
import { useGetEmployeeEngagement } from 'src/api/tables';

// ----------------------------------------------------------------------

export function useNavData() {
  const params = useParams();
  const router = useRouter();
  const { t } = useTranslate();
  const { user } = useAuthContext();
  const { id } = params;

  const employeeData = useGetEmployeeEngagement(id).data;

  const data = useMemo(() => {
    const employeeItems = [
      {
        show: ACLGuard({ category: 'employee', subcategory: 'appointments', acl: 'read' }),
        title: t('appointments'),
        path: paths.unitservice.employees.appointments(id),
        icon: <Iconify icon="teenyicons:appointments-solid" />,
      },
      {
        show: ACLGuard({ category: 'employee', subcategory: 'appointment_configs', acl: 'read' }),
        title: t('appointment configuration'),
        path: paths.unitservice.employees.appointmentconfig.root(id),
        icon: <Iconify icon="fluent:content-settings-16-regular" />,
      },
      {
        show: ACLGuard({ category: 'employee', subcategory: 'accounting', acl: 'read' }),
        title: t('accounting'),
        path: paths.unitservice.employees.accounting(id),
        icon: <Iconify icon="fa6-solid:file-invoice-dollar" />,
      },
      {
        show: true,
        title: t('feedback'),
        path: paths.unitservice.employees.feedback(id),
        icon: <Iconify icon="healthicons:world-care" />,
      },
      {
        show: ACLGuard({ category: 'employee', subcategory: 'attendence', acl: 'read' }),
        title: t('attendece'),
        path: paths.unitservice.employees.attendence(id),
        icon: <Iconify icon="fluent-mdl2:time-entry" />,
      },
      // {
      // show: ACLGuard({ category: 'employee', subcategory: 'accounting', acl: 'read' }),//
      // title: t('offers'),
      //   path: paths.unitservice.employees.offers(id),
      //   icon: <Iconify icon="eos-icons:activate-subscriptions" />,
      // },
      // {
      // show: ACLGuard({ category: 'employee', subcategory: 'accounting', acl: 'read' }),//
      // title: t('activities'),
      //   path: paths.unitservice.employees.activities.root(id),
      //   icon: <Iconify icon="ic:baseline-security" />,
      // },
      {
        show: ACLGuard({ category: 'employee', subcategory: 'acl', acl: 'read' }),
        title: t('access control list'),
        path: paths.unitservice.employees.acl(id),
        icon: <Iconify icon="mdi:account-secure" />,
      },
    ];
    const employeeSecDashboard = [
      {
        subheader: t('control panel'),
        items: employeeItems.filter((item) => item.show),
      },
      {
        items: [
          {
            title: t(
              `${employeeData?.employee?.first_name} ${employeeData?.employee?.family_name}`
            ),
            path: paths.unitservice.employees.info(id),
            icon: <Iconify icon="fluent:person-info-20-filled" />,
          },
        ],
      },
    ];

    if (!user) {
      router.replace('/');
    }

    if (user?.role === 'admin') {
      return [...employeeSecDashboard];
    }
    return [...employeeSecDashboard];
  }, [t, user, router, id, employeeData]);

  return data;
}
