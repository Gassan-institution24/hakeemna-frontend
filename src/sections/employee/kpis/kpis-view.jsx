import PropTypes from 'prop-types';
import { CSS } from '@dnd-kit/utilities';
import { useState, useEffect } from 'react';
import { DndContext, closestCenter, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import {
  SortableContext,
  verticalListSortingStrategy,
  useSortable,
  arrayMove,
} from '@dnd-kit/sortable';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

import {
  Box,
  Card,
  Grid,
  Stack,
  Button,
  Drawer,
  Switch,
  Divider,
  Container,
  Typography,
  CircularProgress,
} from '@mui/material';
import Iconify from 'src/components/iconify';
import { useTranslate } from 'src/locales';

const navy = '#1e2a5a';
const teal = '#38b2ac';
const lightBg = '#f4f6f8';

const defaultWidgets = [
  { id: 'kpi1', label: 'KPI 1', visible: true },
  { id: 'kpi2', label: 'KPI 2', visible: true },
  { id: 'kpi3', label: 'KPI 3', visible: true },
  { id: 'chart', label: 'Performance Chart', visible: true },
  { id: 'stat1', label: 'Stat Card 1', visible: true },
  { id: 'stat2', label: 'Stat Card 2', visible: true },
  { id: 'stat3', label: 'Stat Card 3', visible: true },
  { id: 'stat4', label: 'Stat Card 4', visible: true },
];

const chartData = [
  { name: 1, uv: 200, pv: 400 },
  { name: 2, uv: 450, pv: 420 },
  { name: 3, uv: 250, pv: 300 },
  { name: 4, uv: 600, pv: 150 },
  { name: 5, uv: 650, pv: 500 },
  { name: 6, uv: 180, pv: 700 },
  { name: 7, uv: 620, pv: 600 },
  { name: 8, uv: 350, pv: 720 },
  { name: 9, uv: 150, pv: 760 },
];

function ProgressCard({ value }) {
  return (
    <Card
      sx={{
        height: 150,
        borderRadius: 3,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <Box position="relative">
        <CircularProgress variant="determinate" value={value} size={80} sx={{ color: teal }} />
        <Box
          position="absolute"
          inset={0}
          display="flex"
          alignItems="center"
          justifyContent="center"
        >
          <Typography fontWeight={700}>{value}%</Typography>
        </Box>
      </Box>
    </Card>
  );
}

function SortableItem({ id, label, visible, toggle }) {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <Box
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      sx={{
        p: 2,
        mb: 1,
        bgcolor: '#f9fafb',
        borderRadius: 2,
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        cursor: 'grab',
      }}
    >
      <Typography>{label}</Typography>
      <Switch checked={visible} onChange={toggle} />
    </Box>
  );
}

export default function KpisPage() {
  const [widgets, setWidgets] = useState(defaultWidgets);
  const [open, setOpen] = useState(false);
  const { t } = useTranslate();
  const sensors = useSensors(useSensor(PointerSensor));

  useEffect(() => {
    const saved = localStorage.getItem('dashboard-config');
    if (saved) setWidgets(JSON.parse(saved));
  }, []);

  const handleDragEnd = (event) => {
    const { active, over } = event;
    if (!over) return;

    if (active.id !== over.id) {
      const oldIndex = widgets.findIndex((w) => w.id === active.id);
      const newIndex = widgets.findIndex((w) => w.id === over.id);
      setWidgets(arrayMove(widgets, oldIndex, newIndex));
    }
  };

  const toggleVisibility = (id) => {
    setWidgets(widgets.map((w) => (w.id === id ? { ...w, visible: !w.visible } : w)));
  };

  const renderWidget = (id) => {
    switch (id) {
      case 'kpi1':
      case 'kpi2':
      case 'kpi3':
        return (
          <Grid item xs={12} md={4} key={id}>
            <ProgressCard value={80} />
          </Grid>
        );

      case 'chart':
        return (
          <Grid item xs={12} key={id}>
            <Card sx={{ p: 3, borderRadius: 3 }}>
              <Box
                sx={{
                  outline: 'none',
                  '& *:focus': { outline: 'none !important' },
                }}
              >
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Line type="monotone" dataKey="uv" stroke={navy} strokeWidth={2} />
                    <Line type="monotone" dataKey="pv" stroke={teal} strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              </Box>
            </Card>
          </Grid>
        );

      default:
        return (
          <Grid item xs={12} md={3} key={id}>
            <Card
              sx={{
                height: 120,
                borderRadius: 3,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Typography>NO.</Typography>
            </Card>
          </Grid>
        );
    }
  };

  return (
    <>
      <Container maxWidth="xl" sx={{ py: 4 }}>
        <Stack
          direction="row"
          alignItems="center"
          justifyContent="space-between"
          sx={{
            mb: { xs: 3, md: 5 },
          }}
        >
          <Typography variant="h4">{t('key performance indicators')}</Typography>
          <Button
            variant="contained"
            startIcon={<Iconify icon="mdi:pencil" />}
            onClick={() => setOpen(true)}
          >
            {t('Customize')}
          </Button>
        </Stack>

        <Grid container spacing={3}>
          {widgets.filter((w) => w.visible).map((w) => renderWidget(w.id))}
        </Grid>
      </Container>

      <Drawer anchor="left" open={open} onClose={() => setOpen(false)}>
        <Box sx={{ width: 350, p: 3 }}>
          <Typography variant="h6" fontWeight={700} mb={2}>
            Customize Dashboard
          </Typography>

          <Divider sx={{ mb: 2 }} />

          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
          >
            <SortableContext
              items={widgets.map((w) => w.id)}
              strategy={verticalListSortingStrategy}
            >
              {widgets.map((widget) => (
                <SortableItem
                  key={widget.id}
                  id={widget.id}
                  label={widget.label}
                  visible={widget.visible}
                  toggle={() => toggleVisibility(widget.id)}
                />
              ))}
            </SortableContext>
          </DndContext>

          <Divider sx={{ my: 2 }} />

          <Stack spacing={2}>
            <Button
              variant="contained"
              onClick={() => {
                localStorage.setItem('dashboard-config', JSON.stringify(widgets));
                setOpen(false);
              }}
            >
              Save Changes
            </Button>

            <Button variant="outlined" onClick={() => setWidgets(defaultWidgets)}>
              Reset to Default
            </Button>
          </Stack>
        </Box>
      </Drawer>
    </>
  );
}

ProgressCard.propTypes = {
  value: PropTypes.number.isRequired,
};
SortableItem.propTypes = {
  id: PropTypes.number.isRequired,
  label: PropTypes.string.isRequired,
  visible: PropTypes.bool.isRequired,
  toggle: PropTypes.func.isRequired,
};
