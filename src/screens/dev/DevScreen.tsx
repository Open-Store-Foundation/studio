import {Outlet} from "react-router";
import Toolbar from "@mui/material/Toolbar";
import {AvoirToolbar} from "@components/basic/AvoirToolbar.tsx";
import {AvoirDrawer, DrawerMenuItem} from "@components/basic/AvoirDrawer.tsx";
import {AppRoute} from "@router";
import {MainContainer, OutletContainer} from "@components/layouts/BaseContainers.tsx";
import {Box} from "@mui/material";
import {AvoirFooter} from "@components/basic/AvoirFooter.tsx";
import * as React from "react";
import {useMemo} from "react";
import {IconApps, IconUser} from "@tabler/icons-react";
import {RStr} from "@localization/ids.ts";
import {str} from "@localization/res.ts";
import {TasksDrawerDialog} from "@screens/task/TasksDrawerDialog.tsx";

export function DevScreen() {
    const [idOpen, setIdOpen] = React.useState(false);
    const [tasksDrawerOpen, setTasksDrawerOpen] = React.useState(false);
    const {devId, devAddress, isFetching} = AppRoute.Assets.useParams();

    const items = useMemo(() => {
        const items = [
            new DrawerMenuItem(
                AppRoute.DevAccount.path,
                [AppRoute.DevAccount.path],
                str(RStr.DevScreen_drawer_account),
                AppRoute.DevAccount.route(devId, devAddress),
                () => (<IconUser/>),
            ),
            new DrawerMenuItem(
                AppRoute.Assets.path,
                [AppRoute.Assets.path, AppRoute.AssetsCreate.path],
                str(RStr.DevScreen_drawer_apps),
                AppRoute.Assets.route(devId, devAddress),
                () => (<IconApps/>)
            ),
        ]

        return items
    }, [devId, devAddress])

    return (
        <MainContainer>
            <AvoirToolbar
                isLoading={isFetching}
                buttonTitle={str(RStr.DevScreen_createApp_title)}
                buttonLink={AppRoute.AssetsCreate.route(devId, devAddress)}
                onOpenMenu={() => {
                    setIdOpen(true)
                }}
                onOpenTasks={() => setTasksDrawerOpen(true)}
            />
            <TasksDrawerDialog open={tasksDrawerOpen} onClose={() => setTasksDrawerOpen(false)} />

            <AvoirDrawer
                onClose={() => setIdOpen(false)}
                idOpen={idOpen}
                items={items}
                backText={str(RStr.DevScreen_drawer_allDevelopers)}
                backLink={AppRoute.Devs.route()}
            />

            <OutletContainer>
                <Toolbar/>

                <Box component="main" sx={{ flex: '1 0 auto' }}>
                    <Outlet/>
                </Box>

                <Box component="footer">
                    <AvoirFooter/>
                </Box>
            </OutletContainer>
        </MainContainer>
    )
}
