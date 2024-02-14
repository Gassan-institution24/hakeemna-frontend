import PropTypes from 'prop-types';

import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import Collapse from '@mui/material/Collapse';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import IconButton from '@mui/material/IconButton';

import { useBoolean } from 'src/hooks/use-boolean';

import { fDateTime } from 'src/utils/format-time';

import Label from 'src/components/label';
import Iconify from 'src/components/iconify';
import { usePopover } from 'src/components/custom-popover';

// ----------------------------------------------------------------------

export default function TablesTableRow({ row, selected, onViewRow }) {
  const { tableName, documents } = row;

  const collapse = useBoolean();

  const popover = usePopover();

  function stackComponent({ arr, idx }) {
    return (
      <Stack
        key={idx}
        direction="row"
        alignItems="center"
        sx={{
          p: (theme) => theme.spacing(1.5, 2, 1.5, 1.5),
          '&:not(:last-of-type)': {
            borderBottom: (theme) => `solid 2px ${theme.palette.background.neutral}`,
          },
        }}
      >
        {arr?.map((item, index) =>
          item === 'active' || item === 'inactive' ? (
            <Box key={index} sx={{ flex: 1 }}>
              <Label
                variant="soft"
                color={
                  (item === 'active' && 'success') ||
                  (item === 'inactive' && 'warning') ||
                  'default'
                }
              >
                {item}{' '}
              </Label>
            </Box>
          ) : (
            <Box key={index} sx={{ flex: 1 }}>
              {item}
            </Box>
          )
        )}
      </Stack>
    );
  }

  const renderPrimary = (
    <TableRow hover selected={selected}>
      <TableCell align="center">
        <Box
          onClick={onViewRow}
          sx={{
            cursor: 'pointer',
            '&:hover': {
              textDecoration: 'underline',
            },
          }}
        >
          {tableName}
        </Box>
      </TableCell>

      <TableCell align="center">
        <Box>Note</Box>
      </TableCell>

      <TableCell align="right" sx={{ px: 1, whiteSpace: 'nowrap' }}>
        {/* <IconButton
          color={collapse.value ? 'inherit' : 'default'}
          onClick={collapse.onToggle}
          sx={{
            ...(collapse.value && {
              bgcolor: 'action.hover',
            }),
          }}
        >
          <Iconify icon="eva:arrow-ios-downward-fill" />
        </IconButton> */}

        <IconButton onClick={onViewRow} color={popover.open ? 'inherit' : 'default'}>
          <Iconify icon="majesticons:open" />
        </IconButton>
      </TableCell>
    </TableRow>
  );

  const renderSecondary = (
    <TableRow>
      <TableCell sx={{ p: 0, border: 'none' }} colSpan={8}>
        <Collapse
          in={collapse.value}
          timeout="auto"
          unmountOnExit
          sx={{ bgcolor: 'background.neutral' }}
        >
          {tableName === 'countries' && (
            <Stack component={Paper} sx={{ m: 1.5 }}>
              {stackComponent({ arr: ['Code', 'Name', 'Status', 'Created At', 'Updated At'] })}
              {documents.map((item, idx) =>
                stackComponent({
                  idx: { idx },
                  arr: [
                    item.code,
                    item.name_english,
                    item.status,
                    fDateTime(item.created_at),
                    fDateTime(item.updated_at),
                  ],
                })
              )}
            </Stack>
          )}
          {tableName === 'cities' && (
            <Stack component={Paper} sx={{ m: 1.5 }}>
              {stackComponent({
                arr: ['Code', 'Name', 'Country', 'Status', 'Created At', 'Updated At'],
              })}
              {documents.map((item, idx) =>
                stackComponent({
                  idx: { idx },
                  arr: [
                    item.code,
                    item.name_english,
                    item.country?.name_english,
                    item.status,
                    fDateTime(item.created_at),
                    fDateTime(item.updated_at),
                  ],
                })
              )}
            </Stack>
          )}
          {tableName === 'surgeries' && (
            <Stack component={Paper} sx={{ m: 1.5 }}>
              {stackComponent({ arr: ['Code', 'Name', 'Created At', 'Updated At'] })}
              {documents.map((item, idx) =>
                stackComponent({
                  idx: { idx },
                  arr: [
                    item.code,
                    item.name,
                    fDateTime(item.created_at),
                    fDateTime(item.updated_at),
                  ],
                })
              )}
            </Stack>
          )}
          {tableName === 'diseases' && (
            <Stack component={Paper} sx={{ m: 1.5 }}>
              {stackComponent({ arr: ['Code', 'Name', 'Category', 'Created At', 'Updated At'] })}
              {documents.map((item, idx) =>
                stackComponent({
                  idx: { idx },
                  arr: [
                    item.code,
                    item.name,
                    item.category?.name,
                    fDateTime(item.created_at),
                    fDateTime(item.updated_at),
                  ],
                })
              )}
            </Stack>
          )}
          {tableName === 'specialities' && (
            <Stack component={Paper} sx={{ m: 1.5 }}>
              {stackComponent({ arr: ['Code', 'Name', 'Created At', 'Updated At'] })}
              {documents.map((item, idx) =>
                stackComponent({
                  idx: { idx },
                  arr: [
                    item.code,
                    item.name_english,
                    fDateTime(item.created_at),
                    fDateTime(item.updated_at),
                  ],
                })
              )}
            </Stack>
          )}
          {tableName === 'sub_specialities' && (
            <Stack component={Paper} sx={{ m: 1.5 }}>
              {stackComponent({ arr: ['Code', 'Name', 'Specialty', 'Created At', 'Updated At'] })}
              {documents.map((item, idx) =>
                stackComponent({
                  idx: { idx },
                  arr: [
                    item.code,
                    item.name_english,
                    item.specialty?.name_english,
                    fDateTime(item.created_at),
                    fDateTime(item.updated_at),
                  ],
                })
              )}
            </Stack>
          )}
          {tableName === 'insurance_companies' && (
            <Stack component={Paper} sx={{ m: 1.5 }}>
              {stackComponent({
                arr: ['Code', 'Name', 'Country', 'Status', 'Created At', 'Updated At'],
              })}
              {documents.map((item, idx) =>
                stackComponent({
                  idx: { idx },
                  arr: [
                    item.code,
                    item.name,
                    item.country?.name,
                    item.status,
                    fDateTime(item.created_at),
                    fDateTime(item.updated_at),
                  ],
                })
              )}
            </Stack>
          )}
          {tableName === 'added_value_tax_GD' && (
            <Stack component={Paper} sx={{ m: 1.5 }}>
              {stackComponent({ arr: ['Code', 'Name', 'Created At', 'Updated At'] })}
              {documents.map((item, idx) =>
                stackComponent({
                  idx: { idx },
                  arr: [
                    item.code,
                    item.tax_name,
                    fDateTime(item.created_at),
                    fDateTime(item.updated_at),
                  ],
                })
              )}
            </Stack>
          )}
          {tableName === 'departments' && (
            <Stack component={Paper} sx={{ m: 1.5 }}>
              {stackComponent({
                arr: ['Code', 'Name', 'Unit Service', 'Created At', 'Updated At'],
              })}
              {documents.map((item, idx) =>
                stackComponent({
                  idx: { idx },
                  arr: [
                    item.code,
                    item.name_english,
                    item.unit_service?.name_english,
                    fDateTime(item.created_at),
                    fDateTime(item.updated_at),
                  ],
                })
              )}
            </Stack>
          )}
          {tableName === 'unit_services' && (
            <Stack component={Paper} sx={{ m: 1.5 }}>
              {stackComponent({
                arr: ['Code', 'Name', 'City', 'Status', 'Created At', 'Updated At'],
              })}
              {documents.map((item, idx) =>
                stackComponent({
                  idx: { idx },
                  arr: [
                    item.code,
                    item.name_english,
                    item.city?.name_english,
                    item.status,
                    fDateTime(item.created_at),
                    fDateTime(item.updated_at),
                  ],
                })
              )}
            </Stack>
          )}
          {tableName === 'medicines' && (
            <Stack component={Paper} sx={{ m: 1.5 }}>
              {stackComponent({
                arr: ['Code', 'Name', 'Country', 'Status', 'Created At', 'Updated At'],
              })}
              {documents.map((item, idx) =>
                stackComponent({
                  idx: { idx },
                  arr: [
                    item.code,
                    item.trade_name,
                    item.country?.name_english,
                    item.status,
                    fDateTime(item.created_at),
                    fDateTime(item.updated_at),
                  ],
                })
              )}
            </Stack>
          )}
          {tableName === 'appointment_types' && (
            <Stack component={Paper} sx={{ m: 1.5 }}>
              {stackComponent({ arr: ['Code', 'Name', 'Status', 'Created At', 'Updated At'] })}
              {documents.map((item, idx) =>
                stackComponent({
                  idx: { idx },
                  arr: [
                    item.code,
                    item.name,
                    item.status,
                    fDateTime(item.created_at),
                    fDateTime(item.updated_at),
                  ],
                })
              )}
            </Stack>
          )}
          {tableName === 'free_subscriptions' && (
            <Stack component={Paper} sx={{ m: 1.5 }}>
              {stackComponent({
                arr: ['Code', 'Name', 'General', 'Status', 'Created At', 'Updated At'],
              })}
              {documents.map((item, idx) =>
                stackComponent({
                  idx: { idx },
                  arr: [
                    item.code,
                    item.name,
                    item.general,
                    item.status,
                    fDateTime(item.created_at),
                    fDateTime(item.updated_at),
                  ],
                })
              )}
            </Stack>
          )}
          {tableName === 'symptoms' && (
            <Stack component={Paper} sx={{ m: 1.5 }}>
              {stackComponent({ arr: ['Code', 'Name', 'Created At', 'Updated At'] })}
              {documents.map((item, idx) =>
                stackComponent({
                  idx: { idx },
                  arr: [
                    item.code,
                    item.name,
                    fDateTime(item.created_at),
                    fDateTime(item.updated_at),
                  ],
                })
              )}
            </Stack>
          )}
          {tableName === 'patients' && (
            <Stack component={Paper} sx={{ m: 1.5 }}>
              {stackComponent({ arr: ['Code', 'Name', 'Status', 'Created At', 'Updated At'] })}
              {documents.map((item, idx) =>
                stackComponent({
                  idx: { idx },
                  arr: [
                    item.code,
                    item.first_name,
                    item.status,
                    fDateTime(item.created_at),
                    fDateTime(item.updated_at),
                  ],
                })
              )}
            </Stack>
          )}
          {tableName === 'diets' && (
            <Stack component={Paper} sx={{ m: 1.5 }}>
              {stackComponent({ arr: ['Code', 'Name', 'Created At', 'Updated At'] })}
              {documents.map((item, idx) =>
                stackComponent({
                  idx: { idx },
                  arr: [
                    item.code,
                    item.name,
                    fDateTime(item.created_at),
                    fDateTime(item.updated_at),
                  ],
                })
              )}
            </Stack>
          )}
          {tableName === 'currencies' && (
            <Stack component={Paper} sx={{ m: 1.5 }}>
              {stackComponent({ arr: ['Code', 'Name', 'Symbol', 'Created At', 'Updated At'] })}
              {documents.map((item, idx) =>
                stackComponent({
                  idx: { idx },
                  arr: [
                    item.code,
                    item.name_english,
                    item.symbol,
                    fDateTime(item.created_at),
                    fDateTime(item.updated_at),
                  ],
                })
              )}
            </Stack>
          )}
          {tableName === 'analyses' && (
            <Stack component={Paper} sx={{ m: 1.5 }}>
              {stackComponent({ arr: ['Code', 'Name', 'Created At', 'Updated At'] })}
              {documents.map((item, idx) =>
                stackComponent({
                  idx: { idx },
                  arr: [
                    item.code,
                    item.name,
                    fDateTime(item.created_at),
                    fDateTime(item.updated_at),
                  ],
                })
              )}
            </Stack>
          )}
          {tableName === 'medical_categories' && (
            <Stack component={Paper} sx={{ m: 1.5 }}>
              {stackComponent({ arr: ['Code', 'Name', 'Created At', 'Updated At'] })}
              {documents.map((item, idx) =>
                stackComponent({
                  idx: { idx },
                  arr: [
                    item.code,
                    item.name,
                    fDateTime(item.created_at),
                    fDateTime(item.updated_at),
                  ],
                })
              )}
            </Stack>
          )}
          {tableName === 'medicines_families' && (
            <Stack component={Paper} sx={{ m: 1.5 }}>
              {stackComponent({ arr: ['Code', 'Name', 'Created At', 'Updated At'] })}
              {documents.map((item, idx) =>
                stackComponent({
                  idx: { idx },
                  arr: [
                    item.code,
                    item.name,
                    fDateTime(item.created_at),
                    fDateTime(item.updated_at),
                  ],
                })
              )}
            </Stack>
          )}
          {tableName === 'unit_service_types' && (
            <Stack component={Paper} sx={{ m: 1.5 }}>
              {stackComponent({ arr: ['Code', 'Name', 'Created At', 'Updated At'] })}
              {documents.map((item, idx) =>
                stackComponent({
                  idx: { idx },
                  arr: [
                    item.code,
                    item.name_english,
                    fDateTime(item.created_at),
                    fDateTime(item.updated_at),
                  ],
                })
              )}
            </Stack>
          )}
          {tableName === 'activities' && (
            <Stack component={Paper} sx={{ m: 1.5 }}>
              {stackComponent({ arr: ['Code', 'Name', 'Created At', 'Updated At'] })}
              {documents.map((item, idx) =>
                stackComponent({
                  idx: { idx },
                  arr: [
                    item.code,
                    item.name_english,
                    fDateTime(item.created_at),
                    fDateTime(item.updated_at),
                  ],
                })
              )}
            </Stack>
          )}
          {tableName === 'employee_types' && (
            <Stack component={Paper} sx={{ m: 1.5 }}>
              {stackComponent({ arr: ['Code', 'Name', 'Created At', 'Updated At'] })}
              {documents.map((item, idx) =>
                stackComponent({
                  idx: { idx },
                  arr: [
                    item.code,
                    item.name_english,
                    fDateTime(item.created_at),
                    fDateTime(item.updated_at),
                  ],
                })
              )}
            </Stack>
          )}
          {tableName === 'payment_methods' && (
            <Stack component={Paper} sx={{ m: 1.5 }}>
              {stackComponent({ arr: ['Code', 'Name', 'Created At', 'Updated At'] })}
              {documents.map((item, idx) =>
                stackComponent({
                  idx: { idx },
                  arr: [
                    item.code,
                    item.name_english,
                    fDateTime(item.created_at),
                    fDateTime(item.updated_at),
                  ],
                })
              )}
            </Stack>
          )}
          {tableName === 'stakeholder_types' && (
            <Stack component={Paper} sx={{ m: 1.5 }}>
              {stackComponent({ arr: ['Code', 'Name', 'Created At', 'Updated At'] })}
              {documents.map((item, idx) =>
                stackComponent({
                  idx: { idx },
                  arr: [
                    item.code,
                    item.name_english,
                    fDateTime(item.created_at),
                    fDateTime(item.updated_at),
                  ],
                })
              )}
            </Stack>
          )}
          {tableName === 'work_shifts' && (
            <Stack component={Paper} sx={{ m: 1.5 }}>
              {stackComponent({ arr: ['Code', 'Name', 'Created At', 'Updated At'] })}
              {documents.map((item, idx) =>
                stackComponent({
                  idx: { idx },
                  arr: [
                    item.code,
                    item.name_english,
                    fDateTime(item.created_at),
                    fDateTime(item.updated_at),
                  ],
                })
              )}
            </Stack>
          )}
          {tableName === 'service_types' && (
            <Stack component={Paper} sx={{ m: 1.5 }}>
              {stackComponent({ arr: ['Code', 'Name', 'Created At', 'Updated At'] })}
              {documents.map((item, idx) =>
                stackComponent({
                  idx: { idx },
                  arr: [
                    item.code,
                    item.name_english,
                    fDateTime(item.created_at),
                    fDateTime(item.updated_at),
                  ],
                })
              )}
            </Stack>
          )}
          {tableName === 'measurement_types' && (
            <Stack component={Paper} sx={{ m: 1.5 }}>
              {stackComponent({ arr: ['Code', 'Name', 'Created At', 'Updated At'] })}
              {documents.map((item, idx) =>
                stackComponent({
                  idx: { idx },
                  arr: [
                    item.code,
                    item.name_english,
                    fDateTime(item.created_at),
                    fDateTime(item.updated_at),
                  ],
                })
              )}
            </Stack>
          )}
          {tableName === 'hospital_list' && (
            <Stack component={Paper} sx={{ m: 1.5 }}>
              {stackComponent({ arr: ['Code', 'Name', 'Created At', 'Updated At'] })}
              {documents.map((item, idx) =>
                stackComponent({
                  idx: { idx },
                  arr: [
                    item.code,
                    item.name_english,
                    fDateTime(item.created_at),
                    fDateTime(item.updated_at),
                  ],
                })
              )}
            </Stack>
          )}
          {tableName === 'deduction_config' && (
            <Stack component={Paper} sx={{ m: 1.5 }}>
              {stackComponent({ arr: ['Code', 'Name', 'Created At', 'Updated At'] })}
              {documents.map((item, idx) =>
                stackComponent({
                  idx: { idx },
                  arr: [
                    item.code,
                    item.name_english,
                    fDateTime(item.created_at),
                    fDateTime(item.updated_at),
                  ],
                })
              )}
            </Stack>
          )}
          {tableName === 'rooms' && (
            <Stack component={Paper} sx={{ m: 1.5 }}>
              {stackComponent({ arr: ['Code', 'Name', 'Created At', 'Updated At'] })}
              {documents.map((item, idx) =>
                stackComponent({
                  idx: { idx },
                  arr: [
                    item.code,
                    item.name_english,
                    fDateTime(item.created_at),
                    fDateTime(item.updated_at),
                  ],
                })
              )}
            </Stack>
          )}
        </Collapse>
      </TableCell>
    </TableRow>
  );

  return (
    <>
      {renderPrimary}

      {/* {renderSecondary} */}
    </>
  );
}

TablesTableRow.propTypes = {
  onViewRow: PropTypes.func,
  row: PropTypes.object,
  selected: PropTypes.bool,
};
