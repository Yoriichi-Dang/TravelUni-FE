import {
    Accordion,
    AccordionButton,
    AccordionIcon,
    AccordionItem,
    AccordionPanel,
    Box,
    Text,
    VStack,
} from "@chakra-ui/react";
import PropTypes from "prop-types";

function ScheduleProvinceItem({ day, activities }) {
    return (
        <Box boxShadow={"md"} borderRadius="lg" p={4} className="hover:scale-105 duration-300 ease-in-out bg-white">
            <Text fontSize="lg" fontWeight="bold" marginBottom={2} className="font-roboto text-primary-200">
                Ngày {day}
            </Text>
            <Accordion defaultIndex={[0]} allowMultiple>
                {activities.map((activity, index) => (
                    <AccordionItem key={index}>
                        <h2>
                            <AccordionButton>
                                <Box flex="1" textAlign="left">
                                    <Text fontWeight="bold">
                                        {activity.time} - {activity.location}
                                    </Text>
                                </Box>
                                <AccordionIcon />
                            </AccordionButton>
                        </h2>
                        <AccordionPanel pb={4}>
                            <Text className="text-primary-100 font-roboto" fontWeight="bold" fontSize="md">
                                {activity.name}
                            </Text>
                            <Text className="text-primary-100">{activity.description}</Text>
                            {activity.subActivities && (
                                <VStack align="start" spacing={2} mt={2}>
                                    {activity.subActivities.map((subActivity, subIndex) => (
                                        <Text
                                            className="text-primary-100 font-poppins"
                                            key={subIndex}
                                            pl={4}
                                            fontSize="sm"
                                        >
                                            - {subActivity.description}
                                        </Text>
                                    ))}
                                </VStack>
                            )}
                        </AccordionPanel>
                    </AccordionItem>
                ))}
            </Accordion>
        </Box>
    );
}

ScheduleProvinceItem.propTypes = {
    day: PropTypes.string,
    activities: PropTypes.array,
};

export default ScheduleProvinceItem;
