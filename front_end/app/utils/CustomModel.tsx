import React, { Component, FC } from 'react';
import { Modal, Box } from '@mui/material';

interface Props {
    open: boolean;
    setOpen: (open: boolean) => void;
    activeItem: any;
    component: any;
    setRoute?: (route: string) => void;
}

const CustomModal: FC<Props> = (props: Props) => {
    return (
        <Modal
            open={props.open}
            onClose={() => props.setOpen(false)}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
        >
            <Box className="absolute top-[50%] left-[50%] -translate-x-1/2 -translate-y-1/2 w-[450px] bg-white dark:bg-slate-900 rounded-[8px] shad p-4 outline-none">
                <Component setOpen={props.setOpen} setRoute={props.setRoute} />
            </Box>
        </Modal>

    )
}

export { CustomModal }
