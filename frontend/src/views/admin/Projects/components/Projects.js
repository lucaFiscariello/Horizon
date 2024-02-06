// Chakra imports
import { Text, useColorModeValue } from "@chakra-ui/react";
// Assets
import Project1 from "assets/img/profile/Project1.png";
// Custom components
import Card from "components/card/Card.js";
import React from "react";
import Project from "views/admin/Projects/components/Project";
import {deleteProject,listProjects} from "opensand/api/index.ts"
import {useDispatch,useSelector} from 'opensand/redux/index.ts';

import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Button from '@mui/material/Button';

import useMediaQuery from '@mui/material/useMediaQuery';
import {ThemeProvider} from '@mui/material/styles';
import createTheme from 'opensand/utils/theme.ts';


export default function Projects(props) {

  const prefersDarkMode = useMediaQuery("(prefers-color-scheme: dark)");
  const theme = React.useMemo(() => createTheme(prefersDarkMode), [prefersDarkMode]);

  const [deleteThis, setProjectToDelete] = React.useState(null);
  const projects = useSelector((state) => state.project.projects);
  const dispatch = useDispatch();

  React.useEffect(() => {
    dispatch(listProjects());
  }, []);

  const clearDeleteProject = React.useCallback(() => {
    setProjectToDelete(null);
  }, []);

  const handleDeleteProject = React.useCallback(() => {
      setProjectToDelete((removable) => {
          if (removable != null) {
              dispatch(deleteProject({project: removable}));
          }
          return null;
      });
  }, [dispatch]);


  // Chakra Color Mode
  const textColorPrimary = useColorModeValue("secondaryGray.900", "white");
  const textColorSecondary = "gray.400";
  const cardShadow = useColorModeValue(
    "0px 18px 40px rgba(112, 144, 176, 0.12)",
    "unset"
  );
  
  let project = "#/project/"
  let projectDeploy = "#/deploy/"
  let projectService = "#/service/"


  const projectsCards = projects.map((p, i) => (
    <Project
        boxShadow={cardShadow}
        mb='20px'
        image={Project1}
        ranking={i}
        link= {project.concat(p)}
        linkdeploy= {projectDeploy.concat(p)}
        linkService = {projectService.concat(p)}
        title= {p}
        onDelete={setProjectToDelete}
        project={p}
      />
  ));

  return (
    <Card mb={{ base: "0px", "2xl": "20px" }}>
      <Text
        color={textColorPrimary}
        fontWeight='bold'
        fontSize='2xl'
        mt='10px'
        mb='4px'>
        All projects
      </Text>
      <Text color={textColorSecondary} fontSize='md' me='26px' mb='40px'>
        Here you can find more details about your projects. Keep you user
        engaged by providing meaningful information.
      </Text>


      {projectsCards}

      <ThemeProvider theme={theme}>

          <Dialog open={deleteThis != null} onClose={clearDeleteProject}>
                    <DialogTitle>Delete a project</DialogTitle>
                    <DialogContent>
                        <DialogContentText>You're about to delete project {deleteThis}!</DialogContentText>
                        <DialogContentText>This action can't be reverted, are you sure?</DialogContentText>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={clearDeleteProject} color="primary">No, Keep it</Button>
                        <Button onClick={handleDeleteProject} color="primary">Yes, Delete {deleteThis}</Button>
                    </DialogActions>
          </Dialog>
       </ThemeProvider>


    </Card>
  );
}
