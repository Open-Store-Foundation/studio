import {AvoirSkeleton} from '@components/anim/AvoirSkeleton.tsx';
import {TextDecoration} from "@components/basic/TextDecoration.tsx";
import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import {str} from "@localization/res.ts";
import {RStr} from "@localization/ids.ts";
import {BNB} from "@utils/format.ts";

export interface TopUpOption {
    id: string;
    bnbAmountFormat: string;
    bnbAmount: number;
    usdAmount: string;
    months: string;
    band: string | null;
    bandColor: string | null;
    isAmount: boolean;
}

interface TopUpOptionCardProps {
    option: TopUpOption;
    isSelected: boolean;
    loading: boolean;
    onClick: () => void;
}

interface TopUpFormProps {
    withAlert?: boolean;
    loading: boolean;
    selected: TopUpOption | null;
    options: TopUpOption[];
    onSelect: (option: TopUpOption) => void;
}

export function TopUpForm({ withAlert, options, onSelect, loading, selected }: TopUpFormProps) {
    return (
        <Stack spacing={4}>
            <Stack spacing={2}>
                {
                    withAlert && <Alert severity="error" sx={{ backgroundColor: "background.paper" }}>
                        {str(RStr.TopupForm_balanceTooLow)}
                    </Alert>
                }

                <Stack spacing={3}>
                    <Stack
                        direction="row"
                        spacing={3}
                        width="100%"
                        alignItems="center"
                    >
                        {options.map((option) => (
                            <TopUpOptionCard
                                key={option.id}
                                option={option}
                                isSelected={selected?.id === option.id}
                                loading={loading}
                                onClick={() => {
                                    onSelect(option);
                                }}
                            />
                        ))}
                    </Stack>
                </Stack>
            </Stack>
        </Stack>
    );
}

function TopUpOptionCard({ option, loading, isSelected, onClick }: TopUpOptionCardProps) {
    return (
        <AvoirSkeleton isLoading={loading} >
            <Box
                onClick={onClick}
                sx={{
                    width: '150px',
                    height: '110px',
                    display: 'flex',
                    px: 2,
                    py: 3,
                    flexDirection: 'column',
                    alignItems: 'start',
                    justifyContent: 'center',
                    bgcolor: 'background.paper',
                    borderRadius: 2,
                    cursor: 'pointer',
                    border: isSelected ? '2px solid' : '2px solid',
                    borderColor: isSelected ? (option.isAmount ? 'success.main' : 'primary.main') : 'background.paper',
                    transition: 'all 0.2s ease-in-out',
                    position: 'relative',
                    overflow: 'hidden', // 92B4F3
                    boxShadow: isSelected ? (option.isAmount ? '0 0 10px rgba(146, 180, 243, 0.3)' : '0 0 10px rgba(76, 175, 80, 0.3)') : 'none',
                    '&:hover': {
                        borderColor: option.isAmount ? 'success.main' : 'primary.main',
                        boxShadow: '0 0 10px rgba(76, 175, 80, 0.3)',
                        transform: 'scale(0.98)'
                    }
                }}
            >
                {option.band && (
                    <Box
                        sx={{
                            position: 'absolute',
                            top: 15,
                            right: -50,
                            transform: 'rotate(45deg)',
                            bgcolor: option.bandColor ?? 'success.main',
                            color: 'primary.contrastText',
                            width: '140px',
                            textAlign: 'center',
                            py: 0.1,
                            fontSize: 12,
                            fontWeight: 'bold',
                            zIndex: 1,
                        }}
                    >
                        {option.band}
                    </Box>
                )}

                {
                    option.isAmount
                        ? <Stack spacing={1} width="100%">
                            <Stack>
                                <Typography variant="h6" fontSize={18} color="text.primary" fontWeight="bold">
                                    {option.bnbAmountFormat} <TextDecoration text={BNB} color={"text.secondary"}/>
                                </Typography>

                                <Typography variant="body2" fontSize={13} color="text.secondary" fontWeight="bold">
                                    {option.usdAmount}
                                </Typography>
                            </Stack>
                            <Typography fontSize={13} color="#C5CAE9" fontWeight="bold">
                                {option.months}
                            </Typography>
                        </Stack>
                        : <Stack spacing={1}  width="100%" >
                            <Stack>
                                <Typography variant="h6" fontSize={18} color="text.primary" fontWeight="bold">
                                    {option.bnbAmountFormat} <TextDecoration text={BNB} color={"text.secondary"}/>
                                </Typography>

                                <Typography variant="body2" fontSize={13} color="text.secondary" fontWeight="bold">
                                    {option.usdAmount}
                                </Typography>
                            </Stack>
                            <Typography fontSize={13} color="#C5CAE9" fontWeight="bold">
                                {option.months}
                            </Typography>
                        </Stack>
                }
            </Box>
        </AvoirSkeleton>
    );
}
