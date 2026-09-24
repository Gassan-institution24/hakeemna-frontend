import { useMemo } from 'react';

import { Button } from '@mui/material';

import { paths } from 'src/routes/paths';
import { RouterLink } from 'src/routes/components';

import { useGetEmployee } from 'src/api';
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

// The employee's own profile, on the same frame as the patient file: an identity banner and a
// grouped rail rather than a two-item tab strip under a breadcrumb.
//
// What changed beyond the frame: the person's own identity is actually shown — photo, speciality,
// which clinic they are engaged with, their role and how to reach them — instead of a bare
// breadcrumb heading.
export default function AccountView() {
  const { t } = useTranslate();
  const { currentLang } = useLocales();
  const curLangAr = currentLang.value === 'ar';

  const { user } = useAuthContext();

  const { data, loading, refetch } = useGetEmployee(user?.employee?._id);

  const engagement = user?.employee?.employee_engagements?.[user?.employee?.selected_engagement];
  const employeeEng = engagement?._id;

  const pinned = useMemo(
    () => [{ value: 'identity', label: t('identity'), icon: 'solar:user-id-bold-duotone' }],
    [t]
  );

  // The form's own three-step wizard is gone; these are the same fields, reachable directly
  // instead of by clicking Next twice.
  const sections = useMemo(
    () => [
      {
        key: 'profile',
        label: t('profile'),
        items: [
          { value: 'contact', label: t('contact'), icon: 'solar:phone-bold-duotone' },
          {
            value: 'professional',
            label: t('Profession Practice Profile'),
            icon: 'solar:diploma-bold-duotone',
          },
          {
            value: 'documents',
            label: t('Verification Document'),
            icon: 'solar:document-add-bold-duotone',
          },
        ],
      },
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

  const [section, setSection] = useProfileSection(validSections, 'identity');

  const name = curLangAr
    ? data?.name_arabic || data?.name_english
    : data?.name_english || data?.name_arabic;

  const speciality = curLangAr
    ? data?.speciality?.name_arabic || data?.speciality?.name_english
    : data?.speciality?.name_english || data?.speciality?.name_arabic;

  const clinic = curLangAr
    ? engagement?.unit_service?.name_arabic || engagement?.unit_service?.name_english
    : engagement?.unit_service?.name_english || engagement?.unit_service?.name_arabic;

  // Roles come from the RBAC engagement, which is the honest answer to "what can I do here".
  const roleNames = [...(engagement?.roles || []), ...(engagement?.role ? [engagement.role] : [])]
    .map((one) => (curLangAr ? one?.name_arabic || one?.name_english : one?.name_english || one?.name_arabic))
    .filter(Boolean)
    .filter((value, index, all) => all.indexOf(value) === index);

  const facts = [
    data?.sequence_number && {
      key: 'code',
      label: `${t('code')}: ${data.sequence_number}`,
      dir: 'ltr',
    },
    clinic && { key: 'clinic', label: clinic, icon: 'solar:hospital-bold-duotone' },
    engagement?.department && {
      key: 'department',
      label: curLangAr
        ? engagement.department?.name_arabic || engagement.department?.name_english
        : engagement.department?.name_english || engagement.department?.name_arabic,
      icon: 'solar:folder-bold-duotone',
    },
    roleNames.length > 0 && {
      key: 'role',
      label: roleNames.join(' + '),
      icon: 'solar:shield-user-bold-duotone',
      color: 'info',
    },
    data?.email && { key: 'email', label: data.email, icon: 'solar:letter-bold-duotone', dir: 'ltr' },
    data?.mobile_num1 && {
      key: 'phone',
      label: data.mobile_num1,
      icon: 'solar:phone-bold-duotone',
      dir: 'ltr',
    },
  ].filter(Boolean);

  const renderSection = () => {
    if (section === 'security') return <AccountChangePassword />;
    if (!data) return null;
    // One form, one set of validation rules; `section` decides which fields it shows.
    return <AccountGeneral employeeData={data} refetch={refetch} section={section} />;
  };

  const publicPageHref = paths.pages.doctor(
    `${employeeEng}_${data?.[t('name_english')]?.replace(/ /g, '-')}_${data?.speciality?.[
      t('name_english')
    ]?.replace(/ /g, '-')}`
  );

  return (
    <ProfileShell
      storageKey="employee-profile-rail"
      banner={
        <IdentityBanner
          loading={loading}
          name={name}
          subtitle={speciality}
          avatar={data?.picture}
          facts={facts}
          status={
            engagement?.is_owner ? (
              <Label color="warning" variant="soft">
                {t('owner')}
              </Label>
            ) : null
          }
          actions={
            employeeEng && (
              <Button
                component={RouterLink}
                href={publicPageHref}
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
