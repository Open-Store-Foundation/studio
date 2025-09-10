import {Box, Stack, Step, StepLabel, Stepper, SxProps, Theme} from "@mui/material";
import {Spacer} from "@components/layouts/Spacer.tsx";

interface OpenStepperProps {
    sx?: SxProps<Theme>,
    activeStep: number,
    steps: string[]
}

export function AvoirStepper({sx, activeStep, steps}: OpenStepperProps) {
    return (
        <Stack>
            <Box display="flex" justifyContent="center" width="100%">
                <Box sx={sx}>
                    <Stepper activeStep={activeStep} nonLinear>
                        {steps.map((label) => (
                            <Step key={label}>
                                <StepLabel>
                                    {label}
                                </StepLabel>
                            </Step>
                        ))}
                    </Stepper>
                </Box>
            </Box>

            <Spacer y={3}/>
        </Stack>
    );
}
