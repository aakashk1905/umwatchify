import React, { useEffect, useState } from "react";
import {
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  TableContainer,
  IconButton,
  FormControl,
  FormLabel,
  Input,
  Stack,
  ButtonGroup,
  Button,
  Popover,
  PopoverTrigger,
  PopoverContent,
  FocusLock,
  PopoverArrow,
  PopoverCloseButton,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import { EditIcon } from "@chakra-ui/icons";
import axios from "axios";
import crypto from "crypto-js";

const Mentor = () => {
  const [videos, setVideos] = useState([]);
  const [lectureNumber, setLectureNumber] = useState("");
  const [videoLink, setVideoLink] = useState("");
  const toast = useToast();
  useEffect(() => {
    function decryptData(encryptedData) {
      const bytes = crypto.AES.decrypt(
        encryptedData,
        process.env.REACT_APP_KEY
      );
      const decryptedData = bytes.toString(crypto.enc.Utf8);
      return JSON.parse(decryptedData);
    }

    const fetchVideos = async () => {
      try {
        const response = await axios.get("https://api.upskillmafia.com/api/v1/videos");
        const videos = decryptData(response.data.data);
        setVideos(videos.videos);
      } catch (error) {
        console.error("Error fetching videos:", error);
      }
    };

    fetchVideos();
  }, []);

  const handleSubmit = async () => {
    if (lectureNumber === "" || videoLink === "") {
      toast({
        title: "Validation Failed",
        description: "Please Fill All Required Fields",
        status: "error",
        duration: 9000,
        isClosable: true,
      });
      return;
    }

    try {
      const response = await axios.post(
        `https://api.upskillmafia.com/api/v1/video/add`,
        { lec: lectureNumber, link: videoLink }
      );
      if (response.data.success) {
        toast({
          title: "Success!!!",
          description: "Added The Video",
          status: "success",
          duration: 9000,
          isClosable: true,
        });
        setTimeout(() => {
          window.location.reload();
        }, 1000);
      } else {
        toast({
          title: "Failed!!!",
          description: response.data.message,
          status: "error",
          duration: 9000,
          isClosable: true,
        });
      }
    } catch (error) {
      console.error("Error updating video:", error);
    }

    setLectureNumber("");
    setVideoLink("");
  };

  return (
    <div className="mentor-cont">
      <div className="mentor-form">
        <div className="mentor-inps">
          <FormControl isRequired>
            <FormLabel>Lecture Number</FormLabel>
            <Input
              placeholder="Lecture Number"
              value={lectureNumber}
              onChange={(e) => setLectureNumber(e.target.value)}
            />
          </FormControl>
          <FormControl isRequired>
            <FormLabel>Link</FormLabel>
            <Input
              placeholder="Video Link"
              value={videoLink}
              onChange={(e) => setVideoLink(e.target.value)}
            />
          </FormControl>
        </div>
        <Button paddingX="50px" colorScheme="teal" onClick={handleSubmit}>
          Submit
        </Button>
      </div>
      <div className="mentor-details">
        <TableContainer>
          <Table variant="striped" colorScheme="teal">
            <Thead>
              <Tr>
                <Th>Lecture Number</Th>
                <Th>Link</Th>
                <Th isNumeric>Edit</Th>
              </Tr>
            </Thead>
            <Tbody>
              {videos.map((v, ind) => {
                return <VideoRow key={ind} video={v} />;
              })}
            </Tbody>
          </Table>
        </TableContainer>
      </div>
    </div>
  );
};

const VideoRow = ({ video }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const firstFieldRef = React.useRef(null);
  const toast = useToast();

  return (
    <Tr key={video.id}>
      <Td>{video.lec}</Td>
      <Td>{video.link}</Td>
      <Td isNumeric>
        <Popover
          isOpen={isOpen}
          initialFocusRef={firstFieldRef}
          onOpen={onOpen}
          onClose={onClose}
          placement="right"
          closeOnBlur={false}
        >
          <PopoverTrigger>
            <IconButton size="sm" icon={<EditIcon />} />
          </PopoverTrigger>
          <PopoverContent p={5}>
            <FocusLock returnFocus persistentFocus={false}>
              <PopoverArrow />
              <PopoverCloseButton />
              <Form
                firstFieldRef={firstFieldRef}
                onCancel={onClose}
                onSave={(values) => handleSave(values, toast)}
                video={video}
              />
            </FocusLock>
          </PopoverContent>
        </Popover>
      </Td>
    </Tr>
  );
};

const TextInput = React.forwardRef((props, ref) => {
  return (
    <FormControl>
      <FormLabel htmlFor={props.id}>{props.label}</FormLabel>
      <Input ref={ref} id={props.id} {...props} />
    </FormControl>
  );
});

const handleSave = async (values, toast) => {
  try {
    const response = await axios.put(
      `https://api.upskillmafia.com/api/v1/video/edit`,
      values
    );
    if (response.data.success) {
      toast({
        title: "Success!!!",
        description: "Updated the url of video",
        status: "success",
        duration: 9000,
        isClosable: true,
      });
      setTimeout(() => {
        window.location.reload();
      }, 1000);
    } else {
      toast({
        title: "Failed!!!",
        description: response.data.message,
        status: "error",
        duration: 9000,
        isClosable: true,
      });
    }
  } catch (error) {
    console.error("Error updating video:", error);
  }
};

const Form = ({ firstFieldRef, onCancel, onSave, video }) => {
  const { lec, link } = video;
  const [updatedLec, setUpdatedLec] = useState(lec);
  const [updatedLink, setUpdatedLink] = useState(link);

  const handleSaveClick = async () => {
    try {
      await onSave({ lec: updatedLec, link: updatedLink });
      onCancel();
    } catch (error) {
      console.error("Error saving video:", error);
    }
  };

  return (
    <Stack spacing={4}>
      <TextInput
        label="Lecture Number"
        id="first-name"
        value={updatedLec}
        onChange={(e) => setUpdatedLec(e.target.value)}
      />
      <TextInput
        label="Link"
        id="link"
        ref={firstFieldRef}
        value={updatedLink}
        onChange={(e) => setUpdatedLink(e.target.value)}
      />
      <ButtonGroup display="flex" justifyContent="flex-end">
        <Button variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button colorScheme="teal" onClick={handleSaveClick}>
          Save
        </Button>
      </ButtonGroup>
    </Stack>
  );
};

export default Mentor;
