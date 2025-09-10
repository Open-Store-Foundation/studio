import {ThemeOptions} from '@mui/material/styles';
import {createTheme, styled, Switch} from "@mui/material";
import {PaletteOptions} from "@mui/material/styles/createPalette";
import {DrawerWidth} from "@components/basic/AvoirDrawer.tsx";


const darkPalette: PaletteOptions = {
    primary: {
        main: '#A3C9FE',
        contrastText: '#202124',
    },
    secondary: {
        main: '#BBC7DB',
    },
    text: {
        primary: `#E3E3E3`,
        secondary: '#9e9e9e',
        // @ts-ignore
        variant: '#bbbdc6',
        title: '#C5CAE9',
    },
    error: {
        main: '#E54451', // FFB4AB
    },
    background: {
        default: '#1B1B1B',
        paper: '#131314',
        // @ts-ignore
        surface: '#222222',
        surfaceVariant: '#090909',
        drawer: '#191919',
    },
    warning: {
        main: '#ffc107',
    },
    success: {
        main: '#4bb34b',
    },
    info: {
        main: '#009688',
    },
    // action: {
    //     hover: "#DADDE4"
    // }
    // divider:  '#F1FFFF'
}

const lightPalette: PaletteOptions = {
    primary: {
        main: '#0046fd',
        contrastText: '#ffffff',
    },
    secondary: {
        main: '#5181b8',
    },
    text: {
        primary: `#000000`,
        secondary: '#404040',
        // @ts-ignore
        variant: '#2c2f32',
        title: '#000000',
    },
    error: {
        main: '#BA1A1A',
    },
    background: {
        default: '#F1F4F9',
        paper: '#FFFFFF',
        // @ts-ignore
        surface: '#EAEEF5',
        surfaceVariant: '#EAEAEA',
        drawer: '#F9FAFD',
    },
    warning: {
        main: '#ffc107',
    },
    success: {
        main: '#4bb34b',
    },
    divider: '#bdbfc3',
    action: {
        hover: "#DADDE4AA"
    }
}

export const themeOptions: ThemeOptions = {
    // @ts-ignore
    colorSchemes: {
        light: {
            palette: lightPalette
        },
        dark: {
            palette: darkPalette
        }
    },

    breakpoints: {
        values: {
            xs: 0,
            sm: 600,
            md: 900,
            lg: 1400,
            xl: DrawerWidth + 1024 + 320
        }
    },

    typography: {
        fontFamily: ['Open Sans'].join(",")
    },

    components: {
        MuiCssBaseline: {
            styleOverrides: {
                "input:-webkit-autofill" : {
                    "-webkit-box-shadow": "0 0 0 30px #252527 inset !important",
                },
            }
        },

        MuiButton: {
            styleOverrides: {
                root: {
                    border: 0,
                    borderRadius: 12,
                    boxShadow: '0 0px 0px 0px rgba(255, 255,255,0)',
                    height: 48,
                    padding: '0 30px',
                },
            },
        },

        MuiListItemButton: {
            styleOverrides: {
                root: ({ theme }) => ({
                    borderRadius: 25,
                    '& .MuiListItemText-primary': {
                        // @ts-ignore
                        color: theme.palette.text.variant,
                    },
                    '& .MuiListItemIcon-root': {
                        // @ts-ignore
                        color: theme.palette.text.variant,
                    },

                    "&:hover, &.Mui-focusVisible": {
                        // @ts-ignore
                        backgroundColor: theme.palette.action.surface,
                    },

                    "&.Mui-selected": {
                        // @ts-ignore
                        backgroundColor: theme.palette.background.surface,

                        '& .MuiListItemIcon-root': {
                            color: theme.palette.primary.main,
                        },
                        '& .MuiListItemText-primary': {
                            color: theme.palette.primary.main,
                        },
                        '&.Mui-selected:hover, &.Mui-selected.Mui-focusVisible': {
                            // @ts-ignore
                            backgroundColor: theme.palette.action.hover,
                        }
                    },
                })
            }
        },

        MuiStepIcon: {
            styleOverrides: {
                text: () => ({
                    fontWeight: 'bold',
                    fontSize: "0.8rem"
                })
            }
        },

        MuiTypography: {
            defaultProps: {
                fontFamily: ['Open Sans'].join(","),
            },
        },
    },
};

export const NoRadius = {
    borderRadius: 2,
    "&:hover": {
        borderRadius: 2,
    }
}

export const Android12Switch = styled(Switch)(() => ({
    padding: 8,
    '& .MuiSwitch-track': {
        borderRadius: 22 / 2,
        '&::before, &::after': {
            content: '""',
            position: 'absolute',
            top: '50%',
            transform: 'translateY(-50%)',
            width: 16,
            height: 16,
        },
        '&::before': {
            left: 12,
        },
        '&::after': {
            right: 12,
        },
    },
    '& .MuiSwitch-thumb': {
        boxShadow: 'none',
        width: 16,
        height: 16,
        margin: 2,
    },
}));


export const theme = createTheme(
    themeOptions
)
