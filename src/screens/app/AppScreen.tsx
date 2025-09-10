import {AvoirToolbar} from "@components/basic/AvoirToolbar.tsx";
import {AvoirDrawer, DrawerMenuItem} from "@components/basic/AvoirDrawer.tsx";
import Toolbar from "@mui/material/Toolbar";
import {Outlet} from "react-router";
import {AppRoute} from "@router";
import {IconClockShield, IconHammer, IconHome2} from "@tabler/icons-react";
import * as React from "react";
import {useMemo} from "react";
import {MainContainer, OutletContainer} from "@components/layouts/BaseContainers.tsx";
import {Box} from "@mui/material";
import {AvoirFooter} from "@components/basic/AvoirFooter.tsx";
import {RStr} from "@localization/ids";
import {str} from "@localization/res.ts";
import {TasksDrawerDialog} from "@screens/task/TasksDrawerDialog.tsx";

export function AppScreen() {
    const { devId, appPackage, appAddress, devAddress, isFetching } = AppRoute.AppAsset.useParams();
    const [idOpen, setIdOpen] = React.useState(false);
    const [tasksDrawerOpen, setTasksDrawerOpen] = React.useState(false);

    const items = useMemo(() => {
        const items = [
            new DrawerMenuItem(
                AppRoute.AppInfo.path,
                [AppRoute.AppInfo.path, AppRoute.AppDistributionEdit.path, AppRoute.AppInfoEdit.path],
                str(RStr.AppScreen_drawer_dashboard),
                AppRoute.AppInfo.route(devId, appPackage, devAddress, appAddress),
                () => (<IconHome2/>)
            ),
            new DrawerMenuItem(
                AppRoute.AppStatus.path,
                [AppRoute.AppStatus.path, AppRoute.AppNewRelease.path, AppRoute.OwnerValidation.path],
                str(RStr.AppScreen_drawer_status),
                AppRoute.AppStatus.route(devId, appPackage, devAddress, appAddress),
                () => (<IconClockShield/>)
            ),
            new DrawerMenuItem(
                AppRoute.AppBuilds.path,
                [AppRoute.AppBuilds.path],
                str(RStr.AppScreen_drawer_builds),
                AppRoute.AppBuilds.route(devId, appPackage, devAddress, appAddress),
                () => (<IconHammer/>)
            ),
            // new DrawerMenuItem(
            //     DrawerItemType.Plugins,
            //     str(RStr.AppScreen_drawer_plugins),
            //     AppRoute.AppBuilds.route(devId, appPackage, devAddress, appAddress),
            //     () => (<IconPlugConnected/>)
            // ),
        ]

        return items
    }, [devId, appPackage, devAddress, appAddress])

    const link = useMemo(() => {
        return AppRoute.AppNewRelease.route(devId, appPackage, devAddress, appAddress)
    }, [devId, appPackage, devAddress, appAddress])

    return (
        <MainContainer>
            <AvoirToolbar
                isLoading={isFetching}
                buttonTitle={str(RStr.AppScreen_toolbar_newRelease)}
                buttonLink={link}
                onOpenMenu={() => {
                    setIdOpen(true)
                }}
                onOpenTasks={() => setTasksDrawerOpen(true)}
            />
            <TasksDrawerDialog open={tasksDrawerOpen} onClose={() => setTasksDrawerOpen(false)} />

            <AvoirDrawer
                onClose={() => setIdOpen(false)}
                idOpen={idOpen}
                backText={str(RStr.AppScreen_drawer_allApplications)}
                backLink={AppRoute.Assets.route(devId, devAddress)}
                items={items}
            />

            <OutletContainer>
                <Toolbar/>

                <Box component="main" sx={{ flex: '1 0 auto' }}>
                    {<Outlet/>}
                </Box>

                <Box component="footer">
                    <AvoirFooter/>
                </Box>
            </OutletContainer>
        </MainContainer>
    )
}
