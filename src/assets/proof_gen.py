#!/usr/bin/env python3
# -*- coding: utf-8 -*-

import argparse
import subprocess
import sys
import os
import tempfile
import base64 # Still imported but urlsafe_b64encode won't be used for proof
import re
import getpass

# --- Global Debug Setting ---
DEBUG_MODE = False

# --- Utilities ---

def debug_print(*args, **kwargs):
    if DEBUG_MODE:
        print("DEBUG:", *args, file=sys.stderr, **kwargs)

def error_print(*args, **kwargs):
    print("Error:", *args, file=sys.stderr, **kwargs)

def run_command(command, input_data=None, capture_output=True, check=True, shell=False, env=None, working_dir=None, is_binary_output=False):
    try:
        command_str = [str(item) for item in command]
        # In debug mode, we print the command but censor passwords for security
        if DEBUG_MODE:
            debug_print(f"Executing: {' '.join(command_str)}")
        else:
            censored_command_str = []
            censor_next = False
            for item in command_str:
                if censor_next:
                    censored_command_str.append("CENSORED")
                    censor_next = False
                else:
                    censored_command_str.append(item)
                if item in ['-storepass', '-srcstorepass', '-srckeypass', '-deststorepass', '-passin']:
                    censor_next = True
            debug_print(f"Executing: {' '.join(censored_command_str)}")

        text_mode = not is_binary_output
        encoding = 'utf-8' if text_mode else None
        errors_policy = 'surrogateescape' if text_mode else None

        process = subprocess.run(
            command_str,
            input=input_data,
            capture_output=capture_output,
            check=check,
            shell=shell,
            env=env,
            cwd=working_dir,
            text=text_mode,
            encoding=encoding,
            errors=errors_policy
        )
        return process

    except FileNotFoundError:
        error_print(f"Command not found: '{command_str[0]}'. Make sure it's installed and in PATH.")
        return None
    except subprocess.CalledProcessError as e:
        error_print(f"Command execution failed: {' '.join(command_str)}")
        error_print(f"Return code: {e.returncode}")

        def _decode_if_bytes(data, encoding_val, errors_val):
            if isinstance(data, bytes):
                return data.decode(encoding_val or 'utf-8', errors=errors_val or 'replace')
            return data

        decode_encoding = encoding
        errors_decode_policy = errors_policy

        if e.stdout:
            stdout_str = _decode_if_bytes(e.stdout, decode_encoding, errors_decode_policy)
            error_print(f"stdout:\n{stdout_str}")
        if e.stderr:
            stderr_str = _decode_if_bytes(e.stderr, decode_encoding, errors_decode_policy)
            error_print(f"stderr:\n{stderr_str}")
        return None
    except Exception as e:
        error_print(f"Unexpected error running command: {e}")
        return None

def check_tool_availability(tool_name, check_args):
    debug_print(f"Checking availability of '{tool_name}'...")
    process = run_command([tool_name] + check_args, capture_output=True, check=False)
    if process is None or process.returncode != 0:
        error_print(f"Utility '{tool_name}' not found or not working correctly.")
        error_print(f"Please ensure it is installed and its directory is in the system's PATH environment variable.")
        return False
    debug_print(f"'{tool_name}' found.")
    return True

# --- Core Logic ---

def calculate_sha256_fingerprint_with_keytool(jks_path, jks_pass, alias):
    debug_print(f"\n--- Calculating SHA256 fingerprint for alias '{alias}' using keytool -list -v ---")
    keytool_command_list = [
        'keytool', '-list', '-v',
        '-keystore', jks_path,
        '-storepass', jks_pass,
        '-alias', alias
    ]

    process_list = run_command(keytool_command_list, capture_output=True, is_binary_output=False)
    if not process_list or not hasattr(process_list, 'stdout') or process_list.stdout is None:
        error_print(f"keytool -list -v command failed or produced no stdout for alias '{alias}'.")
        if process_list and hasattr(process_list, 'stderr') and process_list.stderr:
            error_print(f"keytool stderr:\n{process_list.stderr}")
        return None

    output_text = process_list.stdout
    debug_print(f"keytool -list -v output for alias '{alias}' (first 1000 chars):\n{output_text[:1000]}...")

    match = re.search(r"SHA256:\s*(([0-9A-F]{2}:){31}[0-9A-F]{2})", output_text, re.IGNORECASE)
    if match:
        sha_finger = match.group(1).strip().upper()
        debug_print(f"Calculated SHA256 fingerprint (from keytool -list): {sha_finger}")
        return sha_finger
    else:
        error_print(f"Could not find a valid SHA256 fingerprint in keytool -list -v output for alias '{alias}'.")
        error_print("Searched for pattern 'SHA256: XX:XX:...:XX' (32 hex pairs with colons).")
        if DEBUG_MODE:
            error_print(f"Full keytool output was:\n{output_text}")
        return None

def sign_with_external_tools(jks_path, jks_pass, alias, alias_pass, app_hex):
    """
    Calculates cert fingerprint, signs data, and returns (fingerprint, proof_hex) or None.
    """
    if not os.path.exists(jks_path):
        error_print(f"JKS file not found at path '{jks_path}'")
        return None

    # --- Calculate SHA256 Fingerprint of the certificate ---
    calculated_sha_finger = calculate_sha256_fingerprint_with_keytool(jks_path, jks_pass, alias)
    if not calculated_sha_finger:
        return None # Error already printed

    data_to_sign_str = f"{app_hex}::{calculated_sha_finger}"
    data_to_sign_bytes = data_to_sign_str.encode('utf-8')
    debug_print(f"\nData to sign (with calculated fingerprint): '{data_to_sign_str}'")

    pkcs12_file_path = None
    pem_file_path = None

    try:
        debug_print(f"Generating temporary file paths in current directory ('.')...")
        try:
            fd, pkcs12_temp_path = tempfile.mkstemp(suffix=".p12", prefix="temp_pkcs12_", dir='.')
            os.close(fd)
            os.remove(pkcs12_temp_path)
            pkcs12_file_path = os.path.abspath(pkcs12_temp_path)

            with tempfile.NamedTemporaryFile(delete=False, suffix=".pem", prefix="temp_privkey_", dir='.') as temp_pem:
                pem_file_path = os.path.abspath(temp_pem.name)
        except Exception as e_temp:
            error_print(f"Failed during temporary file path generation: {e_temp}")
            if pkcs12_file_path and os.path.exists(pkcs12_file_path): os.remove(pkcs12_file_path)
            if pem_file_path and os.path.exists(pem_file_path): os.remove(pem_file_path)
            return None
        debug_print(f"Temporary file paths:\n  PKCS12: {pkcs12_file_path}\n  PEM Key: {pem_file_path}")

        # --- Step 1: Convert JKS -> PKCS12 ---
        pkcs12_pass = jks_pass
        debug_print(f"\n--- Step 1: Converting JKS (alias: '{alias}') to PKCS12 using keytool ---")
        keytool_command_export = [
            'keytool', '-importkeystore',
            '-srckeystore', jks_path,
            '-srcstorepass', jks_pass,
            '-srcalias', alias,
            '-srckeypass', alias_pass,
            '-destkeystore', pkcs12_file_path,
            '-deststoretype', 'PKCS12',
            '-deststorepass', pkcs12_pass,
        ]
        process_export = run_command(keytool_command_export)
        if not process_export:
            debug_print("keytool command failed during PKCS12 export.")
            return None
        if not os.path.exists(pkcs12_file_path) or os.path.getsize(pkcs12_file_path) == 0:
            error_print(f"keytool command seemingly succeeded but PKCS12 file '{pkcs12_file_path}' is missing or empty!")
            return None
        debug_print("--- Conversion to PKCS12 completed successfully ---")

        # --- Step 2: Extract PEM private key from PKCS12 ---
        debug_print(f"\n--- Step 2: Extracting private key from PKCS12 ('{os.path.basename(pkcs12_file_path)}') to PEM using openssl ---")
        openssl_command_extract = [
            'openssl', 'pkcs12',
            '-in', pkcs12_file_path,
            '-passin', f'pass:{pkcs12_pass}',
            '-nodes',
            '-nocerts',
            '-out', pem_file_path
        ]
        process_extract = run_command(openssl_command_extract)
        if not process_extract:
            debug_print("openssl command failed during PEM extraction.")
            return None
        if not os.path.exists(pem_file_path) or os.path.getsize(pem_file_path) == 0:
            error_print(f"openssl command seemingly succeeded but PEM file '{pem_file_path}' is missing or empty.")
            return None
        debug_print("--- PEM key extraction completed successfully ---")

        # --- Step 3: Sign the data ---
        debug_print(f"\n--- Step 3: Signing data using openssl dgst -sha256 ---")
        openssl_command_sign = [
            'openssl', 'dgst', '-sha256',
            '-sign', pem_file_path,
        ]
        process_sign = run_command(openssl_command_sign, input_data=data_to_sign_bytes, is_binary_output=True)
        if not process_sign:
            debug_print("openssl command failed during signing.")
            return None
        signature_bytes = process_sign.stdout
        if not signature_bytes:
            error_print("openssl dgst command finished but returned no signature (empty stdout).")
            return None
        debug_print("--- Data signing completed successfully ---")

        # --- Step 4: Convert binary signature to HEX ---
        signature_hex_string = signature_bytes.hex()
        debug_print(f"Raw signature bytes length: {len(signature_bytes)}")
        debug_print(f"Signature (HEX string): {signature_hex_string}")

        return calculated_sha_finger, signature_hex_string # Return fingerprint and HEX proof

    finally:
        debug_print("\n--- Cleaning up temporary files ---")
        files_to_remove = [pkcs12_file_path, pem_file_path]
        for f_path in files_to_remove:
            if f_path and os.path.exists(f_path):
                abs_f_path = os.path.abspath(f_path)
                try:
                    os.remove(f_path)
                    debug_print(f"Removed: {abs_f_path}")
                except OSError as e:
                    print(f"Warning: Failed to remove temporary file {abs_f_path}: {e}", file=sys.stderr)

# --- Entry Point ---

def main():
    global DEBUG_MODE

    parser = argparse.ArgumentParser(
        description="Calculates the SHA-256 certificate fingerprint and signs '${app}:${calculated-sha-fingerprint}' "
                    "using a key from a JKS file. Outputs the HEX signature (proof) and the fingerprint. "
                    "Passwords are read securely from standard input to avoid shell history.",
        epilog="Workflow: JKS -(keytool for fingerprint)-> SHA256_Fingerprint\n"
               "          JKS -(keytool)-> PKCS12 -(openssl)-> PEM_PrivateKey -(openssl dgst)-> Signature (HEX).\n"
               "REQUIREMENTS: 'keytool' (from Java) and 'openssl' installed and in PATH.\n"
    )
    parser.add_argument('--debug', action='store_true', help="Enable verbose debug output to stderr.")
    parser.add_argument('-jks-path', required=True, help="Path to the JKS file.")
    parser.add_argument('-alias', required=True, help="Alias (name) of the key entry in JKS.")

    def validate_app_hex(value):
        if not isinstance(value, str) or not value.startswith('0x') or len(value) != 42:
            raise argparse.ArgumentTypeError("Argument -address must be a string in the format 0xHHHH... (42 chars total, '0x' + 20 hex bytes).")
        try:
            bytes.fromhex(value[2:])
        except ValueError:
            raise argparse.ArgumentTypeError("Argument -address must contain valid HEX characters after '0x'.")
        return value

    parser.add_argument('-address', required=True, type=validate_app_hex,
                        help="Application identifier (e.g., 0x followed by 40 hex characters).")

    args = parser.parse_args()

    DEBUG_MODE = args.debug
    if DEBUG_MODE:
        debug_print("--- Debug mode enabled ---")

    try:
        jks_pass = getpass.getpass("Enter JKS keystore password: ")
        if not jks_pass:
            error_print("JKS keystore password cannot be empty.")
            sys.exit(1)

        alias_pass = getpass.getpass(f"Enter private key password for alias '{args.alias}': ")
        if not alias_pass:
            error_print("Alias password cannot be empty.")
            sys.exit(1)

    except (EOFError, KeyboardInterrupt):
        print("\nPassword entry cancelled.", file=sys.stderr)
        sys.exit(1)


    debug_print("--- Checking for required tools ---")
    if not check_tool_availability('keytool', ['-help']):
        sys.exit(1)
    if not check_tool_availability('openssl', ['version']):
        sys.exit(1)
    debug_print("--- Required tools found ---")

    result_tuple = sign_with_external_tools(
        args.jks_path,
        jks_pass,
        args.alias,
        alias_pass,
        args.address
    )

    if result_tuple:
        calculated_fingerprint, proof_hex = result_tuple
        # Output Proof first, then Fingerprint as requested
        print(f"\nFingerprint (SHA-256):")
        print(calculated_fingerprint)
        print(f"\nProof (HEX):") # Updated label
        print(f"0x{proof_hex}")
        sys.exit(0)
    else:
        print("\nFailed to generate proof and/or fingerprint.", file=sys.stderr)
        sys.exit(1)

if __name__ == "__main__":
    main()