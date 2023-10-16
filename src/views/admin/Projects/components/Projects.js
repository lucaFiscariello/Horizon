// Chakra imports
import { Text, useColorModeValue } from "@chakra-ui/react";
// Assets
import Project1 from "assets/img/profile/Project1.png";
// Custom components
import Card from "components/card/Card.js";
import React from "react";
import Project from "views/admin/Projects/components/Project";
import {listProjects} from "opensand/api/index.ts"
import {useDispatch,useSelector} from 'opensand/redux/index.ts';


export default function Projects(props) {

  const projects = useSelector((state) => state.project.projects);
  const dispatch = useDispatch();

  React.useEffect(() => {
    dispatch(listProjects());
  }, []);

  // Chakra Color Mode
  const textColorPrimary = useColorModeValue("secondaryGray.900", "white");
  const textColorSecondary = "gray.400";
  const cardShadow = useColorModeValue(
    "0px 18px 40px rgba(112, 144, 176, 0.12)",
    "unset"
  );
  
  let project = "#/project/"
  let projectDeploy = "#/deploy/"


  const projectsCards = projects.map((p, i) => (
    <Project
        boxShadow={cardShadow}
        mb='20px'
        image={Project1}
        ranking={i}
        link= {project.concat(p)}
        linkdeploy= {projectDeploy.concat(p)}
        title= {p}
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

    </Card>
  );
}
