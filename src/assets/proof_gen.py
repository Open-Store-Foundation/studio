#!/usr/bin/env python3
# -*- coding: utf-8 -*-

import argparse
import subprocess
import sys
import os
import tempfile
import re
import getpass

DEBUG_MODE = False

def debug_print(*args, **kwargs):
    if DEBUG_MODE:
        print("DEBUG:", *args, file=sys.stderr, **kwargs)

def error_print(*args, **kwargs):
    print("Error:", *args, file=sys.stderr, **kwargs)

def run_command(command, input_data=None, capture_output=True, check=True, shell=False, env=None, working_dir=None, is_binary_output=False):
    try:
        command_str = [str(item) for item in command]
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

def export_certificate_der_hex(jks_path, jks_pass, alias):
    der_file_path = None
    try:
        fd, der_temp_path = tempfile.mkstemp(suffix=".cer", prefix="temp_cert_der_", dir='.')
        os.close(fd)
        os.remove(der_temp_path)
        der_file_path = os.path.abspath(der_temp_path)

        keytool_export_cmd = [
            'keytool', '-exportcert',
            '-keystore', jks_path,
            '-storepass', jks_pass,
            '-alias', alias,
            '-file', der_file_path
        ]
        process_export = run_command(keytool_export_cmd)
        if not process_export:
            return None
        if not os.path.exists(der_file_path) or os.path.getsize(der_file_path) == 0:
            error_print(f"keytool -exportcert seemingly succeeded but DER file '{der_file_path}' is missing or empty.")
            return None
        with open(der_file_path, 'rb') as f:
            der_bytes = f.read()
        return der_bytes.hex()
    finally:
        if der_file_path and os.path.exists(der_file_path):
            try:
                os.remove(der_file_path)
            except OSError:
                pass

def map_network(network_key):
    mapping = {
        'bscmain': 'eip155:56',
        'bsctest': 'eip155:97',
        'lh': 'eip155:31337',
    }
    if network_key not in mapping:
        raise ValueError("Unsupported network")
    return mapping[network_key]

def sign_with_external_tools(jks_path, jks_pass, alias, alias_pass, app_hex, network_key):
    if not os.path.exists(jks_path):
        error_print(f"JKS file not found at path '{jks_path}'")
        return None

    calculated_sha_finger = calculate_sha256_fingerprint_with_keytool(jks_path, jks_pass, alias)
    if not calculated_sha_finger:
        return None

    caip2 = map_network(network_key)
    data_to_sign_str = f"{caip2}::{app_hex}::{calculated_sha_finger}"
    data_to_sign_bytes = data_to_sign_str.encode('utf-8')
    debug_print(f"Data to sign: '{data_to_sign_str}'")

    pkcs12_file_path = None
    pem_file_path = None

    try:
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

        pkcs12_pass = jks_pass
        keytool_command_export = [
            'keytool', '-importkeystore',
            '-srcstoretype', "JKS",
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
            return None
        if not os.path.exists(pkcs12_file_path) or os.path.getsize(pkcs12_file_path) == 0:
            error_print(f"keytool command seemingly succeeded but PKCS12 file '{pkcs12_file_path}' is missing or empty!")
            return None

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
            return None
        if not os.path.exists(pem_file_path) or os.path.getsize(pem_file_path) == 0:
            error_print(f"openssl command seemingly succeeded but PEM file '{pem_file_path}' is missing or empty.")
            return None

        openssl_command_sign = [
            'openssl', 'dgst', '-sha256',
            '-sign', pem_file_path,
        ]
        process_sign = run_command(openssl_command_sign, input_data=data_to_sign_bytes, is_binary_output=True)
        if not process_sign:
            return None
        signature_bytes = process_sign.stdout
        if not signature_bytes:
            error_print("openssl dgst command finished but returned no signature (empty stdout).")
            return None

        signature_hex_string = signature_bytes.hex()

        cert_der_hex = export_certificate_der_hex(jks_path, jks_pass, alias)
        if not cert_der_hex:
            return None

        return calculated_sha_finger, signature_hex_string, cert_der_hex, caip2

    finally:
        files_to_remove = [pkcs12_file_path, pem_file_path]
        for f_path in files_to_remove:
            if f_path and os.path.exists(f_path):
                try:
                    os.remove(f_path)
                except OSError:
                    pass

def main():
    global DEBUG_MODE

    parser = argparse.ArgumentParser(
        description="Calculates the SHA-256 certificate fingerprint and signs 'network::chainId::address:finger' using a key from a JKS file. Outputs the HEX signature (proof), the fingerprint, and the certificate DER as hex.",
    )
    parser.add_argument('--debug', action='store_true', help="Enable verbose debug output to stderr.")
    parser.add_argument('-jks-path', required=True, help="Path to the JKS file.")
    parser.add_argument('-alias', required=True, help="Alias (name) of the key entry in JKS.")
    parser.add_argument('-network', required=True, choices=['bscmain', 'bsctest', 'lh'], help="Network: bscmain, bsctest or lh. Mapped to CAIP-2 (eip155:56 / eip155:97 / eip155:31337).")

    def validate_app_hex(value):
        if not isinstance(value, str) or not value.startswith('0x') or len(value) != 42:
            raise argparse.ArgumentTypeError("Argument -address must be a string in the format 0xHHHH... (42 chars total, '0x' + 20 hex bytes).")
        try:
            bytes.fromhex(value[2:])
        except ValueError:
            raise argparse.ArgumentTypeError("Argument -address must contain valid HEX characters after '0x'.")
        return value

    parser.add_argument('-address', required=True, type=validate_app_hex, help="Application identifier (0x followed by 40 hex characters).")

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

    if not check_tool_availability('keytool', ['-help']):
        sys.exit(1)
    if not check_tool_availability('openssl', ['version']):
        sys.exit(1)

    result_tuple = sign_with_external_tools(
        args.jks_path,
        jks_pass,
        args.alias,
        alias_pass,
        args.address.lower(),
        args.network
    )

    if result_tuple:
        calculated_fingerprint, proof_hex, cert_der_hex, caip2 = result_tuple
        print(f"\nNetwork (CAIP-2):")
        print(caip2)
        print(f"\nFingerprint (SHA-256):")
        print(calculated_fingerprint)
        print(f"\nCertificate (DER, HEX):")
        print(f"0x{cert_der_hex}")
        print(f"\nProof (HEX):")
        print(f"0x{proof_hex}")
        sys.exit(0)
    else:
        print("\nFailed to generate proof and/or fingerprint.", file=sys.stderr)
        sys.exit(1)

if __name__ == "__main__":
    main()


