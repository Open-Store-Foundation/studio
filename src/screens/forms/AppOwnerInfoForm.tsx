import {Alert, Collapse, Link, Stack, Typography} from "@mui/material";
import Box from "@mui/material/Box";
import {AvoirTitledRoFiled} from "@components/inputs/AvoirTitledRoFiled.tsx";
import {FieldAction} from "@components/inputs/FieldAction.tsx";
import {AvoirCountedTextField} from "@components/inputs/AvoirCountedTextField.tsx";
import {AvoirSectionTitledBox} from "@components/basic/AvoirSection.tsx";
import {AvoirTitledTextField} from "@components/inputs/AvoirTitledTextField.tsx";
import {AvoirSecondaryButton} from "@components/inputs/AvoirButtons.tsx";
import {Spacer} from "@components/layouts/Spacer.tsx";
import {AvoirPropertyBox} from "@components/basic/AvoirProperty.tsx";
import {Address, AppCertificateProof, AppCertificateProofFactory} from "@data/CommonModels.ts";
import {FormFieldProps, RenderEditButton} from "@screens/forms/form.tsx";
import {RStr} from "@localization/ids.ts";
import {str} from "@localization/res.ts";
import {useMemo} from "react";
import {appConfig} from "@config";
import {IconEye} from "@tabler/icons-react";

export function parseProofs(certs: AppCertificateProof[]) {
    const proofs = certs.map((_, i) => {
        const fingerprintEl = document.getElementById(`fingerprint-${i}`) as HTMLInputElement;
        const certEl = document.getElementById(`cert-${i}`) as HTMLInputElement;
        const proofEl = document.getElementById(`proof-${i}`) as HTMLInputElement;
        return AppCertificateProofFactory.defaultProof(
            fingerprintEl.value,
            certEl.value,
            proofEl.value,
        )
    })

    return proofs
}

export interface AppOwnerInfoFormProps {
    appAddress: Address | null,
    website: FormFieldProps<string>,
    certs: AppCertificateProof[];
    isLoading: boolean;
    isAddAvailable: boolean;
    onAddCertificate: () => void;
    onDeleteCertificate: (index: number) => void;
}

export function AppOwnerInfoForm({
    appAddress,
    website,
    certs,
    isLoading,
    isAddAvailable,
    onAddCertificate,
    onDeleteCertificate,
}: AppOwnerInfoFormProps) {
    return (
        <AvoirSectionTitledBox
            title={str(RStr.AppOwnerInfoForm_title)}
            description={str(RStr.AppOwnerInfoForm_description)}
            contentOffset={3}>

            <Stack spacing={6}>
                <AvoirTitledTextField
                    maxLength={100}
                    title={str(RStr.AppOwnerInfoForm_website_label)}
                    value={website.value}
                    type={"url"}
                    autocomplete={"off"}
                    disabled={isLoading}
                    onChange={(e) => website.onChange(e.target.value)}
                    error={!website.isValid}
                    helperText={
                        website.isValid
                            ? str(RStr.AppOwnerInfoForm_website_helper)
                            : str(RStr.AppOwnerInfoForm_website_error)
                    }
                />

                <CertificateProofTextFields
                    appAddress={appAddress}
                    certs={certs}
                    isAddAvailable={isAddAvailable}
                    isLoading={isLoading}
                    onAddCertificate={onAddCertificate}
                    onDeleteCertificate={onDeleteCertificate}
                />
            </Stack>
        </AvoirSectionTitledBox>
    )
}

export interface AppOwnerInfoReadOnlyFormProps {
    domain: string
    certs: AppCertificateProof[]
    isSynced: boolean | null
    isRevealed: boolean | null
    editHref?: string;
    onReveal?: () => void;
    revealLoading?: boolean;
}

export function AppOwnerInfoReadOnlyForm(
    {
        domain,
        certs,
        isSynced,
        isRevealed,
        editHref,
        onReveal,
        revealLoading,
    }: AppOwnerInfoReadOnlyFormProps
) {
    return (
        <AvoirSectionTitledBox
            title={str(RStr.AppOwnerInfoForm_title)}
            description={str(RStr.AppOwnerInfoForm_description)}
            action={() => {
                return (
                    <Stack direction={"row"} spacing={2} alignItems={"center"}>
                        {editHref ? RenderEditButton(editHref) : undefined}
                    </Stack>
                )
            }}>

            <OwnerRequirementAlert isSynced={isSynced}/>

            <Spacer y={1}/>

            <AvoirTitledRoFiled
                label={str(RStr.AppOwnerInfoForm_website_label)}
                value={domain}
                helperText={str(RStr.AppOwnerInfoForm_website_helper)}
                action={FieldAction.Copy}
            />

            {
                certs.map((cert, i) => {
                    return (
                        <Stack
                            key={`saved-cert-${i}`}
                            direction={"column"}
                            spacing={2}
                            display={"flex"}
                            alignItems={"flex-start"}
                            py={2}
                        >
                            <AvoirTitledRoFiled
                                label={`${str(RStr.AppOwnerInfoForm_certificate_label)}${i + 1}`}
                                value={cert.fingerprint || str(RStr.AppOwnerInfoForm_no_fingerprint)}
                                helperText={str(RStr.AppOwnerInfoForm_certificate_fingerprint_helper)}
                                action={FieldAction.Copy}
                            />

                            

                            {isRevealed && (
                                <AvoirTitledRoFiled
                                    label={``}
                                    action={FieldAction.Copy}
                                    value={cert.cert || str(RStr.AppOwnerInfoForm_no_cert)}
                                    helperText={str(RStr.AppOwnerInfoForm_certificate_cert_helper)}
                                />
                            )}

                            {isRevealed && (
                                <AvoirTitledRoFiled
                                    label={``}
                                    action={FieldAction.Copy}
                                    value={cert.proof || str(RStr.AppOwnerInfoForm_no_proof)}
                                    helperText={str(RStr.AppOwnerInfoForm_certificate_proof_helper)}
                                />
                            )}
                        </Stack>
                    )
                })
            }

            {
                !isRevealed && (
                    <AvoirPropertyBox type={"default"} background={"background.surfaceVariant"}>
                        <Stack spacing={1} alignItems={"center"} pt={1}>
                            <Typography variant="body2" color="text.secondary" textAlign={"center"}>
                                {str(RStr.AppOwnerInfoForm_reveal_title)}
                            </Typography>

                            {onReveal && (
                                <AvoirSecondaryButton
                                    text={str(RStr.AppOwnerInfoForm_reveal_certs)}
                                    color={"primary"}
                                    icon={() => <IconEye/>}
                                    onClick={onReveal}
                                    disabled={revealLoading}
                                />
                            )}
                        </Stack>
                    </AvoirPropertyBox>
                )
            }
        </AvoirSectionTitledBox>
    )
}

export interface AppOwnerInfoEditFormProps {
    domain: FormFieldProps<string>;
    certs: AppCertificateProof[];
    isSynced: boolean | null;
    isLoading: boolean;
    deletedCertIndices: Set<number>;
    onAction: (index: number, action: FieldAction) => void;
    newCertificatesProps: CertificateProofTextFieldsProps;
}

// TODO V3 investigate if it's OK to have defaultValue instead of value here
export function AppOwnerInfoEditForm(
    {
        domain,
        certs,
        isSynced,
        isLoading,
        deletedCertIndices,
        onAction,
        newCertificatesProps,
    }: AppOwnerInfoEditFormProps
) {
    const deletedSize = deletedCertIndices?.size ?? 0
    const newSize = newCertificatesProps?.certs.length ?? 0
    const certsLeft = certs.length - deletedSize + newSize
    const isLastActiveCertificate = certsLeft == 1;

    return (
        <AvoirSectionTitledBox
            title={str(RStr.AppOwnerInfoForm_title)}
            description={str(RStr.AppOwnerInfoForm_description)}>

            <OwnerRequirementAlert isSynced={isSynced}/>

            <Spacer y={1}/>

            <AvoirTitledTextField
                grow
                multiline
                title={str(RStr.AppOwnerInfoForm_website_label)}
                maxLength={100}
                id={"outlined-multiline-flexible"}
                maxRows={3}
                value={domain.value}
                disabled={isLoading}
                helperText={str(RStr.AppOwnerInfoForm_website_helper)}
                onChange={(e) => domain.onChange(e.target.value)}
            />

            {
                certs.map((cert, i) => {
                    const isDeleted = deletedCertIndices?.has(i)
                    const currentAction = isDeleted ? FieldAction.Restore : FieldAction.Delete
                    const isActionDisabled = isLoading || (currentAction == FieldAction.Delete && isLastActiveCertificate)

                    return (
                        <Stack
                            key={`saved-cert-${i}`}
                            direction={"column"}
                            spacing={2}
                            display={"flex"}
                            alignItems={"flex-start"}
                            py={2}
                        >
                            <AvoirTitledRoFiled
                                label={`${str(RStr.AppOwnerInfoForm_certificate_label)}${i + 1}`}
                                value={cert.fingerprint || str(RStr.AppOwnerInfoForm_no_fingerprint)}
                                helperText={str(RStr.AppOwnerInfoForm_certificate_fingerprint_helper)}
                                action={currentAction}
                                onActionClick={() => {
                                    onAction?.(i, currentAction)
                                }}
                                disabled={isDeleted}
                                actionDisabled={isActionDisabled}
                            />

                            <AvoirTitledRoFiled
                                label={``}
                                value={cert.cert || str(RStr.AppOwnerInfoForm_no_cert)}
                                helperText={str(RStr.AppOwnerInfoForm_certificate_cert_helper)}
                                disabled={isDeleted}
                            />

                            <AvoirTitledRoFiled
                                label={``}
                                value={cert.proof || str(RStr.AppOwnerInfoForm_no_proof)}
                                helperText={str(RStr.AppOwnerInfoForm_certificate_proof_helper)}
                                disabled={isDeleted}
                            />
                        </Stack>
                    )
                })
            }

            <CertificateProofTextFields
                {...newCertificatesProps}
                indexOffset={certs.length}
                isActionDisabled={isLastActiveCertificate}
                isAddAvailable={certs.length + newCertificatesProps.certs.length <= 10}
            />
        </AvoirSectionTitledBox>
    )
}

function OwnerRequirementAlert({isSynced}: { isSynced: boolean | null }) {
    return (
        <>
            {
                isSynced == false && <Alert
                    severity="error"
                    sx={{backgroundColor: "background.paper", borderRadius: 8}}
                >
                    {str(RStr.AppOwnerInfoForm_ownership_alert)}
                </Alert>
            }
        </>
    )
}

export interface CertificateProofTextFieldsProps {
    appAddress: Address | null,
    certs: AppCertificateProof[];
    isLoading: boolean;
    isAddAvailable: boolean;
    onAddCertificate: () => void;
    onDeleteCertificate: (index: number) => void;
    firstRemovable?: boolean;
    isActionDisabled?: boolean;
    indexOffset?: number;
}

export function CertificateProofTextFields(
    {
        appAddress,
        certs,
        isLoading,
        isActionDisabled,
        isAddAvailable,
        indexOffset,
        onDeleteCertificate,
        firstRemovable,
        onAddCertificate
    }: CertificateProofTextFieldsProps
) {
    const renderCerts = () => {
        const offset = indexOffset ?? 0;
        return certs
            .map((cert, i) => {
                return (
                    <CertificateProofTextField
                        cert={cert}
                        index={offset + i}
                        isLoading={isLoading}
                        isFirstRemovable={firstRemovable}
                        onDeleteCertificate={onDeleteCertificate}
                        isActionDisabled={isActionDisabled || isLoading}
                        hasDescription={i == 0}/>
                )
            })
    }

    return (
        <Stack spacing={1}>

            <Collapse in={certs.length > 0}>
                <Stack spacing={6}>
                    {
                        appAddress &&
                        <CertificateProofInstruction
                            appAddress={appAddress}/>
                    }

                    <Stack spacing={6}>
                        {renderCerts()}
                    </Stack>
                </Stack>
            </Collapse>

            {
                isAddAvailable &&
                <Box textAlign={"end"} width={850}>
                    <AvoirSecondaryButton text={str(RStr.AppOwnerInfoForm_add_certificate)}
                                          onClick={onAddCertificate}/>
                </Box>
            }
        </Stack>
    )
}

export interface CertificateProofTextFieldProps {
    index: number;
    cert: AppCertificateProof;
    isLoading: boolean;
    onDeleteCertificate: (i: number) => void;
    isActionDisabled?: boolean;
    isFirstRemovable?: boolean;
    hasDescription?: boolean;
}

export function CertificateProofTextField({index, isLoading, cert, onDeleteCertificate, isActionDisabled, isFirstRemovable, hasDescription}: CertificateProofTextFieldProps) {
    return <Stack
        key={index}
        direction={"row"}
        display={"flex"}
        alignItems={"flex-start"}>

        <Typography
            variant={"subtitle2"}
            color={"text.secondary"}
            fontWeight={"500"}
            width={250}
            flexWrap={"nowrap"}>
            {`${str(RStr.AppOwnerInfoForm_certificate_label)}${index + 1}`}
        </Typography>

        <Stack flexGrow={1} spacing={4}>
            <AvoirCountedTextField
                helperText={hasDescription ? str(RStr.AppOwnerInfoForm_certificate_fingerprint_helper) : ""}
                maxLength={95}
                disabled={isLoading}
                placeholder={str(RStr.AppOwnerInfoForm_fingerprint_placeholder)}
                autocomplete={"off"}
                id={`fingerprint-${index}`}
                name="Fingerprint 1"
                action={index >= 1 || isFirstRemovable ? FieldAction.Delete : FieldAction.None}
                onAction={() => onDeleteCertificate(cert.ordinal)}
                actionDisabled={isActionDisabled}
                defaultValue={cert.fingerprint || ""}
                maxRows={3}
                multiline
                grow
            />

            <AvoirCountedTextField
                helperText={hasDescription ? str(RStr.AppOwnerInfoForm_certificate_cert_helper) : ""}
                disabled={isLoading}
                maxLength={3072}
                autocomplete={"off"}
                placeholder={str(RStr.AppOwnerInfoForm_cert_placeholder)}
                id={`cert-${index}`}
                name="Certificate 1"
                defaultValue={cert.cert || ""}
                maxRows={5}
                multiline
                grow
            />

            <AvoirCountedTextField
                helperText={hasDescription ? str(RStr.AppOwnerInfoForm_certificate_proof_helper) : ""}
                disabled={isLoading}
                maxLength={1024}
                autocomplete={"off"}
                placeholder={str(RStr.AppOwnerInfoForm_proof_placeholder)}
                id={`proof-${index}`}
                name="Proof 1"
                defaultValue={cert.proof || ""}
                maxRows={5}
                multiline
                grow
            />
        </Stack>
    </Stack>
}

export function CertificateProofInstruction({appAddress}: { appAddress: Address }) {
    const caseAddress = useMemo(() => {
        return `0x${appAddress.slice(2).toLowerCase()}`
    }, [appAddress])

    return (
        <AvoirPropertyBox type={"big"} background={"background.surfaceVariant"}>
            <Stack spacing={2}>
                <Typography variant="subtitle1" color={"text.title"} fontWeight="bold">
                    {str(RStr.AppOwnerInfoForm_how_to_generate_title)}
                </Typography>

                <Typography variant="body2" color="text.secondary">
                    {str(RStr.AppOwnerInfoForm_how_to_generate_step1)}
                    <Link
                        href={appConfig.proofGenLUrl}
                        target="_blank" rel="noopener">
                        {str(RStr.AppOwnerInfoForm_this_link)}
                    </Link>
                </Typography>

                <Typography variant="body2" color="text.secondary">
                    {str(RStr.AppOwnerInfoForm_how_to_generate_step2)}
                </Typography>

                <Typography variant="body2" color="text.secondary">
                    {str(RStr.AppOwnerInfoForm_how_to_generate_note1)}
                </Typography>

                <Typography variant="body2" color="text.secondary">
                    {str(RStr.AppOwnerInfoForm_how_to_generate_note2)}
                </Typography>

                <Typography
                    variant="body2"
                    sx={{
                        fontFamily: 'monospace',
                        bgcolor: 'background.drawer',
                        whiteSpace: 'pre-wrap',
                        wordBreak: 'break-word',
                        p: 1,
                        borderRadius: 1,
                        mb: 1
                    }}
                >
                    python3 proof_gen.py -jks-path=path/to/keystore.jks -alias=YOUR_ALIAS
                    -address={caseAddress} -network={appConfig.chainName}
                </Typography>
            </Stack>
        </AvoirPropertyBox>
    )
}
