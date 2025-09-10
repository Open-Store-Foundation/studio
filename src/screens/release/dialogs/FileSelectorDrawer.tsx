import {ScAppBuild} from "@data/sc/ScAssetService.ts";
import {useGreenfield} from "@di";
import {AppRoute} from "@router";
import {GfBuildFile, toAppBuild} from "@data/greenfield";
import {CircularProgress, IconButton, List, ListItem, ListItemText, Stack, Typography, useTheme} from "@mui/material";
import {formatDate} from "@utils/date.ts";
import {S, useAsyncEffect, useScreenState} from "@utils/state.ts";
import {ContentContainer, PageContainer, ScrollableContentContainer} from "@components/layouts/BaseContainers.tsx";
import {AvoirScreenTitleSmall} from "@components/basic/AvoirScreenTitle.tsx";
import {formatSize} from "@utils/format.ts";
import {RStr} from "@localization/ids.ts";
import {str} from "@localization/res.ts";
import {AvoirCard} from "@components/layouts/AvoirCard.tsx";
import {IconArrowRight} from "@tabler/icons-react";
import {AutoSnackbar, DefaultSnackbarError} from "@components/events/AutoSnackbar.tsx";
import {AvoirButtons} from "@components/inputs/AvoirButtons.tsx";

interface SelectFileScreenPageProps {
    onClose: () => void;
    onNext: (info: ScAppBuild) => void;
}

export function FileSelectorDrawer(
    {onClose, onNext}: SelectFileScreenPageProps,
) {
    const greenfield = useGreenfield();

    const {devId, appPackage} = AppRoute.AppAsset.useParams();
    const { isLoading, error, data, setState } = useScreenState<GfBuildFile[], string>()

    useAsyncEffect(async () => {
        setState(S.loading())
        try {
            const builds = await greenfield.getAppVersions(devId.toLowerCase(), appPackage)
            setState(S.data(builds));
        } catch (error: Error | any) {
            console.error("Error fetching builds", error.message)
            setState({ data: [], error: DefaultSnackbarError, isLoading: false })
        }
    }, [])

    return (
        <PageContainer>

            <AutoSnackbar
                message={error}
                onClose={() => { setState(S.data([])) }}
            />

            <ScrollableContentContainer>
                <PageContainer>
                    <AvoirScreenTitleSmall
                        title={str(RStr.FileSelectorDrawer_title)}
                    />

                    <ContentContainer>
                        <Stack
                            width={"100%"}
                            height={"100%"}
                            spacing={4}
                        >
                            <BuildList
                                isLoading={isLoading}
                                disabled={false}
                                builds={data}
                                onNext={(build) => onNext(build)}/>
                        </Stack>
                    </ContentContainer>
                </PageContainer>
            </ScrollableContentContainer>

            <Stack
                width={"100%"}
                direction={"row"}
                justifyContent={"end"}
                spacing={2}
                p={2}
            >
                <AvoirButtons
                    text={str(RStr.FileUploaderDrawer_button_close)}
                    onClick={onClose}
                />
            </Stack>
        </PageContainer>
    )
}

interface BuildListProps {
    isLoading: boolean,
    disabled: boolean,
    builds: GfBuildFile[] | null,
    onNext: (build: ScAppBuild) => void,
}

function BuildList(
    {isLoading, disabled, builds, onNext}: BuildListProps
) {
    const theme = useTheme();

    if (isLoading) {
        return (
            <AvoirCard>
                <CircularProgress/>
                <Typography sx={{mt: 2}}>
                    {str(RStr.FileSelectorDrawer_buildList_loading)}
                </Typography>
            </AvoirCard>
        )
    }

    if (!builds || builds.length === 0) {
        return (
            <AvoirCard>
                <Typography>
                    {str(RStr.NotFound)}
                </Typography>
            </AvoirCard>
        )
    }

    return (
        <List>
            {builds.map((build) => (
                <ListItem
                    key={build.id}
                    secondaryAction={
                        <IconButton
                            disabled={disabled}
                            onClick={() => onNext(toAppBuild(build))}
                        >
                            <IconArrowRight color={theme.palette.primary.main}/>
                        </IconButton>
                    }
                    sx={{
                        backgroundColor: 'background.paper', // TODO v2
                        mt: 1,
                        borderRadius: 2
                    }}
                >
                    <ListItemText
                        slotProps={{
                            primary: {
                                fontWeight: 'bold'
                            }
                        }}
                        primary={
                            str(RStr.FileSelectorDrawer_buildList_version)
                                .replace("{type}", build.type)
                                .replace("{name}", build.versionName)
                        }
                        secondary={`${formatSize(build.size)} | ${formatDate(build.createdAt)}`}
                    />
                </ListItem>
            ))}
        </List>
    )
}
