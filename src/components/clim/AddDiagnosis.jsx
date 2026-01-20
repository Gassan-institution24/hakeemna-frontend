import { useState } from 'react';

import {
  Box,
  Grid,
  Paper,
  Typography,
  TextField,
  Divider,
  List,
  ListItemButton,
  ListItemText,
  Chip,
} from '@mui/material';

import AddIcon from '@mui/icons-material/Add';
import DragIndicatorIcon from '@mui/icons-material/DragIndicator';

const DIAGNOSIS_LIST = [
  { code: 'A18.0', name: 'Tuberculosis of other specified joint' },
  { code: 'G44.2', name: 'Chronic tension type headache' },
  { code: 'R51', name: 'Headache' },
  { code: 'K08.1', name: 'Loss of teeth due to trauma' },
];

export default function AddDiagnosis() {
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState([]);

  const filtered = DIAGNOSIS_LIST.filter((d) =>
    d.name.toLowerCase().includes(search.toLowerCase())
  );

  const addDiagnosis = (item) => {
    if (selected.find((s) => s.code === item.code)) return;
    setSelected((prev) => [...prev, item]);
  };

  const removeDiagnosis = (code) => {
    setSelected((prev) => prev.filter((d) => d.code !== code));
  };

  return (
    <Paper sx={{ p: 2, mb: 2, borderRadius: 2 }}>
      <Typography fontWeight="bold" mb={2}>
        Add Diagnosis
      </Typography>

      <Grid container spacing={2}>
        {/* LEFT SIDE */}
        <Grid item xs={12} md={8}>
          <Box
            sx={{
              border: '2px dashed',
              borderColor: 'divider',
              borderRadius: 2,
              minHeight: 180,
              p: 2,
            }}
          >
            {selected.length === 0 ? (
              <Box
                sx={{
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'text.secondary',
                }}
              >
                <DragIndicatorIcon fontSize="large" />
                <Typography mt={1}>
                  Drag or Select Diagnosis
                </Typography>
              </Box>
            ) : (
              selected.map((item) => (
                <Chip
                  key={item.code}
                  label={`${item.code} - ${item.name}`}
                  onDelete={() => removeDiagnosis(item.code)}
                  sx={{ m: 0.5 }}
                  color="primary"
                  variant="outlined"
                />
              ))
            )}
          </Box>
        </Grid>

        {/* RIGHT SIDE */}
        <Grid item xs={12} md={4}>
          <TextField
            fullWidth
            size="small"
            placeholder="Search diagnosis"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          <Divider sx={{ my: 1 }} />

          <List dense sx={{ maxHeight: 180, overflow: 'auto' }}>
            {filtered.map((item) => (
              <ListItemButton
                key={item.code}
                onClick={() => addDiagnosis(item)}
              >
                <AddIcon fontSize="small" sx={{ mr: 1 }} />
                <ListItemText
                  primary={item.name}
                  secondary={item.code}
                />
              </ListItemButton>
            ))}
          </List>
        </Grid>
      </Grid>
    </Paper>
  );
}
