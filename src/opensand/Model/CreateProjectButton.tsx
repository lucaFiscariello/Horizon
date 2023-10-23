import React from 'react';

import Button from '@mui/material/Button';

import {createProject} from 'opensand/api/index.ts';
import {useSelector, useDispatch} from 'opensand/redux/index.ts';
import {useOpen} from 'opensand/utils/hooks.tsx';
import SingleFieldDialog from 'opensand/Model/SingleFieldDialog.tsx';
import useMediaQuery from '@mui/material/useMediaQuery';
import {ThemeProvider} from '@mui/material/styles';
import createTheme from 'opensand/utils/theme.ts';
import "assets/css/style.css"


const CreateProjectButton: React.FC<Props> = (props) => {

    const prefersDarkMode = useMediaQuery("(prefers-color-scheme: dark)");
    const theme = React.useMemo(() => createTheme(prefersDarkMode), [prefersDarkMode]);

    const status = useSelector((state: { project: { status: any; }; }) => state.project.status);
    const dispatch = useDispatch();

    const [projectName, setProjectName] = React.useState<string>("");
    const [open, handleOpen, handleClose] = useOpen();

    const doCreateProject = React.useCallback((project: string) => {
        if (project) {
            setProjectName(project);
            dispatch(createProject({project}));
        }
        handleClose();
    }, [dispatch, handleClose]);

    React.useEffect(() => {
        if (projectName && status === "created") {
            setProjectName("");
        }
    }, [status, projectName]);

    return (

        <ThemeProvider theme={theme}>

            <React.Fragment>
                <button className="button" onClick={handleOpen}>Create</button>
                <SingleFieldDialog
                    open={open}
                    title="New Project"
                    description="Please enter the name of your new project."
                    fieldLabel="Project Name"
                    onValidate={doCreateProject}
                    onClose={handleClose}
                />
            </React.Fragment>
            
        </ThemeProvider>
    );
};


interface Props {
}


export default CreateProjectButton;