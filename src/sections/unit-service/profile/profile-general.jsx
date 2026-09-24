import * as Yup from 'yup';
import { decode } from 'he';
import PropTypes from 'prop-types';
import { useForm } from 'react-hook-form';
import { matchIsValidTel } from 'mui-tel-input';
import { yupResolver } from '@hookform/resolvers/yup';
import { useMemo, useState, useEffect, useCallback } from 'react';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Grid from '@mui/material/Unstable_Grid2';
import LoadingButton from '@mui/lab/LoadingButton';
import { Chip, Divider, Typography } from '@mui/material';

import { paths } from 'src/routes/paths';

import { isDemoUser } from 'src/utils/demo';
import { fData } from 'src/utils/format-number';
import axios, { endpoints } from 'src/utils/axios';

import socket from 'src/socket';
import { useAuthContext } from 'src/auth/hooks';
import { useLocales, useTranslate } from 'src/locales';
import {
  useGetCountries,
  useGetUnitservice,
  useGetCountryCities,
  useGetActiveUSTypes,
} from 'src/api';

import Iconify from 'src/components/iconify';
import { useSnackbar } from 'src/components/snackbar';
import { InfoRow, PanelCard } from 'src/components/panel-card';
import FormSection, { twoCol } from 'src/components/form-section';
import { isDiallingCodeOnly } from 'src/components/hook-form/rhfPhoneNumberCustom';
import FormProvider, {
  RHFEditor,
  RHFCheckbox,
  RHFTextField,
  RHFTimePicker,
  RHFAutocomplete,
  RHFUploadAvatar,
  RHFPhoneNumberCustom,
} from 'src/components/hook-form';

// ----------------------------------------------------------------------

// ----------------------------------------------------------------------

/**
 * The display name for an id, from the reference list the value came from.
 *
 * The form holds ids; the read-only rows show names. Returns '' rather than the raw id when the
 * list has not loaded yet — InfoRow renders nothing for an empty value, so the row simply is not
 * there instead of flashing an ObjectId.
 */
const nameById = (list, id, isArabic) => {
  const found = (list || []).find((one) => String(one._id) === String(id));
  if (!found) return '';
  return (
    (isArabic ? found.name_arabic || found.name_english : found.name_english || found.name_arabic) ||
    ''
  );
};

// ----------------------------------------------------------------------

export default function AccountGeneral({ unitServiceData }) {
  const { t } = useTranslate();
  const { currentLang } = useLocales();
  const curLangAr = currentLang.value === 'ar';

  const daysOfWeek = [
    t('sunday'),
    t('monday'),
    t('tuesday'),
    t('wednesday'),
    t('thursday'),
    t('friday'),
    t('saturday'),
  ];

  const [companyLogo, setCompanyLog] = useState();

  const { enqueueSnackbar } = useSnackbar();

  const { user } = useAuthContext();

  const { data, refetch } = useGetUnitservice(
    user?.employee?.employee_engagements?.[user?.employee.selected_engagement]?.unit_service?._id
  );
  const { countriesData } = useGetCountries({ select: 'name_english name_arabic' });
  const { unitserviceTypesData } = useGetActiveUSTypes();

  const UpdateUserSchema = Yup.object().shape({
    // Editable identity. The letter tests match the employee form's, so "name in Arabic" means
    // the same thing on both screens.
    name_english: Yup.string()
      .required(t('required field'))
      .test(
        'valid-english-name',
        t('English letters only'),
        (value) => !value || /^[A-Za-z0-9][A-Za-z0-9\s.\-&'()]*$/.test(value)
      ),
    name_arabic: Yup.string()
      .required(t('required field'))
      .test(
        'valid-arabic-name',
        t('Arabic letters only'),
        (value) => !value || /^[؀-ۿ0-9][؀-ۿ0-9\s.\-&'()]*$/.test(value)
      ),
    identification_num: Yup.string().required(t('required field')),

    // Registration details, deliberately NOT required.
    //
    // They are set at registration and shown read-only, so requiring them could only ever block a
    // save with no field to fix — the error surfaced as a toast reading "city: required field"
    // next to no city input. They are still submitted with their current values.
    country: Yup.string().nullable(),
    city: Yup.string().nullable(),
    US_type: Yup.string().nullable(),
    sector_type: Yup.string().nullable(),

    email: Yup.string().email(t('Invalid email address')),
    address: Yup.string(),
    web_page: Yup.string(),
    work_days: Yup.array(),
    work_start_time: Yup.mixed(),
    work_end_time: Yup.mixed(),
    // The control seeds '+962' so its flag button has something to show, which makes an untouched
    // field look filled. Report that as "required" rather than "invalid": the number is missing,
    // not wrong, and telling someone their empty field is invalid sends them looking for a typo.
    // Two tests rather than one, so the message matches the problem: a field holding only the
    // seeded dialling code is EMPTY, not wrong, and "Invalid phone number" would send someone
    // hunting for a typo in a field they never filled in. The first failure is the one reported.
    phone: Yup.string()
      .test('phone-required', t('required field'), (value) => !isDiallingCodeOnly(value))
      .test('phone-valid', t('Invalid phone number'), (value) =>
        isDiallingCodeOnly(value) ? true : matchIsValidTel(value)
      ),
    mobile_num: Yup.string().test('mobile', t('Invalid phone number'), (value) =>
      isDiallingCodeOnly(value) ? true : matchIsValidTel(value)
    ),
    introduction_letter: Yup.string(),
    arabic_introduction_letter: Yup.string(),
    location_gps: Yup.string(),
    Secret_Key: Yup.string(),
    Activity_Number: Yup.string(),
    ClientId: Yup.string(),
    CompanyID: Yup.string(),
    claim_username: Yup.string(),
    claim_password: Yup.string(),
    RegistrationName: Yup.string(),
    company_logo: Yup.mixed(),
    facebook: Yup.mixed(),
    instagram: Yup.mixed(),
    other: Yup.mixed(),
    has_tax: Yup.bool(),
    has_deduction: Yup.bool(),
    invoicing_system: Yup.bool(),
    claim_registered: Yup.boolean(),
    show_on_homepage: Yup.bool(),
  });

  // Memoised so the reset effect below has a stable identity to react to. Rebuilt on every
  // render, it would reset the form on every render.
  const defaultValues = useMemo(
    () => ({
    name_english: data?.name_english || '',
    name_arabic: data?.name_arabic || '',
    // `data?.country._id` stopped the optional chain at `data` — a clinic whose country was never
    // set threw a TypeError while rendering its own profile.
    country: data?.country?._id || null,
    city: data?.city?._id || null,
    US_type: data?.US_type?._id || null,
    email: data?.email || '',
    sector_type: data?.sector_type || '',
    identification_num: data?.identification_num || '',
    address: data?.address || '',
    web_page: data?.web_page || '',
    work_days: data?.work_days || [],
    work_start_time: data?.work_start_time || null,
    work_end_time: data?.work_end_time || null,
    phone: data?.phone || '',
    mobile_num: data?.mobile_num || '',
    introduction_letter: data?.introduction_letter ? decode(data?.introduction_letter) : '',
    arabic_introduction_letter: data?.arabic_introduction_letter
      ? decode(data?.arabic_introduction_letter)
      : '',
    location_gps: data?.location_gps || '',
    company_logo: data?.company_logo || '',
    facebook: data?.facebook || '',
    instagram: data?.instagram || '',
    other: data?.other || '',
    Secret_Key: data?.Secret_Key || '',
    Activity_Number: data?.Activity_Number || '',
    ClientId: data?.ClientId || '',
    CompanyID: data?.CompanyID || '',
    RegistrationName: data?.RegistrationName || '',
    has_tax: data?.has_tax || false,
    has_deduction: data?.has_deduction || false,
    invoicing_system: data?.invoicing_system || false,
    claim_registered: data?.claim_registered || false,
    claim_username: data?.claim_username || '',
    // Seeded from the server like everything else. It used to be hardcoded '' and then sent with
    // the rest of the form, so every save overwrote the stored insurance password with a blank —
    // silently, and even when the panel holding the field was collapsed.
    claim_password: data?.claim_password || '',
    show_on_homepage: data?.show_on_homepage ?? true,
    }),
    [data]
  );

  const methods = useForm({
    mode: 'all',
    resolver: yupResolver(UpdateUserSchema),
    defaultValues,
  });
  const {
    reset,
    setValue,
    watch,
    handleSubmit,
    formState: { isSubmitting, isDirty },
  } = methods;

  // Take fresh server data into the form — it previously never did, so the refetch after every
  // save or toggle was thrown away and the form kept its first-render values forever.
  //
  // Guarded on isDirty: a revalidation must not overwrite what someone is in the middle of
  // typing. Toggling a switch triggers a refetch, and without this guard that refetch would
  // discard every other edit on screen.
  useEffect(() => {
    if (!isDirty) reset(defaultValues);
    // isDirty is deliberately not a dependency: this should run when new data arrives, not the
    // moment the form becomes dirty.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [defaultValues, reset]);

  const values = watch();
  const { tableData } = useGetCountryCities(watch().country, {
    select: 'name_english name_arabic',
  });

  const handleDrop = useCallback(
    (acceptedFiles) => {
      const file = acceptedFiles[0];
      setCompanyLog(file);
      const newFile = Object.assign(file, {
        preview: URL.createObjectURL(file),
      });

      if (file) {
        setValue('company_logo', newFile, { shouldValidate: true });
      }
    },
    [setValue]
  );

  /**
   * Submit was blocked by validation.
   *
   * Every field is validated whether or not its section is on screen, so a bad value somewhere
   * else is the one case where the error genuinely cannot be seen. One toast naming the fields —
   * on submit only, unlike the old effect that fired one per error on every render.
   */
  const onInvalid = (formErrors) => {
    const names = Object.keys(formErrors || {});
    if (!names.length) return;
    enqueueSnackbar(`${t('required field')}: ${names.map((n) => t(n)).join(', ')}`, {
      variant: 'error',
    });
  };

  const onSubmit = handleSubmit(async (dataToSend) => {
    try {
      const formData = new FormData();
      if (companyLogo) {
        formData.append('company_logo_pic', companyLogo);
        await axios.patch(
          `${endpoints.unit_services.one(
            user?.employee?.employee_engagements?.[user?.employee.selected_engagement]?.unit_service
              ._id
          )}/updatelogo`,
          formData
        );
        socket.emit('updated', {
          user,
          link: paths.unitservice.profile.root,
          msg: `uploaded logo to unit of service profile`,
        });
      }
      // Built explicitly rather than forwarding the whole values object.
      //
      // Two things went out with it that should not have: `company_logo`, which is a File once
      // someone drops one and was already uploaded as multipart to /updatelogo just above; and
      // `claim_password`, which defaulted to '' and so overwrote the stored insurance password on
      // every save — including saves made while the panel holding that field was collapsed.
      const {
        // eslint-disable-next-line no-unused-vars -- destructured to omit it from `payload`
        company_logo: _companyLogo,
        claim_password: claimPassword,
        ...payload
      } = dataToSend;

      // Only send the password when it actually holds something. Blank means "unchanged", which
      // is what an untouched password field means everywhere else.
      if (claimPassword) payload.claim_password = claimPassword;

      await axios.patch(
        endpoints.unit_services.one(
          user?.employee?.employee_engagements?.[user?.employee.selected_engagement]?.unit_service
            ._id
        ),
        payload
      );
      enqueueSnackbar(t('updated successfully!'));
      socket.emit('updated', {
        user,
        link: paths.unitservice.profile.root,
        msg: `updated the unit of service profile`,
      });
      refetch();
    } catch (error) {
      enqueueSnackbar(
        curLangAr ? `${error.arabic_message}` || `${error.message}` : `${error.message}`,
        {
          variant: 'error',
        }
      );
      console.error(error);
    }
  }, onInvalid);

  return (
    <FormProvider methods={methods} onSubmit={onSubmit}>
      <Grid container spacing={3}>
        <Grid xs={12} md={4}>
          <Card sx={{ pt: 5, height: { md: '100%' }, pb: { xs: 5 }, px: 3, textAlign: 'center' }}>
            <RHFUploadAvatar
              helperText={
                <Typography
                  variant="caption"
                  sx={{
                    mt: 3,
                    mx: 'auto',
                    display: 'block',
                    textAlign: 'center',
                    color: 'text.disabled',
                  }}
                >
                  {t('max size of')} {fData(3145728)}
                </Typography>
              }
              maxSize={3145728}
              name="company_logo"
              onDrop={handleDrop}
            />
            <Box
              rowGap={3}
              columnGap={2}
              sx={{ mt: 5 }}
              display="grid"
              gridTemplateColumns={{
                xs: 'repeat(1, 1fr)',
                sm: 'repeat(1, 1fr)',
              }}
            >
              {/* Real inputs now. These were a plain TextField with a `value` and no `onChange`,
                  which React treats as permanently read-only — the Arabic name was marked
                  required and would not accept a keystroke. */}
              <FormSection title={t('identity')} sx={{ textAlign: 'start' }}>
                <Stack spacing={2.5}>
                  <RHFTextField name="name_english" label={t('name english')} />
                  <RHFTextField name="name_arabic" label={t('name arabic')} />
                  <RHFTextField name="identification_num" label={t('ID number')} />
                </Stack>
              </FormSection>

              <Divider />
              {/* Hidden for demo accounts: a demo clinic is never listed publicly, so this
                  switch would do nothing. The server pins show_on_homepage off and excludes
                  demo clinics from every public query — see backend utils/demoAccount.js. */}
              <Stack alignItems="flex-start" gap={1} sx={{ display: isDemoUser(user) ? 'none' : undefined }}>
                <Typography
                  variant="subtitle2"
                  sx={{ display: 'flex', alignItems: 'center', gap: 1 }}
                >
                  <Iconify icon="solar:eye-bold-duotone" width={18} sx={{ color: 'primary.main' }} />
                  {t('visibility information')}
                </Typography>
                <RHFCheckbox
                  name="show_on_homepage"
                  label={t('show on home page')}
                  onChange={async () => {
                    const newValue = !values.show_on_homepage;
                    setValue('show_on_homepage', newValue);

                    try {
                      await axios.patch(
                        endpoints.unit_services.one(
                          user?.employee?.employee_engagements?.[user?.employee.selected_engagement]
                            ?.unit_service._id
                        ),
                        { show_on_homepage: newValue }
                      );
                      enqueueSnackbar(t('updated successfully!'), { variant: 'success' });

                      socket.emit('updated', {
                        user,
                        link: paths.unitservice.profile.root,
                        msg: `update visibility information `,
                      });

                      refetch(); // optional if you want to re-fetch fresh data
                    } catch (error) {
                      // Put the switch back: the write failed, so leaving it flipped would show a
                      // state the server never accepted and the next save would send it as fact.
                      setValue('show_on_homepage', !newValue);
                      enqueueSnackbar(
                        curLangAr
                          ? `${error.arabic_message}` || `${error.message}`
                          : `${error.message}`,
                        { variant: 'error' }
                      );
                    }
                  }}
                />
              </Stack>

              <Stack alignItems="flex-start" gap={1}>
                <Typography
                  variant="subtitle2"
                  sx={{ display: 'flex', alignItems: 'center', gap: 1 }}
                >
                  <Iconify icon="solar:banknote-2-bold-duotone" width={18} sx={{ color: 'primary.main' }} />
                  {t('financial information')}
                </Typography>
                <RHFCheckbox
                  name="has_tax"
                  label={t('subject to sales tax')}
                  onChange={async () => {
                    const newValue = !values.has_tax;
                    setValue('has_tax', newValue);

                    try {
                      await axios.patch(
                        endpoints.unit_services.one(
                          user?.employee?.employee_engagements?.[user?.employee.selected_engagement]
                            ?.unit_service._id
                        ),
                        { has_tax: newValue }
                      );
                      enqueueSnackbar(t('updated successfully!'), { variant: 'success' });

                      socket.emit('updated', {
                        user,
                        link: paths.unitservice.profile.root,
                        msg: `updated sales tax status `,
                      });

                      refetch(); // optional if you want to re-fetch fresh data
                    } catch (error) {
                      // Put the switch back: the write failed, so leaving it flipped would show a
                      // state the server never accepted and the next save would send it as fact.
                      setValue('has_tax', !newValue);
                      enqueueSnackbar(
                        curLangAr
                          ? `${error.arabic_message}` || `${error.message}`
                          : `${error.message}`,
                        { variant: 'error' }
                      );
                    }
                  }}
                />
                <RHFCheckbox
                  name="has_deduction"
                  label={t('subject to deductions - income tax or doctors syndicate')}
                  onChange={async () => {
                    const newValue = !values.has_deduction;
                    setValue('has_deduction', newValue);

                    try {
                      await axios.patch(
                        endpoints.unit_services.one(
                          user?.employee?.employee_engagements?.[user?.employee.selected_engagement]
                            ?.unit_service._id
                        ),
                        { has_deduction: newValue }
                      );
                      enqueueSnackbar(t('updated successfully!'), { variant: 'success' });

                      socket.emit('updated', {
                        user,
                        link: paths.unitservice.profile.root,
                        msg: `updated has deduction status `,
                      });

                      refetch(); // optional if you want to re-fetch fresh data
                    } catch (error) {
                      // Put the switch back: the write failed, so leaving it flipped would show a
                      // state the server never accepted and the next save would send it as fact.
                      setValue('has_deduction', !newValue);
                      enqueueSnackbar(
                        curLangAr
                          ? `${error.arabic_message}` || `${error.message}`
                          : `${error.message}`,
                        { variant: 'error' }
                      );
                    }
                  }}
                />
                <RHFCheckbox
                  name="invoicing_system"
                  label={t('Are you registered in the National Jordanian Billing System?')}
                  onChange={async () => {
                    const newValue = !values.invoicing_system;
                    setValue('invoicing_system', newValue);

                    try {
                      await axios.patch(
                        endpoints.unit_services.one(
                          user?.employee?.employee_engagements?.[user?.employee.selected_engagement]
                            ?.unit_service._id
                        ),
                        { invoicing_system: newValue }
                      );
                      enqueueSnackbar(t('updated successfully!'), { variant: 'success' });

                      socket.emit('updated', {
                        user,
                        link: paths.unitservice.profile.root,
                        msg: `updated invoicing_system status`,
                      });

                      refetch(); // optional if you want to re-fetch fresh data
                    } catch (error) {
                      // Put the switch back: the write failed, so leaving it flipped would show a
                      // state the server never accepted and the next save would send it as fact.
                      setValue('invoicing_system', !newValue);
                      enqueueSnackbar(
                        curLangAr
                          ? `${error.arabic_message}` || `${error.message}`
                          : `${error.message}`,
                        { variant: 'error' }
                      );
                    }
                  }}
                />
                <RHFCheckbox
                  name="claim_registered"
                  label={t('Registered with insurance claim system')}
                  onChange={async () => {
                    const newValue = !values.claim_registered;
                    setValue('claim_registered', newValue);

                    try {
                      await axios.patch(
                        endpoints.unit_services.one(
                          user?.employee?.employee_engagements?.[user?.employee.selected_engagement]
                            ?.unit_service._id
                        ),
                        { claim_registered: newValue }
                      );
                      enqueueSnackbar(t('updated successfully!'), { variant: 'success' });

                      socket.emit('updated', {
                        user,
                        link: paths.unitservice.profile.root,
                        msg: `updated claim registered status`,
                      });

                      refetch(); // optional if you want to re-fetch fresh data
                    } catch (error) {
                      // Put the switch back: the write failed, so leaving it flipped would show a
                      // state the server never accepted and the next save would send it as fact.
                      setValue('claim_registered', !newValue);
                      enqueueSnackbar(
                        curLangAr
                          ? `${error.arabic_message}` || `${error.message}`
                          : `${error.message}`,
                        { variant: 'error' }
                      );
                    }
                  }}
                />
              </Stack>

              <Stack alignItems="flex-start" gap={1}>
                {values.invoicing_system && (
                  <>
                    <Typography variant="subtitle1">
                      {t('Jordanian National Billing System Information')}
                    </Typography>
                    <RHFTextField
                      type="string"
                      variant="filled"
                      name="RegistrationName"
                      label={`${t('Registration Name')} :`}
                    />
                    <RHFTextField
                      type="string"
                      variant="filled"
                      name="CompanyID"
                      label={`${t('Company ID')} :`}
                    />
                    <RHFTextField
                      type="string"
                      variant="filled"
                      name="Activity_Number"
                      label={`${t('Activity Number')} :`}
                    />
                    <RHFTextField
                      type="string"
                      variant="filled"
                      name="ClientId"
                      label={`${t('Client Id')} :`}
                    />
                    <RHFTextField
                      type="string"
                      variant="filled"
                      name="Secret_Key"
                      label={`${t('Secret Key')} :`}
                    />
                  </>
                )}
              </Stack>
              <Stack alignItems="flex-start" gap={1}>

                {values.claim_registered && (
                  <>
                    <Typography variant="subtitle1">
                      {t('Insurance Claim System Information')}
                    </Typography>
                    <RHFTextField
                      variant="filled"
                      name="claim_username"
                      label={`${t('claim Username')} :`}
                    />

                    <RHFTextField
                      variant="filled"
                      name="claim_password"
                      type="password"
                      label={`${t('claim Password')} :`}
                    />
                  </>
                )}
              </Stack>
            </Box>
          </Card>
        </Grid>
        <Grid xs={12} md={8}>
          <Card sx={{ p: 3, pt: 5 }}>
            {/* Registration details: set when the clinic was created and not editable here. They
                were four disabled dropdowns, which still look clickable — a chevron that does
                nothing is worse than plain text. */}
            <PanelCard icon="solar:lock-keyhole-bold-duotone" title={t('registration')}>
              <Typography variant="caption" sx={{ color: 'text.disabled', display: 'block', mb: 1 }}>
                {t('Contact support to change these')}
              </Typography>
              <Box sx={twoCol}>
                <InfoRow label={t('country')} value={nameById(countriesData, values.country, curLangAr)} />
                <InfoRow label={t('city')} value={nameById(tableData, values.city, curLangAr)} />
                <InfoRow
                  label={t('unit of service type')}
                  value={nameById(unitserviceTypesData, values.US_type, curLangAr)}
                />
                <InfoRow
                  label={t('sector type')}
                  value={values.sector_type ? t(values.sector_type) : ''}
                />
              </Box>
            </PanelCard>

            <Divider sx={{ my: 3 }} />

            {/* One Contact section, not two. The institution email and main phone used to sit in
                the narrow left column while the alternative mobile, webpage and address sat over
                here — two headings with the same name on one screen, and no way to tell which
                held what. */}
            <FormSection title={t('contact')}>
              <Box sx={twoCol}>
                {/* Read-only: the institution email is the clinic's login identity, so it is
                    changed through account settings rather than buried in a profile form. Shown
                    here because it is a contact detail people need to read. */}
                <RHFTextField
                  name="email"
                  type="email"
                  label={t('institution email')}
                  disabled
                  helperText={t('Contact support to change these')}
                />
                <RHFPhoneNumberCustom name="phone" label={t('phone number')} />
                <RHFPhoneNumberCustom name="mobile_num" label={t('alternative mobile number')} />
                <RHFTextField name="web_page" label={t('webpage')} />
              </Box>

              <RHFTextField multiline rows={2} name="address" label={t('address')} />
            </FormSection>

            <Divider sx={{ my: 3 }} />

            {/* Hours and days together: they answer one question — when is this clinic open. The
                24-hour note belongs to the pair, not hanging under the end-time field. */}
            <FormSection
              title={t('opening hours')}
              caption={t('choose 12 am for both start and end time if you are working 24 hours')}
            >
              <Box sx={twoCol}>
                <RHFTimePicker name="work_start_time" label={t('work start time')} />
                <RHFTimePicker name="work_end_time" label={t('work end time')} />
              </Box>

              <RHFAutocomplete
                name="work_days"
                label={t('work days')}
              multiple
              disableCloseOnSelect
              options={daysOfWeek.filter(
                (option) => !values.work_days.some((item) => option === item)
              )}
              getOptionLabel={(option) => option}
              renderOption={(props, option, idx) => (
                <li lang="ar" {...props} key={idx} value={option}>
                  {option}
                </li>
              )}
              renderTags={(selected, getTagProps) =>
                selected.map((option, index) => (
                  <Chip
                    {...getTagProps({ index })}
                    key={index}
                    label={option}
                    size="small"
                    color="info"
                    variant="soft"
                  />
                ))
              }
              />
            </FormSection>

            <Divider sx={{ my: 3 }} />

            {/* The map link and the social accounts are all "where people find us", so they sit
                together rather than being interleaved with opening hours. */}
            <FormSection title={t('online presence')}>
              <Box sx={twoCol}>
                {/* Was labelled "goole map url". */}
                <RHFTextField name="location_gps" label={t('location GPS - google map url')} />
                <RHFTextField name="facebook" label={t('facebook url')} />
                <RHFTextField name="instagram" label={t('instagram url')} />
                <RHFTextField name="other" label={t('other social media')} />
              </Box>
            </FormSection>

            <Divider sx={{ my: 3 }} />

            <FormSection title={t('introduction letter')}>
              <RHFEditor
                lang="en"
                name="introduction_letter"
                label={t('introduction letter in english')}
                sx={{ textTransform: 'lowercase' }}
              />
              <RHFEditor
                lang="ar"
                name="arabic_introduction_letter"
                label={t('introduction letter in arabic')}
                sx={{ textTransform: 'lowercase' }}
              />
            </FormSection>

            {/* Sticks to the bottom of the viewport while scrolling a long form, so the person
                does not have to scroll back down to find Save after editing a field near the top. */}
            <Stack
              direction="row"
              justifyContent="flex-end"
              sx={{
                mt: 3,
                pt: 2,
                position: 'sticky',
                bottom: 0,
                bgcolor: 'background.paper',
                borderTop: (muiTheme) => `1px solid ${muiTheme.palette.divider}`,
              }}
            >
              <LoadingButton type="submit" variant="contained" loading={isSubmitting}>
                {t('save changes')}
              </LoadingButton>
            </Stack>
          </Card>
        </Grid>
      </Grid>
    </FormProvider>
  );
}
AccountGeneral.propTypes = {
  unitServiceData: PropTypes.object,
};
