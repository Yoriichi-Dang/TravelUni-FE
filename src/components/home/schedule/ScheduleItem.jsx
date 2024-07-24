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

function ScheduleItem({ timeOnDate, activities }) {
    return (
        <Box boxShadow={"md"} borderRadius="lg" p={4} className="hover:scale-105 duration-300 ease-in-out bg-white">
            <Text fontSize="lg" fontWeight="bold" marginBottom={2} className="font-roboto text-primary-200">
                {timeOnDate}
            </Text>
            <Accordion defaultIndex={[0]} allowMultiple>
                {activities.map((activity, index) => (
                    <AccordionItem key={index}>
                        <h2>
                            <AccordionButton>
                                <Box flex="1" textAlign="left">
                                    <Text fontWeight="bold">{activity.time}</Text>
                                </Box>
                                <AccordionIcon />
                            </AccordionButton>
                        </h2>
                        <AccordionPanel pb={4}>
                            <Text>{activity.description}</Text>
                            {activity.subActivities && (
                                <VStack align="start" spacing={2} mt={2}>
                                    {activity.subActivities.map((subActivity, subIndex) => (
                                        <Text key={subIndex} pl={4} fontSize="sm">
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

ScheduleItem.propTypes = {
    timeOnDate: PropTypes.string,
    activities: PropTypes.array,
};

export default ScheduleItem;
