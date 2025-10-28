import {useNavigate} from "react-router";
import {useState} from "react";
import {Collapse, Stack} from "@mui/material";
import {ContentContainer, PageContainer} from "@components/layouts/BaseContainers.tsx";
import {ScAppDistribution, ScAppDistributionType, ScAppGeneralInfo, ScAssetService} from "@data/sc/ScAssetService.ts";
import {AppGeneralInfoReadOnlyForm} from "../forms/AppGeneralInfoForm.tsx";
import {OracleVerificationNotification} from "../common/OracleVerificationNotification.tsx";
import {AppRoute} from "@router";
import {ScOracleService} from "@data/sc/ScOracleService.ts";
import {AvoirScreenTitle} from "@components/basic/AvoirScreenTitle.tsx";
import {AppOwnerInfoReadOnlyForm} from "../forms/AppOwnerInfoForm.tsx";
import {Spacer} from "@components/layouts/Spacer.tsx";
import {S, useAsyncEffect, useScreenState} from "@utils/state.ts";
import {AppCategoryReadOnlyForm} from "@screens/forms/AppCategoryForm.tsx";
import {AppSourcesReadOnlyForm} from "@screens/forms/AppSourcesForm.tsx";
import {AndroidTypeId, AppCertificateProofFactory, AppOwnerInfo} from "@data/CommonModels.ts";
import {RStr} from "@localization/ids.ts";
import {str} from "@localization/res.ts";
import {LogoDrawerDialog} from "@screens/release/dialogs/LogoDrawerDialog.tsx";
import {AutoSnackbar, DefaultSnackbarError} from "@components/events/AutoSnackbar.tsx";

export function AppInfoScreen() {
    const navigate = useNavigate();

    const { devId, appPackage, appAddress, devAddress, isFetching } = AppRoute.AppInfo.useParams();

    const { data, isLoading, setState } = useScreenState<AppOwnerInfo, boolean>()

    const [info, setInfo] = useState<ScAppGeneralInfo | undefined>(undefined)
    const [distribution, setDistribution] = useState<ScAppDistribution | undefined>(undefined)
    const [isSynced, setIsSynced] = useState<boolean | null>(null)
    const [isLogoDrawerOpen, setIsLogoDrawerOpen] = useState(false)
    const [logoRefreshKey, setLogoRefreshKey] = useState(0)
    const [ownerCertsRevealed, setOwnerCertsRevealed] = useState(false)
    const [revealLoading, setRevealLoading] = useState(false)
    const [revealError, setRevealError] = useState<string | null>(null)

    useAsyncEffect(async () => {
        if (isFetching) {
            return
        }

        try {
            const info = await ScAssetService.getAppGeneralInfo(appAddress)
            if (info) {
                setInfo(info)
            }
        } catch (e) {
            console.error(e)
        }
    }, [isFetching])

    useAsyncEffect(async () => {
        if (isFetching) {
            return
        }

        try {
            const distribution = await ScAssetService.getDistributionSources(appAddress)
            setDistribution(distribution)
        } catch (e) {
            console.error(e)
        }
    }, [isFetching])

    useAsyncEffect(async () => {
        if (isFetching) {
            return
        }

        let state: AppOwnerInfo | null = null

        try {
            setState(S.loading())
            const data = await ScAssetService.getOwnerState(appAddress)

            state = {
                domain: data.domain,
                proofs: data.fingerprints.map((f) => AppCertificateProofFactory.defaultProof(f)) ?? []
            } as AppOwnerInfo

            setState(S.data(state))
        } catch (e) {
            console.error(e)
            setState(S.error(true))
        }

        if (state && appAddress) {
            const lastVersion = await ScOracleService.lastVersionVerified(appAddress)
            const isSynced = lastVersion > 0;
            if (!isSynced) {
                const state = await ScOracleService.getLastState(appAddress)
                setIsSynced(state.pendingVersion > 0)
            } else {
                setIsSynced(true)
            }
        }
    }, [isFetching]);

    const handleReveal = async () => {
        if (!appAddress || revealLoading) {
            return
        }

        setRevealLoading(true)
        try {
            const { owner, proof } = await ScAssetService.getOwnerStateWithProofs(appAddress)
            const proofs = owner.fingerprints.map((fingerprint, i) =>
                AppCertificateProofFactory.defaultProof(fingerprint, proof.certs?.[i] || "", proof.proofs?.[i] || "")
            )
            setState(S.data({ domain: owner.domain, proofs }))
            setOwnerCertsRevealed(true)
        } catch (e) {
            console.error(e)
            setRevealError(DefaultSnackbarError)
        } finally {
            setRevealLoading(false)
        }
    }

    const handleLogoUploadComplete = () => {
        setIsLogoDrawerOpen(false)
        setLogoRefreshKey(prev => prev + 1)
    }

    return (
        <PageContainer>
            <AutoSnackbar message={revealError} onClose={() => setRevealError(null)}/>

            <AvoirScreenTitle
                title={str(RStr.AppInfoScreen_title)}
                description={str(RStr.AppInfoScreen_description)}/>

            <ContentContainer spacing={3}>
                <Stack
                    spacing={3}
                    width={"100%"}
                    maxWidth={"1024px"}
                    justifyContent={"center"}
                    direction={"row"}
                    >
                    <Stack
                        flexGrow={1}
                        spacing={3}
                    >
                        <Collapse in={isSynced == false}>
                            <OracleVerificationNotification
                                onValidateClick={() => {
                                    return navigate(
                                        AppRoute.OwnerValidation.route(devId, appPackage, devAddress, appAddress)
                                    )
                                }}
                                isLoading={isLoading}
                            />
                        </Collapse>

                        <AppGeneralInfoReadOnlyForm
                            appAddress={appAddress}
                            name={info?.name}
                            packageName={appPackage}
                            description={info?.description}
                            isLoading={isLoading}
                            editHref={!isFetching ? AppRoute.AppInfoEdit.route(devId, appPackage, devAddress, appAddress) : undefined}
                            devId={devId}
                            appPackage={appPackage}
                            onLogoClick={() => setIsLogoDrawerOpen(true)}
                            logoRefreshKey={logoRefreshKey}
                        />

                        {
                            info && <AppCategoryReadOnlyForm
                                objType={AndroidTypeId.App}
                                category={info.categoryId}
                                platform={info.platformId}
                                editHref={!isFetching ? AppRoute.AppInfoEdit.route(devId, appPackage, devAddress, appAddress) : undefined}
                            />
                        }

                        <AppOwnerInfoReadOnlyForm
                            certs={data?.proofs ?? []}
                            domain={data?.domain || ""}
                            isSynced={isSynced}
                            isRevealed={ownerCertsRevealed}
                            editHref={!isFetching ? AppRoute.OwnerValidation.route(devId, appPackage, devAddress, appAddress) : undefined}
                            onReveal={handleReveal}
                            revealLoading={revealLoading}
                        />

                        <AppSourcesReadOnlyForm
                            sources={distribution?.sources ?? []}
                            isCustomEnabled={distribution?.type == ScAppDistributionType.Custom}
                            editHref={!isFetching ? AppRoute.AppDistributionEdit.route(devId, appPackage, devAddress, appAddress) : undefined}
                        />

                        <Spacer y={5}/>
                    </Stack>
                </Stack>
            </ContentContainer>

            {
                isLogoDrawerOpen &&
                <LogoDrawerDialog
                    open={isLogoDrawerOpen}
                    onClose={() => setIsLogoDrawerOpen(false)}
                    onSuccess={handleLogoUploadComplete}
                />
            }
        </PageContainer>
    )
}
