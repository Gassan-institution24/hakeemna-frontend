import { useMemo } from 'react';

import { paths } from 'src/routes/paths';
import { useRouter, useParams } from 'src/routes/hooks';

import { useTranslate } from 'src/locales';
import { useAuthContext } from 'src/auth/hooks';
import { useGetEmployeeEngagement } from 'src/api';
import { useAclGuard } from 'src/auth/guard/acl-guard';

import Iconify from 'src/components/iconify';

// ----------------------------------------------------------------------

export function useNavData() {
  const params = useParams();
  const router = useRouter();
  const { t } = useTranslate();
  const { user } = useAuthContext();
  const { id } = params;

  const checkAcl = useAclGuard();

  const employeeData = useGetEmployeeEngagement(id).data;

  const data = useMemo(() => {
    const employeeItems = [
      {
        show: checkAcl({ category: 'unit_service', subcategory: 'appointments', acl: 'read' }),
        title: t('appointments'),
        path: paths.unitservice.employees.appointments(id),
        icon: <Iconify icon="teenyicons:appointments-solid" />,
      },
      {
        show: checkAcl({
          category: 'unit_service',
          subcategory: 'appointment_configs',
          acl: 'read',
        }),
        title: t('appointment configuration'),
        path: paths.unitservice.employees.appointmentconfig.root(id),
        icon: <Iconify icon="fluent:content-settings-16-regular" />,
      },
      {
        show: checkAcl({ category: 'unit_service', subcategory: 'accounting', acl: 'read' }),
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
        show: checkAcl({ category: 'unit_service', subcategory: 'unit_service_info', acl: 'read' }),
        title: t('attendance'),
        path: paths.unitservice.employees.attendence(id),
        icon: <Iconify icon="fluent-mdl2:time-entry" />,
      },
      // {
      // show: checkAcl({ category: 'unit_service', subcategory: 'accounting', acl: 'read' }),//
      // title: t('offers'),
      //   path: paths.unitservice.employees.offers(id),
      //   icon: <Iconify icon="eos-icons:activate-subscriptions" />,
      // },
      // {
      // show: checkAcl({ category: 'unit_service', subcategory: 'accounting', acl: 'read' }),//
      // title: t('activities'),
      //   path: paths.unitservice.employees.activities.root(id),
      //   icon: <Iconify icon="ic:baseline-security" />,
      // },
      {
        show: checkAcl({ category: 'unit_service', subcategory: 'permissions', acl: 'read' }),
        title: t('permissions'),
        path: paths.unitservice.employees.acl(id),
        icon: <Iconify icon="mdi:account-secure" />,
      },
    ];
    const employeeSecDashboard = [
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
      {
        subheader: t('control panel'),
        items: employeeItems.filter((item) => item.show),
      },
    ];

    if (!user) {
      router.replace('/');
    }

    if (user?.role === 'admin') {
      return [...employeeSecDashboard];
    }
    return [...employeeSecDashboard];
  }, [t, user, router, id, employeeData, checkAcl]);

  return data;
}
