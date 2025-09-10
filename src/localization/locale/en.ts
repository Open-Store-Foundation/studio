import {RStr} from "@localization/ids.ts";
import {StrToken} from "@localization/res.ts";

export function prepare_en_locale(): Map<StrToken, string> {
    let map = new Map<StrToken, string>();

    map.set(RStr.TokenExample, "Example");
    map.set(RStr.UnknownError, "Something went wrong. Please try again later.");
    map.set(RStr.Retry, "Retry");
    map.set(RStr.Back, "Back");
    map.set(RStr.Continue, "Continue");
    map.set(RStr.Save, "Save");
    map.set(RStr.Next, "Next");
    map.set(RStr.Cancel, "Cancel");
    map.set(RStr.TopUp, "Top up");
    map.set(RStr.TbnbGbPerMonth, "tBNB/GB/month");
    map.set(RStr.GbPerMonth, "GB/month");
    map.set(RStr.PerMonth, "/month");
    map.set(RStr.Enabled, "Enabled");
    map.set(RStr.Disabled, "Disabled");
    map.set(RStr.Fees, "Fees");
    map.set(RStr.Total, "Total");
    map.set(RStr.Topup, "Top Up");
    map.set(RStr.Error, "Error");
    map.set(RStr.Unknown, "Unknown");
    map.set(RStr.NotFound, "Not found anything :(");

    map.set(RStr.AppOwnerInfoForm_title, "Ownership info");
    map.set(RStr.AppOwnerInfoForm_description, "Without ownership verification it's only possible to find application by address!"); // TODO
    map.set(RStr.AppOwnerInfoForm_website_label, "Website");
    map.set(RStr.AppOwnerInfoForm_website_helper, "Website for ownership verification through '.well-known/assetlinks.json'"); // TODO learn more
    map.set(RStr.AppOwnerInfoForm_website_error, "Website shouldn't have path");
    map.set(RStr.AppOwnerInfoForm_certificate_label, "Certificate #");
    map.set(RStr.AppOwnerInfoForm_certificate_fingerprint_helper, "SHA-256 fingerprint of certificate");
    map.set(RStr.AppOwnerInfoForm_certificate_proof_helper, "Signature proof of ownership");
    map.set(RStr.AppOwnerInfoForm_add_certificate, "Add Certificate");
    map.set(RStr.AppOwnerInfoForm_how_to_generate_title, "How to generate fingerprint and proof?");
    map.set(RStr.AppOwnerInfoForm_how_to_generate_step1, "1. Download Python script using ");
    map.set(RStr.AppOwnerInfoForm_how_to_generate_step2, "2. In terminal specify your keystore and PK's alias you want to proof");
    map.set(RStr.AppOwnerInfoForm_how_to_generate_note1, "* Replace all parameters except address with your own data");
    map.set(RStr.AppOwnerInfoForm_how_to_generate_note2, "* You can also use LLMs to ensure code is safe");
    map.set(RStr.AppOwnerInfoForm_ownership_alert, "Ownership verification is needed, users will be able to find and download your application only by address!");
    map.set(RStr.AppOwnerInfoForm_no_fingerprint, "No fingerprint");
    map.set(RStr.AppOwnerInfoForm_no_proof, "No proof");
    map.set(RStr.AppOwnerInfoForm_this_link, "this link");
    map.set(RStr.AppOwnerInfoForm_your_address, "YOUR_ADDRESS");
    map.set(RStr.AppOwnerInfoForm_fingerprint_placeholder, "SHA-256 Fingerprint");
    map.set(RStr.AppOwnerInfoForm_proof_placeholder, "Proof");

    map.set(RStr.AppGeneralInfoForm_title, "General info");
    map.set(RStr.AppGeneralInfoForm_description, "Provide basic details about your application");
    map.set(RStr.AppGeneralInfoForm_package_name_label, "Package name");
    map.set(RStr.AppGeneralInfoForm_package_name_helper, "Package is ID for your APK file, you WONT be able to change it");
    map.set(RStr.AppGeneralInfoForm_package_name_error, "Package should contain only latin letters, digits, dots and underscore");
    map.set(RStr.AppGeneralInfoForm_app_name_label, "Name");
    map.set(RStr.AppGeneralInfoForm_app_name_helper, "This is how your app will appear on Open Store. It should be concise and not include price, rank, any emoji or repetitive symbols");
    map.set(RStr.AppGeneralInfoForm_app_name_error, "App name should contain 0-9, !@#$_-., a-Z, A-Z");
    map.set(RStr.AppGeneralInfoForm_description_label, "Description");
    map.set(RStr.AppGeneralInfoForm_description_helper, "Write a clear and engaging description that highlights your app's key features and benefits to help users understand what your app does");
    map.set(RStr.AppGeneralInfoForm_app_contract_label, "App Contract");
    map.set(RStr.AppGeneralInfoForm_application_logo, "Application logo");

    map.set(RStr.AppSourcesForm_title, "Distribution");
    map.set(RStr.AppSourcesForm_description, "Configure how and where your application will be distributed to users");
    map.set(RStr.AppSourcesForm_settings_title, "Settings");
    map.set(RStr.AppSourcesForm_settings_description, "Control global distribution preferences and enable advanced distribution options");
    map.set(RStr.AppSourcesForm_sources_title, "Sources");
    map.set(RStr.AppSourcesForm_sources_description, "Add and manage multiple download sources where users can get your application");
    map.set(RStr.AppSourcesForm_custom_distribution_label, "Enable custom distribution");
    map.set(RStr.AppSourcesForm_source_label, "Source");
    map.set(RStr.AppSourcesForm_add_source_button, "Add Source");
    map.set(RStr.AppSourcesForm_field_description, "You can use dynamic parameters VERSION_CODE/VERSION_NAME/REF_ID in source link (e.g. https://example.com/download/${VERSION_CODE}/app.apk)");
    map.set(RStr.AppSourcesForm_distribution_info_title, "Distribution info");
    map.set(RStr.AppSourcesForm_custom_distribution_title, "Custom distribution");
    map.set(RStr.AppSourcesForm_sources_count_title, "Sources count");
    map.set(RStr.AppSourcesForm_some_description_to_specify_what_we_can_do_here_or_not, "Configure what is allowed here"); // TODO
    map.set(RStr.AppSourcesForm_custom_distribution_enabled, "Custom distribution is enabled");
    map.set(RStr.AppSourcesForm_custom_distribution_disabled, "Custom distribution is disabled");
    map.set(RStr.AppSourcesForm_source_url_label, "Source URL");
    map.set(RStr.AppSourcesForm_source_url_helper, "URL where your APK file is hosted");
    map.set(RStr.AppSourcesForm_source_url_error, "URL should be valid and accessible");
    map.set(RStr.AppSourcesForm_source_enabled_label, "Enable source");
    map.set(RStr.AppSourcesForm_source_enabled_helper, "Toggle this source on or off to control where users can download your app");

    map.set(RStr.AppCategoryForm_title, "Category");
    map.set(RStr.AppCategoryForm_description, "Select the appropriate category and platform to help users discover your application");
    map.set(RStr.AppCategoryForm_type_label, "Type");
    map.set(RStr.AppCategoryForm_type_helper, "Application type (App or Game)");
    map.set(RStr.AppCategoryForm_category_label, "Category");
    map.set(RStr.AppCategoryForm_category_helper, "Application category");
    map.set(RStr.AppCategoryForm_platform_label, "Platform");
    map.set(RStr.AppCategoryForm_platform_helper, "Target platform");

    map.set(RStr.ContractsInfoForm_title, "Contract Addresses");
    map.set(RStr.ContractsInfoForm_description, "General store contract addresses");
    map.set(RStr.ContractsInfoForm_store_contract_label, "Store Contract");
    map.set(RStr.ContractsInfoForm_oracle_contract_label, "Oracle Contract");
    map.set(RStr.ContractsInfoForm_dev_factory_label, "Publisher Factory Contract");

    map.set(RStr.ConfirmBuildForm_title, "Confirm Build");
    map.set(RStr.ConfirmBuildForm_description, "Confirm your application build");
    map.set(RStr.ConfirmBuildForm_file_info, "File Info");
    map.set(RStr.ConfirmBuildForm_version_name, "Version name");
    map.set(RStr.ConfirmBuildForm_version_code, "Version code");
    map.set(RStr.ConfirmBuildForm_protocol, "Protocol");
    map.set(RStr.ConfirmBuildForm_reference_id, "Reference ID");

    map.set(RStr.ConfirmAccountForm_title, "Confirm account");
    map.set(RStr.ConfirmAccountForm_description, "Confirm your account details");
    map.set(RStr.ConfirmAccountForm_developer_name, "Publisher name");
    map.set(RStr.ConfirmAccountForm_app_name, "App package");
    map.set(RStr.ConfirmAccountForm_your_address, "Your address");
    map.set(RStr.ConfirmAccountForm_spProvider_address, "Storage operator");
    map.set(RStr.ConfirmAccountForm_dev_address, "Developer address");
    map.set(RStr.ConfirmAccountForm_storage_balance, "Storage balance");
    map.set(RStr.ConfirmAccountForm_wallet_balance, "Wallet balance");

    map.set(RStr.ConfirmApkForm_title, "Confirm APK");
    map.set(RStr.ConfirmApkForm_description, "Confirm your APK details");
    map.set(RStr.ConfirmApkForm_version_name, "Version name");
    map.set(RStr.ConfirmApkForm_version_code, "Version code");
    map.set(RStr.ConfirmApkForm_file_size, "File size");

    map.set(RStr.BuildInfoForm_title, "Build Information");
    map.set(RStr.BuildInfoForm_description, "Review the build information and current status before proceeding");
    map.set(RStr.BuildInfoForm_status, "Status");

    map.set(RStr.ConfirmDeleteDrawer_storeWarning, "Deleting this version will make your app unavailable in the store.");

    map.set(RStr.ConfirmTopUpForm_title, "Top Up");
    map.set(RStr.ConfirmTopUpForm_description, "Review the amount and confirm your storage account top-up transaction");
    map.set(RStr.ConfirmTopUpForm_storage_account, "Storage account");

    map.set(RStr.FeesForm_description, "Review all transaction costs and fees before confirming your operation");
    map.set(RStr.FeesForm_MainWallet, "Main wallet");
    map.set(RStr.FeesForm_StorageWallet, "Storage wallet");
    map.set(RStr.FeesForm_validatorFee, "Validator fee");
    map.set(RStr.FeesForm_oracleFee, "Oracle fee");
    map.set(RStr.FeesForm_networkFee, "Network fee");
    map.set(RStr.FeesForm_relayFee, "Relay fee");
    map.set(RStr.FeesForm_settlePrepayFee, "Settle & Prepay Fee");
    map.set(RStr.FeesForm_gasFee, "Gas fee");
    map.set(RStr.FeesForm_storagePriceRate, "Monthly payment(storage and traffic) will change from {from} to {to} per week");

    map.set(RStr.TopupForm_description, "Add funds to your account");
    map.set(RStr.TopupForm_balanceTooLow, "Your balance is too low, please top up to continue!");

    map.set(RStr.BalanceInfoForm_title, "Balance Info");
    map.set(RStr.BalanceInfoForm_description, "Monitor your wallet balance, storage quota usage, and manage your account resources");
    map.set(RStr.BalanceInfoForm_fees, "Fees");
    map.set(RStr.BalanceInfoForm_prepaidAmount, "Prepaid amount");
    map.set(RStr.BalanceInfoForm_monthlyAmount, "Monthly amount");
    map.set(RStr.BalanceInfoForm_download, "Traffic");
    map.set(RStr.BalanceInfoForm_trafficAvailable, "Total available");
    map.set(RStr.BalanceInfoForm_per_week, "per week");
    map.set(RStr.BalanceInfoForm_claim, "Claim");
    map.set(RStr.BalanceInfoForm_manage, "Manage");
    map.set(RStr.BalanceInfoForm_data, "Data");
    map.set(RStr.BalanceInfoForm_total, "Total");
    map.set(RStr.BalanceInfoForm_oneTimeFree, "One time free");
    map.set(RStr.BalanceInfoForm_monthlyFree, "Monthly free");
    map.set(RStr.BalanceInfoForm_mainQuote, "Main quote");
    map.set(RStr.BalanceInfoForm_freeQuote, "Free quote");

    map.set(RStr.QuotaManagementForm_title, "Monthly download quota");
    map.set(RStr.QuotaManagementForm_currentQuote, "Current quote");
    map.set(RStr.QuotaManagementForm_selectedQuote, "Selected quote");
    map.set(RStr.QuotaManagementForm_newQuote, "New quote");

    map.set(RStr.StorageAccountInfoForm_title, "Bucket Info");
    map.set(RStr.StorageAccountInfoForm_bucketName, "Bucket name");
    map.set(RStr.StorageAccountInfoForm_paymentAccount, "Payment Account");

    map.set(RStr.StorageProviderInfoForm_title, "Storage Info");
    map.set(RStr.StorageProviderInfoForm_primaryStorageProvider, "Primary storage provider");
    map.set(RStr.StorageProviderInfoForm_freeMonthlyQuota, "Free monthly quota");
    map.set(RStr.StorageProviderInfoForm_freeQuotaOneTime, "Free quota (one-time)");

    map.set(RStr.TopUpManagementForm_title, "Top up");
    map.set(RStr.TopUpManagementForm_balances, "Balances");
    map.set(RStr.TopUpManagementForm_yourWalletBalance, "Your wallet balance");
    map.set(RStr.TopUpManagementForm_storageAccountBalance, "Storage account balance");
    map.set(RStr.TopUpManagementForm_amount, "Amount");
    map.set(RStr.TopUpManagementForm_equivalent, "Equivalent: ");

    map.set(RStr.AppInfoScreen_title, "Dashboard");
    map.set(RStr.AppInfoScreen_description, "Overview of your application's key metrics, status, and performance data");

    map.set(RStr.AppStatusScreen_title, "Application status");
    map.set(RStr.AppStatusScreen_description, "Monitor your application's verification status and build distribution channels to ensure everything is properly configured");
    map.set(RStr.AppStatusScreen_dataVerification_title, "Data verification");
    map.set(RStr.AppStatusScreen_dataVerification_description, "Check if your app ownership has been verified through website validation and certificate signing");
    map.set(RStr.AppStatusScreen_dataVerification_manageButton, "Manage");
    map.set(RStr.AppStatusScreen_buildChannels_title, "Build channels");
    map.set(RStr.AppStatusScreen_buildChannels_description, "View the status of your app releases across different distribution channels (Alpha, Beta, Release)");
    map.set(RStr.AppStatusScreen_buildChannels_manageButton, "Manage");
    map.set(RStr.AppStatusScreen_oracle_pending_title, "Pending");
    map.set(RStr.AppStatusScreen_oracle_notVerified_title, "Not verified");
    map.set(RStr.AppStatusScreen_oracle_verified_title, "Verified");
    map.set(RStr.AppStatusScreen_oracle_verificationInProgress_desc, "Verification in progress");
    map.set(RStr.AppStatusScreen_oracle_success_desc, "Success");
    map.set(RStr.AppStatusScreen_oracle_contentFormat_title, "Assetlink Format");
    map.set(RStr.AppStatusScreen_oracle_contentFormat_desc, "Invalid assetlinks.json");
    map.set(RStr.AppStatusScreen_oracle_noFingerprint_title, "No Fingerprint");
    map.set(RStr.AppStatusScreen_oracle_noFingerprint_desc, "Fingerprint mismatch");
    map.set(RStr.AppStatusScreen_oracle_noPackage_title, "No Package");
    map.set(RStr.AppStatusScreen_oracle_noPackage_desc, "Package not found");
    map.set(RStr.AppStatusScreen_oracle_unavailable_desc, "Website unreachable");
    map.set(RStr.AppStatusScreen_oracle_websiteFormat_title, "Website Format");
    map.set(RStr.AppStatusScreen_oracle_websiteFormat_desc, "Invalid website format");
    map.set(RStr.AppStatusScreen_oracle_exceedRpcAttempts_title, "Exceed Rpc Attempts");
    map.set(RStr.AppStatusScreen_oracle_urlFormatError_title, "Url Format Error");
    map.set(RStr.AppStatusScreen_oracle_contentReadingError_title, "Content Reading");
    map.set(RStr.AppStatusScreen_oracle_unreachableLink_title, "Unreachable Link");
    map.set(RStr.AppStatusScreen_oracle_exceedRpcAttempts_desc, "RPC attempts exceeded");
    map.set(RStr.AppStatusScreen_oracle_urlFormatError_desc, "URL format error");
    map.set(RStr.AppStatusScreen_oracle_contentReadingError_desc, "Failed to read assetlinks");
    map.set(RStr.AppStatusScreen_oracleType_ownership, "Ownership");
    map.set(RStr.AppStatusScreen_oracleType_ownershipReview, "Ownership Review");
    map.set(RStr.AppStatusScreen_build_verified, "Verified");
    map.set(RStr.AppStatusScreen_build_error, "Error");
    map.set(RStr.AppStatusScreen_build_unknown, "Unknown");
    map.set(RStr.AppStatusScreen_build_availableInStore, "Available in Store");
    map.set(RStr.AppStatusScreen_build_invalidApkFormat, "Invalid APK format");
    map.set(RStr.AppStatusScreen_build_invalidSignBlock, "Invalid sign block");
    map.set(RStr.AppStatusScreen_build_zip64Unsupported, "Zip64 unsupported");
    map.set(RStr.AppStatusScreen_build_tooManySigners, "Too many signers");
    map.set(RStr.AppStatusScreen_build_noSignersFound, "No signers found");
    map.set(RStr.AppStatusScreen_build_noDigestFound, "No digest found");
    map.set(RStr.AppStatusScreen_build_unknownSignAlgo, "Unknown sign algo");
    map.set(RStr.AppStatusScreen_build_badEncryptionData, "Bad encryption data");
    map.set(RStr.AppStatusScreen_build_signaturesNotFound, "Signatures not found");
    map.set(RStr.AppStatusScreen_build_invalidSignature, "Invalid signature");
    map.set(RStr.AppStatusScreen_build_algoMismatch, "Algo mismatch");
    map.set(RStr.AppStatusScreen_build_prevDigestMismatch, "Prev digest mismatch");
    map.set(RStr.AppStatusScreen_build_noCertsFound, "No certs found");
    map.set(RStr.AppStatusScreen_build_keyCertMismatch, "Key/cert mismatch");
    map.set(RStr.AppStatusScreen_build_noDigestCheck, "No digest check");
    map.set(RStr.AppStatusScreen_build_digestMismatch, "Digest mismatch");
    map.set(RStr.AppStatusScreen_build_tooManyChunks, "Too many chunks");
    map.set(RStr.AppStatusScreen_build_digestAlgoMissing, "Digest algo missing");
    map.set(RStr.AppStatusScreen_build_unknownStatus, "Unknown status");

    map.set(RStr.AppBuildsScreen_title, "Builds overview");
    map.set(RStr.AppBuildsScreen_description, "View and manage all versions of your application builds, including their validation status and distribution");
    map.set(RStr.AppBuildsScreen_versionNumber, "Version number");
    map.set(RStr.AppBuildsScreen_versionCode, "Version code");
    map.set(RStr.AppBuildsScreen_status, "Status");
    map.set(RStr.AppBuildsScreen_size, "Size");
    map.set(RStr.AppBuildsScreen_objectId, "Reference ID");
    map.set(RStr.AppBuildsScreen_list_title, "Active builds");
    map.set(RStr.AppBuildsScreen_list_description, "All uploaded builds with their current verification status and availability");
    map.set(RStr.AppBuildsScreen_status_production, "Production");
    map.set(RStr.AppBuildsScreen_status_unverified, "Unverified");
    map.set(RStr.AppBuildsScreen_status_verified, "Verified");
    map.set(RStr.AppBuildsScreen_error_title, "Publisher account doesn't exist!");
    map.set(RStr.AppBuildsScreen_error_description, "Unable to load your builds at this time. This might be due to network issues or your publisher account needs to be set up.");
    map.set(RStr.AppBuildsScreen_error_action, "Retry");

    map.set(RStr.AppsEditDistributionScreen_title, "Manage distribution");
    map.set(RStr.AppsEditDistributionScreen_description, "Configure custom distribution sources and manage where users can download your application");
    map.set(RStr.AppsEditDistributionScreen_error_action, "Retry");
    map.set(RStr.AppsEditDistributionScreen_error_calculateFees, "Can't calculate fees, please try again.");
    map.set(RStr.AppsEditDistributionScreen_error_noSources, "You can't enable custom distribution without any sources!");
    map.set(RStr.AppsEditDistributionScreen_error_invalidUrl, "Invalid URL in source #{index}, please try again");
    map.set(RStr.AppsEditDistributionScreen_error_updateFailed, "Can't update app distribution, please try again");
    map.set(RStr.AppsEditDistributionScreen_button_back, "Back");
    map.set(RStr.AppsEditDistributionScreen_button_continue, "Continue");
    map.set(RStr.AppsEditDistributionScreen_button_save, "Save");
    map.set(RStr.AppsEditDistributionScreen_summary_title, "Summary");
    map.set(RStr.AppsEditDistributionScreen_summary_description, "Please check information before proceed!");

    map.set(RStr.AppsEditGeneralInfoScreen_title, "Edit application data");
    map.set(RStr.AppsEditGeneralInfoScreen_description, "Update your application's name, description, and other basic information");
    map.set(RStr.AppsEditGeneralInfoScreen_summary_title, "Summary");
    map.set(RStr.AppsEditGeneralInfoScreen_summary_description, "Please check information before proceed!");
    map.set(RStr.AppsEditGeneralInfoScreen_summary_generalInfo, "General info");
    map.set(RStr.AppsEditGeneralInfoScreen_summary_package, "Package");
    map.set(RStr.AppsEditGeneralInfoScreen_summary_name, "Name");
    map.set(RStr.AppsEditGeneralInfoScreen_error_action, "Retry");
    map.set(RStr.AppsEditGeneralInfoScreen_error_calculateFees, "Can't calculate fees, please try again.");
    map.set(RStr.AppsEditGeneralInfoScreen_error_updateFailed, "Can't update app general info, please try again");
    map.set(RStr.AppsEditGeneralInfoScreen_button_back, "Back");
    map.set(RStr.AppsEditGeneralInfoScreen_button_continue, "Continue");
    map.set(RStr.AppsEditGeneralInfoScreen_button_save, "Save");

    map.set(RStr.AppOwnerVerificationScreen_title, "Manage ownership");
    map.set(RStr.AppOwnerVerificationScreen_description, "Verify your application ownership through website validation and certificate signing to enable distribution");
    map.set(RStr.AppOwnerVerificationScreen_summary_title, "Summary");
    map.set(RStr.AppOwnerVerificationScreen_summary_description, "Please check information before proceed!");
    map.set(RStr.AppOwnerVerificationScreen_summary_ownershipInfo, "Ownership info");
    map.set(RStr.AppOwnerVerificationScreen_summary_website, "Website");
    map.set(RStr.AppOwnerVerificationScreen_summary_currentVersion, "Current version");
    map.set(RStr.AppOwnerVerificationScreen_summary_lastVerifiedVersion, "Last verified version");
    map.set(RStr.AppOwnerVerificationScreen_summary_status, "Status");
    map.set(RStr.AppOwnerVerificationScreen_summary_execution, "Execution");
    map.set(RStr.AppOwnerVerificationScreen_summary_action, "Action");
    map.set(RStr.AppOwnerVerificationScreen_error_action, "Retry");
    map.set(RStr.AppOwnerVerificationScreen_error_calculateFees, "Can't calculate fees, please try again.");
    map.set(RStr.AppOwnerVerificationScreen_error_invalidWebsite, "Invalid website format!");
    map.set(RStr.AppOwnerVerificationScreen_error_invalidCertificateHash, "Certificate hash #{index} is not valid!");
    map.set(RStr.AppOwnerVerificationScreen_error_invalidCertificateProof, "Certificate proof #{index} is not valid!");
    map.set(RStr.AppOwnerVerificationScreen_button_saveChanges, "Save changes");
    map.set(RStr.AppOwnerVerificationScreen_button_verifyOwnership, "Verify ownership");
    map.set(RStr.AppOwnerVerificationScreen_button_saveAndVerify, "Save and Verify");
    map.set(RStr.AppOwnerVerificationScreen_button_back, "Back");
    map.set(RStr.AppOwnerVerificationScreen_button_save, "Save");
    map.set(RStr.AppOwnerVerificationScreen_button_verify, "Verify");
    map.set(RStr.AppOwnerVerificationScreen_warning_pending, "To verify ownership, wait until the previous verification finishes");

    map.set(RStr.AppScreen_title, "Application");
    map.set(RStr.AppScreen_description, "Manage your application");
    map.set(RStr.AppScreen_error_title, "Publisher account does not exist");
    map.set(RStr.AppScreen_error_description, "We couldn't find your publisher account. Please make sure you have created one.");
    map.set(RStr.AppScreen_error_action, "Go back");
    map.set(RStr.AppScreen_drawer_dashboard, "Dashboard");
    map.set(RStr.AppScreen_drawer_status, "Status");
    map.set(RStr.AppScreen_drawer_builds, "Builds");
    map.set(RStr.AppScreen_drawer_plugins, "Plugins");
    map.set(RStr.AppScreen_toolbar_newRelease, "New release");
    map.set(RStr.AppScreen_drawer_allApplications, "All applications");

    map.set(RStr.DevScreen_createApp_title, "Create app");
    map.set(RStr.DevScreen_drawer_account, "Account");
    map.set(RStr.DevScreen_drawer_apps, "Assets");
    map.set(RStr.DevScreen_drawer_allDevelopers, "All publishers");

    map.set(RStr.DevAccountScreen_title, "Publisher Account");
    map.set(RStr.DevAccountScreen_description, "View your publisher profile, storage account details, and manage your account resources and quotas");
    map.set(RStr.DevAccountScreen_accountInfo_title, "Account Info");
    map.set(RStr.DevAccountScreen_accountInfo_description, "General information about your publisher account");
    map.set(RStr.DevAccountScreen_accountInfo_name_label, "Name");
    map.set(RStr.DevAccountScreen_accountInfo_name_helper, "Your publisher account name will be used as a unique identifier across the platform");
    map.set(RStr.DevAccountScreen_accountInfo_address_label, "Address");
    map.set(RStr.DevAccountScreen_accountInfo_address_helper, "Your blockchain wallet address associated with this publisher account");
    map.set(RStr.DevAccountScreen_storageAccount_title, "Storage account");
    map.set(RStr.DevAccountScreen_greenfieldRates_title, "Greenfield rates");
    map.set(RStr.DevAccountScreen_greenfieldRates_storageRate, "Storage Rate (Gb/month)");
    map.set(RStr.DevAccountScreen_greenfieldRates_downloadRate, "Download Rate (Gb/month)");

    map.set(RStr.DevAppsListScreen_title, "Assets");
    map.set(RStr.DevAppsListScreen_description, "Choose application to manage or create new");
    map.set(RStr.DevAppsListScreen_applications_title, "Applications");
    map.set(RStr.DevAppsListScreen_applications_description, "Here some information about"); // TODO
    map.set(RStr.DevAppsListScreen_columns_name, "Name");
    map.set(RStr.DevAppsListScreen_columns_package, "Package");
    map.set(RStr.DevAppsListScreen_columns_address, "Address");
    map.set(RStr.DevAppsListScreen_error_title, "Publisher account doesn't exist!");
    map.set(RStr.DevAppsListScreen_error_description, "Unable to load your applications. Please check your publisher account status and try again.");
    map.set(RStr.DevAppsListScreen_error_action, "Retry");

    map.set(RStr.OracleVerificationNotification_title, "Ownership information verification required");
    map.set(RStr.OracleVerificationNotification_description, "We've detected changes in your app's ownership information. Please verify these changes to ensure your app listing remains compliant.");
    map.set(RStr.OracleVerificationNotification_verify, "Verify");
    map.set(RStr.OracleVerificationNotification_learnMore, "Learn more");

    map.set(RStr.CreateAppScreen_title, "App creation");
    map.set(RStr.CreateAppScreen_description, "Set up a new application with basic information, ownership verification, and distribution settings");
    map.set(RStr.CreateAppScreen_steps_general, "General");
    map.set(RStr.CreateAppScreen_steps_ownership, "Ownership");
    map.set(RStr.CreateAppScreen_steps_distribution, "Distribution");
    map.set(RStr.CreateAppScreen_steps_summary, "Summary");
    map.set(RStr.CreateAppScreen_summary_title, "Summary");
    map.set(RStr.CreateAppScreen_summary_description, "Please check information before proceed!");
    map.set(RStr.CreateAppScreen_summary_generalInfo, "General info");
    map.set(RStr.CreateAppScreen_summary_package, "Package");
    map.set(RStr.CreateAppScreen_summary_name, "Name");
    map.set(RStr.CreateAppScreen_summary_appAddress, "App address");
    map.set(RStr.CreateAppScreen_summary_ownershipInfo, "Ownership info");
    map.set(RStr.CreateAppScreen_summary_website, "Website");
    map.set(RStr.CreateAppScreen_summary_certificates, "Certificates");
    map.set(RStr.CreateAppScreen_error_reload, "Please reload the page and try again.");
    map.set(RStr.CreateAppScreen_error_calculateAddress, "Can't calculate future app address!");
    map.set(RStr.CreateAppScreen_error_estimateFee, "Can't estimate fee!");
    map.set(RStr.CreateAppScreen_button_back, "Back");
    map.set(RStr.CreateAppScreen_button_skip, "Skip");
    map.set(RStr.CreateAppScreen_button_next, "Next");
    map.set(RStr.CreateAppScreen_button_create, "Create application");
    map.set(RStr.CreateAppScreen_unknown, "Unknown");
    map.set(RStr.CreateAppScreen_unspecified, "Unspecified");
    map.set(RStr.CreateAppScreen_error_certificateHash, "Certificate hash #{index} is not valid!");
    map.set(RStr.CreateAppScreen_error_certificateProof, "Certificate proof #{index} is not valid!");
    map.set(RStr.CreateAppScreen_error_validationFailed, "General info validation failed");

    map.set(RStr.IntroCreateDevScreen_title, "Create Developer");
    map.set(RStr.IntroCreateDevScreen_description, "Set up your Publisher account with storage provider configuration to start publishing applications");
    map.set(RStr.IntroCreateDevScreen_drawer_allDevelopers, "All publishers");
    map.set(RStr.IntroCreateDevScreen_developerInfo_title, "Publisher info");
    map.set(RStr.IntroCreateDevScreen_developerInfo_description, "Choose which file wont to release");
    map.set(RStr.IntroCreateDevScreen_name_label, "Name");
    map.set(RStr.IntroCreateDevScreen_name_helper, "This is account identifier, you won't be able to change it later!");
    map.set(RStr.IntroCreateDevScreen_name_error_required, "Bucket Name is required");
    map.set(RStr.IntroCreateDevScreen_name_error_length, "Must be between 5 to 50 characters long.");
    map.set(RStr.IntroCreateDevScreen_name_error_symbols, "Consist only of lowercase letters, numbers, and hyphens (-).");
    map.set(RStr.IntroCreateDevScreen_name_error_beginEnd, "Begin and end with a letter or number.");
    map.set(RStr.IntroCreateDevScreen_name_error_taken, "This name is already taken, try another one.");
    map.set(RStr.IntroCreateDevScreen_primaryStorage_title, "Primary Storage");
    map.set(RStr.IntroCreateDevScreen_primaryStorage_description, "Choose storage to keep file for validations");
    map.set(RStr.IntroCreateDevScreen_reviewSummary_title, "Review summary");
    map.set(RStr.IntroCreateDevScreen_button_check, "Check");
    map.set(RStr.IntroCreateDevScreen_button_create, "Create publisher");
    map.set(RStr.IntroCreateDevScreen_error_default, "Something went wrong. Please try again.");
    map.set(RStr.IntroCreateDevScreen_error_nameInvalid, "Error! Publisher name is not valid!");
    map.set(RStr.IntroCreateDevScreen_error_creation, "Error during dev creation!");
    map.set(RStr.IntroCreateDevScreen_error_created, "Publisher is created!");
    map.set(RStr.IntroCreateDevScreen_error_refresh, "Error! Refresh page and retry one more time!");
    map.set(RStr.IntroCreateDevScreen_greenfield_description, "Decentralized storage solution powered by BNB Chain for secure and reliable app distribution");

    map.set(RStr.IntroDevsScreen_description, "Select publisher account");
    map.set(RStr.IntroDevsScreen_selectAccount, "Select publisher account");
    map.set(RStr.IntroDevsScreen_selectAccountDescription, "You can choose existing or create new");
    map.set(RStr.IntroDevsScreen_button_connectWallet, "Connect Wallet");
    map.set(RStr.IntroDevsScreen_noAccounts, "Publisher accounts not found");
    map.set(RStr.IntroDevsScreen_createNew, "Create new account");

    map.set(RStr.FileSelectorDrawer_title, "Select build");
    map.set(RStr.FileSelectorDrawer_buildList_loading, "Loading builds...");
    map.set(RStr.FileSelectorDrawer_buildList_version, "{type} v{name}");

    map.set(RStr.FileUploaderDrawer_title, "Upload new file");
    map.set(RStr.FileUploaderDrawer_button_close, "Close");
    map.set(RStr.FileUploaderDrawer_button_upload, "Upload");
    map.set(RStr.FileUploaderDrawer_uploading, "Uploading...");
    map.set(RStr.FileUploaderDrawer_dropZone_accept, "Drop your APK or AAB file here, or click to browse");
    map.set(RStr.FileUploaderDrawer_error_default, "Something went wrong. Please try again.");

    map.set(RStr.LogoUploaderDrawer_title, "Upload app logo");
    map.set(RStr.LogoUploaderDrawer_button_close, "Close");
    map.set(RStr.LogoUploaderDrawer_button_upload, "Upload Logo");

    map.set(RStr.CreateReleaseScreen_title, "Publishing");
    map.set(RStr.CreateReleaseScreen_description, "Select a build file, choose distribution channels, and publish your application to users");
    map.set(RStr.CreateReleaseScreen_steps_info, "Info");
    map.set(RStr.CreateReleaseScreen_steps_summary, "Summary");
    map.set(RStr.CreateReleaseScreen_selectFile_title, "Select file");
    map.set(RStr.CreateReleaseScreen_selectFile_description, "Choose which file wont to release");
    map.set(RStr.CreateReleaseScreen_selectFile_button_change, "Change file");
    map.set(RStr.CreateReleaseScreen_error_default, "Something went wrong. Please try again.");
    map.set(RStr.CreateReleaseScreen_error_validationFailed, "Validation failed. Please check your input.");
    map.set(RStr.CreateReleaseScreen_error_releaseFailed, "Failed to release the app. Please try again.");
    map.set(RStr.CreateReleaseScreen_error_releaseSuccess, "App released successfully!");
    map.set(RStr.CreateReleaseScreen_button_back, "Back");
    map.set(RStr.CreateReleaseScreen_button_next, "Next");
    map.set(RStr.CreateReleaseScreen_button_publish, "Publish");
    map.set(RStr.CreateReleaseScreen_button_publishAnyway, "Publish Anyway");
    map.set(RStr.CreateReleaseScreen_error_selectBuild, "Please select a build first");
    map.set(RStr.CreateReleaseScreen_error_selectTrackOrValidation, "Please select a track or enable validation");
    map.set(RStr.CreateReleaseScreen_summary_title, "Summary");
    map.set(RStr.CreateReleaseScreen_summary_description, "Review all information before proceeding with the release");
    map.set(RStr.CreateReleaseScreen_quota_warning, "High probability it's not enough storage quota to validate this build.");
    map.set(RStr.CreateReleaseScreen_storage_warning, "Insufficient storage balance to complete this operation.");
    map.set(RStr.CreateReleaseScreen_wallet_warning, "Insufficient wallet balance to cover transaction spending.");
    map.set(RStr.CreateReleaseScreen_quota_increaseQuote, "Increase quote");
    map.set(RStr.CreateReleaseScreen_minRequired, "Min required:");
    map.set(RStr.CreateReleaseScreen_selectFile_changeFile, "Change file");
    map.set(RStr.CreateReleaseScreen_selectFile_uploadTitle, "Upload new file");
    map.set(RStr.CreateReleaseScreen_selectFile_uploadDescription, "Upload a new app file from your device");
    map.set(RStr.CreateReleaseScreen_selectFile_selectTitle, "Choose from storage");
    map.set(RStr.CreateReleaseScreen_selectFile_selectDescription, "Select an existing file from your library");
    map.set(RStr.CreateReleaseScreen_selectTrack_title, "Select track");
    map.set(RStr.CreateReleaseScreen_selectTrack_description, "Choose which track to release your build to");
    map.set(RStr.CreateReleaseScreen_validation_title, "Validation");
    map.set(RStr.CreateReleaseScreen_validation_description, "Without validation users will only be able to find your application by address");
    map.set(RStr.CreateReleaseScreen_skip_description, "Do not add build to any track");
    map.set(RStr.CreateReleaseScreen_validate_description, "Everyone will be able to download this build");
    map.set(RStr.CreateReleaseScreen_track_none_description, "Do not add build to any track");
    map.set(RStr.CreateReleaseScreen_track_release_description, "Everyone will be able to download this build");
    map.set(RStr.CreateReleaseScreen_track_beta_description, "Everyone who wants to get access to early builds");
    map.set(RStr.CreateReleaseScreen_track_alpha_description, "Only internal testers can download this build");

    map.set(RStr.TasksDrawerDialog_title, "Tasks history");
    map.set(RStr.TasksDrawerDialog_status_pending, "Pending");
    map.set(RStr.TasksDrawerDialog_status_uploading, "Uploading");
    map.set(RStr.TasksDrawerDialog_status_completed, "Completed");

    map.set(RStr.DevManageDrawerDialog_title, "Manage storage account");

    map.set(RStr.ConfirmDeleteDrawerDialog_title, "Delete Build");
    map.set(RStr.ConfirmDeleteDrawerDialog_button_delete, "Delete Build");

    map.set(RStr.ApkValidator_error_fileType, "File must be an APK or AAB file");
    map.set(RStr.ApkValidator_error_invalidFormat, "Invalid APK file format");
    map.set(RStr.ApkValidator_dropZone_title, "Drag and drop your file here");
    map.set(RStr.ApkValidator_dropZone_subtitle, "Supports APK or AAB files");

    map.set(RStr.PngLogoValidator_error_fileType, "Logo must be a PNG file");
    map.set(RStr.PngLogoValidator_error_fileSize, "Logo file size must be under 1MB");
    map.set(RStr.PngLogoValidator_error_dimensions, "Logo must be exactly 512x512 pixels. Current size: {width}x{height}");
    map.set(RStr.PngLogoValidator_error_invalidImage, "Invalid or corrupted image file");
    map.set(RStr.PngLogoValidator_dropZone_title, "Drag and drop your logo here");
    map.set(RStr.PngLogoValidator_dropZone_subtitle, "512x512 PNG with transparency, max 1MB");

    return map;
}
