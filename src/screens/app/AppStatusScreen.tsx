import {IconButton, Stack, Typography} from "@mui/material";
import {AvoirTableView} from "@components/basic/AvoirTableView.tsx";
import {GridColDef} from "@mui/x-data-grid";
import {ContentContainer, PageContainer} from "@components/layouts/BaseContainers.tsx";
import {AvoirScreenTitle} from "@components/basic/AvoirScreenTitle.tsx";
import {
    ScAppSyncState,
    ScOracleService,
    ScOracleType,
    ScOwnershipVerificationStatus
} from "@data/sc/ScOracleService.ts";
import AccessTimeOutlined from "@mui/icons-material/AccessTimeOutlined";
import CancelOutlined from "@mui/icons-material/CancelOutlined";
import CheckCircleOutlined from "@mui/icons-material/CheckCircleOutlined";
import HelpOutlineOutlined from "@mui/icons-material/HelpOutlineOutlined";
import {AppRoute} from "@router";
import {S, useAsyncEffect, useScreenState} from "@utils/state.ts";
import {useNavigate} from "react-router";
import {DefaultScreenErrorProps, ScreenError} from "@components/basic/ScreenError";
import {AvoirSectionTitledBox} from "@components/basic/AvoirSection.tsx";
import {AvoirButtons} from "@components/inputs/AvoirButtons.tsx";
import {usePublishingRepo} from "@di";
import {AndroidPublishingResponse, ApkValidationStatus} from "@data/client/PublishingRepo.ts";
import {ProtocolId, TrackId} from "@data/CommonModels.ts";
import {ScreenEmpty} from "@components/basic/ScreenEmpty.tsx";
import {RStr} from "@localization/ids.ts";
import {str} from "@localization/res.ts";
import {IconRefresh} from "@tabler/icons-react";

export const renderOracleIcon = (sync: ScAppSyncState) => {
    if (sync.status == undefined) {
        return <AccessTimeOutlined color="warning" fontSize={"small"}/>
    }

    if (sync.status === ScOwnershipVerificationStatus.Undefined) {
        return <HelpOutlineOutlined color="secondary" fontSize={"small"}/>
    } else if (sync.status === ScOwnershipVerificationStatus.Success) {
        return <CheckCircleOutlined color="success" fontSize={"small"}/>
    } else {
        return <CancelOutlined color="error" fontSize={"small"}/>
    }
}

export const renderOracleTitle = (sync?: ScOwnershipVerificationStatus) => {
    switch (sync) {
        case undefined:
            return str(RStr.AppStatusScreen_oracle_pending_title)
        case ScOwnershipVerificationStatus.Undefined:
            return str(RStr.AppStatusScreen_oracle_notVerified_title)
        case ScOwnershipVerificationStatus.Success:
            return str(RStr.AppStatusScreen_oracle_verified_title)
        case ScOwnershipVerificationStatus.ExceedRpcAttemptsErrors:
            return str(RStr.AppStatusScreen_oracle_exceedRpcAttempts_title)
        case ScOwnershipVerificationStatus.UrlFormatError:
            return str(RStr.AppStatusScreen_oracle_urlFormatError_title)
        case ScOwnershipVerificationStatus.WebsiteFormatError:
            return str(RStr.AppStatusScreen_oracle_websiteFormat_title)
        case ScOwnershipVerificationStatus.UnreachableLinkError:
            return str(RStr.AppStatusScreen_oracle_unreachableLink_title)
        case ScOwnershipVerificationStatus.AssetlinkFormatError:
            return str(RStr.AppStatusScreen_oracle_contentFormat_title)
        case ScOwnershipVerificationStatus.ContentReadingError:
            return str(RStr.AppStatusScreen_oracle_contentReadingError_title)
        case ScOwnershipVerificationStatus.NoPackageError:
            return str(RStr.AppStatusScreen_oracle_noPackage_title)
        case ScOwnershipVerificationStatus.NoFingerprintError:
            return str(RStr.AppStatusScreen_oracle_noFingerprint_title)
        default:
            return str(RStr.AppStatusScreen_oracle_notVerified_title)
    }
}

export const renderOracleDescription = (sync: ScAppSyncState): string => {
    switch (sync.status) {
        case undefined:
            return str(RStr.AppStatusScreen_oracle_verificationInProgress_desc)
        case ScOwnershipVerificationStatus.Success:
            return str(RStr.AppStatusScreen_oracle_success_desc)
        case ScOwnershipVerificationStatus.AssetlinkFormatError:
            return str(RStr.AppStatusScreen_oracle_contentFormat_desc)
        case ScOwnershipVerificationStatus.NoFingerprintError:
            return str(RStr.AppStatusScreen_oracle_noFingerprint_desc)
        case ScOwnershipVerificationStatus.NoPackageError:
            return str(RStr.AppStatusScreen_oracle_noPackage_desc)
        case ScOwnershipVerificationStatus.ExceedRpcAttemptsErrors:
            return str(RStr.AppStatusScreen_oracle_exceedRpcAttempts_desc)
        case ScOwnershipVerificationStatus.UrlFormatError:
            return str(RStr.AppStatusScreen_oracle_urlFormatError_desc)
        case ScOwnershipVerificationStatus.ContentReadingError:
            return str(RStr.AppStatusScreen_oracle_contentReadingError_desc)
        case ScOwnershipVerificationStatus.UnreachableLinkError:
            return str(RStr.AppStatusScreen_oracle_unavailable_desc)
        case ScOwnershipVerificationStatus.WebsiteFormatError:
            return str(RStr.AppStatusScreen_oracle_websiteFormat_desc)
        default:
            return str(RStr.AppStatusScreen_oracle_notVerified_title)
    }
}

export const renderOracleType = (type: ScOracleType): string => {
    switch (type) {
        case ScOracleType.Ownership:
            return str(RStr.AppStatusScreen_oracleType_ownership)
        case ScOracleType.OwnershipReview:
            return str(RStr.AppStatusScreen_oracleType_ownershipReview)
        default:
            return str(RStr.AppStatusScreen_oracleType_ownership)
    }
}

const renderBuildStatusIcon = (status: ApkValidationStatus) => {
    switch (status) {
        case ApkValidationStatus.Success:
            return <CheckCircleOutlined color="success" fontSize={"small"}/>

        // Group 10s
        case ApkValidationStatus.InvalidApkFormat:
        case ApkValidationStatus.InvalidSignBlockFormat:
        case ApkValidationStatus.Zip64NotSupported:
        case ApkValidationStatus.HashMismatch:

        // Group 20s
        case ApkValidationStatus.TooManySigners:
        case ApkValidationStatus.NoSignersFound:
        case ApkValidationStatus.NoDigestFound:

        // Group 30s
        case ApkValidationStatus.UnknownSignatureAlgorithm:
        case ApkValidationStatus.IncorrectEncryptionData:
        case ApkValidationStatus.SignaturesNotFound:
        case ApkValidationStatus.InvalidSignature:

        // Group 40s
        case ApkValidationStatus.DigestAndSignatureAlgorithmsMismatch:
        case ApkValidationStatus.PreviousDigestForSameAlgorithmMismatch:

        // Group 50s
        case ApkValidationStatus.NoCertificatesFound:
        case ApkValidationStatus.PubKeyFromCertMismatch:
        case ApkValidationStatus.IncorrectCertFormat:

        // Group 60s
        case ApkValidationStatus.NoKnownDigestToCheck:
        case ApkValidationStatus.DigestMismatch:
        case ApkValidationStatus.TooManyChunks:
        case ApkValidationStatus.DigestAlgorithmNotFound:

        // Group 70s
        case ApkValidationStatus.ProofNotFound:
        case ApkValidationStatus.InvalidProof:
            return <CancelOutlined color="error" fontSize={"small"}/>

        default:
            return <HelpOutlineOutlined color="secondary" fontSize={"small"}/>
    }
}

const renderBuildStatusTitle = (status: ApkValidationStatus): string => {
    switch (status) {
        case ApkValidationStatus.Success:
            return str(RStr.AppStatusScreen_build_verified)

        // Group 10s
        case ApkValidationStatus.InvalidApkFormat:
        case ApkValidationStatus.InvalidSignBlockFormat:
        case ApkValidationStatus.Zip64NotSupported:

        // Group 20s
        case ApkValidationStatus.TooManySigners:
        case ApkValidationStatus.NoSignersFound:
        case ApkValidationStatus.NoDigestFound:

        // Group 30s
        case ApkValidationStatus.UnknownSignatureAlgorithm:
        case ApkValidationStatus.IncorrectEncryptionData:
        case ApkValidationStatus.SignaturesNotFound:
        case ApkValidationStatus.InvalidSignature:

        // Group 40s
        case ApkValidationStatus.DigestAndSignatureAlgorithmsMismatch:
        case ApkValidationStatus.PreviousDigestForSameAlgorithmMismatch:

        // Group 50s
        case ApkValidationStatus.NoCertificatesFound:
        case ApkValidationStatus.PubKeyFromCertMismatch:

        // Group 60s
        case ApkValidationStatus.NoKnownDigestToCheck:
        case ApkValidationStatus.DigestMismatch:
        case ApkValidationStatus.TooManyChunks:
        case ApkValidationStatus.DigestAlgorithmNotFound:

        // Group 70s
        case ApkValidationStatus.ProofNotFound:
        case ApkValidationStatus.HashMismatch:
        case ApkValidationStatus.InvalidProof:
            return str(RStr.AppStatusScreen_build_error)

        default:
            return str(RStr.AppStatusScreen_build_unknown)
    }
}

const renderBuildStatusMessage = (status: ApkValidationStatus) => {
    switch (status) {
        case ApkValidationStatus.Success:
            return str(RStr.AppStatusScreen_build_availableInStore)

        // Group 10s
        case ApkValidationStatus.InvalidApkFormat:
            return str(RStr.AppStatusScreen_build_invalidApkFormat)
        case ApkValidationStatus.InvalidSignBlockFormat:
            return str(RStr.AppStatusScreen_build_invalidSignBlock)
        case ApkValidationStatus.Zip64NotSupported:
            return str(RStr.AppStatusScreen_build_zip64Unsupported)

        // Group 20s
        case ApkValidationStatus.TooManySigners:
            return str(RStr.AppStatusScreen_build_tooManySigners)
        case ApkValidationStatus.NoSignersFound:
            return str(RStr.AppStatusScreen_build_noSignersFound)
        case ApkValidationStatus.NoDigestFound:
            return str(RStr.AppStatusScreen_build_noDigestFound)

        // Group 30s
        case ApkValidationStatus.UnknownSignatureAlgorithm:
            return str(RStr.AppStatusScreen_build_unknownSignAlgo)
        case ApkValidationStatus.IncorrectEncryptionData:
            return str(RStr.AppStatusScreen_build_badEncryptionData)
        case ApkValidationStatus.SignaturesNotFound:
            return str(RStr.AppStatusScreen_build_signaturesNotFound)
        case ApkValidationStatus.InvalidSignature:
            return str(RStr.AppStatusScreen_build_invalidSignature)

        // Group 40s
        case ApkValidationStatus.DigestAndSignatureAlgorithmsMismatch:
            return str(RStr.AppStatusScreen_build_algoMismatch)
        case ApkValidationStatus.PreviousDigestForSameAlgorithmMismatch:
            return str(RStr.AppStatusScreen_build_prevDigestMismatch)

        // Group 50s
        case ApkValidationStatus.NoCertificatesFound:
            return str(RStr.AppStatusScreen_build_noCertsFound)
        case ApkValidationStatus.PubKeyFromCertMismatch:
            return str(RStr.AppStatusScreen_build_keyCertMismatch)

        // Group 60s
        case ApkValidationStatus.NoKnownDigestToCheck:
            return str(RStr.AppStatusScreen_build_noDigestCheck)
        case ApkValidationStatus.DigestMismatch:
            return str(RStr.AppStatusScreen_build_digestMismatch)
        case ApkValidationStatus.TooManyChunks:
            return str(RStr.AppStatusScreen_build_tooManyChunks)
        case ApkValidationStatus.DigestAlgorithmNotFound:
            return str(RStr.AppStatusScreen_build_digestAlgoMissing)

        // Group 70s
        case ApkValidationStatus.HashMismatch:
            return str(RStr.AppStatusScreen_build_hashMismatch)
        case ApkValidationStatus.IncorrectCertFormat:
            return str(RStr.AppStatusScreen_build_incorrectCertFormat)

        default:
            return str(RStr.AppStatusScreen_build_unknownStatus)
    }
}

const oracleColumns: GridColDef[] = [
    {
        field: 'type', headerName: 'Type', flex: 1, minWidth: 10,
        renderCell: (params) => {
            return (
                <Stack
                    height={"100%"}
                    justifyContent="center">
                    <Typography
                        variant={"body2"}
                        fontWeight={"bold"}>
                        {renderOracleType(params.row.type)}
                    </Typography>
                </Stack>
            )
        },
    },
    {
        field: 'status', headerName: 'Status', flex: 1, minWidth: 10,
        renderCell: (params) => {
            return (
                <Stack
                    height={"100%"}
                    justifyContent="center">
                    <Stack
                        display="flex"
                        direction={"row"}
                        alignItems={"center"}
                        spacing={1}
                    >
                        {renderOracleIcon(params.row)}

                        <Typography
                            fontSize={"0.9rem"}
                            variant={"body1"}
                            fontWeight={"bold"}>
                            {renderOracleTitle(params.row.status)}
                        </Typography>
                    </Stack>

                    <Typography
                        variant={"caption"}
                        color={"text.secondary"}
                        fontWeight={"bold"}>
                        {renderOracleDescription(params.row)}
                    </Typography>
                </Stack>
            )
        },
    },
    {
        field: 'version', headerName: 'Version', flex: 1, minWidth: 10,
        renderCell: (params) => {
            return (
                <Stack
                    height={"100%"}
                    justifyContent="center">
                    <Typography
                        variant={"body1"}
                        fontWeight={"bold"}>
                        {params.row.version}
                    </Typography>
                </Stack>
            )
        },
    },
]

const publishingColumns: GridColDef[] = [
    {
        field: 'track', headerName: 'Track', flex: 1, minWidth: 10,
        valueGetter: (_, row) => {
            return TrackId[row.trackId];
        },
    },
    {
        field: 'status', headerName: 'Status', flex: 1, minWidth: 10,
        renderCell: (params) => (
            <Stack
                height={"100%"}
                justifyContent="center">

                <Stack
                    display="flex"
                    direction={"row"}
                    alignItems={"center"}
                    spacing={1}
                >
                    {renderBuildStatusIcon(params.row.status)}

                    <Typography
                        fontSize={"0.9rem"}
                        variant={"body1"}
                        fontWeight={"bold"}>
                        {renderBuildStatusTitle(params.row.status)}
                    </Typography>
                </Stack>

                <Typography
                    variant={"caption"}
                    color={"text.secondary"}>
                    {renderBuildStatusMessage(params.row.status)}
                </Typography>
            </Stack>
        ),
    },
    {
        field: 'versionCode', headerName: 'Version', flex: 1, minWidth: 10,
        valueGetter: (_, row) => {
            return `v${row.artifact.versionName} (${row.artifact.versionCode})`;
        },
    },
    {
        field: 'provider', headerName: 'Provider', flex: 1, minWidth: 10,
        valueGetter: (_, row) => {
            return ProtocolId[row.artifact.protocolId];
        },
    },
]

export function AppStatusScreen() {
    const navigate = useNavigate()
    const publishingRepo = usePublishingRepo()

    const {devId, appPackage, appAddress, devAddress, isFetching} = AppRoute.AppInfo.useParams();
    const {
        isLoading,
        error,
        data: oracleData,
        setState,
        retryCount: oracleRetryCount,
        retry: oracleRetry
    } = useScreenState<ScAppSyncState[], string>()
    const retryWithoutCache = () => {
        ScOracleService.clearLastState(appAddress)
        oracleRetry()
    }

    const {
        isLoading: isPublishLoading,
        error: publishError,
        data: publishData,
        setState: setPublishState,
        retry: publishRetry,
        retryCount: publishRetryCount,
    } = useScreenState<AndroidPublishingResponse, string>()

    useAsyncEffect(async () => {
        if (!isFetching) {
            try {
                setState(S.loading())
                const result = await ScOracleService.getLastStates(appAddress);
                setState(S.data(result))
            } catch (e) {
                console.error(e)
                setState(S.error(""))
            }
        }
    }, [isFetching, oracleRetryCount])

    useAsyncEffect(async () => {
        if (!isFetching) {
            try {
                setPublishState(S.loading())
                const publishing = await publishingRepo.getPublishing(appAddress)
                setPublishState(S.data(publishing))
            } catch (e) {
                console.error(e)
                setPublishState(S.error(""))
            }
        }
    }, [isFetching, publishRetryCount])

    return (
        <PageContainer>
            <AvoirScreenTitle
                title={str(RStr.AppStatusScreen_title)}
                description={str(RStr.AppStatusScreen_description)}/>

            <ContentContainer>
                <Stack
                    spacing={4}
                    width={"100%"}
                    maxWidth={"1280px"}
                >

                    <AvoirSectionTitledBox
                        title={str(RStr.AppStatusScreen_dataVerification_title)}
                        description={str(RStr.AppStatusScreen_dataVerification_description)}
                        infoLink={AppRoute.Article.route(AppRoute.Article.Publishing)}
                        action={() => {
                            return (
                                <Stack spacing={2} direction={"row"}>
                                    <IconButton
                                        color={"primary"}
                                        onClick={retryWithoutCache}
                                        disabled={isFetching || isLoading}
                                    >
                                        <IconRefresh/>
                                    </IconButton>

                                    <AvoirButtons
                                        text={str(RStr.AppStatusScreen_dataVerification_manageButton)}
                                        onClick={() => {
                                            navigate(
                                                AppRoute.OwnerValidation.route(devId, appPackage, devAddress, appAddress)
                                            )
                                        }}
                                    />
                                </Stack>
                            )
                        }}>

                        <AvoirTableView
                            rows={oracleData}
                            columns={oracleColumns}
                            isSelectable={false}
                            isLoading={isLoading}
                            isError={error != null}
                            errorOverride={() => {
                                return <ScreenError
                                    {...DefaultScreenErrorProps}
                                    action={str(RStr.Retry)}
                                    onAction={oracleRetry}
                                />
                            }}
                        />
                    </AvoirSectionTitledBox>


                    <AvoirSectionTitledBox
                        title={str(RStr.AppStatusScreen_buildChannels_title)}
                        description={str(RStr.AppStatusScreen_buildChannels_description)}
                        infoLink={AppRoute.Article.route(AppRoute.Article.Publishing)}
                        action={() => {
                            return (
                                <Stack spacing={2} direction={"row"}>
                                    <IconButton
                                        color={"primary"}
                                        onClick={publishRetry}
                                        disabled={isFetching || isPublishLoading}
                                    >
                                        <IconRefresh/>
                                    </IconButton>

                                    <AvoirButtons
                                        text={str(RStr.AppStatusScreen_buildChannels_manageButton)}
                                        onClick={() => {
                                            navigate(
                                                AppRoute.AppNewRelease.route(devId, appPackage, devAddress, appAddress)
                                            )
                                        }}
                                    />
                                </Stack>
                            )
                        }}>

                        {
                            !isPublishLoading && publishData && publishData.published.length === 0
                                ? <ScreenEmpty {...DefaultScreenErrorProps} />
                                : <AvoirTableView
                                    rows={publishData?.published}
                                    // rows={[]}
                                    columns={publishingColumns}
                                    isSelectable={false}
                                    isLoading={isPublishLoading}
                                    isError={publishError != null}
                                    errorOverride={
                                        () => {
                                            return (
                                                <ScreenError
                                                    {...DefaultScreenErrorProps}
                                                    action={str(RStr.Retry)}
                                                    onAction={() => {
                                                        publishRetry()
                                                    }}
                                                />
                                            )
                                        }
                                    }
                                    // TODO v2 add click to specific build
                                />
                        }
                    </AvoirSectionTitledBox>
                </Stack>
            </ContentContainer>
        </PageContainer>
    )
}