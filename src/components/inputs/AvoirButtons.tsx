import {OverridableStringUnion} from "@mui/types";
import {ButtonPropsColorOverrides} from "@mui/material/Button/Button";
import {Button, ButtonBase, CircularProgress, Stack, Typography} from "@mui/material";
import Box from "@mui/material/Box";
import ArrowForwardIos from "@mui/icons-material/ArrowForwardIos";
import {Spacer} from "@components/layouts/Spacer.tsx";
import {SxProps} from "@mui/system/styleFunctionSx";
import {ReactElement} from "react";
import {Link} from "react-router";

interface TextButtonProps {
    text: string,
    onClick?: () => void,
    disabled?: boolean,
    href?: string,
    target?: string,
    color?: OverridableStringUnion<
        'inherit' | 'primary' | 'secondary' | 'success' | 'error' | 'info' | 'warning',
        ButtonPropsColorOverrides
    >,
}

export function AvoirTextButton(
    {text, onClick, disabled, href, target, color}: TextButtonProps,
) {

    if (href) {
        return (
            <ButtonBase
                onClick={onClick}
                disabled={disabled}
                disableRipple={false}
                color={"warning"}
                component={Link}
                target={target}
                to={href}
                sx={{py: 0.5, px:1,  my: 1, borderRadius: 2, ":hover": {backgroundColor: "action.hover"} }}>
                <Typography variant="button" textTransform={"none"} color={disabled ? "divider" : color}>
                    {text}
                </Typography>
            </ButtonBase>
        )
    } else {
        return (
            <ButtonBase
                onClick={onClick}
                disabled={disabled}
                disableRipple={false}
                color={"warning"}
                sx={{ py: 0.5, px:1,  my: 1, borderRadius: 2, ":hover": {backgroundColor: "action.hover"} }}>
                <Typography variant="button" textTransform={"none"} color={disabled ? "divider" : color}>
                    {text}
                </Typography>
            </ButtonBase>
        )
    }
}

interface SecondaryButtonProps {
    text: string
    onClick?: () => void,
    disabled?: boolean,
    icon?: () => ReactElement,
    withForward?: boolean,
    sx?: SxProps,
    color?: OverridableStringUnion<
        'inherit' | 'primary' | 'secondary' | 'success' | 'error' | 'info' | 'warning',
        ButtonPropsColorOverrides
    >,
}

export function AvoirSecondaryButton(
    {text, onClick, icon, withForward, disabled, sx, color}: SecondaryButtonProps,
) {
    return (
        <Button onClick={onClick}
                disabled={disabled}
                size={"small"}
                color={color}
                sx={{
                    height: "40px",
                    borderRadius: 8,
                    textTransform: "none",
                    "&:hover": {
                        backgroundColor: "action.hover",
                    },
                    ...sx
                }}>

            {icon?.()}
            {icon && <Box width="0.2rem"/>}

            <Typography
                fontSize={14}
                fontWeight={"600"}>
                {text}
            </Typography>

            {
                withForward && (
                    <Box display={"inline-flex"}>
                        <Box width="0.2rem"/>
                        <ArrowForwardIos sx={{fontSize: 14}}/>
                    </Box>
                )
            }
        </Button>
    )
}

interface PrimaryButtonProps {
    text: string
    disabled?: boolean,
    loading?: boolean,
    onClick: () => void,
    withIcon?: boolean,
    sx?: SxProps,
    color?: OverridableStringUnion<
        'inherit' | 'primary' | 'secondary' | 'success' | 'error' | 'info' | 'warning',
        ButtonPropsColorOverrides
    >,
}
export function AvoirButtons(
    {text, disabled, loading, onClick, color, sx, withIcon}: PrimaryButtonProps,
) {
    return (
        <Button
            variant={"contained"}
            size={"small"}
            disableElevation
            disabled={disabled || loading}
            onClick={onClick}
            color={color}
            sx={{
                height: "40px",
                width: "auto",
                minWidth: "120px",
                borderRadius: 8,
                textTransform: "none",
                position: "relative",
                ...sx,
            }}
        >
            {loading ? (
                <CircularProgress
                    size={20}
                    sx={{
                        color: 'primary.contrastText',
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        marginTop: '-10px',
                        marginLeft: '-10px',
                    }}
                />
            ) : (
                <>
                    <Typography
                        color={"primary.contrastText"}
                        fontSize={14}
                        fontWeight={"600"}>
                        {text}
                    </Typography>

                    {withIcon ? (
                        <Box display={"inline-flex"}>
                            <Spacer x={0.2}/>
                            <ArrowForwardIos
                                sx={{color: "primary.contrastText", fontSize: 14}}/>
                        </Box>
                    ) : (
                        <Box/>
                    )}
                </>
            )}
        </Button>
    )
}

interface ActionButtonProps {
    icon: () => ReactElement;
    title: string;
    onClick?: () => void;
    disabled?: boolean;
}

// Circle button with icon AND title below
export function AvoirActionButton({ icon: Icon, title, onClick, disabled }: ActionButtonProps) {
    return (
        <ButtonBase
            onClick={onClick}
            disabled={disabled}
            disableRipple
            disableTouchRipple
            sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: 0.5
            }}>

            <Stack
                alignItems="center"
                justifyContent="center"
                sx={{
                    width: 42,
                    height: 42,
                    borderRadius: '50%',
                    bgcolor: disabled ? 'action.disabledBackground' : 'primary.main',
                    color: 'success.contrastText',
                    '& .MuiSvgIcon-root': {
                        fontSize: '1.25rem'
                    }
                }}>

                {Icon()}

            </Stack>

            <Spacer y={0.5}/>

            <Typography
                variant="caption"
                color={'text.secondary'}
                fontWeight={'bold'}
                lineHeight={1}
            >
                {title}
            </Typography>
        </ButtonBase>
    );
}
