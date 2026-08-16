
// this file is generated — do not edit it


/// <reference types="@sveltejs/kit" />

/**
 * This module provides access to environment variables that are injected _statically_ into your bundle at build time and are limited to _private_ access.
 * 
 * |         | Runtime                                                                    | Build time                                                               |
 * | ------- | -------------------------------------------------------------------------- | ------------------------------------------------------------------------ |
 * | Private | [`$env/dynamic/private`](https://svelte.dev/docs/kit/$env-dynamic-private) | [`$env/static/private`](https://svelte.dev/docs/kit/$env-static-private) |
 * | Public  | [`$env/dynamic/public`](https://svelte.dev/docs/kit/$env-dynamic-public)   | [`$env/static/public`](https://svelte.dev/docs/kit/$env-static-public)   |
 * 
 * Static environment variables are [loaded by Vite](https://vitejs.dev/guide/env-and-mode.html#env-files) from `.env` files and `process.env` at build time and then statically injected into your bundle at build time, enabling optimisations like dead code elimination.
 * 
 * **_Private_ access:**
 * 
 * - This module cannot be imported into client-side code
 * - This module only includes variables that _do not_ begin with [`config.kit.env.publicPrefix`](https://svelte.dev/docs/kit/configuration#env) _and do_ start with [`config.kit.env.privatePrefix`](https://svelte.dev/docs/kit/configuration#env) (if configured)
 * 
 * For example, given the following build time environment:
 * 
 * ```env
 * ENVIRONMENT=production
 * PUBLIC_BASE_URL=http://site.com
 * ```
 * 
 * With the default `publicPrefix` and `privatePrefix`:
 * 
 * ```ts
 * import { ENVIRONMENT, PUBLIC_BASE_URL } from '$env/static/private';
 * 
 * console.log(ENVIRONMENT); // => "production"
 * console.log(PUBLIC_BASE_URL); // => throws error during build
 * ```
 * 
 * The above values will be the same _even if_ different values for `ENVIRONMENT` or `PUBLIC_BASE_URL` are set at runtime, as they are statically replaced in your code with their build time values.
 */
declare module '$env/static/private' {
	export const VERCEL_OIDC_TOKEN: string;
	export const ComSpec: string;
	export const USERNAME: string;
	export const npm_execpath: string;
	export const CHROME_CRASHPAD_PIPE_NAME: string;
	export const NODE_ENV: string;
	export const ALLUSERSPROFILE: string;
	export const SESSIONNAME: string;
	export const APPDATA: string;
	export const COPILOT_DEBUG_NONCE: string;
	export const PROCESSOR_IDENTIFIER: string;
	export const COMPUTERNAME: string;
	export const CommonProgramFiles: string;
	export const GIT_ASKPASS: string;
	export const npm_config_local_prefix: string;
	export const COLORTERM: string;
	export const CommonProgramW6432: string;
	export const DriverData: string;
	export const USERPROFILE: string;
	export const EFC_12004_1592913036: string;
	export const ProgramFiles: string;
	export const HOMEDRIVE: string;
	export const HOMEPATH: string;
	export const DEBIAN_FRONTEND: string;
	export const TERM_PROGRAM_VERSION: string;
	export const LOCALAPPDATA: string;
	export const GIT_PAGER: string;
	export const LOGONSERVER: string;
	export const SystemDrive: string;
	export const NUMBER_OF_PROCESSORS: string;
	export const npm_config_user_agent: string;
	export const OS: string;
	export const GIT_EDITOR: string;
	export const LANG: string;
	export const OneDrive: string;
	export const PATHEXT: string;
	export const VSCODE_PYTHON_AUTOACTIVATE_GUARD: string;
	export const PROCESSOR_ARCHITECTURE: string;
	export const PROCESSOR_LEVEL: string;
	export const PROCESSOR_REVISION: string;
	export const PSModulePath: string;
	export const PUBLIC: string;
	export const Path: string;
	export const ProgramData: string;
	export const ProgramW6432: string;
	export const VSCODE_GIT_ASKPASS_NODE: string;
	export const SystemRoot: string;
	export const TEMP: string;
	export const VSCODE_GIT_ASKPASS_EXTRA_ARGS: string;
	export const TMP: string;
	export const USERDOMAIN: string;
	export const USERDOMAIN_ROAMINGPROFILE: string;
	export const ZES_ENABLE_SYSMAN: string;
	export const npm_package_json: string;
	export const windir: string;
	export const AI_AGENT: string;
	export const VSCODE_GIT_ASKPASS_MAIN: string;
	export const COPILOT_AGENT: string;
	export const GIT_MERGE_AUTOEDIT: string;
	export const TERM_PROGRAM: string;
	export const npm_command: string;
	export const VSCODE_GIT_IPC_HANDLE: string;
	export const npm_package_name: string;
	export const VSCODE_INJECTION: string;
	export const npm_package_version: string;
	export const NODE: string;
	export const npm_node_execpath: string;
	export const npm_lifecycle_event: string;
	export const npm_lifecycle_script: string;
	export const SVELTEKIT_FORK: string;
}

/**
 * This module provides access to environment variables that are injected _statically_ into your bundle at build time and are _publicly_ accessible.
 * 
 * |         | Runtime                                                                    | Build time                                                               |
 * | ------- | -------------------------------------------------------------------------- | ------------------------------------------------------------------------ |
 * | Private | [`$env/dynamic/private`](https://svelte.dev/docs/kit/$env-dynamic-private) | [`$env/static/private`](https://svelte.dev/docs/kit/$env-static-private) |
 * | Public  | [`$env/dynamic/public`](https://svelte.dev/docs/kit/$env-dynamic-public)   | [`$env/static/public`](https://svelte.dev/docs/kit/$env-static-public)   |
 * 
 * Static environment variables are [loaded by Vite](https://vitejs.dev/guide/env-and-mode.html#env-files) from `.env` files and `process.env` at build time and then statically injected into your bundle at build time, enabling optimisations like dead code elimination.
 * 
 * **_Public_ access:**
 * 
 * - This module _can_ be imported into client-side code
 * - **Only** variables that begin with [`config.kit.env.publicPrefix`](https://svelte.dev/docs/kit/configuration#env) (which defaults to `PUBLIC_`) are included
 * 
 * For example, given the following build time environment:
 * 
 * ```env
 * ENVIRONMENT=production
 * PUBLIC_BASE_URL=http://site.com
 * ```
 * 
 * With the default `publicPrefix` and `privatePrefix`:
 * 
 * ```ts
 * import { ENVIRONMENT, PUBLIC_BASE_URL } from '$env/static/public';
 * 
 * console.log(ENVIRONMENT); // => throws error during build
 * console.log(PUBLIC_BASE_URL); // => "http://site.com"
 * ```
 * 
 * The above values will be the same _even if_ different values for `ENVIRONMENT` or `PUBLIC_BASE_URL` are set at runtime, as they are statically replaced in your code with their build time values.
 */
declare module '$env/static/public' {
	
}

/**
 * This module provides access to environment variables set _dynamically_ at runtime and that are limited to _private_ access.
 * 
 * |         | Runtime                                                                    | Build time                                                               |
 * | ------- | -------------------------------------------------------------------------- | ------------------------------------------------------------------------ |
 * | Private | [`$env/dynamic/private`](https://svelte.dev/docs/kit/$env-dynamic-private) | [`$env/static/private`](https://svelte.dev/docs/kit/$env-static-private) |
 * | Public  | [`$env/dynamic/public`](https://svelte.dev/docs/kit/$env-dynamic-public)   | [`$env/static/public`](https://svelte.dev/docs/kit/$env-static-public)   |
 * 
 * Dynamic environment variables are defined by the platform you're running on. For example if you're using [`adapter-node`](https://github.com/sveltejs/kit/tree/main/packages/adapter-node) (or running [`vite preview`](https://svelte.dev/docs/kit/cli)), this is equivalent to `process.env`.
 * 
 * **_Private_ access:**
 * 
 * - This module cannot be imported into client-side code
 * - This module includes variables that _do not_ begin with [`config.kit.env.publicPrefix`](https://svelte.dev/docs/kit/configuration#env) _and do_ start with [`config.kit.env.privatePrefix`](https://svelte.dev/docs/kit/configuration#env) (if configured)
 * 
 * > [!NOTE] In `dev`, `$env/dynamic` includes environment variables from `.env`. In `prod`, this behavior will depend on your adapter.
 * 
 * > [!NOTE] To get correct types, environment variables referenced in your code should be declared (for example in an `.env` file), even if they don't have a value until the app is deployed:
 * >
 * > ```env
 * > MY_FEATURE_FLAG=
 * > ```
 * >
 * > You can override `.env` values from the command line like so:
 * >
 * > ```sh
 * > MY_FEATURE_FLAG="enabled" npm run dev
 * > ```
 * 
 * For example, given the following runtime environment:
 * 
 * ```env
 * ENVIRONMENT=production
 * PUBLIC_BASE_URL=http://site.com
 * ```
 * 
 * With the default `publicPrefix` and `privatePrefix`:
 * 
 * ```ts
 * import { env } from '$env/dynamic/private';
 * 
 * console.log(env.ENVIRONMENT); // => "production"
 * console.log(env.PUBLIC_BASE_URL); // => undefined
 * ```
 */
declare module '$env/dynamic/private' {
	export const env: {
		VERCEL_OIDC_TOKEN: string;
		ComSpec: string;
		USERNAME: string;
		npm_execpath: string;
		CHROME_CRASHPAD_PIPE_NAME: string;
		NODE_ENV: string;
		ALLUSERSPROFILE: string;
		SESSIONNAME: string;
		APPDATA: string;
		COPILOT_DEBUG_NONCE: string;
		PROCESSOR_IDENTIFIER: string;
		COMPUTERNAME: string;
		CommonProgramFiles: string;
		GIT_ASKPASS: string;
		npm_config_local_prefix: string;
		COLORTERM: string;
		CommonProgramW6432: string;
		DriverData: string;
		USERPROFILE: string;
		EFC_12004_1592913036: string;
		ProgramFiles: string;
		HOMEDRIVE: string;
		HOMEPATH: string;
		DEBIAN_FRONTEND: string;
		TERM_PROGRAM_VERSION: string;
		LOCALAPPDATA: string;
		GIT_PAGER: string;
		LOGONSERVER: string;
		SystemDrive: string;
		NUMBER_OF_PROCESSORS: string;
		npm_config_user_agent: string;
		OS: string;
		GIT_EDITOR: string;
		LANG: string;
		OneDrive: string;
		PATHEXT: string;
		VSCODE_PYTHON_AUTOACTIVATE_GUARD: string;
		PROCESSOR_ARCHITECTURE: string;
		PROCESSOR_LEVEL: string;
		PROCESSOR_REVISION: string;
		PSModulePath: string;
		PUBLIC: string;
		Path: string;
		ProgramData: string;
		ProgramW6432: string;
		VSCODE_GIT_ASKPASS_NODE: string;
		SystemRoot: string;
		TEMP: string;
		VSCODE_GIT_ASKPASS_EXTRA_ARGS: string;
		TMP: string;
		USERDOMAIN: string;
		USERDOMAIN_ROAMINGPROFILE: string;
		ZES_ENABLE_SYSMAN: string;
		npm_package_json: string;
		windir: string;
		AI_AGENT: string;
		VSCODE_GIT_ASKPASS_MAIN: string;
		COPILOT_AGENT: string;
		GIT_MERGE_AUTOEDIT: string;
		TERM_PROGRAM: string;
		npm_command: string;
		VSCODE_GIT_IPC_HANDLE: string;
		npm_package_name: string;
		VSCODE_INJECTION: string;
		npm_package_version: string;
		NODE: string;
		npm_node_execpath: string;
		npm_lifecycle_event: string;
		npm_lifecycle_script: string;
		SVELTEKIT_FORK: string;
		[key: `PUBLIC_${string}`]: undefined;
		[key: `${string}`]: string | undefined;
	}
}

/**
 * This module provides access to environment variables set _dynamically_ at runtime and that are _publicly_ accessible.
 * 
 * |         | Runtime                                                                    | Build time                                                               |
 * | ------- | -------------------------------------------------------------------------- | ------------------------------------------------------------------------ |
 * | Private | [`$env/dynamic/private`](https://svelte.dev/docs/kit/$env-dynamic-private) | [`$env/static/private`](https://svelte.dev/docs/kit/$env-static-private) |
 * | Public  | [`$env/dynamic/public`](https://svelte.dev/docs/kit/$env-dynamic-public)   | [`$env/static/public`](https://svelte.dev/docs/kit/$env-static-public)   |
 * 
 * Dynamic environment variables are defined by the platform you're running on. For example if you're using [`adapter-node`](https://github.com/sveltejs/kit/tree/main/packages/adapter-node) (or running [`vite preview`](https://svelte.dev/docs/kit/cli)), this is equivalent to `process.env`.
 * 
 * **_Public_ access:**
 * 
 * - This module _can_ be imported into client-side code
 * - **Only** variables that begin with [`config.kit.env.publicPrefix`](https://svelte.dev/docs/kit/configuration#env) (which defaults to `PUBLIC_`) are included
 * 
 * > [!NOTE] In `dev`, `$env/dynamic` includes environment variables from `.env`. In `prod`, this behavior will depend on your adapter.
 * 
 * > [!NOTE] To get correct types, environment variables referenced in your code should be declared (for example in an `.env` file), even if they don't have a value until the app is deployed:
 * >
 * > ```env
 * > MY_FEATURE_FLAG=
 * > ```
 * >
 * > You can override `.env` values from the command line like so:
 * >
 * > ```sh
 * > MY_FEATURE_FLAG="enabled" npm run dev
 * > ```
 * 
 * For example, given the following runtime environment:
 * 
 * ```env
 * ENVIRONMENT=production
 * PUBLIC_BASE_URL=http://example.com
 * ```
 * 
 * With the default `publicPrefix` and `privatePrefix`:
 * 
 * ```ts
 * import { env } from '$env/dynamic/public';
 * console.log(env.ENVIRONMENT); // => undefined, not public
 * console.log(env.PUBLIC_BASE_URL); // => "http://example.com"
 * ```
 * 
 * ```
 * 
 * ```
 */
declare module '$env/dynamic/public' {
	export const env: {
		[key: `PUBLIC_${string}`]: string | undefined;
	}
}
