import "../../chunks/server.js";
//#region src/routes/+page.svelte
function _page($$renderer) {
	$$renderer.push(`<h1>CS Week — Public Site (SvelteKit)</h1> <p>Welcome. This is a minimal scaffold for the public-facing site. Replace with real content and routes under \`src/routes/\`.</p>`);
}
//#endregion
export { _page as default };
