import { ROUTE_CONSTANTS } from "@/constants/routes";
import { AuthContext } from "@/contexts/AuthContext";
import {
    Box,
    Button,
    Container,
    Flex,
    FormControl,
    FormLabel,
    Grid,
    GridItem,
    Heading,
    IconButton,
    Image,
    Input,
    Modal,
    ModalBody,
    ModalCloseButton,
    ModalContent,
    ModalFooter,
    ModalHeader,
    ModalOverlay,
    Select,
    Stack,
    Text,
    useDisclosure,
} from "@chakra-ui/react";
import { useContext, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faClose, faPlus, faShop } from "@fortawesome/free-solid-svg-icons";
import provinces from "@/assets/images/city";
import { useForm } from "react-hook-form";
import { LoadingContext } from "@/contexts/LoadingContext";
import { callAPI } from "@/services/api.service";
import useStore from "@/hooks/useStore";
import useLocationGeo from "@/hooks/useLocationGeo";
import { storeFuncPath as path } from "@/utils";
function StorePage() {
    const { setStore } = useStore();
    const { isOpen, onOpen, onClose } = useDisclosure();
    const [stores, setStores] = useState([]);
    const { setLoading } = useContext(LoadingContext);
    const { auth } = useContext(AuthContext);
    const [imageFiles, setImageFiles] = useState([]);
    const navigate = useNavigate();
    const { location } = useLocationGeo();
    const imageInputRef = useRef(null);
    const [storeAdded, setStoreAdded] = useState(false);
    const handleBoxClick = () => {
        if (imageInputRef.current) {
            imageInputRef.current.click();
        }
    };
    const handlePushImage = (event) => {
        const file = event.target.files[0];
        if (imageFiles.length > 0) {
            setImageFiles((prev) => [...prev, file]);
        } else {
            setImageFiles([file]);
        }
    };
    const onSubmit = async (data) => {
        setLoading(true);
        const formData = new FormData();
        formData.append("longitude", location.longitude);
        formData.append("latitude", location.latitude);
        formData.append("name", data.name);
        formData.append("businessType", data.businessType);
        if (data.thumbnail.length > 0) {
            formData.append("thumbnail", data.thumbnail[0]);
        }
        if (data.videos.length) {
            for (const file of data.videos) {
                formData.append("videos", file);
            }
        }
        formData.append("provinceId", data.provinceId);
        formData.append("detailAddress", data.detailAddress);
        const openingHours = data.openHours + "-" + data.closeHours;
        formData.append("openingHours", openingHours);
        imageFiles.forEach((file) => formData.append("images", file));
        try {
            const url = path.createStore();
            const res = await fetch(url, {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${auth?.token}`,
                },
                body: formData,
            });
            if (!res.ok) {
                throw new Error("Failed to create store");
            }
            onClose();
            setLoading(false);
            setStoreAdded(true);
        } catch (error) {
            console.log(error);
        }
    };
    const { register, handleSubmit } = useForm();
    useEffect(() => {
        if (!(auth?.user?.roles && auth.user.roles.includes("store-owner"))) {
            navigate(ROUTE_CONSTANTS.HOME_PAGE);
        }
    }, [auth, navigate]);
    useEffect(() => {
        const fetchStores = async () => {
            const resultData = await callAPI(
                `${import.meta.env.VITE_STORES_URL}/my-stores`,
                "GET",
                null,
                {
                    Authorization: `Bearer ${auth?.token}`,
                },
                setLoading
            );
            setStores(resultData);
            setStoreAdded(false);
        };
        fetchStores();
    }, [auth.token, setLoading, storeAdded]);
    if (auth?.user?.roles && auth.user.roles.includes("store-owner")) {
        return (
            <Container maxW={"container.2xl"} padding={8}>
                <Flex>
                    <Heading>Your Store</Heading>
                    <IconButton onClick={onOpen}>
                        <FontAwesomeIcon icon={faShop} />
                    </IconButton>
                </Flex>
                <Grid width={"100%"} gap={18} templateColumns={"repeat(4, 1fr)"}>
                    <Modal isOpen={isOpen} onClose={onClose}>
                        <ModalOverlay />
                        <form onSubmit={handleSubmit(onSubmit)}>
                            <ModalContent maxWidth={"570px"}>
                                <ModalHeader>Add new store</ModalHeader>
                                <ModalCloseButton />
                                <ModalBody>
                                    <Flex gap={4}>
                                        <FormControl isRequired>
                                            <FormLabel>Name store</FormLabel>
                                            <Input {...register("name")} placeholder="Enter your store name" />
                                        </FormControl>
                                        <FormControl isRequired>
                                            <FormLabel>Type of business</FormLabel>
                                            <Select {...register("businessType")} placeholder="Select type of business">
                                                <option value="cafe">Cafe</option>
                                                <option value="food store">Food store</option>
                                            </Select>
                                        </FormControl>
                                    </Flex>
                                    <Flex gap={4} marginTop={4}>
                                        <FormControl isRequired>
                                            <FormLabel>Time Open</FormLabel>
                                            <Input {...register("openHours")} type="time" />
                                        </FormControl>
                                        <FormControl isRequired>
                                            <FormLabel>Time Close</FormLabel>
                                            <Input {...register("closeHours")} type="time" />
                                        </FormControl>
                                    </Flex>
                                    <Flex gap={4} marginTop={4}>
                                        <FormControl isRequired>
                                            <FormLabel>Province</FormLabel>
                                            <Select {...register("provinceId")} placeholder="Select province">
                                                {provinces.map((item, index) => (
                                                    <option key={index} value={item.id}>
                                                        {item.name}
                                                    </option>
                                                ))}
                                            </Select>
                                        </FormControl>
                                        <FormControl isRequired>
                                            <FormLabel>Address</FormLabel>
                                            <Input {...register("detailAddress")} placeholder="Enter location" />
                                        </FormControl>
                                    </Flex>
                                    <Flex gap={4} marginTop={4}>
                                        <FormControl isRequired>
                                            <FormLabel>Thumbnail</FormLabel>
                                            <Input {...register("thumbnail")} type="file" />
                                        </FormControl>
                                        <FormControl isRequired>
                                            <FormLabel>Video</FormLabel>
                                            <Input {...register("videos")} multiple type="file" />
                                        </FormControl>
                                    </Flex>
                                    <FormControl isRequired marginTop={4}>
                                        <FormLabel>Store Image</FormLabel>
                                        <Input
                                            type="file"
                                            className="hidden"
                                            onChange={handlePushImage}
                                            ref={imageInputRef}
                                        />
                                        <Flex marginTop={4} gap={4} flexWrap={"wrap"}>
                                            {imageFiles?.map((file, index) => (
                                                <Box key={index} width={"100px"} height={"100px"} position={"relative"}>
                                                    <Image
                                                        width={"100%"}
                                                        height={"100%"}
                                                        src={URL.createObjectURL(file)}
                                                        borderRadius={"lg"}
                                                        cursor={"pointer"}
                                                    />
                                                    <FontAwesomeIcon
                                                        onClick={() =>
                                                            setImageFiles((prev) =>
                                                                prev.filter((item) => item !== file)
                                                            )
                                                        }
                                                        className="absolute top-0 right-0 cursor-pointer"
                                                        icon={faClose}
                                                    />
                                                </Box>
                                            ))}
                                            <Box
                                                width={"100px"}
                                                height={"100px"}
                                                bg={"gray.100"}
                                                borderRadius={"lg"}
                                                justifyContent={"center"}
                                                display={"flex"}
                                                alignItems={"center"}
                                                cursor={"pointer"}
                                                onClick={handleBoxClick}
                                            >
                                                <FontAwesomeIcon icon={faPlus} />
                                            </Box>
                                        </Flex>
                                    </FormControl>
                                </ModalBody>

                                <ModalFooter>
                                    <Button variant={"ghost"} mr={3} onClick={onClose}>
                                        Close
                                    </Button>
                                    <Button type="submit" colorScheme="blue">
                                        Add
                                    </Button>
                                </ModalFooter>
                            </ModalContent>
                        </form>
                    </Modal>
                    {stores.map((item, index) => (
                        <GridItem
                            colSpan={1}
                            key={index}
                            height={"460px"}
                            onClick={() => {
                                navigate(`/store/${item["_id"]}`);
                                setStore(item);
                            }}
                        >
                            <Stack
                                height={"100%"}
                                borderRadius={"2xl"}
                                boxShadow={"xl"}
                                padding={"20px"}
                                className="hover:scale-105 duration-300 ease-in-out cursor-pointer"
                            >
                                <Image width={"100%"} borderRadius={"lg"} height={"250px"} src={item.thumbnailUrl} />
                                <Flex justifyContent={"space-between"} marginTop={4}>
                                    <Text fontWeight={"bold"} fontSize={"lg"}>
                                        {item.name}
                                    </Text>
                                    <Text color={"gray.500"} fontSize={"md"}>
                                        {provinces.find((province) => province.id === item.province).name}
                                    </Text>
                                </Flex>
                                <Text fontWeight={"semibold"}>Địa chỉ: {item.detailAddress}</Text>
                                <Flex justifyContent={"space-between"} alignItems={"center"} marginTop={4}>
                                    <Text className="font-roboto text-primary-200" fontWeight={"bold"}>
                                        Open: {item.openingHours}h
                                    </Text>
                                    <Button
                                        borderColor={"black"}
                                        borderWidth={"2px"}
                                        padding={"0 30px"}
                                        variant="outline"
                                    >
                                        View
                                    </Button>
                                </Flex>
                            </Stack>
                        </GridItem>
                    ))}
                </Grid>
            </Container>
        );
    }
    return null;
}

export default StorePage;
