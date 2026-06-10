import PropTypes from 'prop-types';
import { useState, useRef, useCallback } from 'react';

import AddIcon from '@mui/icons-material/Add';
import DragIndicatorIcon from '@mui/icons-material/DragIndicator';
import {
  Box,
  Chip,
  Grid,
  List,
  Paper,
  Divider,
  TextField,
  Typography,
  ListItemText,
  ListItemButton,
  CircularProgress,
} from '@mui/material';

import axiosInstance from 'src/utils/axios';
import { useLocales } from 'src/locales';

export default function AddDiagnosis({ onDataChange }) {
  const { currentLang } = useLocales();
  const curLangAr = currentLang.value === 'ar';

  const [search, setSearch]   = useState('');
  const [options, setOptions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selected, setSelected] = useState([]);

  const debounceRef = useRef(null);

  const fetchDiagnoses = useCallback(async (query) => {
    if (query.trim().length < 2) { setOptions([]); return; }
    setLoading(true);
    try {
      const res = await axiosInstance.get('/api/diagnosis/search', { params: { q: query } });
      setOptions(res.data || []);
    } catch {
      setOptions([]);
    } finally {
      setLoading(false);
    }
  }, []);

  const handleSearchChange = (e) => {
    const val = e.target.value;
    setSearch(val);
    clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => fetchDiagnoses(val), 300);
  };

  const addDiagnosis = (item) => {
    if (selected.find((s) => s.code === item.code)) return;
    const updated = [...selected, item];
    setSelected(updated);
    notify(updated);
    setSearch('');
    setOptions([]);
  };

  const removeDiagnosis = (code) => {
    const updated = selected.filter((d) => d.code !== code);
    setSelected(updated);
    notify(updated);
  };

  const notify = (list) => {
    if (!onDataChange) return;
    // First item = Principal, rest = Secondary
    onDataChange(
      list.map((d, i) => ({
        code:        d.code,
        description: d.description || d.nameEn || '',
        type:        i === 0 ? 'Principal' : 'Secondary',
      }))
    );
  };

  return (
    <Paper sx={{ p: 2, mb: 2, borderRadius: 2 }}>
      <Typography fontWeight="bold" mb={2}>
        {curLangAr ? 'إضافة تشخيص' : 'Add Diagnosis'}
      </Typography>

      <Grid container spacing={2}>
        {/* ── Selected diagnoses ── */}
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
                  {curLangAr
                    ? 'ابحث أو اكتب تشخيصًا وأضفه'
                    : 'Search or type a diagnosis and add it'}
                </Typography>
              </Box>
            ) : (
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                {selected.map((item, index) => (
                  <Chip
                    key={item.code}
                    label={`${index === 0 ? '★ ' : ''}${item.code}${item.nameEn ? ` — ${item.nameEn}` : ''}`}
                    onDelete={() => removeDiagnosis(item.code)}
                    color={index === 0 ? 'primary' : 'default'}
                    variant="outlined"
                    sx={{ maxWidth: 320 }}
                  />
                ))}
              </Box>
            )}
          </Box>
          {selected.length > 0 && (
            <Typography variant="caption" color="text.secondary" mt={0.5} display="block">
              {curLangAr ? '★ = التشخيص الرئيسي (Principal)' : '★ = Principal diagnosis · others are Secondary'}
            </Typography>
          )}
        </Grid>

        {/* ── Search panel ── */}
        <Grid item xs={12} md={4}>
          <TextField
            fullWidth
            size="small"
            placeholder={curLangAr ? 'ابحث بالرمز أو الاسم' : 'Search by ICD code or name'}
            value={search}
            onChange={handleSearchChange}
            InputProps={{
              endAdornment: loading ? <CircularProgress size={16} /> : null,
            }}
          />

          <Divider sx={{ my: 1 }} />

          {options.length === 0 && search.trim().length >= 2 && !loading && (
            <>
              <Typography variant="caption" color="text.secondary" px={1}>
                {curLangAr ? 'لا توجد نتائج' : 'No results'}
              </Typography>
              <ListItemButton
                onClick={() => addDiagnosis({ code: search.trim(), nameEn: search.trim() })}
              >
                <AddIcon fontSize="small" sx={{ mr: 1, flexShrink: 0 }} />
                <ListItemText
                  primary={
                    curLangAr
                      ? `إضافة "${search.trim()}" كتشخيص مخصص`
                      : `Add "${search.trim()}" as custom`
                  }
                  primaryTypographyProps={{ fontSize: 13 }}
                />
              </ListItemButton>
            </>
          )}

          <List dense sx={{ maxHeight: 220, overflow: 'auto' }}>
            {options.map((item) => (
              <ListItemButton
                key={item.code}
                onClick={() => addDiagnosis(item)}
                disabled={!!selected.find((s) => s.code === item.code)}
              >
                <AddIcon fontSize="small" sx={{ mr: 1, flexShrink: 0 }} />
                <ListItemText
                  primary={item.nameEn}
                  secondary={item.code}
                  primaryTypographyProps={{ fontSize: 13 }}
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
