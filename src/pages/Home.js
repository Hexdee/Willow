import { Box, Flex, Image, SimpleGrid, Text } from "@chakra-ui/react";
import AuthNav from "../components/Navbar/AuthNav";
import ImageBg from "../assets/images/trees-bg.jpeg";
import CustomButton from "../components/CustomButton/customButton";
import { location } from "../assets/svgs/svg";
import { auth, db } from "../firebase";
import {
  query,
  collection,
  getDocs,
  where,
  orderBy,
  onSnapshot,
} from "firebase/firestore";
import MyTree1 from "../assets/images/my-tree1.jpeg";
import { useAuthState } from "react-firebase-hooks/auth";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toaster } from "evergreen-ui";
import Cookies from "js-cookie";
import { locations } from "../utils/appData";
import { RegisterPhoneNumber } from "../components/Modal/RegisterPhoneNumber";
import RequestDialog from "../components/Modal/RequestDialog";

const Home = () => {
  const [user, loading] = useAuthState(auth);
  const [name, setName] = useState("");
  const [myTrees, setMyTrees] = useState([]);
  const navigate = useNavigate();
  const userId = Cookies.get("userId");
  const [isShown, setIsShown] = useState(false);
  const walletAddr = localStorage.getItem("wallet_addr");

  const fetchUserName = async () => {
    try {
      const q = query(collection(db, "users"), where("uid", "==", user?.uid));
      const doc = await getDocs(q);
      const data = doc.docs[0].data();
      setName(data.name);
    } catch (error) {
      toaster.danger("An error occured while fetching user data", { id: 'mess' });
    }
  };

  useEffect(() => {
    if (loading) return;
    if (!user) return navigate("/");
    fetchUserName();
  }, [user, loading]);

  useEffect(() => {
    const q = query(collection(db, "plantTrees"), 
    where("userId", "==", userId), 
    orderBy("created", "desc")
  );
    onSnapshot(q, (querySnapshot) => {
      setMyTrees(
        querySnapshot.docs.map((myTree) => ({
          id: myTree.id,
          data: myTree.data(),
        }))
      );
    });
  }, []);

  return (
    <Box>
      <AuthNav />
      <Box p="20px" w="100%" justifyContent="space-between">
        <Box>
          <Image
            src={ImageBg}
            borderRadius="8px"
            h="400px"
            w="100%"
            objectFit="cover"
            alt="bg"
          />
          <Box mt="20px">
            <Text fontSize="20px" color="brand.orange">
              Welcome back {name}
            </Text>
          </Box>

          {/* Locations */}
          <Box mt="40px" px="40px">
            <Flex alignItems="center">
              <Box mr="10px">{location}</Box>
              <Text fontSize="25px" fontWeight="normal">
                Locations
              </Text>
            </Flex>
            <SimpleGrid columns={4} gap="38">
              {locations.map((location) => (
                <Box
                  key={location.country}
                  mt="10px"
                  borderRadius="8px"
                  style={{ boxShadow: "rgba(0, 0, 0, 0.04) 0px 3px 5px" }}
                  minH="310px"
                >
                  <Image
                    src={location.image}
                    borderTopRightRadius="8px"
                    borderTopLeftRadius="8px"
                    w="100%"
                    objectFit="cover"
                    h="400px"
                    maxH="200px"
                    alt={location.country}
                  />
                  <Box p="20px">
                    <Text color="brand.dark" fontWeight="bold">
                      {location.country}
                    </Text>
                    <Text mt="8px" color="brand.lightGreen" fontSize="14px">
                      {location.figure} trees planted
                    </Text>
                    <Box mt="20px">
                      <a href={location.route}>
                        <CustomButton
                          border="1px solid #18541A"
                          bg="none"
                          color="brand.dark"
                          hoverColor="brand.white"
                          hoverBg="brand.lightGreen"
                        >
                          <Text fontWeight="medium">Plant here</Text>
                        </CustomButton>
                      </a>
                    </Box>
                  </Box>
                </Box>
              ))}
            </SimpleGrid>
          </Box>
          {/* Plants */}
          <Box mt="60px" px="40px">
            <Flex alignItems="center">
              <Box mr="10px">{location}</Box>
              <Text fontSize="25px" fontWeight="normal">
                My Trees
              </Text>
            </Flex>
            <SimpleGrid columns={4} gap="38">
              {myTrees.map((myTree) => (
                <Box
                  key={myTree.id}
                  mt="10px"
                  borderRadius="8px"
                  style={{ boxShadow: "rgba(0, 0, 0, 0.04) 0px 3px 5px" }}
                  minH="310px"
                >
                  <Image
                    src={myTree.data.imageUrl || MyTree1}
                    borderTopRightRadius="8px"
                    borderTopLeftRadius="8px"
                    w="100%"
                    objectFit="cover"
                    h="400px"
                    maxH="200px"
                    alt={myTree.country}
                  />
                  <Box p="20px">
                    <Text color="brand.dark" fontWeight="bold">
                      {myTree.data.region}, Nigeria
                    </Text>
                    <Text mt="8px" color="brand.lightGreen" fontSize="14px">
                      1 tree planted
                    </Text>
                    <Text mt="8px" color="brand.lightGreen" fontSize="14px">
                      {myTree.data.tree}
                    </Text>
                    <Box mt="20px">
                        <a href={`/view-plants/${myTree.id}`}>
                            <CustomButton
                                border="1px solid #18541A"
                                bg="none"
                                color="brand.dark"
                                hoverColor="brand.white"
                                hoverBg="brand.lightGreen"
                            >
                                <Text fontWeight="medium">View</Text>
                            </CustomButton>
                        </a>
                    </Box>
                  </Box>
                </Box>
              ))}
            </SimpleGrid>
          </Box>
        </Box>

      </Box>

      <RegisterPhoneNumber isShown={isShown} setIsShown={setIsShown} address={walletAddr} />
      <RequestDialog handleAddNumber={() => setIsShown(true)} />
    </Box>
  );
};

export default Home;
