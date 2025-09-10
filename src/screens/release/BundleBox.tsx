import SvgIcon from '@mui/material/SvgIcon';
import {Box, Typography} from "@mui/material";

interface BundleBoxProps {
    icon: typeof SvgIcon
    title: string
    description: string
    onClick: () => void
}

export function BundleBox({icon: Icon, title, description, onClick}: BundleBoxProps) {
    return (
        <Box
            onClick={onClick}
            sx={{
                borderRadius: 2,
                p: 3,
                display: 'flex',
                maxWidth: 300,
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                bgcolor: 'background.default',
                cursor: 'pointer',
                transition: 'all 0.3s ease-in-out',
                '&:hover': {
                    backgroundColor: "action.hover",
                    borderColor: 'primary.main',
                    boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)',
                }
            }}>
            <Icon sx={{fontSize: 40, color: 'divider', mb: 1}}/>
            <Typography variant="subtitle1" color="text.primary" fontWeight="bold">
                {title}
            </Typography>
            <Typography variant="body2" color="text.secondary" align="center">
                {description}
            </Typography>
        </Box>
    )
}
