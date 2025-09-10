import {createBrowserRouter} from "react-router";
import {DevScreen} from "@screens/dev/DevScreen.tsx";
import {AppScreen} from "./screens/app/AppScreen.tsx";
import {AppBuildsScreen} from "./screens/app/AppBuildsScreen.tsx";
import {AppInfoScreen} from "./screens/app/AppInfoScreen.tsx";
import {CreateAppScreen} from "./screens/create/CreateAppScreen.tsx";
import {DevAppsListScreen} from "@screens/dev/DevAppsListScreen.tsx";
import {AppEditOwnerVerificationScreen} from "@screens/app/AppEditOwnerVerificationScreen.tsx";
import {Address} from "@data/CommonModels.ts";
import {CreateReleaseScreen} from "@screens/release/CreateReleaseScreen.tsx";
import {IntroCreateDevScreen} from "@screens/intro/IntroCreateDevScreen.tsx";
import {DevAccountScreen} from "@screens/dev/DevAccountScreen.tsx";
import {useDevIdParams} from "@hooks/useDevIdParams.ts";
import {useDevIdAndAppPackageParams} from "@hooks/useDevIdAndAppPackageParams.ts";
import {AppStatusScreen} from "@screens/app/AppStatusScreen.tsx";
import {AppEditGeneralInfoScreen} from "@screens/app/AppEditGeneralInfoScreen.tsx";
import {AppEditDistributionScreen} from "@screens/app/AppEditDistributionScreen.tsx";
import {AltIntroDevsScreen} from "@screens/intro/AltIntroDevsScreen.tsx";

export const AppRoute = {
    Devs: {
        path: "/",
        route: () => `/`,
    },
    DevCreate: {
        path: "/publisher-create",
        route: () => `/publisher-create`,
    },
    Article: {
        Info: "",
        HowItWorks: "docs/how-it-works",
        CustomDistribution: "docs/custom-distribution",
        BillingAndFees: "docs/billing-and-fees",
        Publishing: "docs/publishing-process",
        Privacy: "privacy-policy",
        Terms: "terms-of-service",
        route: (articleId: string) => {
            return `https://docs.openstore.foundation/${articleId}`
        },
    },
    Social: {
        X: "https://x.com/openstorefnd",
        Discord: "https://discord.gg/CPmjuPNt",
    },
    Tg: {
        Community: "openstore_community",
        News: "openstore_news",
        route: (tgId: string) => {
          return `https://t.me/${tgId}`
        }
    },
    Dev: {
        path: "/publisher/:devId",
        route: (devId: string, devAddress: Address) => {
            return `/publisher/${devId}?${buildDevPath(devAddress)}`
        },
        useParams: useDevIdParams,
    },
    DevAccount: {
        path: "/publisher/:devId/info",
        route: (devId: string, devAddress: Address) => {
            return `/publisher/${devId}/info?${buildDevPath(devAddress)}`
        },
        useParams: useDevIdParams,
    },
    Assets: {
        path: "/publisher/:devId/assets",
        route: (devId: string, devAddress: Address) => {
            return `/publisher/${devId}/assets?${buildDevPath(devAddress)}`
        },
        useParams: useDevIdParams,
    },
    AssetsCreate: {
        path: "/publisher/:devId/assets/create",
        route: (devId: string, devAddress: Address) => {
            return `/publisher/${devId}/assets/create?${buildDevPath(devAddress)}`
        },
        useParams: useDevIdParams,
    },
    AppAsset: {
        path: "/asset/:devId/:appPackage",
        route: (devId: string, appPackage: string, devAddress: Address, appAddress: Address) => {
            return `/asset/${devId}/${appPackage}?${buildAppPath(devAddress, appAddress)}`
        },
        useParams: useDevIdAndAppPackageParams,
    },
    AppInfo: {
        path: "/asset/:devId/:appPackage/info",
        route: (devId: string, appPackage: string, devAddress: Address, appAddress: Address) => {
            return `/asset/${devId}/${appPackage}/info?${buildAppPath(devAddress, appAddress)}`
        },
        useParams: useDevIdAndAppPackageParams,
    },
    AppDistributionEdit: {
        path: "/asset/:devId/:appPackage/distribution/edit",
        route: (devId: string, appPackage: string, devAddress: Address, appAddress: Address) => {
            return `/${devId}/${appPackage}/asset/distribution/edit?${buildAppPath(devAddress, appAddress)}`
        },
        useParams: useDevIdAndAppPackageParams,
    },
    AppInfoEdit: {
        path: "/asset/:devId/:appPackage/info/edit",
        route: (devId: string, appPackage: string, devAddress: Address, appAddress: Address) => {
            return `/${devId}/${appPackage}/asset/info/edit?${buildAppPath(devAddress, appAddress)}`
        },
        useParams: useDevIdAndAppPackageParams,
    },
    AppBuilds: {
        path: "/asset/:devId/:appPackage/builds",
        route: (devId: string, appPackage: string, devAddress: Address, appAddress: Address) => {
            return `/asset/${devId}/${appPackage}/builds?${buildAppPath(devAddress, appAddress)}`
        },
        useParams: useDevIdAndAppPackageParams,
    },
    AppStatus: {
        path: "/asset/:devId/:appPackage/status",
        route: (devId: string, appPackage: string, devAddress: Address, appAddress: Address) => {
            return `/asset/${devId}/${appPackage}/status?${buildAppPath(devAddress, appAddress)}`
        },
        useParams: useDevIdAndAppPackageParams,
    },
    OwnerValidation: {
        path: "/asset/:devId/:appPackage/status/owner",
        route: (devId: string, appPackage: string, devAddress: Address, appAddress: Address) => {
            return `/asset/${devId}/${appPackage}/status/owner?${buildAppPath(devAddress, appAddress)}`
        },
        useParams: useDevIdAndAppPackageParams,
    },
    AppNewRelease: {
        path: "/asset/:devId/:appPackage/status/release/create",
        route: (devId: string, appPackage: string, devAddress: Address, appAddress: Address) => {
            return `/asset/${devId}/${appPackage}/status/release/create?${buildAppPath(devAddress, appAddress)}`
        },
        useParams: useDevIdAndAppPackageParams,
    },
}

function buildDevPath(devAddress: Address) {
    return `devAddress=${devAddress}`
}

function buildAppPath(devAddress: Address, appAddress: Address) {
    return `devAddress=${devAddress}&appAddress=${appAddress}`
}

export const appRouter = createBrowserRouter([
    {
        path: AppRoute.Devs.path,
        element: <AltIntroDevsScreen/>,
    },

    {
        path: AppRoute.DevCreate.path,
        element: <IntroCreateDevScreen/>,
    },

    {
        path: AppRoute.Dev.path,
        element: <DevScreen/>,
        children: [
            {
                index: true,
                path: AppRoute.DevAccount.path,
                element: <DevAccountScreen/>
            },
            {
                path: AppRoute.Assets.path,
                element: <DevAppsListScreen/>
            },
            {
                path: AppRoute.AssetsCreate.path,
                element: <CreateAppScreen/>,
            }
        ]
    },

    {
        path: AppRoute.AppAsset.path,
        element: <AppScreen/>,
        children: [
            {
                index: true,
                path: AppRoute.AppInfo.path,
                element: <AppInfoScreen/>
            },
            {
                path: AppRoute.AppInfoEdit.path,
                element: <AppEditGeneralInfoScreen/>,
            },
            {
                path: AppRoute.AppDistributionEdit.path,
                element: <AppEditDistributionScreen/>,
            },
            {
                path: AppRoute.AppBuilds.path,
                element: <AppBuildsScreen/>,
            },
            {
                path: AppRoute.OwnerValidation.path,
                element: <AppEditOwnerVerificationScreen/>,
            },
            {
                path: AppRoute.AppStatus.path,
                element: <AppStatusScreen/>,
            },
            {
                path: AppRoute.AppNewRelease.path,
                element: <CreateReleaseScreen/>,
            },
        ]
    }
]);
