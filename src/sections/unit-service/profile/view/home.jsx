import { useMemo } from 'react';

import { Button } from '@mui/material';

import { paths } from 'src/routes/paths';
import { RouterLink } from 'src/routes/components';

import { useGetUnitservice } from 'src/api';
import { useAuthContext } from 'src/auth/hooks';
import { useLocales, useTranslate } from 'src/locales';

import Label from 'src/components/label';
import Iconify from 'src/components/iconify';
import ProfileShell from 'src/components/profile-shell';
import IdentityBanner from 'src/components/profile-shell/identity-banner';

import { useProfileSection } from 'src/sections/shared/patient-profile/use-profile-section';

import AccountGeneral from '../profile-general';
import AccountChangePassword from '../profile-change-password';

// ----------------------------------------------------------------------

// The clinic's own profile, on the same frame as the patient file and the employee profile.
//
// Previously this was a breadcrumb and a single form with no navigation at all and nothing
// identifying the clinic on screen — you could not tell which clinic you were editing without
// reading the form. Now the banner answers that first: logo, type, where it is, how to reach it,
// and whether the subscription is active.
export default function AccountView() {
  const { t } = useTranslate();
  const { currentLang } = useLocales();
  const curLangAr = currentLang.value === 'ar';

  const { user } = useAuthContext();

  const serviceUnitID =
    user?.employee?.employee_engagements?.[user?.employee?.selected_engagement]?.unit_service?._id;

  const { data, loading, refetch } = useGetUnitservice(serviceUnitID);

  const pinned = useMemo(
    () => [
      { value: 'general', label: t('unit of service info'), icon: 'solar:hospital-bold-duotone' },
    ],
    [t]
  );

  const sections = useMemo(
    () => [
      {
        key: 'account',
        label: t('settings'),
        items: [
          { value: 'security', label: t('security'), icon: 'solar:lock-password-bold-duotone' },
        ],
      },
    ],
    [t]
  );

  const validSections = useMemo(
    () => [...pinned, ...sections.flatMap((one) => one.items)].map((one) => one.value),
    [pinned, sections]
  );

  const [section, setSection] = useProfileSection(validSections, 'general');

  const localized = (doc) => {
    if (!doc || typeof doc !== 'object') return '';
    return (curLangAr ? doc.name_arabic || doc.name_english : doc.name_english || doc.name_arabic) || '';
  };

  const name = localized(data);
  const place = [localized(data?.city), localized(data?.country)].filter(Boolean).join(', ');

  const facts = [
    data?.sequence_number && {
      key: 'code',
      label: `${t('code')}: ${data.sequence_number}`,
      dir: 'ltr',
    },
    localized(data?.US_type) && {
      key: 'type',
      label: localized(data.US_type),
      icon: 'solar:buildings-2-bold-duotone',
    },
    place && { key: 'place', label: place, icon: 'solar:map-point-bold-duotone' },
    data?.address && { key: 'address', label: data.address, icon: 'solar:home-2-bold-duotone' },
    data?.phone && {
      key: 'phone',
      label: data.phone,
      icon: 'solar:phone-bold-duotone',
      dir: 'ltr',
    },
    data?.users_num && {
      key: 'users',
      label: `${t('users number')}: ${data.users_num}`,
      icon: 'solar:users-group-rounded-bold-duotone',
    },
  ].filter(Boolean);

  const renderSection = () => {
    switch (section) {
      case 'general':
        return data ? <AccountGeneral unitServiceData={data} refetch={refetch} /> : null;
      case 'security':
        return <AccountChangePassword />;
      default:
        return null;
    }
  };

  return (
    <ProfileShell
      storageKey="unit-service-profile-rail"
      banner={
        <IdentityBanner
          loading={loading}
          name={name}
          subtitle={localized(data?.speciality)}
          avatar={data?.company_logo}
          icon={!data?.company_logo ? 'solar:hospital-bold-duotone' : undefined}
          facts={facts}
          status={
            data?.status && (
              <Label color={data.status === 'active' ? 'success' : 'default'} variant="soft">
                {t(data.status)}
              </Label>
            )
          }
          actions={
            serviceUnitID && (
              <Button
                component={RouterLink}
                href={paths.pages.serviceUnit(serviceUnitID)}
                variant="contained"
                target="_blank"
                startIcon={<Iconify icon="icomoon-free:new-tab" />}
              >
                {t('show page')}
              </Button>
            )
          }
        />
      }
      pinned={pinned}
      sections={sections}
      section={section}
      onChangeSection={setSection}
    >
      {renderSection()}
    </ProfileShell>
  );
}
