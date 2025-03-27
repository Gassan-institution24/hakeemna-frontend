import React from 'react';

import { Box, List, Paper, ListItem, Container, Typography, ListItemText } from '@mui/material';

export default function TermsAndCondition() {
  return (
    <Container maxWidth="lg" sx={{ display: 'flex', py: 4 }}>
      {/* Sidebar */}
      <Box sx={{ width: '25%', pr: 2 }}>
        <Typography variant="h6" gutterBottom>
          السياسات المتعلقة بالمستخدمين
        </Typography>
        <Paper elevation={3} sx={{ p: 2, backgroundColor: '#e0f2f1' }}>
          <List>
            <ListItem button>
              <ListItemText primary="تعريف المصطلحات" />
            </ListItem>
            <ListItem button>
              <ListItemText primary="شروط الاستخدام" />
            </ListItem>
            <ListItem button>
              <ListItemText primary="سياسة الخصوصية" />
            </ListItem>
          </List>
        </Paper>
      </Box>

      {/* Main Content */}
      <Box sx={{ width: '75%' }}>
        <Typography variant="h5" align="center" gutterBottom>
          السياسات المتعلقة بالمستخدمين الباحثين عن الخدمات الطبية (مرضى والأطباء)
        </Typography>
        <Paper elevation={3} sx={{ p: 3, backgroundColor: '#f0f8f8' }}>
          <Box>
            <Typography variant="h6" gutterBottom>
              تعريف المصطلحات
            </Typography>
            <Typography variant="body1" paragraph>
              التعريف الأول: هذا النص هو مثال لتعريف المصطلحات المستخدمة في هذه الصفحة.
            </Typography>
            <Typography variant="body1" paragraph>
              التعريف الثاني: يمكن إضافة المزيد من النصوص وفقًا للمحتوى الفعلي.
            </Typography>
          </Box>
        </Paper>
      </Box>
    </Container>
  );
}