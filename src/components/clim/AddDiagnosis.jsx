import PropTypes from 'prop-types';
import { useState, useEffect } from 'react';

import AddIcon from '@mui/icons-material/Add';
import DragIndicatorIcon from '@mui/icons-material/DragIndicator';
import {
  Box,
  Grid,
  List,
  Chip,
  Paper,
  Divider,
  TextField,
  Typography,
  ListItemText,
  ListItemButton,
} from '@mui/material';

import { useLocales } from 'src/locales';

const DIAGNOSIS_LIST = [
  {
    code: 'A18.0',
    nameEn: 'Tuberculosis of other specified joint',
    nameAr: 'السل في مفصل محدد آخر',
  },
  {
    code: 'G44.2',
    nameEn: 'Chronic tension type headache',
    nameAr: 'صداع توتري مزمن',
  },
  {
    code: 'R51',
    nameEn: 'Headache',
    nameAr: 'صداع',
  },
  {
    code: 'K08.1',
    nameEn: 'Loss of teeth due to trauma',
    nameAr: 'فقدان الأسنان بسبب إصابة',
  },
];

export default function AddDiagnosis({ onDataChange }) {
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState([]);
  const { currentLang } = useLocales();
  const curLangAr = currentLang.value === 'ar';

  useEffect(() => {
  if (onDataChange) {
    onDataChange(selected);
  }
}, [selected, onDataChange]);


  const filtered = DIAGNOSIS_LIST.filter((d) => {
    const name = curLangAr ? d.nameAr : d.nameEn;
    return name.toLowerCase().includes(search.toLowerCase());
  });

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
          {curLangAr ? 'إضافة تشخيص' : 'Add Diagnosis'}
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
                <Typography mt={1}>{curLangAr ? 'اسحب أو اختر تشخيص' : 'Drag or Select Diagnosis'}</Typography>
              </Box>
            ) : (
              selected.map((item) => (
                <Chip
                  key={item.code}
                  label={`${item.code} - ${curLangAr ? item.nameAr : item.nameEn}`}
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
            placeholder={curLangAr ? 'ابحث عن تشخيص' : 'Search diagnosis'}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          <Divider sx={{ my: 1 }} />

          <List dense sx={{ maxHeight: 180, overflow: 'auto' }}>
            {filtered.map((item) => (
              <ListItemButton key={item.code} onClick={() => addDiagnosis(item)}>
                <AddIcon fontSize="small" sx={{ mr: 1 }} />
                <ListItemText
                  primary={curLangAr ? item.nameAr : item.nameEn}
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
AddDiagnosis.propTypes = {
  onDataChange: PropTypes.func,
};
