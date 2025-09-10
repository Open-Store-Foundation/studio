import {Card, Stack, Typography} from "@mui/material";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import Box from "@mui/material/Box";
import {AvoirTextButton} from "@components/inputs/AvoirButtons.tsx";
import {RStr} from "@localization/ids.ts";
import {str} from "@localization/res.ts";
import {AppRoute} from "@router";

interface OracleVerificationNotificationProps {
    onValidateClick?: () => void;
    isLoading?: boolean;
}

export function OracleVerificationNotification(
    { onValidateClick, isLoading }: OracleVerificationNotificationProps
) {
    return (
        <Card variant="outlined"
              sx={{
                  px: 2,
                  pt: 3,
                  pb: 1,
                  display: "flex",
                  alignItems: "flex-start",
                  borderRadius: 4,
        }}>
            <InfoOutlinedIcon
                color="warning"
                sx={{ mr: 2, mt: 0.5 }}
            />

            <Stack
                spacing={2}
                sx={{
                    width: "100%"
                }}>

                <Box>
                    <Typography variant="subtitle2" fontWeight="bold">
                        {str(RStr.OracleVerificationNotification_title)}
                    </Typography>

                    <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                        {str(RStr.OracleVerificationNotification_description)}
                    </Typography>
                </Box>

                <Stack spacing={3} direction="row" justifyContent="flex-start">
                    <AvoirTextButton
                        text={str(RStr.OracleVerificationNotification_verify)}
                        disabled={isLoading}
                        onClick={onValidateClick}
                        color={"warning"}
                    />

                    <AvoirTextButton
                        text={str(RStr.OracleVerificationNotification_learnMore)}
                        disabled={isLoading}
                        target={"_blank"}
                        href={AppRoute.Article.route(AppRoute.Article.Publishing)}
                    />
                </Stack>
            </Stack>
        </Card>
    );
}
