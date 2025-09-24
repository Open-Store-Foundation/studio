import {Box, IconButton, Stack} from "@mui/material";
import {GridColDef} from "@mui/x-data-grid";
import {useMemo, useState} from "react";
import {AvoirTableView} from "@components/basic/AvoirTableView.tsx";
import {shrinkAddress} from "@utils/account.ts";
import {AvoirScreenTitle} from "@components/basic/AvoirScreenTitle.tsx";
import {ContentContainer} from "@components/layouts/BaseContainers.tsx";
import {S, useAsyncEffect, useScreenState} from "@utils/state.ts";
import {useGreenfield} from "@di";
import {AppRoute} from "@router";
import {ScreenError} from "@components/basic/ScreenError.tsx";
import {numberToBytes32} from "@utils/hex.ts";
import {formatSize} from "@utils/format.ts";
import {RStr} from "@localization/ids.ts";
import {str} from "@localization/res.ts";
import {DefaultScreenEmptyProps, ScreenEmpty} from "@components/basic/ScreenEmpty.tsx";
import {AvoirSectionTitledBox} from "@components/basic/AvoirSection";
import {IconRefresh, IconTrash} from "@tabler/icons-react";
import {ConfirmDeleteDrawerDialog} from "./ConfirmDeleteDrawerDialog.tsx";

export interface BuildFile {
    id: number,
    versionCode: number,
    versionNumber: string,
    objectPath: string,
    size: string,
    referenceId: string,
}

export function AppBuildsScreen() {
    const greenfield = useGreenfield();
    const {devId, devAddress, appPackage, appAddress} = AppRoute.AppAsset.useParams();

    const {isLoading, error, data, setState, retry, retryCount} = useScreenState<BuildFile[], string>()
    const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
    const [selectedBuildFile, setSelectedBuildFile] = useState<BuildFile | null>(null);

    useAsyncEffect(async () => {
        setState(S.loading())
        try {
            const builds = await greenfield.getAppVersions(devId.toLowerCase(), appPackage)

            const files = builds.map((build) => {
                return {
                    id: build.id,
                    versionCode: build.versionCode,
                    versionNumber: build.versionName,
                    objectPath: build.path,
                    size: formatSize(build.size),
                    referenceId: shrinkAddress(numberToBytes32(build.id)), // TODO shrink inside cell
                } as BuildFile
            })

            setState(S.data(files));
        } catch (error: Error | any) {
            console.error("Error fetching builds", error.message)
            setState(S.error(error.message))
        }
    }, [retryCount])

    const openDeleteConfirmation = (buildFile: BuildFile) => {
        setSelectedBuildFile(buildFile);
        setConfirmDialogOpen(true);
    }

    const handleDeleteSuccess = () => {
        retry();
    }

    const columns: GridColDef[] = useMemo(() => {
        return [
            {field: 'versionNumber', headerName: str(RStr.AppBuildsScreen_versionNumber), sortable: false, flex: 1, minWidth: 10},
            {field: 'versionCode', headerName: str(RStr.AppBuildsScreen_versionCode), sortable: false, flex: 1, minWidth: 10},
            {field: 'size', headerName: str(RStr.AppBuildsScreen_size), sortable: false, flex: 1, minWidth: 10},
            {field: 'referenceId', headerName: str(RStr.AppBuildsScreen_objectId), sortable: false, flex: 1, minWidth: 10},
            {
                field: 'navigate',
                headerName: '',
                sortable: false,
                filterable: false,
                renderCell: (props) => (
                    <Box>
                        <IconButton 
                            color="error"
                            onClick={() => openDeleteConfirmation(props.row)}>
                            <IconTrash/>
                        </IconButton>
                    </Box>
                ),
            },
        ]
    }, [])

    return (
        <Stack>
            <AvoirScreenTitle
                title={str(RStr.AppBuildsScreen_title)}
                description={str(RStr.AppBuildsScreen_description)}
                isLoading={isLoading}/>

            <ContentContainer>
                {
                    !isLoading &&
                    <AvoirSectionTitledBox
                        title={str(RStr.AppBuildsScreen_list_title)}
                        description={str(RStr.AppBuildsScreen_list_description)}
                        infoLink={AppRoute.Article.route(AppRoute.Article.HowItWorks)}
                        action={() => {
                            return <IconButton
                                color={"primary"}
                                onClick={retry}
                                disabled={isLoading}
                            >
                                <IconRefresh/>
                            </IconButton>
                        }}
                    >
                        {
                            data && data.length === 0
                                ? <ScreenEmpty {...DefaultScreenEmptyProps} />
                                : <AvoirTableView
                                    rows={data}
                                    isSelectable={false}
                                    isLoading={false}
                                    columns={columns}
                                    isError={error != null}
                                    errorOverride={() => {
                                        return <ScreenError
                                            title={str(RStr.AppBuildsScreen_error_title)}
                                            description={str(RStr.AppBuildsScreen_error_description)}
                                            action={str(RStr.AppBuildsScreen_error_action)}
                                            onAction={retry}/>
                                    }}
                                />
                        }
                    </AvoirSectionTitledBox>
                }
            </ContentContainer>

            {
                confirmDialogOpen && selectedBuildFile &&
                <ConfirmDeleteDrawerDialog
                    open={confirmDialogOpen}

                    devId={devId}
                    devAddress={devAddress}
                    appAddress={appAddress}
                    buildFile={selectedBuildFile}

                    onClose={() => setConfirmDialogOpen(false)}
                    onSuccess={handleDeleteSuccess}
                />
            }
        </Stack>
    )
}
