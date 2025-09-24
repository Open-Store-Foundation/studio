import {useNavigate} from "react-router";
import {useMemo} from "react";
import {GridColDef, GridValidRowModel} from "@mui/x-data-grid";
import {AvoirTableView} from "@components/basic/AvoirTableView.tsx";
import {ScAssetService} from "@data/sc/ScAssetService.ts";
import {AppRoute} from "@router";
import {AvoirScreenTitle} from "@components/basic/AvoirScreenTitle.tsx";
import {S, useAsyncEffect, useScreenState} from "@utils/state.ts";
import {AvoirAvatar} from "@components/inputs/AvoirAvatar.tsx";
import {ContentContainer, PageContainer} from "@components/layouts/BaseContainers.tsx";
import {ScreenError} from "@components/basic/ScreenError.tsx";
import {AvoirSectionTitledBox} from "@components/basic/AvoirSection";
import Stack from "@mui/material/Stack";
import {RStr} from "@localization/ids.ts";
import {str} from "@localization/res.ts";
import {IconButton} from "@mui/material";
import {IconRefresh} from "@tabler/icons-react";

enum AppListError {
    Unknown,
    NoAccount,
}

export function DevAppsListScreen() {
    const {devId, devAddress, isFetching} = AppRoute.Assets.useParams();
    const navigate = useNavigate()

    const {setState, isLoading, data, error, retryCount, retry} = useScreenState<GridValidRowModel[], AppListError>()
    const retryWithoutCache = () => {
        ScAssetService.cleanAppsCache(devAddress)
        retry()
    }

    useAsyncEffect(
        async () => {
            if (!isFetching) {
                try {
                    setState(S.loading())

                    if (!devAddress) {
                        setState(S.error(AppListError.NoAccount))
                        return
                    }

                    const apps = await ScAssetService.getApps(devAddress)
                    setState(S.data(apps))
                } catch (e) {
                    setState(S.error(AppListError.Unknown))
                    console.error(e)
                }
            }
        }, [retryCount, isFetching]
    )

    const columns: GridColDef[] = useMemo(() => {
        return [
            {
                field: 'avatar',
                headerName: '',
                width: 100,
                sortable: false,
                filterable: false,
                renderCell: (params) => (
                    <AvoirAvatar name={params.row.name}/>
                ),
            },
            {field: 'name', headerName: str(RStr.DevAppsListScreen_columns_name), flex: 1, minWidth: 10},
            {field: 'package', headerName: str(RStr.DevAppsListScreen_columns_package), flex: 1, minWidth: 10},
            {field: 'address', headerName: str(RStr.DevAppsListScreen_columns_address), flex: 1, minWidth: 10},
        ]
    }, [])

    return (
        <PageContainer>
            <AvoirScreenTitle
                title={str(RStr.DevAppsListScreen_title)}
                description={str(RStr.DevAppsListScreen_description)}
            />

            <ContentContainer>
                <Stack
                    spacing={4}
                    width={"100%"}
                    maxWidth={"1280px"}
                >
                    <AvoirSectionTitledBox
                        title={str(RStr.DevAppsListScreen_applications_title)}
                        description={str(RStr.DevAppsListScreen_applications_description)}
                        action={() => {
                            return <IconButton
                                color={"primary"}
                                onClick={retryWithoutCache}
                                disabled={isFetching || isLoading}
                            >
                                <IconRefresh/>
                            </IconButton>
                        }}
                    >

                        <AvoirTableView
                            rows={data}
                            columns={columns}
                            isLoading={isLoading || isFetching}
                            isError={error !== null}
                            errorOverride={() => {
                                return <ScreenError
                                    title={str(RStr.DevAppsListScreen_error_title)}
                                    description={str(RStr.DevAppsListScreen_error_description)}
                                    action={str(RStr.DevAppsListScreen_error_action)}
                                    onAction={retryWithoutCache}
                                />
                            }}
                            onClick={(data) => {
                                navigate(AppRoute.AppInfo.route(devId, data.row.package, devAddress, data.row.address))
                            }}
                        />
                    </AvoirSectionTitledBox>
                </Stack>
            </ContentContainer>
        </PageContainer>
    )
}