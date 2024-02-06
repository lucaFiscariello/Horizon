// Chakra imports
import {
  Box,
  Button,
  Flex,
  Icon,
  Image,
  Link,
  Text,
  useColorModeValue,
} from "@chakra-ui/react";
// Custom components
import Card from "components/card/Card.js";
// Assets
import PlayCircleOutlineSharpIcon from '@mui/icons-material/PlayCircleOutlineSharp';
import React from "react"
import DeleteIcon from '@mui/icons-material/Delete';
import HandymanIcon from '@mui/icons-material/Handyman';

export default function Project(props) {
  const { title, ranking, link, image,linkService,linkdeploy, ...rest } = props;
  // Chakra Color Mode
  const textColorPrimary = useColorModeValue("secondaryGray.900", "white");
  const textColorSecondary = "gray.400";
  const brandColor = useColorModeValue("brand.500", "white");
  const bg = useColorModeValue("white", "navy.700");
  const {project, onDelete} = props;

  const removeProject = React.useCallback(() => {
    onDelete(project);
  }, [onDelete, project]);

  return (
    <Card bg={bg} {...rest} p='14px'>
      <Flex align='center' direction={{ base: "column", md: "row" }}>
        <Image h='80px' w='80px' src={image} borderRadius='8px' me='20px' />
        <Box mt={{ base: "10px", md: "0" }}>
          <Text
            color={textColorPrimary}
            fontWeight='500'
            fontSize='md'
            mb='4px'>
            {title}
          </Text>
          <Text
            fontWeight='500'
            color={textColorSecondary}
            fontSize='sm'
            me='4px'>
            Project #{ranking} •{" "}
            <Link fontWeight='500' color={brandColor} href={link} fontSize='sm'>
              See project details
            </Link>
          </Text>
        </Box>

        
        <Link
          href={linkdeploy}
          me='16px'
          ms='875px'
          >
          <Button>
            <Icon as={PlayCircleOutlineSharpIcon} color='secondaryGray.500' h='18px' w='18px' />
          </Button>
        </Link>

        <Link
          href={linkService}
          me='16px'
          ms='auto'
          p='0px !important'>
          <Button>
            <Icon as={HandymanIcon} color='secondaryGray.500' h='18px' w='18px' />
          </Button>
        </Link>

        <Button>
          <Icon as={DeleteIcon} onClick={removeProject} color='secondaryGray.500' h='18px' w='18px' />
        </Button>


      </Flex>
    </Card>
  );
}
