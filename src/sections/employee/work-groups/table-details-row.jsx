import PropTypes from 'prop-types';

import Box from '@mui/material/Box';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';

import { useLocales } from 'src/locales';
import { useAclGuard } from 'src/auth/guard/acl-guard';

// ----------------------------------------------------------------------

export default function TableDetailsRow({ row, selected, onView }) {
  const { code, name_english, name_arabic, employees } = row;

  const checkAcl = useAclGuard();

  const { currentLang } = useLocales();
  const curLangAr = currentLang.value === 'ar';

  const renderPrimary = (
    <TableRow hover selected={selected}>
      <TableCell
        sx={
          checkAcl({
            category: 'work_group',
            subcategory: 'permissions',
            acl: 'update',
          }) && {
            cursor: 'pointer',
            color: '#3F54EB',
          }
        }
        onClick={
          checkAcl({
            category: 'work_group',
            subcategory: 'permissions',
            acl: 'update',
          })
            ? onView
            : null
        }
        lang="ar"
        align="center"
      >
        <Box>{code}</Box>
      </TableCell>

      <TableCell
        sx={
          checkAcl({
            category: 'work_group',
            subcategory: 'permissions',
            acl: 'update',
          }) && {
            cursor: 'pointer',
            color: '#3F54EB',
          }
        }
        onClick={
          checkAcl({
            category: 'work_group',
            subcategory: 'permissions',
            acl: 'update',
          })
            ? onView
            : null
        }
        lang="ar"
        align="center"
      >
        {curLangAr ? name_arabic : name_english}
      </TableCell>
      <TableCell
        onClick={
          checkAcl({
            category: 'work_group',
            subcategory: 'permissions',
            acl: 'update',
          })
            ? onView
            : null
        }
        lang="ar"
        align="center"
      >
        {employees
          .map((employee) =>
            curLangAr
              ? employee?.employee?.employee?.name_arabic
              : employee.employee?.employee?.name_english
          )
          .join(', ')}
      </TableCell>
      <TableCell lang="ar" align="center" />
    </TableRow>
  );

  return <>{renderPrimary}</>;
}

TableDetailsRow.propTypes = {
  row: PropTypes.object,
  selected: PropTypes.bool,
  onView: PropTypes.func,
};
