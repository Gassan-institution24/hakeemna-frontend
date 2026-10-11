import { useMemo, useState } from 'react';

import {
  Box,
  Card,
  Chip,
  Stack,
  Button,
  Container,
  TextField,
  Typography,
  InputAdornment,
} from '@mui/material';

import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';
import { RouterLink } from 'src/routes/components';

import { fDate } from 'src/utils/format-time';

import { useGetQuestionnaireTemplates } from 'src/api';

import Iconify from 'src/components/iconify';
import EmptyContent from 'src/components/empty-content';
import { LoadingScreen } from 'src/components/loading-screen';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';
import { allQuestions } from 'src/components/questionnaire/utils';

// ----------------------------------------------------------------------

// Superadmin: speciality questionnaires, grouped by speciality. Clinics pick these up from their
// own Questionnaires page.
export default function ChecklistTableView() {
  const router = useRouter();
  const { templates, loading } = useGetQuestionnaireTemplates();
  const [search, setSearch] = useState('');

  const groups = useMemo(() => {
    const query = search.trim().toLowerCase();
    const filtered = templates.filter(
      (one) =>
        !query ||
        [one.title, one.title_arabic, one.speciality?.name_english, one.speciality?.name_arabic]
          .filter(Boolean)
          .some((text) => text.toLowerCase().includes(query))
    );
    const bySpeciality = new Map();
    filtered.forEach((one) => {
      const name = one.speciality?.name_english || '—';
      if (!bySpeciality.has(name)) bySpeciality.set(name, []);
      bySpeciality.get(name).push(one);
    });
    return [...bySpeciality.entries()].sort(([a], [b]) => a.localeCompare(b));
  }, [templates, search]);

  if (loading) return <LoadingScreen />;

  return (
    <Container maxWidth="xl">
      <CustomBreadcrumbs
        heading="Questionnaires"
        links={[
          { name: 'dashboard', href: paths.superadmin.root },
          { name: 'Tables', href: paths.superadmin.tables.list },
          { name: 'Questionnaires' },
        ]}
        action={
          <Button
            component={RouterLink}
            href={paths.superadmin.tables.checklist.new}
            variant="contained"
            startIcon={<Iconify icon="mingcute:add-line" />}
          >
            New questionnaire
          </Button>
        }
        sx={{ mb: { xs: 3, md: 5 } }}
      />

      <TextField
        fullWidth
        placeholder="Search by title or speciality..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        sx={{ mb: 3, maxWidth: 480 }}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <Iconify icon="eva:search-fill" sx={{ color: 'text.disabled' }} />
            </InputAdornment>
          ),
        }}
      />

      {!groups.length && (
        <EmptyContent
          filled
          title="No questionnaires yet"
          description="Create one per speciality — clinics of that speciality can then switch it on."
          sx={{ py: 10 }}
        />
      )}

      <Stack spacing={4}>
        {groups.map(([speciality, rows]) => (
          <Box key={speciality}>
            <Typography variant="overline" sx={{ color: 'text.secondary' }}>
              {speciality}
            </Typography>
            <Box
              sx={{
                mt: 1,
                display: 'grid',
                gap: 2,
                gridTemplateColumns: {
                  xs: '1fr',
                  sm: 'repeat(2, minmax(0, 1fr))',
                  lg: 'repeat(3, minmax(0, 1fr))',
                },
              }}
            >
              {rows.map((row) => (
                <Card
                  key={row._id}
                  onClick={() => router.push(paths.superadmin.tables.checklist.edit(row._id))}
                  sx={{
                    p: 2.5,
                    cursor: 'pointer',
                    '&:hover': { boxShadow: (theme) => theme.customShadows?.z16 },
                  }}
                >
                  <Stack
                    direction="row"
                    justifyContent="space-between"
                    alignItems="flex-start"
                    spacing={1}
                  >
                    <Box sx={{ minWidth: 0 }}>
                      <Typography variant="subtitle1" noWrap>
                        {row.title}
                      </Typography>
                      {row.title_arabic && (
                        <Typography
                          variant="body2"
                          sx={{ color: 'text.secondary' }}
                          noWrap
                          dir="rtl"
                        >
                          {row.title_arabic}
                        </Typography>
                      )}
                    </Box>
                    <Chip
                      size="small"
                      label={row.active ? 'Published' : 'Hidden'}
                      color={row.active ? 'success' : 'default'}
                      variant="soft"
                    />
                  </Stack>
                  <Stack
                    direction="row"
                    spacing={2}
                    sx={{ mt: 2, color: 'text.secondary', typography: 'caption' }}
                  >
                    <span>#{row.code}</span>
                    <span>{row.sections?.length || 0} sections</span>
                    <span>{allQuestions(row).length} questions</span>
                    <span>v{row.version || 1}</span>
                    <Box component="span" sx={{ flexGrow: 1, textAlign: 'end' }}>
                      {fDate(row.updated_at)}
                    </Box>
                  </Stack>
                </Card>
              ))}
            </Box>
          </Box>
        ))}
      </Stack>
    </Container>
  );
}
