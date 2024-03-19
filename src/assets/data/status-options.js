import { useTranslate } from 'src/locales';

// Custom hook to use the translate hook and return the array
export const StatusOptions = () => {
  const { t } = useTranslate();

  return {
    STATUS_OPTIONS: [
      // { value: 'all', label: t('all') },
      { value: 'active', label: t('active') },
      { value: 'inactive', label: t('inactive') },
    ],
    QC_STATUS_OPTIONS: [
      // { value: 'all', label: t('all') },
      { value: 'unread', label: t('unread') },
      { value: 'read', label: t('read') },
    ],
  };
};
