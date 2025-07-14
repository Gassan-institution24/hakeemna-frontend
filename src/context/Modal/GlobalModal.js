import React, { useState } from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button
} from '@mui/material';
import PropTypes from 'prop-types';

const GlobalModal = ({ open, title, content, actions, onClose }) => {
    // If content is a function, use local state and pass handlers
    const [localValue, setLocalValue] = useState('');
    const isContentFunction = typeof content === 'function';

    let renderedContent = content;
    if (isContentFunction) {
        renderedContent = content({
            value: localValue,
            setValue: setLocalValue,
            onChange: (e) => setLocalValue(e.target.value),
        });
    }

    let saveButton = null;
    let cancelButton = null;
    let customActions = null;
    if (typeof actions === 'function') {
        const result = actions(onClose, isContentFunction ? localValue : undefined);
        if (result && typeof result === 'object' && (result.onSave || result.onCancel)) {
            saveButton = (
                <Button variant="contained" color="primary" onClick={result.onSave}>
                    Save
                </Button>
            );
            cancelButton = (
                <Button variant="outlined" color="inherit" onClick={result.onCancel || onClose}>
                    Cancel
                </Button>
            );
        } else {
            customActions = result;
        }
    } else {
        cancelButton = (
            <Button variant="outlined" color="inherit" onClick={onClose}>
                Cancel
            </Button>
        );
    }

    return (
        <Dialog open={open} onClose={onClose} maxWidth='sm' fullWidth>
            <DialogTitle>{title}</DialogTitle>
            <DialogContent>{renderedContent}</DialogContent>
            <DialogActions>
                {saveButton}
                {cancelButton}
                {customActions}
            </DialogActions>
        </Dialog>
    );
};

GlobalModal.propTypes = {
    open: PropTypes.bool.isRequired,
    title: PropTypes.string.isRequired,
    content: PropTypes.oneOfType([PropTypes.node, PropTypes.func]).isRequired,
    actions: PropTypes.func,
    onClose: PropTypes.func.isRequired
};

export default GlobalModal;