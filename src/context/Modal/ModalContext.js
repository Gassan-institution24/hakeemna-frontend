import React, { createContext, useState, useCallback, useMemo } from 'react';
import PropTypes from 'prop-types';

const ModalContext = createContext();
export const useModal = ()=> React.useContext(ModalContext);
const GlobalModal = React.lazy(()=> import('./GlobalModal'));

export const ModalProvider = ({ children }) => {
    const [modalState, setModalState] = useState({
        open: false,
        title: '',
        content: null,
        actions: null
    });
    
    const showModal = useCallback((title,content, actions) =>{
        setModalState({
            open: true,
            title,
            content,
            actions
        });
    }, []);

    const hideModal = useCallback(()=>{
        setModalState((prev)=>({...prev, open: false}));
    }, []);

    const value = useMemo(()=>({
        showModal,
        hideModal
    }), [showModal, hideModal]);

    const renderedModal = useMemo(()=>
        
            <GlobalModal
                open={modalState.open}
                title={modalState.title}
                content={modalState.content}
                actions={modalState.actions}
                onClose={hideModal}
            />
        , [modalState, hideModal])

    return (
        <ModalContext.Provider value={value}>
            {children}
            {renderedModal}
        </ModalContext.Provider>
    )
}

ModalProvider.propTypes = {
    children: PropTypes.node.isRequired
}

export default ModalProvider;
