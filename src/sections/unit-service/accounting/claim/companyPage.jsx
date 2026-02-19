import { useState, useEffect } from 'react';

import {
  Box,
  Table,
  Paper,
  Divider,
  TableRow,
  TextField,
  TableBody,
  TableCell,
  TableHead,
  Container,
  Typography,
  Button,
  TableContainer,
} from '@mui/material';

import { useTranslate } from 'src/locales';
import { useSnackbar } from 'src/components/snackbar';
import { useRouter } from 'src/routes/hooks';
import { paths } from 'src/routes/paths';
import { createEncounter, getNewAuthorizations } from 'src/services/claimService';
import { useNavigate } from 'react-router-dom';

const DATA = [
  {
    _id: '1',
    name: 'Ahmad Ali',
    email: 'ahmad@test.com',
    visitBefore: false,
  },
  {
    _id: '2',
    name: 'Sara Mohammad',
    email: 'sara@test.com',
    visitBefore: true,
  },
  {
    _id: '3',
    name: 'Omar Khaled',
    email: 'omar@test.com',
    visitBefore: false,
  },
];

export default function CompanyPage() {
  const [search, setSearch] = useState('');
  const [results, setResults] = useState([]);

  const { enqueueSnackbar } = useSnackbar();
  const navigate = useNavigate();

  const { t } = useTranslate();

  useEffect(() => {
    if (!search.trim()) {
      setResults([]);
      return;
    }

    const searchValue = search.toLowerCase().trim();

    const filtered = DATA.filter((u) => {
      const firstName = u.name.toLowerCase().split(' ')[0];

      return firstName.startsWith(searchValue) || u.email.toLowerCase().startsWith(searchValue);
    });

    setResults(filtered);
  }, [search]);

  const handleCreate = async () => {
    try {
      await createEncounter();

      navigate(paths.unitservice.accounting.claim.patientVisitView('ELG0001'));

      enqueueSnackbar('Visit created successfully', { variant: 'success' });
    } catch (error) {
      enqueueSnackbar('Failed to create visit', { variant: 'error' });
    }
  };

  return (
    <Box sx={{ py: 5 }}>
      <Container maxWidth={false} sx={{ px: 3 }}>
        {/* Search */}
        <Paper sx={{ p: 3, mb: 4, borderRadius: 3, bgcolor: '#f4f6f8' }}>
          <TextField
            fullWidth
            label={t('search Users')}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </Paper>

        {/* Search Results */}
        {results.length > 0 && (
          <Paper sx={{ borderRadius: 3 }}>
            <Box sx={{ p: 2 }}>
              <Typography fontWeight="bold">{t('search Results')}</Typography>
            </Box>
            <Divider />

            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Name</TableCell>
                    <TableCell>Email</TableCell>
                    <TableCell align="center">Actions</TableCell>
                  </TableRow>
                </TableHead>

                <TableBody>
                  {results.map((user) => (
                    <TableRow key={user._id}>
                      <TableCell>{user.name}</TableCell>
                      <TableCell>{user.email}</TableCell>

                      <TableCell align="center">
                        {/* Create (always visible) */}
                        <Button
                          size="small"
                          variant="contained"
                          onClick={() => handleCreate(user)}
                          sx={{ mr: 1 }}
                        >
                          Create Visit
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        )}
      </Container>
    </Box>
  );
}
