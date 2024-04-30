// date-pickers
import merge from 'lodash/merge';
// import arLocale from 'date-fns/locale/ar';
import { enUS as enUSAdapter, arSA as arSAAdapter } from 'date-fns/locale';

import { enUS as enUSDate } from '@mui/x-date-pickers/locales';
// core
import { enUS as enUSCore, arSA as arSACore } from '@mui/material/locale';
// data-grid
import { enUS as enUSDataGrid, arSD as arSDDataGrid } from '@mui/x-data-grid';

// PLEASE REMOVE `LOCAL STORAGE` WHEN YOU CHANGE SETTINGS.
// ----------------------------------------------------------------------

export const langs = [
  {
    label: 'العربية',
    value: 'ar',
    systemValue: merge(arSDDataGrid, arSACore),
    adapterLocale: arSAAdapter,
    icon: 'mdi:abjad-arabic',
  },
  {
    label: 'English',
    value: 'en',
    systemValue: merge(enUSDate, enUSDataGrid, enUSCore),
    adapterLocale: enUSAdapter,
    icon: 'flagpack:gb-nir',
  },
  // {
  //   label: 'French',
  //   value: 'fr',
  //   systemValue: merge(frFRDate, frFRDataGrid, frFRCore),
  //   adapterLocale: frFRAdapter,
  //   icon: 'flagpack:fr',
  // },
  // {
  //   label: 'Vietnamese',
  //   value: 'vi',
  //   systemValue: merge(viVNDate, viVNDataGrid, viVNCore),
  //   adapterLocale: viVNAdapter,
  //   icon: 'flagpack:vn',
  // },
  // {
  //   label: 'Chinese',
  //   value: 'cn',
  //   systemValue: merge(zhCNDate, zhCNDataGrid, zhCNCore),
  //   adapterLocale: zhCNAdapter,
  //   icon: 'flagpack:cn',
  // },
];

export const defaultLangs = langs[0]; // English

// GET MORE COUNTRY FLAGS
// https://icon-sets.iconify.design/flagpack/
// https://www.dropbox.com/sh/nec1vwswr9lqbh9/AAB9ufC8iccxvtWi3rzZvndLa?dl=0
