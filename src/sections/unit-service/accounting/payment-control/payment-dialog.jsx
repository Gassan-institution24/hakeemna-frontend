import PropTypes from 'prop-types';
import { useForm } from 'react-hook-form';

import {
    Box,
    Stack,
    Button,
    Dialog,
    Typography,
    DialogTitle,
    DialogActions,
    DialogContent,
    InputAdornment,
} from '@mui/material';

import { useTranslate } from 'src/locales';

import FormProvider from 'src/components/hook-form/form-provider';
import { RHFTextField, RHFRadioGroup } from 'src/components/hook-form';
import { fDate } from 'src/utils/format-time';
import axiosInstance, { endpoints } from 'src/utils/axios';
import { useMemo } from 'react';

// ----------------------------------------------------------------------

export default function PaymentDialog({ open, onClose, row, refetch }) {
    const defaultValues = useMemo(
        () => ({
            amount: row.required_amount,
            payment_method: 'cash'
        }), [row.required_amount])
    const methods = useForm({ defaultValues });

    const { t } = useTranslate();

    const handlePayment = methods.handleSubmit(async (data) => {
        try {
            await axiosInstance.patch(endpoints.income_payment.pay(row._id), data)
            refetch()
        } catch (e) {
            // ss
        }
    })

    return (
        <Dialog fullWidth open={open} onClose={onClose}>
            <FormProvider methods={methods}>
                <DialogTitle sx={{ pb: 2, textTransform: 'capitalize' }}>{t('payment info')}</DialogTitle>
                <DialogContent>
                    <Stack direction='row' justifyContent='space-between' mb={2}>
                        <Typography variant='subtitle2'>{t('sequence')} : {row.sequence_number}</Typography>
                        <Typography variant='subtitle2'>{t('economic movement')} : {row.economic_movement?.sequence_number}-{fDate(row.economic_movement?.created_at, 'yyyy')}</Typography>
                    </Stack>
                    <Stack gap={2}>
                        <Stack gap={1}>
                            <Typography variant="subtitle2">{t('payment amount')}</Typography>
                            <RHFTextField
                                type="number"
                                name="amount"
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <Box sx={{ typography: 'subtitle2', color: 'text.disabled' }}>JOD</Box>
                                        </InputAdornment>
                                    ),
                                }}
                            />
                        </Stack>
                        <RHFRadioGroup
                            row
                            name="payment_method"
                            label={t('payment method')}
                            options={[
                                { label: 'cash', value: 'cash' },
                                { label: 'credit card', value: 'credit_card' },
                                { label: 'bank transfer', value: 'bank_transfer' },
                                { label: 'instant bank transfer', value: 'instant_transfere' },
                            ]}
                        />
                    </Stack>
                </DialogContent>

                <DialogActions>
                    <Button variant="outlined" color="inherit" onClick={onClose}>
                        Cancel
                    </Button>

                    <Button
                        variant="contained"
                        onClick={() => {
                            handlePayment();
                            onClose();
                        }}
                    >
                        Apply
                    </Button>
                </DialogActions>
            </FormProvider>
        </Dialog>
    );
}
PaymentDialog.propTypes = {
    open: PropTypes.bool,
    row: PropTypes.object,
    onClose: PropTypes.func,
    refetch: PropTypes.func,
};
