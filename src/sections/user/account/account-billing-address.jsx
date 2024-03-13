import PropTypes from 'prop-types';
// import { useState, useCallback } from 'react';

import Card from '@mui/material/Card';

// import { useBoolean } from 'src/hooks/use-boolean';

// import { usePopover } from 'src/components/custom-popover';

// import { AddressItem, AddressNewForm } from '../address';

// ----------------------------------------------------------------------

export default function AccountBillingAddress({ addressBook }) {
  // const [addressId, setAddressId] = useState('');
  // const DATA = [{ value: 'test' }];
  // const popover = usePopover();

  // const addressForm = useBoolean();

  // const handleAddNewAddress = useCallback((address) => {
  //   console.info('ADDRESS', address);
  // }, []);

  // const handleSelectedId = useCallback(
  //   (event, id) => {
  //     popover.onOpen(event);
  //     setAddressId(id);
  //   },
  //   [popover]
  // );

  // const handleClose = useCallback(() => {
  //   popover.onClose();
  //   setAddressId('');
  // }, [popover]);

  return (
    <>
      <Card>
        {/* <CardHeader
          title="Address Book"
          action={
            <Button
              size="small"
              color="primary"
              startIcon={<Iconify icon="mingcute:add-line" />}
              onClick={addressForm.onTrue}
            >
              Address
            </Button>
          }
        /> */}

        {/* <Stack spacing={2.5} sx={{ p: 3 }}>
          {DATA.map((address, idx)  => (
            <>
              <AddressItem
                variant="outlined"
                // key={idx}
                address={address}
                // action={
                //   <IconButton
                //     onClick={(event) => {
                //       handleSelectedId(event, `${address.id}`);
                //     }}
                //     sx={{ position: 'absolute', top: 8, right: 8 }}
                //   >
                //     <Iconify icon="eva:more-vertical-fill" />
                //   </IconButton>
                // }
                sx={{
                  p: 2.5,
                  borderRadius: 1,
                }}
              />
            </>
          ))}
        </Stack> */}
      </Card>

      {/* <CustomPopover open={popover.open} onClose={handleClose}>
        <MenuItem
          onClick={() => {
            handleClose();
            console.info('SET AS PRIMARY', addressId);
          }}
        >
          <Iconify icon="eva:star-fill" />
          Set as primary
        </MenuItem>

        <MenuItem
          onClick={() => {
            handleClose();
            console.info('EDIT', addressId);
          }}
        >
          <Iconify icon="solar:pen-bold" />
          Edit
        </MenuItem>

        <MenuItem
          onClick={() => {
            handleClose();
            console.info('DELETE', addressId);
          }}
          sx={{ color: 'error.main' }}
        >
          <Iconify icon="solar:trash-bin-trash-bold" />
          Delete
        </MenuItem>
      </CustomPopover> */}

      {/* <AddressNewForm
        open={addressForm.value}
        onClose={addressForm.onFalse}
        onCreate={handleAddNewAddress}
      /> */}
    </>
  );
}

AccountBillingAddress.propTypes = {
  addressBook: PropTypes.array,
};
