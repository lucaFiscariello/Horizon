import React from 'react';
import {Formik} from 'formik';
import type {FormikProps, FormikHelpers} from 'formik';

import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Parameter from 'opensand/Model/Parameter.tsx';
import {noActions} from 'opensand/utils/actions.ts';
import type {Parameter as ParameterType} from 'opensand/xsd/index.ts';

import useMediaQuery from '@mui/material/useMediaQuery';
import {ThemeProvider} from '@mui/material/styles';
import createTheme from 'opensand/utils/theme.ts';
import { setIdNewNode } from 'client/opensad-wrapper/clientModel';
import { addPhysicalEntity } from 'client/opensad-wrapper/clientModel';
import { addPhysicalMapping } from 'client/opensad-wrapper/clientModel';

interface Values {
    name: ParameterType;
    type: ParameterType;
}


const NewEntityDialog = (props: Props) => {
    const {entityName, entityType, onValidate, onClose} = props;    

    const nameParam = React.useMemo(() => {
        const cloned = {...entityName};
        cloned.readOnly = false;
        cloned.value = "";
        return cloned;
    }, [entityName]);

    const typeParam = React.useMemo(() => {
        const cloned = {...entityType};
        cloned.readOnly = false;
        cloned.value = "";
        return cloned;
    }, [entityType]);

    const initialValues: Values = React.useMemo(() => ({
        name: nameParam,
        type: typeParam,
    }), [nameParam, typeParam]);

    const handleClose = React.useCallback(() => {
        onClose();
    }, [onClose]);

    const handleSubmit = React.useCallback(async (values: Values, helpers: FormikHelpers<Values>): any => {

        if(props.createOnlyGW){
            onValidate(values.name.value, "Gateway");
            await addPhysicalMapping(props.nameProject,props.nameGwPhysical,values.name.value)
        }
        else{
            onValidate(values.name.value, values.type.value);
            await addPhysicalEntity(props.nameProject,values.name.value,values.type.value)
        }


        handleClose();
       
    }, [onValidate, handleClose]);


    const prefersDarkMode = useMediaQuery("(prefers-color-scheme: dark)");
    const theme = React.useMemo(() => createTheme(prefersDarkMode), [prefersDarkMode]);


    return (
        <ThemeProvider theme={theme}>

            <Dialog open={true} onClose={handleClose}>
                <Formik initialValues={initialValues} onSubmit={handleSubmit}>
                    {(formik: FormikProps<Values>) => (
                        <form onSubmit={formik.handleSubmit}>
                            <DialogTitle>Add a new Entity in your Platform</DialogTitle>
                            <DialogContent>
                                <DialogContentText>
                                    Please give a name and select the role of your machine!
                                </DialogContentText>
                                <Parameter parameter={formik.values.name} prefix="name" form={formik} actions={noActions} autosave={false} />
                                {(!props.createOnlyGW && <Parameter parameter={formik.values.type} prefix="type" form={formik} actions={noActions} autosave={false} />                                )}

                            </DialogContent>
                            <DialogActions>
                                <Button onClick={handleClose} color="primary">Cancel</Button>
                                <Button type="submit" color="primary">Add Entity</Button>
                            </DialogActions>
                        </form>
                    )}
                </Formik>
            </Dialog>
        
        </ThemeProvider>

    );
};


interface Props {
    entityName: ParameterType;
    entityType: ParameterType;
    nameProject: any;
    machines : any;
    onValidate: (entity: string, entityType: string) => void;
    onClose: () => void;
    createOnlyGW:any;
    nameGwPhysical:any
    
}


export default NewEntityDialog;